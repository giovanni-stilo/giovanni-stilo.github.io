import type { MetadataRoute } from "next";
import { getBlogArticles, getEvents, getPosts, getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const PAGES = ["/", "/about/", "/research/", "/publications/", "/teaching/", "/people/", "/events/", "/service/", "/news/", "/blog/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();
  return [
    ...getBlogArticles()
      .filter((d) => d.published)
      .map((d) => ({
        url: absoluteUrl(d.url),
        lastModified: d.lastModifiedAt ?? d.date ?? built,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ...getPosts().map((d) => ({ url: absoluteUrl(d.url), lastModified: d.date ?? built, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...[...getEvents(), ...getProjects()]
      .filter((d) => !d.inactive)
      .map((d) => ({ url: absoluteUrl(d.url), lastModified: built, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...PAGES.map((p) => ({ url: absoluteUrl(p), lastModified: built, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
