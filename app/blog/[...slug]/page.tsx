import Link from "next/link";
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/site/html-content";
import { JsonLd } from "@/components/site/json-ld";
import { getBlogArticles, getPosts, renderDoc, formatLong, type Doc } from "@/lib/content";
import { docGraph, docMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Two URL shapes share /blog/:
 *   /blog/<slug>/                    long-form articles (content/blog)
 *   /blog/YYYY/MM/DD/<slug>/         news announcements (content/posts)
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...getBlogArticles(), ...getPosts()].map((d) => ({ slug: d.url.split("/").filter(Boolean).slice(1) }));
}

function resolve(slug: string[]): Doc | undefined {
  const url = `/blog/${slug.join("/")}/`;
  return [...getBlogArticles(), ...getPosts()].find((d) => d.url === url);
}

export async function generateMetadata({ params }: PageProps<"/blog/[...slug]">) {
  const doc = resolve((await params).slug);
  return doc ? docMetadata(doc) : {};
}

function Article({ doc }: { doc: Doc }) {
  return (
    <div className="container">
      <article className="page-content post-content blog-post">
        <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/blog/">Blog</Link>
            </li>
            <li aria-current="page">{doc.title}</li>
          </ol>
        </nav>
        <header className="post-header">
          {!doc.published ? <p className="blog-draft">Draft — for review</p> : null}
          <h1 className="page-title">{doc.title}</h1>
          {doc.description ? <p className="blog-summary">{doc.description}</p> : null}
          <div className="blog-meta">
            <span>{doc.author ?? site.author}</span>
            {doc.date ? <time dateTime={doc.date.toISOString()}>{formatLong(doc.date)}</time> : null}
            {doc.lastModifiedAt ? (
              <span>
                Updated <time dateTime={doc.lastModifiedAt.toISOString()}>{formatLong(doc.lastModifiedAt)}</time>
              </span>
            ) : null}
          </div>
          {doc.tags.length ? (
            <ul className="blog-tags" aria-label="Topics">
              {doc.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}
        </header>
        <HtmlContent className="blog-body" html={renderDoc(doc)} />
        <footer className="blog-post-footer">
          <Link href="/blog/">
            <span aria-hidden="true">←</span> Back to Blog
          </Link>
        </footer>
      </article>
    </div>
  );
}

function NewsPost({ doc }: { doc: Doc }) {
  return (
    <div className="container">
      <article className="page-content post-content" itemScope itemType="https://schema.org/BlogPosting">
        <header className="post-header">
          <h1 className="page-title" itemProp="headline">
            {doc.title}
          </h1>
          {doc.date ? (
            <time className="post-date" dateTime={doc.date.toISOString()} itemProp="datePublished">
              {formatLong(doc.date)}
            </time>
          ) : null}
        </header>
        <HtmlContent html={renderDoc(doc)} />
      </article>
    </div>
  );
}

export default async function BlogDocPage({ params }: PageProps<"/blog/[...slug]">) {
  const doc = resolve((await params).slug);
  if (!doc) notFound();
  const isArticle = doc.collection === "blog";
  return (
    <>
      <JsonLd
        data={docGraph(
          doc,
          isArticle ? [{ name: "Blog", path: "/blog/" }, { name: doc.title, path: doc.url }] : [{ name: "News", path: "/news/" }, { name: doc.title, path: doc.url }],
        )}
      />
      {isArticle ? <Article doc={doc} /> : <NewsPost doc={doc} />}
    </>
  );
}
