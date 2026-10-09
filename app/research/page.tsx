import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";
import { JsonLd } from "@/components/site/json-ld";
import { InfoCard } from "@/components/site/card";
import { getProjects, stripHtml, truncate } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import research from "@/content/data/research.json";

const title = "Research Projects";

export const metadata = pageMetadata({
  title,
  description:
    "Research projects by Prof. Giovanni Stilo covering Explainable AI, Machine Unlearning, Algorithmic Fairness, Graph Neural Networks, and Data Mining.",
  path: "/research/",
});

export default function ResearchPage() {
  const projects = getProjects().filter((p) => !p.inactive);
  return (
    <PageShell title={title}>
      <JsonLd data={breadcrumbSchema([{ name: title, path: "/research/" }])} />
      <div className="card-grid">
        {projects.map((project) => (
          <div className="card" key={project.url}>
            {project.image ? (
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image} alt={project.title} style={{ maxHeight: 80, borderRadius: 4 }} loading="lazy" />
              </div>
            ) : null}
            <h3>
              <Link href={project.url}>{project.title}</Link>
            </h3>
            {project.description ? <p>{truncate(stripHtml(project.description), 200)}</p> : null}
            {!project.noLink ? (
              <Link href={project.url} className="card-link">
                Details <i className="fas fa-arrow-right" />
              </Link>
            ) : null}
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: "3rem" }}>
        Open-Source Software &amp; Datasets
      </h2>
      <div className="card-grid">
        {research.openSource.map((c) => (
          <InfoCard key={c.title} {...c} />
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: "3rem" }}>
        Funded Projects
      </h2>
      <div className="card-grid">
        {research.funded.map((c) => (
          <InfoCard key={c.title} {...c} />
        ))}
      </div>
    </PageShell>
  );
}
