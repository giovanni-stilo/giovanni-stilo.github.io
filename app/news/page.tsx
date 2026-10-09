import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";
import { JsonLd } from "@/components/site/json-ld";
import { getPosts, formatShort, stripHtml, truncate } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const title = "News";

export const metadata = pageMetadata({
  title,
  description:
    "Latest news, announcements, and updates from Prof. Giovanni Stilo's research activities in AI, Machine Learning, and Explainable AI.",
  path: "/news/",
});

export default function NewsPage() {
  return (
    <PageShell title={title}>
      <JsonLd data={breadcrumbSchema([{ name: title, path: "/news/" }])} />
      <ul className="news-list all-news">
        {getPosts().map((post) => (
          <li className="news-item" key={post.url}>
            <span className="news-date">{post.date && formatShort(post.date)}</span>
            <div>
              <h3>
                <Link href={post.url}>{post.title}</Link>
              </h3>
              {post.description ? <p>{truncate(stripHtml(post.description), 200)}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
