import { profile, faq } from "@/lib/profile";

/**
 * Answer-first summary for readers and answer engines: the key facts as a
 * definition list, before the long-form biography.
 */
export function AtAGlance() {
  const rows: [string, React.ReactNode][] = [
    ["Name", `${profile.honorificPrefix} ${profile.name}`],
    ["Position", `${profile.jobTitle}, ${profile.department}, ${profile.employer.name} (Rome, Italy)`],
    ["Also", `${profile.roleAtBusinessSchool}, ${profile.businessSchool.name}`],
    [
      "Research group",
      <>
        Founder of the <a href={profile.group.url}>{profile.group.short}</a>
      </>,
    ],
    ["Research areas", profile.researchAreas.join(" · ")],
    ["Education", profile.education.map((e) => `${e.degree}, ${e.institution} (${e.year})`).join("; ")],
    ["Recognition", profile.awards[0]],
    [
      "Identifiers",
      <>
        ORCID <a href={profile.links.orcid}>{profile.identifiers.orcid}</a> · Scopus{" "}
        <a href={profile.links.scopus}>{profile.identifiers.scopus}</a> ·{" "}
        <a href={profile.links.scholar}>Google Scholar</a>
      </>,
    ],
    [
      "Contact",
      <a key="mail" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>,
    ],
  ];
  return (
    <section className="at-a-glance" aria-labelledby="at-a-glance">
      <h2 id="at-a-glance">At a glance</h2>
      <p className="at-a-glance-lead">{profile.summary}</p>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Visible FAQ; the same questions are published as FAQPage structured data. */
export function Faq() {
  return (
    <section className="faq" aria-labelledby="faq">
      <h2 id="faq">Frequently asked questions</h2>
      {faq.map(({ q, a }) => (
        <div className="faq-item" key={q}>
          <h3>{q}</h3>
          <p>{a}</p>
        </div>
      ))}
    </section>
  );
}
