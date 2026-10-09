import type { Metadata } from "next";
import { getPage, formatLong } from "@/lib/content";
import { getCourses, getPublications } from "@/lib/scholarly";
import { courseNodes, faqNode, graph, pageMetadata, publicationNodes, webPageNode, PERSON_ID } from "@/lib/seo";
import { PageShell } from "@/components/site/page-shell";
import { absoluteUrl } from "@/lib/site";
import { HtmlContent } from "@/components/site/html-content";
import { JsonLd } from "@/components/site/json-ld";
import { AtAGlance, Faq } from "@/components/site/profile-facts";

/** A page whose body lives in content/pages/<name>.(md|html). */
export function contentPageMetadata(name: string, path: string): Metadata {
  const { data } = getPage(name);
  return pageMetadata({ title: data.title as string, description: data.description as string, path });
}

/** Page-specific schema.org nodes: who the page is about, and what it lists. */
function structuredData(name: string, path: string, title: string, description: string, modified?: Date) {
  const page = (type: string, extra: object = {}) =>
    webPageNode({ path, name: title, description, type, modified, trail: [{ name: title, path }], extra });
  switch (name) {
    case "about":
      return graph(page("ProfilePage", { mainEntity: { "@id": PERSON_ID }, hasPart: { "@id": absoluteUrl(`${path}#faq`) } }), faqNode());
    case "publications": {
      const list = publicationNodes(getPublications());
      return graph(page("CollectionPage", { mainEntity: { "@id": list["@id"] } }), list);
    }
    case "teaching": {
      const list = courseNodes(getCourses());
      return graph(page("CollectionPage", { mainEntity: { "@id": list["@id"] } }), list);
    }
    default:
      return graph(page("WebPage"));
  }
}

export function ContentPage({ name, path }: { name: string; path: string }) {
  const { html, data, modified } = getPage(name);
  const title = data.title as string;
  const isAbout = name === "about";
  return (
    <>
      <JsonLd data={structuredData(name, path, title, data.description as string, modified)} />
      <PageShell title={title} subtitle={data.subtitle as string | undefined} notitle={data.notitle === true}>
        {isAbout ? <AtAGlance /> : null}
        <HtmlContent html={html} />
        {isAbout ? <Faq /> : null}
        {modified ? (
          <p className="page-updated">
            Last updated <time dateTime={modified.toISOString()}>{formatLong(modified)}</time>
          </p>
        ) : null}
      </PageShell>
    </>
  );
}
