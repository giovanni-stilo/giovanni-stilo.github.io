import type { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import type { Doc } from "@/lib/content";
import { profile, sameAs, faq } from "@/lib/profile";
import type { Publication, Course } from "@/lib/scholarly";

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
      images: [{ url: absoluteUrl(site.logo), alt: `${profile.honorificPrefix} ${profile.name}` }],
      ...(article
        ? {
            type: "article",
            publishedTime: article.published?.toISOString(),
            modifiedTime: article.modified?.toISOString(),
          }
        : { type: "website" }),
    },
    twitter: { card: "summary", title: title ?? site.title, description: desc, site: site.twitter, images: [absoluteUrl(site.logo)] },
  };
}

export const docMetadata = (doc: Doc): Metadata =>
  pageMetadata({
    title: doc.title,
    description: doc.description,
    path: doc.url,
    article: { published: doc.date, modified: doc.lastModifiedAt ?? doc.modified ?? doc.date },
    noindex: doc.collection === "blog" && !doc.published,
  });

/*
 * Structured data as one connected graph. Every node has a stable @id, and
 * everything points back to the same Person, so answer engines resolve the
 * site to a single, unambiguous entity (reinforced by ORCID / Scopus sameAs).
 */
const id = (path: string, frag: string) => `${absoluteUrl(path)}#${frag}`;
export const PERSON_ID = `${site.url}/#person`;
export const WEBSITE_ID = `${site.url}/#website`;
const ref = (i: string) => ({ "@id": i });

const org = (name: string, url?: string, extra: object = {}) => ({
  "@type": "EducationalOrganization",
  name,
  ...(url ? { url } : {}),
  ...extra,
});

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export const personNode = () => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: profile.name,
  givenName: profile.givenName,
  familyName: profile.familyName,
  honorificPrefix: profile.honorificPrefix,
  jobTitle: profile.jobTitle,
  description: profile.summary,
  url: `${site.url}/`,
  mainEntityOfPage: absoluteUrl("/about/"),
  image: absoluteUrl(site.logo),
  email: `mailto:${profile.email}`,
  worksFor: [
    org(profile.employer.name, profile.employer.url, {
      alternateName: "Luiss University of Rome",
      department: { "@type": "Organization", name: profile.department },
    }),
    org(profile.businessSchool.name, profile.businessSchool.url),
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: profile.jobTitle,
    occupationLocation: { "@type": "City", name: "Rome" },
    description: `${profile.jobTitle}, ${profile.department}, ${profile.employer.name}. ${profile.roleAtBusinessSchool}, ${profile.businessSchool.name}.`,
  },
  alumniOf: [...new Map(profile.education.map((e) => [e.institution, org(e.institution, e.url)])).values()],
  hasCredential: profile.education.map((e) => ({
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "degree",
    name: e.degree,
    dateCreated: String(e.year),
    recognizedBy: org(e.institution, e.url),
  })),
  memberOf: { "@type": "ResearchOrganization", "@id": `${site.url}/#aiim`, name: profile.group.name, url: profile.group.url },
  award: [...profile.awards],
  knowsAbout: [...profile.knowsAbout],
  identifier: [
    { "@type": "PropertyValue", propertyID: "ORCID", value: profile.identifiers.orcid, url: profile.links.orcid },
    { "@type": "PropertyValue", propertyID: "Scopus Author ID", value: profile.identifiers.scopus, url: profile.links.scopus },
    { "@type": "PropertyValue", propertyID: "Google Scholar", value: profile.identifiers.scholar, url: profile.links.scholar },
  ],
  sameAs,
});

export const aiimNode = () => ({
  "@type": "ResearchOrganization",
  "@id": `${site.url}/#aiim`,
  name: profile.group.name,
  alternateName: "AIIM",
  url: profile.group.url,
  founder: ref(PERSON_ID),
});

export const websiteNode = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${site.url}/`,
  name: site.title,
  description: site.description,
  inLanguage: site.lang,
  publisher: ref(PERSON_ID),
  about: ref(PERSON_ID),
});

type Crumb = { name: string; path: string };

export function webPageNode({
  path,
  name,
  description,
  type = "WebPage",
  modified,
  trail = [],
  extra = {},
}: {
  path: string;
  name: string;
  description?: string;
  type?: string | string[];
  modified?: Date;
  trail?: Crumb[];
  extra?: object;
}) {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@type": type,
    "@id": id(path, "webpage"),
    url: absoluteUrl(path),
    name,
    ...(description ? { description } : {}),
    inLanguage: site.lang,
    isPartOf: ref(WEBSITE_ID),
    about: ref(PERSON_ID),
    ...(modified ? { dateModified: modified.toISOString() } : {}),
    ...(trail.length
      ? {
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              item: absoluteUrl(c.path),
            })),
          },
        }
      : {}),
    ...extra,
  };
}

/** The main entity of a collection document: Event, ResearchProject or BlogPosting. */
export function docEntity(doc: Doc) {
  const base = {
    "@id": id(doc.url, "main"),
    name: doc.title,
    ...(doc.description ? { description: doc.description } : {}),
    url: absoluteUrl(doc.url),
    mainEntityOfPage: ref(id(doc.url, "webpage")),
    ...(doc.image ? { image: doc.image.startsWith("http") ? doc.image : absoluteUrl(doc.image) } : {}),
  };
  if (doc.collection === "events") {
    return {
      "@type": "Event",
      ...base,
      ...(doc.startDate ? { startDate: doc.startDate } : {}),
      ...(doc.endDate ? { endDate: doc.endDate } : {}),
      ...(doc.location ? { location: { "@type": "Place", name: doc.location, address: doc.location } } : {}),
      eventStatus: "https://schema.org/EventScheduled",
      contributor: ref(PERSON_ID),
    };
  }
  if (doc.collection === "projects") {
    return {
      "@type": "ResearchProject",
      ...base,
      member: doc.people.map((name) => (name === profile.name ? ref(PERSON_ID) : { "@type": "Person", name })),
      parentOrganization: ref(`${site.url}/#aiim`),
    };
  }
  return {
    "@type": doc.collection === "posts" ? "NewsArticle" : "BlogPosting",
    ...base,
    headline: doc.title,
    ...(doc.date ? { datePublished: doc.date.toISOString() } : {}),
    ...((doc.lastModifiedAt ?? doc.modified) ? { dateModified: (doc.lastModifiedAt ?? doc.modified)!.toISOString() } : {}),
    ...(doc.tags.length ? { keywords: doc.tags.join(", ") } : {}),
    author: ref(PERSON_ID),
    publisher: ref(PERSON_ID),
    inLanguage: site.lang,
  };
}

export function publicationNodes(pubs: Publication[]) {
  return {
    "@type": "ItemList",
    "@id": id("/publications/", "list"),
    name: `Publications by ${profile.name}`,
    numberOfItems: pubs.length,
    itemListElement: pubs.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": p.kind === "Book Chapter" ? "Chapter" : "ScholarlyArticle",
        name: p.title,
        headline: p.title,
        author: p.authors.map((a) => (a === profile.name ? ref(PERSON_ID) : { "@type": "Person", name: a })),
        datePublished: String(p.year),
        genre: p.kind,
        isPartOf: { "@type": p.kind === "Journal Paper" ? "Periodical" : "CreativeWork", name: p.venue },
        ...(p.url ? { url: p.url } : {}),
        ...(p.doi ? { sameAs: `https://doi.org/${p.doi}`, identifier: { "@type": "PropertyValue", propertyID: "DOI", value: p.doi } } : {}),
      },
    })),
  };
}

export function courseNodes(courses: Course[]) {
  return {
    "@type": "ItemList",
    "@id": id("/teaching/", "list"),
    name: `Courses taught by ${profile.name}`,
    numberOfItems: courses.length,
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: c.name,
        description: [c.details, c.years].filter(Boolean).join(" · "),
        provider: { "@type": "EducationalOrganization", name: c.provider },
        ...(c.section === "Teaching Assistant" ? { contributor: ref(PERSON_ID) } : { instructor: ref(PERSON_ID) }),
      },
    })),
  };
}

export const faqNode = () => ({
  "@type": "FAQPage",
  "@id": id("/about/", "faq"),
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

/** Graph for a listing page: a CollectionPage whose main entity lists `items`. */
export function collectionGraph(path: string, name: string, description: string, modified?: Date, items?: object[]) {
  const list = items?.length
    ? [{ "@type": "ItemList", "@id": id(path, "list"), numberOfItems: items.length, itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })) }]
    : [];
  return graph(
    webPageNode({
      path,
      name,
      description,
      type: "CollectionPage",
      modified,
      trail: [{ name, path }],
      extra: list.length ? { mainEntity: ref(id(path, "list")) } : {},
    }),
    ...list,
  );
}

/** Graph for a collection document page (event, project, article, news post). */
export function docGraph(doc: Doc, trail: Crumb[]) {
  return graph(
    webPageNode({
      path: doc.url,
      name: doc.title,
      description: doc.description,
      modified: doc.lastModifiedAt ?? doc.modified,
      trail,
      extra: { mainEntity: ref(id(doc.url, "main")) },
    }),
    docEntity(doc),
  );
}
