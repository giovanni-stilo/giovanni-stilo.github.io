import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import type { Element, ElementContent, Root, RootContent } from "hast";

/*
 * Publications and Teaching are hand-maintained HTML. These readers recover
 * their structure (title, authors, venue, year, DOI / course, provider) so the
 * same entries can be published as schema.org data and in /llms-full.txt.
 */

const text = (n: ElementContent | Root): string =>
  n.type === "text" ? n.value : "children" in n ? n.children.map((c) => text(c as ElementContent)).join("") : "";
const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const cls = (el: Element) => String((el.properties?.className as string[] | undefined)?.join(" ") ?? "");
const elements = (n: Root | Element) => (n.children as RootContent[]).filter((c): c is Element => c.type === "element");

function find(n: Root | Element, pred: (el: Element) => boolean, out: Element[] = []): Element[] {
  for (const el of elements(n)) {
    if (pred(el)) out.push(el);
    find(el, pred, out);
  }
  return out;
}

const parse = (file: string) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .parse(fs.readFileSync(path.join(process.cwd(), "content/pages", file), "utf8").replace(/^---[\s\S]*?---/, ""));

export type Publication = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  kind: "Book Chapter" | "Journal Paper" | "Conference Paper" | "Workshop Paper";
  url?: string;
  doi?: string;
};

const KINDS: Record<string, Publication["kind"]> = {
  "book-chapters": "Book Chapter",
  "journal-papers": "Journal Paper",
  "conference-papers": "Conference Paper",
  "workshop-papers": "Workshop Paper",
};

export const getPublications = cache((): Publication[] => {
  const tree = parse("publications.html");
  const pubs: Publication[] = [];
  let kind: Publication["kind"] = "Journal Paper";
  let year = 0;
  // Walk in document order: h2 sets the kind, .pub-year h3 the year.
  const walk = (n: Root | Element) => {
    for (const el of elements(n)) {
      if (el.tagName === "h2" && KINDS[String(el.properties?.id)]) kind = KINDS[String(el.properties?.id)];
      if (el.tagName === "h3" && /^\d{4}$/.test(clean(text(el)))) year = Number(clean(text(el)));
      if (cls(el).includes("pub-entry")) {
        const part = (c: string) => find(el, (e) => cls(e).includes(c))[0];
        const link = find(el, (e) => e.tagName === "a" && typeof e.properties?.href === "string")[0];
        const url = link ? String(link.properties!.href) : undefined;
        const doi = url?.match(/10\.\d{4,9}\/[^\s?#]+/)?.[0];
        pubs.push({
          title: clean(text(part("pub-title"))),
          authors: clean(text(part("pub-authors")))
            .split(/,\s*|\s+and\s+/)
            .map(clean)
            .filter(Boolean),
          venue: clean(text(part("pub-venue"))).replace(/^In:\s*/, ""),
          year,
          kind,
          url,
          doi,
        });
        continue;
      }
      walk(el);
    }
  };
  walk(tree);
  return pubs;
});

export type Course = { name: string; provider: string; details: string; years?: string; section: string };

export const getCourses = cache((): Course[] => {
  const tree = parse("teaching.html");
  const courses: Course[] = [];
  let section = "";
  const walk = (n: Root | Element) => {
    for (const el of elements(n)) {
      if (el.tagName === "h2") section = clean(text(el));
      if (cls(el).split(" ").includes("card") && section !== "Ph.D. Mentoring") {
        const tag = find(el, (e) => cls(e).includes("card-tag"))[0];
        const h3 = find(el, (e) => e.tagName === "h3")[0];
        const ps = find(el, (e) => e.tagName === "p").map((p) => clean(text(p)));
        if (tag && h3) courses.push({ name: clean(text(h3)), provider: clean(text(tag)), details: ps[0] ?? "", years: ps[1], section });
        continue;
      }
      walk(el);
    }
  };
  walk(tree);
  return courses;
});
