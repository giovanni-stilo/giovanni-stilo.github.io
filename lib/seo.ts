import type { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import type { Doc } from "@/lib/content";

type PageMeta = {
  title?: string;
  description?: string;
  path: string;
  /** collection documents are typed as articles, like jekyll-seo-tag did */
  article?: { published?: Date; modified?: Date };
  noindex?: boolean;
};

/** Mirrors the tags jekyll-seo-tag emitted, so search snippets don't change. */
export function pageMetadata({ title, description, path, article, noindex }: PageMeta): Metadata {
  const desc = description ?? site.description;
  const url = absoluteUrl(path);
  return {
    title: title ? `${title} | ${site.title}` : site.title,
    description: desc,
    authors: [{ name: site.author }],
    // `alternates` replaces the layout's wholesale, so the feed link is repeated here.
    alternates: { canonical: url, types: { "application/rss+xml": [{ url: `${site.url}/feed.xml`, title: site.title }] } },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: title ?? site.title,
      description: desc,
      url,
      siteName: site.title,
      locale: site.lang,
      ...(article
        ? {
            type: "article",
            publishedTime: article.published?.toISOString(),
            modifiedTime: article.modified?.toISOString(),
          }
        : { type: "website" }),
    },
    twitter: { card: "summary", title: title ?? site.title, site: site.twitter },
  };
}

export const docMetadata = (doc: Doc): Metadata =>
  pageMetadata({
    title: doc.title,
    description: doc.description,
    path: doc.url,
    article: { published: doc.date, modified: doc.lastModifiedAt ?? doc.date },
    noindex: doc.collection === "blog" && !doc.published,
  });

const personId = `${site.url}/#person`;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    "@id": personId,
    name: "Giovanni Stilo",
    givenName: "Giovanni",
    familyName: "Stilo",
    jobTitle: "Professor of Computer Science",
    honorificPrefix: "Prof.",
    url: site.url,
    image: absoluteUrl(site.logo),
    email: "gstilo@luiss.it",
    affiliation: { "@type": "Organization", name: "Luiss University of Rome", url: "https://www.luiss.it" },
    alumniOf: [{ "@type": "Organization", name: "Sapienza University of Rome" }],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Graph Neural Networks",
      "Explainable AI",
      "Graph Counterfactual Explanations",
      "Machine Unlearning",
      "Algorithmic Bias and Fairness",
      "Data Mining",
      "Social Network Analysis",
      "Network Medicine",
      "Recommender Systems",
      "Concept Drift Detection",
    ],
    sameAs: [
      "https://scholar.google.com/citations?hl=en&user=uTyaicMAAAAJ",
      "https://github.com/aiim-research",
      "https://aiimlab.org",
      "https://www.linkedin.com/in/giovanni-stilo-7986b816/",
    ],
    memberOf: {
      "@type": "Organization",
      name: "AIIM - Artificial Intelligence & Information Mining Research Collective",
      url: "https://aiimlab.org",
    },
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.author,
  url: `${site.url}/`,
  description: site.description,
  author: { "@type": "Person", name: site.author },
  publisher: {
    "@type": "Organization",
    name: site.author,
    logo: { "@type": "ImageObject", url: absoluteUrl(site.logo) },
  },
  sameAs: site.social,
};

export function articleSchema(doc: Doc) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: doc.title,
    ...(doc.description ? { description: doc.description } : {}),
    ...(doc.date ? { datePublished: doc.date.toISOString() } : {}),
    ...(doc.lastModifiedAt ? { dateModified: doc.lastModifiedAt.toISOString() } : {}),
    author: { "@type": "Person", "@id": personId, name: doc.author ?? site.author },
    publisher: { "@type": "Person", name: "Giovanni Stilo" },
    url: absoluteUrl(doc.url),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(doc.url) },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: i === 0 ? site.url : absoluteUrl(item.path),
    })),
  };
}
