import { getPosts, renderDoc } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

/** Atom feed of the news posts, as jekyll-feed produced at /feed.xml. */
export function GET() {
  const posts = getPosts().slice(0, 10);
  const updated = (posts[0]?.date ?? new Date()).toISOString();
  const entries = posts
    .map((p) => {
      const url = absoluteUrl(p.url);
      const date = (p.date ?? new Date()).toISOString();
      return `<entry><title type="html">${esc(p.title)}</title><link href="${url}" rel="alternate" type="text/html" title="${esc(p.title)}" /><published>${date}</published><updated>${date}</updated><id>${url}</id><content type="html" xml:base="${url}">${cdata(renderDoc(p))}</content><author><name>${esc(site.author)}</name></author>${p.description ? `<summary type="html">${cdata(p.description)}</summary>` : ""}</entry>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${site.lang}"><link href="${site.url}/feed.xml" rel="self" type="application/atom+xml" /><link href="${site.url}/" rel="alternate" type="text/html" hreflang="${site.lang}" /><updated>${updated}</updated><id>${site.url}/feed.xml</id><title type="html">${esc(site.title)}</title><subtitle>${esc(site.description)}</subtitle><author><name>${esc(site.author)}</name></author>${entries}</feed>`;

  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
