import type { MetadataRoute } from "next";
import { getBlogArticles, getEvents, getPosts, getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { lastModified } from "@/lib/dates";

export const dynamic = "force-static";

// Each static page with the sources its content comes from, for an honest <lastmod>.
const PAGES: [string, string[]][] = [
  ["/", ["app/page.tsx", "components/home", "content/posts", "content/events"]],
  ["/about/", ["content/pages/about.md", "lib/profile.ts"]],
  ["/research/", ["app/research/page.tsx", "content/projects", "content/data/research.json"]],
  ["/publications/", ["content/pages/publications.html"]],
  ["/teaching/", ["content/pages/teaching.html"]],
  ["/people/", ["app/people/page.tsx", "content/data/people.yml"]],
  ["/events/", ["app/events/page.tsx", "content/events", "content/data/events.json"]],
  ["/service/", ["content/pages/service.html"]],
  ["/news/", ["content/posts"]],
  ["/blog/", ["content/blog"]],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();
  return [
    ...getBlogArticles()
      .filter((d) => d.published)
      .map((d) => ({
        url: absoluteUrl(d.url),
        lastModified: d.lastModifiedAt ?? d.modified ?? d.date ?? built,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ...getPosts().map((d) => ({ url: absoluteUrl(d.url), lastModified: d.modified ?? d.date ?? built, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...[...getEvents(), ...getProjects()]
      .filter((d) => !d.inactive)
      .map((d) => ({ url: absoluteUrl(d.url), lastModified: d.modified ?? built, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...PAGES.map(([p, sources]) => ({
      url: absoluteUrl(p),
      lastModified: lastModified(...sources) ?? built,
      changeFrequency: "weekly" as const,
      priority: p === "/" || p === "/about/" ? 1 : 0.8,
    })),
  ];
}
