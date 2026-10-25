import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import matter from "gray-matter";

// Node's native TypeScript support needs the same alias that Next.js resolves.
registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier.startsWith("@/")
      ? new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier, context);
  },
});
const { docEntity, docGraph, collectionGraph } = await import("../lib/seo.ts");
const { site } = await import("../lib/site.ts");

const fixture = {
  collection: "events", slug: "schema-check", url: "/events/schema-check/",
  title: "Schema check", tags: [], people: [], published: true, online: false,
  organizers: [site.author], speakers: [site.author], startDate: "2024-02-21",
  endDate: "2024-02-21", body: "", file: "fixture.md",
  venue: { name: "Verified venue", address: { streetAddress: "1055 Canada Place", addressLocality: "Vancouver", addressCountry: "CA" } },
};
assert.equal(docEntity(fixture)["@type"], "Event");
for (const incomplete of [
  { startDate: undefined }, { startDate: "2024-02-30" }, { startDate: "2024-13-01" },
  { startDate: "2024-2-21" }, { endDate: "2024-02-20" }, { endDate: "invalid" },
  { venue: undefined }, { venue: { name: "City only", address: { addressLocality: "Vancouver", addressCountry: "CA" } } },
  { venue: { name: "Empty address", address: { streetAddress: " ", addressLocality: "Vancouver", addressCountry: "CA" } } },
  { online: true },
]) {
  const doc = { ...fixture, ...incomplete };
  assert.equal(docEntity(doc), null, JSON.stringify(incomplete));
  const page = docGraph(doc, [])["@graph"][0];
  assert.equal(page.mainEntity, undefined, "Archive must not reference an absent Event");
}
for (const [collection, type] of [["projects", "ResearchProject"], ["blog", "BlogPosting"], ["posts", "NewsArticle"]]) {
  assert.equal(docEntity({ ...fixture, collection })["@type"], type);
}
const list = collectionGraph("/test/", "Test", "Test", undefined, [null, docEntity(fixture)])["@graph"][1];
assert.equal(list.numberOfItems, 1);

function* nodes(value) {
  if (Array.isArray(value)) {
    for (const item of value) yield* nodes(item);
  } else if (value && typeof value === "object") {
    yield value;
    for (const item of Object.values(value)) yield* nodes(item);
  }
}

function readPage(file) {
  assert.ok(fs.existsSync(file), `${file} missing; run npm run build first`);
  const html = fs.readFileSync(file, "utf8");
  const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length, `No JSON-LD in ${file}`);
  const schema = blocks.flatMap((match) => [...nodes(JSON.parse(match[1]))]);
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replaceAll("&#x27;", "'").replaceAll("&#39;", "'").replaceAll("&amp;", "&");
  return { schema, visible };
}

const index = readPage("out/events/index.html");
assert.equal(index.schema.filter((n) => n["@type"] === "Event").length, 0, "Full Events belong on detail pages");
const files = fs.readdirSync("content/events").filter((file) => file.endsWith(".md"));
let emitted = 0;
const archives = [];
const optional = { offers: 0, organizer: 0, performer: 0, image: 0, endDate: 0 };
for (const file of files) {
  const slug = path.basename(file, ".md");
  const { data } = matter(fs.readFileSync(`content/events/${file}`, "utf8"));
  const { schema, visible } = readPage(`out/events/${slug}/index.html`);
  const events = schema.filter((node) => node["@type"] === "Event");
  const page = schema.find((node) => node["@id"] === `${site.url}/events/${slug}/#webpage`);
  assert.ok(page, `Archive WebPage missing: ${slug}`);
  if (data.online || !data.venue) {
    assert.equal(events.length, 0, `Incomplete/online archive emitted Event: ${slug}`);
    assert.equal(page.mainEntity, undefined, `Dangling Event reference: ${slug}`);
    archives.push(slug);
    continue;
  }
  assert.equal(events.length, 1, `Expected one verified Event: ${slug}`);
  emitted++;
  const event = events[0];
  assert.match(event.startDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(event.startDate).toISOString().slice(0, 10), event.startDate);
  assert.equal(event.location["@type"], "Place");
  assert.equal(event.location.address["@type"], "PostalAddress");
  for (const field of ["streetAddress", "addressLocality", "addressCountry"]) {
    assert.ok(event.location.address[field]?.trim(), `${slug}: missing ${field}`);
    assert.equal(event.location.address[field], data.venue.address[field]);
  }
  if (event.endDate) assert.ok(event.endDate >= event.startDate, `${slug}: reversed dates`);
  assert.equal(page.mainEntity["@id"], event["@id"]);
  for (const role of ["organizer", "performer"]) {
    for (const person of event[role] ?? []) {
      assert.equal(person["@type"], "Person");
      assert.ok(visible.includes(person.name), `${slug}: hidden ${role}`);
    }
  }
  assert.ok(fs.existsSync(`public${data.image}`), `${slug}: image asset missing`);
  assert.equal(event.image, `${site.url}${data.image}`);
  assert.ok(visible.includes(data.image), `${slug}: schema-only image`);
  assert.ok(data.image_width > 0 && data.image_height > 0, `${slug}: missing image size`);
  for (const field of Object.keys(optional)) if (!event[field]) optional[field]++;
}
assert.ok(emitted > 0, "Fix must preserve verified Events, not remove all Event markup");
assert.equal(index.schema.find((n) => n["@type"] === "ItemList").numberOfItems,
  files.filter((file) => matter(fs.readFileSync(`content/events/${file}`, "utf8")).data.status !== "inactive").length);
console.log(`PASS: shared schema guards, other document types, Events index and ${files.length} detail pages.`);
console.log(`${emitted} verified Events; ${archives.length} ordinary archive pages: ${archives.join(", ")}`);
console.log("Unverified/inapplicable optional fields left absent:", optional);
