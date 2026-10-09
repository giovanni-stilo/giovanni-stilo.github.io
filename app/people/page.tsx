import { PageShell } from "@/components/site/page-shell";
import { JsonLd } from "@/components/site/json-ld";
import { getPeople, type Person } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const title = "People & Supervision";

export const metadata = pageMetadata({
  title,
  description:
    "Students, postdoctoral researchers, and collaborators supervised by Prof. Giovanni Stilo at Luiss University of Rome and University of L'Aquila.",
  path: "/people/",
});

const PHD_COLORS = ["avatar-indigo", "avatar-violet", "avatar-rose", "avatar-emerald", "avatar-cyan", "avatar-fuchsia", "avatar-amber", "avatar-teal"];

const initials = (name: string) => {
  const parts = name.replace("Dr. ", "").replace("Prof. ", "").split(" ");
  return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
};

const NameLink = ({ person }: { person: Person }) =>
  person.webpage ? (
    <a href={person.webpage} target="_blank" rel="noopener">
      {person.name}
    </a>
  ) : (
    <>{person.name}</>
  );

function PersonCard({ person, avatar, badge, badgeClass }: { person: Person; avatar: string; badge: string; badgeClass: string }) {
  return (
    <div className="person-card">
      <div className={`avatar ${avatar}`}>{initials(person.name)}</div>
      <div className="person-info">
        <h4>
          <NameLink person={person} />
        </h4>
        <p>{person.affiliation}</p>
        <span className={`person-badge ${badgeClass}`}>{badge}</span>
        {person.github ? (
          <p style={{ marginTop: "0.3rem" }}>
            <a href={`https://github.com/${person.github}`} target="_blank" rel="noopener">
              <i className="fab fa-github" /> {person.github}
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Section({ icon, color, heading, children }: { icon: string; color: string; heading: string; children: React.ReactNode }) {
  return (
    <div className="people-section">
      <div className={`section-icon ${color}`}>
        <i className={`fas ${icon}`} />
      </div>
      <h3>{heading}</h3>
      {children}
    </div>
  );
}

export default function PeoplePage() {
  const people = getPeople();
  return (
    <PageShell title={title}>
      <JsonLd data={breadcrumbSchema([{ name: title, path: "/people/" }])} />
      <p style={{ marginBottom: "2rem", fontSize: "0.95rem", color: "var(--color-text-secondary)" }}>
        Prof. Stilo has supervised and mentored researchers at all career stages &mdash; from undergraduate students to postdoctoral researchers &mdash; across Luiss University, University of L&apos;Aquila, Sapienza University of Rome, George Mason University, and international visiting programs.
      </p>

      <Section icon="fa-flask" color="indigo" heading="Current Researchers">
        <div className="people-grid">
          {people.postdocs.map((p) => (
            <PersonCard key={p.name} person={p} avatar="avatar-blue" badge="Postdoc" badgeClass="badge-postdoc" />
          ))}
        </div>
      </Section>

      <Section icon="fa-user-graduate" color="indigo" heading="Current PhD Students">
        <div className="people-grid">
          {people.phd_students.map((p, i) => (
            <PersonCard key={p.name} person={p} avatar={PHD_COLORS[i % 8]} badge="PhD Student" badgeClass="badge-phd" />
          ))}
        </div>
      </Section>

      <Section icon="fa-award" color="emerald" heading="PhD Alumni">
        <div className="people-grid">
          {people.phd_alumni.map((p) => (
            <div className="person-card" key={p.name}>
              <div className="avatar avatar-slate">{initials(p.name)}</div>
              <div className="person-info">
                <h4>
                  <NameLink person={p} />
                </h4>
                <p>{p.affiliation}</p>
                <span className="person-badge badge-alumni">PhD {p.thesis_year}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="fa-graduation-cap" color="amber" heading="Master's & Bachelor's Thesis Alumni">
        <ul className="people-list">
          {people.msc_alumni.map((p) => (
            <li key={`${p.name}-${p.year}-${p.program}`}>
              <strong>{p.name}</strong>{" "}
              <span className="person-year">
                &middot; {p.program} ({p.year})
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon="fa-globe-americas" color="rose" heading="International Visiting Students">
        <ul className="people-list">
          {people.visiting_students.map((p) => (
            <li key={p.name}>
              {p.webpage ? (
                <a href={p.webpage} target="_blank" rel="noopener">
                  <strong>{p.name}</strong>
                </a>
              ) : (
                <strong>{p.name}</strong>
              )}{" "}
              <span className="person-year">
                &middot; {p.origin} ({p.year})
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
