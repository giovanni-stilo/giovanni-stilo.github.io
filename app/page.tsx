import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { HighlightBanner } from "@/components/home/highlight-banner";
import { JsonLd } from "@/components/site/json-ld";
import { getEvents, getPosts, formatShort, truncate } from "@/lib/content";
import { graph, pageMetadata, webPageNode, PERSON_ID } from "@/lib/seo";
import { lastModified } from "@/lib/dates";

export const metadata = {
  ...pageMetadata({
    title: "Prof. Giovanni Stilo - AI Researcher & Associate Professor at Luiss University of Rome",
    description:
      "Giovanni Stilo is an Associate Professor at Luiss University of Rome (Department of AI, Data and Decision Sciences) and founder of the AIIM Research Collective, working on Explainable AI, Graph Counterfactual Explanations, Machine Unlearning, and Algorithmic Fairness.",
    path: "/",
  }),
};

const stats = [
  { value: "74", label: "Publications" },
  { value: "7", label: "PhD Graduates" },
  { value: "30+", label: "Theses Supervised" },
  { value: "15+", label: "Funded Projects" },
];

const areas = [
  { icon: "fa-project-diagram", title: "Graph Counterfactual Explainability", text: "Methods and frameworks (GRETEL, RSGG-CE) for explaining GNN decisions through counterfactual reasoning" },
  { icon: "fa-eraser", title: "Machine Unlearning", text: "Selective data removal from trained models (ERASURE, ForSId) for GDPR compliance and responsible AI" },
  { icon: "fa-balance-scale", title: "Algorithmic Fairness", text: "Detecting and mitigating bias in classification, search, and recommendation systems" },
  { icon: "fa-heartbeat", title: "Health Informatics", text: "Syndromic surveillance from social media, drug repurposing via graph networks, disease-gene prediction" },
  { icon: "fa-clock", title: "Temporal & Social Mining", text: "Event discovery, hashtag sense clustering, topic detection in social streams and news media" },
  { icon: "fa-users", title: "Recommender Systems", text: "Semantic recommendation, user profiling via taxonomies, enterprise social network analysis" },
];

const featured = [
  { tag: "xai", label: "Explainable AI", title: "GRETEL Framework", href: "/projects/gretel/", text: "An open-source framework for evaluating Graph Counterfactual Explanation methods. Provides building blocks to create bespoke explanation pipelines for GNN models." },
  { tag: "unlearning", label: "Machine Unlearning", title: "ERASURE", href: "/projects/erasure/", text: "A fully extensible framework for Machine Unlearning, enabling selective removal of learned information from AI models for privacy compliance and bias mitigation." },
  { tag: "xai", label: "Generative XAI", title: "RSGG-CE", href: "/projects/generative-ce/", text: "A novel Robust Stochastic Graph Generator for Counterfactual Explanations, producing plausible counterfactual examples from learned latent spaces. Published at AAAI 2024." },
  { tag: "fairness", label: "Fairness", title: "FAIR-EDU", href: "/projects/fair-edu/", text: "Promoting fairness in educational institutions by testing and estimating algorithmic bias in university staff-related data with a data- and model-agnostic approach." },
];

export default function HomePage() {
  const news = getPosts().slice(0, 6);
  // Jekyll took the 4 most recent and then skipped inactive ones; keep that.
  const events = getEvents().slice(0, 4).filter((e) => !e.inactive);

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: "/",
            name: "Prof. Giovanni Stilo - AI Researcher & Associate Professor at Luiss University of Rome",
            type: "ProfilePage",
            modified: lastModified("app/page.tsx", "content/posts", "content/events"),
            extra: { mainEntity: { "@id": PERSON_ID } },
          }),
        )}
      />
      <Hero />

      <HighlightBanner>
        <i className="fas fa-award" /> Recognized among the <strong>Top 500 Most Influential Italians in Artificial Intelligence</strong> (2024)
      </HighlightBanner>

      <section className="section-alt stats-section">
        <div className="container">
          <Stats items={stats} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Research Areas</h2>
          <div className="research-areas">
            {areas.map((a) => (
              <div className="research-area" key={a.title}>
                <div className="research-area-icon">
                  <i className={`fas ${a.icon}`} />
                </div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="card-grid">
            {featured.map((p) => (
              <div className="card" key={p.title}>
                <span className={`card-tag ${p.tag}`}>{p.label}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <Link href={p.href} className="card-link">
                  Learn more <i className="fas fa-arrow-right" />
                </Link>
              </div>
            ))}
          </div>
          <Link href="/research/" className="view-all">
            View All Research <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Recent News</h2>
          <ul className="news-list">
            {news.map((post) => (
              <li className="news-item" key={post.url}>
                <span className="news-date">{post.date && formatShort(post.date)}</span>
                <div>
                  <h3>
                    <Link href={post.url}>{post.title}</Link>
                  </h3>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/news/" className="view-all">
            All News <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Workshops &amp; Events</h2>
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
                  {event.description ? <p>{truncate(event.description, 120)}</p> : null}
                </div>
              </Link>
            ))}
          </div>
          <Link href="/events/" className="view-all">
            All Events <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </section>
    </>
  );
}
