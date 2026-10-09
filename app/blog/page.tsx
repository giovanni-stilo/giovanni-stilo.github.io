import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";
import { JsonLd } from "@/components/site/json-ld";
import { getBlogArticles, formatLong } from "@/lib/content";
import { collectionGraph, docEntity, pageMetadata } from "@/lib/seo";
import { lastModified } from "@/lib/dates";

const title = "Blog";

export const metadata = pageMetadata({
  title,
  description:
    "Research notes, explanations, and perspectives on artificial intelligence, machine learning, and the questions that connect them.",
  path: "/blog/",
});

function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="blog-tags" aria-label="Topics">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export default function BlogPage() {
  const articles = getBlogArticles();
  return (
    <PageShell title={title}>
      <JsonLd data={collectionGraph("/blog/", title, metadata.description as string, lastModified("content/blog"), articles.filter((a) => a.published).map(docEntity))} />
      <p className="blog-intro">
        A space to explore research ideas, explain concepts, and think through open questions. From artificial intelligence and machine learning to the practice of research itself.
      </p>

      {articles.length > 0 ? (
        <div className="blog-list">
          {articles.map((a) => (
            <article className="blog-entry" key={a.url}>
              <div className="blog-meta">
                {a.date ? <time dateTime={a.date.toISOString()}>{formatLong(a.date)}</time> : null}
                {!a.published ? <span className="blog-draft">Draft — for review</span> : null}
              </div>
              <h2>
                <Link href={a.url}>{a.title}</Link>
              </h2>
              {a.description ? <p>{a.description}</p> : null}
              <Tags tags={a.tags} />
              <Link className="blog-read-more" href={a.url}>
                Read article<span className="sr-only">: {a.title}</span> <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <h2>Coming soon</h2>
          <p>Research notes and perspectives are on the way.</p>
          <Link href="/research/">
            Explore current research <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </PageShell>
  );
}

