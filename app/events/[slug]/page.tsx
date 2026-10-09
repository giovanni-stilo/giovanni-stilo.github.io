import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/site/html-content";
import { JsonLd } from "@/components/site/json-ld";
import { getEvents, findDoc, renderDoc } from "@/lib/content";
import { docGraph, docMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getEvents().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">) {
  const doc = findDoc(getEvents(), (await params).slug);
  return doc ? docMetadata(doc) : {};
}

export default async function Page({ params }: PageProps<"/events/[slug]">) {
  const doc = findDoc(getEvents(), (await params).slug);
  if (!doc) notFound();
  return (
    <div className="container">
      <JsonLd data={docGraph(doc, [{ name: "Events", path: "/events/" }, { name: doc.title, path: doc.url }])} />
      <article className="page-content event-content">
        {!doc.notitle ? <h1 className="page-title">{doc.title}</h1> : null}
        {doc.image ? (
          <div className="event-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={doc.image} alt={doc.title} loading="lazy" />
          </div>
        ) : null}
        <HtmlContent html={renderDoc(doc)} />
      </article>
    </div>
  );
}
