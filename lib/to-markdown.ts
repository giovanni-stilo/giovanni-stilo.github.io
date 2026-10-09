import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import type { Element, Root, RootContent } from "hast";

/** Drop scripts, styles, interactive widgets and decorative icons before converting. */
function stripNoise() {
  const drop = (el: Element) =>
    ["script", "style", "noscript", "button", "select", "input", "datalist", "nav", "i", "svg", "canvas"].includes(el.tagName);
  const walk = (node: Root | Element) => {
    node.children = node.children.filter((c: RootContent) => !(c.type === "element" && drop(c))) as typeof node.children;
    node.children.forEach((c) => c.type === "element" && walk(c));
  };
  return (tree: Root) => walk(tree);
}

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(stripNoise)
  .use(rehypeRemark)
  .use(remarkGfm)
  .use(remarkStringify, { bullet: "-", emphasis: "_", rule: "-" });

/** Rendered page HTML -> clean Markdown for /llms-full.txt. */
export function htmlToMarkdown(html: string): string {
  return String(processor.processSync(html))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
