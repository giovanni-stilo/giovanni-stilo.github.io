import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier.startsWith("@/")
      ? new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier, context);
  },
});
const consent = await import("../lib/statistics-consent.ts");
const { site } = await import("../lib/site.ts");
const { CONSENT_KEY, CONSENT_VERSION, consentExpiry, parseConsent } = consent;

for (const [start, expected] of [
  ["2026-11-01T12:00:00Z", "2027-05-01T12:00:00Z"],
  ["2026-08-31T12:00:00Z", "2027-02-28T12:00:00Z"],
  ["2027-08-31T12:00:00Z", "2028-02-29T12:00:00Z"],
]) assert.equal(new Date(consentExpiry(Date.parse(start))).toISOString(), new Date(expected).toISOString());

const now = Date.parse("2026-11-01T12:00:00Z");
const valid = { version: CONSENT_VERSION, accepted: true, expiresAt: consentExpiry(now) };
assert.equal(parseConsent(JSON.stringify(valid), now)?.accepted, true);
assert.equal(parseConsent(JSON.stringify({ ...valid, accepted: false }), now)?.accepted, false);
for (const value of [null, "", "invalid", "null", "[]", "true", "{}",
  JSON.stringify({ ...valid, version: 0 }), JSON.stringify({ ...valid, accepted: "true" }),
  JSON.stringify({ ...valid, expiresAt: now }), JSON.stringify({ ...valid, expiresAt: valid.expiresAt + 1 }),
]) assert.equal(parseConsent(value, now), null, value);

const storage = new Map();
let blocked = false;
let reloads = 0;
const cookies = new Map([["_ga", "legacy"], ["_ga_8MEB62J7WB", "legacy"], ["essential", "keep"], ["_garden", "keep"]]);
const scripts = [];
const location = new URL(site.url + "/research/");
location.reload = () => reloads++;
globalThis.window = Object.assign(new EventTarget(), {
  location,
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => { if (blocked) throw new Error("Storage blocked"); storage.set(key, value); },
    removeItem: (key) => storage.delete(key),
  },
});
globalThis.document = Object.assign(new EventTarget(), {
  getElementById: (id) => scripts.find((s) => s.id === id) ?? null,
  createElement: () => ({}),
  head: { append: (script) => scripts.push(script) },
});
Object.defineProperty(document, "cookie", {
  get: () => [...cookies].map(([key, value]) => `${key}=${value}`).join("; "),
  set: (value) => { if (value.includes("Max-Age=0")) cookies.delete(value.split("=")[0]); },
});

consent.enableStatistics();
assert.equal(scripts.length, 0, "No consent must mean no tag");
consent.disableStatistics();
assert.deepEqual([...cookies.keys()], ["essential", "_garden"], "Only statistics cookies may be removed");
assert.equal(consent.saveConsent(false), true);
consent.enableStatistics();
assert.equal(scripts.length, 0, "Refusal must mean no tag");
assert.equal(consent.saveConsent(true), true);
consent.enableStatistics();
consent.enableStatistics();
assert.equal(scripts.length, 1, "An accepted tag must load exactly once");
assert.equal(scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${site.gaId}`);
const configuration = window.dataLayer.find((args) => args[0] === "config")[2];
assert.equal(configuration.allow_google_signals, false);
assert.equal(configuration.allow_ad_personalization_signals, false);
assert.equal(configuration.cookie_update, false);
assert.ok(configuration.cookie_expires > 0 && configuration.cookie_expires <= 184 * 86400);
assert.deepEqual(Array.from(window.dataLayer[0]).slice(0, 2), ["consent", "default"]);
assert.equal(Object.prototype.toString.call(window.dataLayer[0]), "[object Arguments]", "Use Google’s documented command-queue format");
assert.equal(window.dataLayer[0][2].ad_storage, "denied");

const unsubscribe = consent.subscribeToConsent(() => {});
consent.saveConsent(false);
assert.equal(window[`ga-disable-${site.gaId}`], true);
assert.equal(reloads, 1, "Revocation must leave the document containing the old tag");
unsubscribe();
scripts.length = 0;
assert.equal(consent.saveConsent(true), true);
blocked = true;
consent.enableStatistics();
assert.equal(scripts.length, 0, "A read-only preference store must fail closed");
assert.equal(parseConsent(consent.getConsentSnapshot())?.accepted, false);
assert.equal(storage.has(CONSENT_KEY), false, "An old grant must be removed when a preference cannot be saved");
blocked = false;
consent.saveConsent(false);

if (fs.existsSync("out/index.html")) {
  const pages = fs.readdirSync("out", { recursive: true }).filter((file) => String(file).endsWith(".html"));
  for (const page of pages) {
    const html = fs.readFileSync(`out/${page}`, "utf8");
    assert.ok(!/<(?:script|link)\b[^>]*(?:src|href)="https:\/\/(?:www\.)?(?:googletagmanager|google-analytics)\.com/i.test(html), `Unconditional analytics in ${page}`);
  }
  const info = fs.readFileSync("out/cookies/index.html", "utf8");
  for (const text of ["Google Analytics 4", "14 months", CONSENT_KEY, "Cookie preferences"]) assert.ok(info.includes(text), text);
}
console.log("PASS: consent validation/expiry, default refusal, opt-in, single tag, revocation, scoped cookie deletion, storage failure and exported analytics guard.");
