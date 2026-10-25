import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/site/html-content";
import { JsonLd } from "@/components/site/json-ld";
import { getEvents, findDoc, renderDoc, formatLong } from "@/lib/content";
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
        {doc.startDate ? (
          <p><strong>Date: </strong><time dateTime={doc.startDate}>{formatLong(new Date(doc.startDate))}</time>
            {doc.endDate && doc.endDate !== doc.startDate ? <> – <time dateTime={doc.endDate}>{formatLong(new Date(doc.endDate))}</time></> : null}
          </p>
        ) : null}
        {doc.online ? <p><strong>Location: </strong>Online event</p> : doc.venue ? (
          <p><strong>Venue: </strong><a href={doc.venue.source}>{doc.venue.name}</a><br />
            {[doc.venue.address.streetAddress, doc.venue.address.postalCode, doc.location ?? `${doc.venue.address.addressLocality}, ${doc.venue.address.addressCountry}`].filter(Boolean).join(", ")}
          </p>
        ) : doc.location ? <p><strong>Location: </strong>{doc.location}</p> : null}
        {doc.organizers.length ? <p><strong>Organizers: </strong>{doc.organizers.join(", ")}</p> : null}
        {doc.speakers.length ? <p><strong>Speakers: </strong>{doc.speakers.join(", ")}</p> : null}
        {doc.image ? (
          <div className="event-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={doc.image} alt={doc.title} width={doc.imageWidth} height={doc.imageHeight} loading="lazy" />
          </div>
        ) : null}
        <HtmlContent html={renderDoc(doc)} />
      </article>
    </div>
  );
}
