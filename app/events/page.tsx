import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";
import { JsonLd } from "@/components/site/json-ld";
import { InfoCard } from "@/components/site/card";
import { getEvents, stripHtml, truncate } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import data from "@/content/data/events.json";

const title = "Workshops & Events";

export const metadata = pageMetadata({
  title,
  description:
    "Academic workshops and events organized by Prof. Giovanni Stilo, including BIAS@ECIR, DELTA@KDD, WIPE-OUT@ECML-PKDD, and tutorials at major AI conferences.",
  path: "/events/",
});

export default function EventsPage() {
  const events = getEvents().filter((e) => !e.inactive);
  return (
    <PageShell title={title}>
      <JsonLd data={breadcrumbSchema([{ name: title, path: "/events/" }])} />
      <p style={{ marginBottom: "2rem", fontSize: "0.95rem", color: "var(--color-text-secondary)" }}>
        Prof. Stilo has organized and co-organized numerous international workshops, tutorials, and events at premier AI and data mining conferences.
      </p>

      <div className="events-grid">
        {events.map((event) => (
          <Link href={event.url} className="event-card" style={{ textDecoration: "none", color: "inherit" }} key={event.url}>
            {event.image ? (
              <div className="event-card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.image} alt={event.title} loading="lazy" />
              </div>
            ) : null}
            <div className="event-card-body">
              <h3>{event.title}</h3>
              {event.description ? <p>{truncate(stripHtml(event.description), 150)}</p> : null}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: "3rem" }}>
        Workshop Series
      </h2>
      <div className="card-grid">
        {data.series.map((c) => (
          <InfoCard key={c.title} {...c} />
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: "3rem" }}>
        Tutorials, Courses &amp; Invited Talks
      </h2>
      <ul className="news-list">
        {data.talks.map((t) => (
          <li className="news-item" key={t.title}>
            <span className="news-date">{t.year}</span>
            <div>
              <h3>{t.title}</h3>
              <p>{t.venue}</p>
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
