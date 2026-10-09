import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import type { Root, Element, ElementContent, RootContent } from "hast";
import { site } from "@/lib/site";

/**
 * Content was authored for Jekyll/kramdown. These rewrites keep it rendering
 * the same without touching the source files:
 *  - `{{ '/path' | relative_url }}` Liquid filters become plain paths
 *  - kramdown's `[text](url){:target="_blank"}` becomes an inline <a>
 */
export function preprocessLiquid(source: string): string {
  return source
    .replace(/\{\{\s*'([^']*)'\s*\|\s*relative_url\s*\}\}/g, "$1")
    .replace(/\{\{\s*'([^']*)'\s*\|\s*absolute_url\s*\}\}/g, (_, p) => site.url + p);
}

function preprocessKramdown(source: string): string {
  return source.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)\{:\s*target="_blank"\s*\}/g,
    '<a href="$2" target="_blank">$1</a>',
  );
}

/**
 * Inline <script> tags inside rendered HTML never run when React inserts them
 * (client navigation), and DO run when the browser parses the exported page.
 * Neutralise them here so <ContentScripts> can run them exactly once, in
 * order, in both cases. JSON data blocks are left alone.
 */
export const DEFERRED_SCRIPT_TYPE = "text/x-deferred-script";

function rehypeDeferScripts() {
  const walk = (nodes: (RootContent | ElementContent)[]) => {
    for (const node of nodes) {
      if (node.type !== "element") continue;
      const el = node as Element;
      if (el.tagName === "script") {
        const type = String(el.properties?.type ?? "");
        if (!type || type === "text/javascript" || type === "module") {
          el.properties = { ...el.properties, type: DEFERRED_SCRIPT_TYPE };
          if (el.properties.src) {
            el.properties.dataSrc = el.properties.src;
            delete el.properties.src;
          }
        }
      }
      if (el.children) walk(el.children);
    }
  };
  return (tree: Root) => walk(tree.children);
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  // kramdown typography: -- en dash, --- em dash, curly quotes
  .use(remarkSmartypants, { dashes: "oldschool" })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeDeferScripts)
  .use(rehypeStringify);

export function renderMarkdown(source: string): string {
  return String(processor.processSync(preprocessKramdown(preprocessLiquid(source))));
}
