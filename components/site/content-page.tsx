import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { PageShell } from "@/components/site/page-shell";
import { HtmlContent } from "@/components/site/html-content";
import { JsonLd } from "@/components/site/json-ld";

/** A page whose body lives in content/pages/<name>.(md|html). */
export function contentPageMetadata(name: string, path: string): Metadata {
  const { data } = getPage(name);
  return pageMetadata({ title: data.title as string, description: data.description as string, path });
}

export function ContentPage({ name, path }: { name: string; path: string }) {
  const { html, data } = getPage(name);
  const title = data.title as string;
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: title, path }])} />
      <PageShell title={title} subtitle={data.subtitle as string | undefined} notitle={data.notitle === true}>
        <HtmlContent html={html} />
      </PageShell>
    </>
  );
}
