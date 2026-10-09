import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeParse from "rehype-parse";
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

const textOf = (node: ElementContent): string =>
  node.type === "text" ? node.value : node.type === "element" ? node.children.map(textOf).join("") : "";

const hasClass = (el: Element, name: string) => {
  const c: unknown = el.properties?.className;
  return Array.isArray(c) ? c.includes(name) : typeof c === "string" && c.split(" ").includes(name);
};

/**
 * Content tables become responsive: each cell carries its column header as
 * `data-label`, so on phones styles/site.css can stack every row into a
 * labelled card instead of squeezing columns. The table is wrapped in a
 * scroll region as a fallback. Tables inside `.prin-report` are interactive
 * data grids with their own scroll container and are left alone.
 */
function rehypeResponsiveTables() {
  const enhance = (table: Element) => {
    const rows: Element[] = [];
    const collect = (n: Element) =>
      n.children.forEach((c) => {
        if (c.type !== "element") return;
        if (c.tagName === "tr") rows.push(c);
        else if (["thead", "tbody", "tfoot"].includes(c.tagName)) collect(c);
      });
    collect(table);
    const header = rows.find((r) => r.children.some((c) => c.type === "element" && c.tagName === "th"));
    if (!header) return false;
    const labels = header.children
      .filter((c): c is Element => c.type === "element")
      .map((c) => textOf(c).trim());
    for (const row of rows) {
      if (row === header) continue;
      let i = 0;
      for (const cell of row.children) {
        if (cell.type !== "element" || cell.tagName !== "td") continue;
        if (labels[i]) cell.properties = { ...cell.properties, dataLabel: labels[i] };
        i++;
      }
    }
    const existing = table.properties?.className;
    const classes = Array.isArray(existing) ? existing.map(String) : existing ? String(existing).split(" ") : [];
    table.properties = { ...table.properties, className: [...classes, "rtable"] };
    return true;
  };

  const walk = (parent: Root | Element, inReport: boolean) => {
    parent.children.forEach((node, idx) => {
      if (node.type !== "element") return;
      const el = node as Element;
      const report = inReport || hasClass(el, "prin-report");
      if (el.tagName === "table" && !report) {
        if (enhance(el)) {
          parent.children[idx] = {
            type: "element",
            tagName: "div",
            properties: { className: ["table-wrap"] },
            children: [el],
          };
        }
        return;
      }
      walk(el, report);
    });
  };
  return (tree: Root) => walk(tree, false);
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
  .use(rehypeResponsiveTables)
  .use(rehypeStringify);

const htmlProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeResponsiveTables)
  .use(rehypeStringify);

/** Legacy HTML content (Publications, Service, Teaching): same table treatment. */
export function renderHtml(source: string): string {
  return String(htmlProcessor.processSync(preprocessLiquid(source)));
}

export function renderMarkdown(source: string): string {
  return String(processor.processSync(preprocessKramdown(preprocessLiquid(source))));
}
