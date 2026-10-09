import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import { cache } from "react";
import { renderMarkdown, renderHtml } from "@/lib/markdown";

const CONTENT = path.join(process.cwd(), "content");

/** Drafts (`published: false`) are built only with SHOW_DRAFTS=1, like `jekyll --unpublished`. */
export const showDrafts = process.env.SHOW_DRAFTS === "1";

export type Doc = {
  collection: "posts" | "blog" | "events" | "projects";
  slug: string;
  url: string;
  title: string;
  description?: string;
  date?: Date;
  lastUpdated?: Date;
  lastModifiedAt?: Date;
  author?: string;
  tags: string[];
  image?: string;
  notitle: boolean;
  published: boolean;
  inactive: boolean;
  noLink: boolean;
  body: string;
};

const toDate = (v: unknown): Date | undefined => {
  if (v instanceof Date) return v;
  if (typeof v === "string" && v) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
};

function readCollection(collection: Doc["collection"]): Doc[] {
  const dir = path.join(CONTENT, collection);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      let slug = file.replace(/\.md$/, "");
      let date = toDate(data.date);
      let url: string;

      if (collection === "posts") {
        // Jekyll: _posts/YYYY-MM-DD-title.md -> /blog/YYYY/MM/DD/title/
        const m = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
        if (!m) throw new Error(`Post filename must start with a date: ${file}`);
        const [, y, mo, d, title] = m;
        date ??= new Date(Date.UTC(+y, +mo - 1, +d));
        slug = title;
        url = `/blog/${y}/${mo}/${d}/${title}/`;
      } else {
        url = `/${collection}/${slug}/`;
      }

      return {
        collection,
        slug,
        url,
        title: String(data.title ?? slug),
        description: data.description,
        date,
        lastUpdated: toDate(data["last-updated"]),
        lastModifiedAt: toDate(data.last_modified_at),
        author: data.author,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        image: data.image,
        notitle: data.notitle === true,
        published: data.published !== false,
        inactive: data.status === "inactive",
        noLink: data["no-link"] === true,
        body: content,
      } satisfies Doc;
    });
}

const byDesc = (key: (d: Doc) => Date | undefined) => (a: Doc, b: Doc) =>
  (key(b)?.getTime() ?? -Infinity) - (key(a)?.getTime() ?? -Infinity);

/** Jekyll skips future-dated posts unless building with --future. */
const isLive = (d: Doc) => showDrafts || (d.published && (!d.date || d.date.getTime() <= Date.now()));

export const getPosts = cache(() =>
  readCollection("posts")
    .filter(isLive)
    .sort(byDesc((d) => d.date)),
);

export const getBlogArticles = cache(() =>
  readCollection("blog")
    .filter(isLive)
    .sort(byDesc((d) => d.date)),
);

/** Events and projects are ordered by their `last-updated` front matter. */
export const getEvents = cache(() => readCollection("events").sort(byDesc((d) => d.lastUpdated)));
export const getProjects = cache(() => readCollection("projects").sort(byDesc((d) => d.lastUpdated)));

export function findDoc(docs: Doc[], slug: string) {
  return docs.find((d) => d.slug === slug);
}

export const renderDoc = (doc: Doc) => renderMarkdown(doc.body);

/** Standalone pages kept as content files: Markdown (about) or HTML fragments. */
export function getPage(name: string): { html: string; data: Record<string, unknown> } {
  const md = path.join(CONTENT, "pages", `${name}.md`);
  if (fs.existsSync(md)) {
    const { data, content } = matter(fs.readFileSync(md, "utf8"));
    return { html: renderMarkdown(content), data };
  }
  const { data, content } = matter(
    fs.readFileSync(path.join(CONTENT, "pages", `${name}.html`), "utf8"),
  );
  return { html: renderHtml(content), data };
}

export type Person = {
  name: string;
  affiliation?: string;
  webpage?: string;
  github?: string;
  thesis_year?: number;
  year?: number;
  program?: string;
  origin?: string;
};

export const getPeople = cache(
  () =>
    loadYaml(fs.readFileSync(path.join(CONTENT, "data", "people.yml"), "utf8")) as Record<
      "postdocs" | "phd_students" | "phd_alumni" | "msc_alumni" | "visiting_students",
      Person[]
    >,
);

// --- Liquid filter equivalents ----------------------------------------------

export const stripHtml = (s: string) => s.replace(/<[^>]*>/g, "");

/** Liquid `truncate`: the result, ellipsis included, is at most `n` chars. */
export const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 3) + "..." : s);

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Rome", ...opts });
const longDate = fmt({ month: "long", day: "2-digit", year: "numeric" });
const shortDate = fmt({ month: "short", day: "2-digit", year: "numeric" });

/** "%B %d, %Y" -> October 07, 2026 */
export const formatLong = (d: Date) => longDate.format(d);
/** "%b %d, %Y" -> Oct 07, 2026 */
export const formatShort = (d: Date) => shortDate.format(d);
