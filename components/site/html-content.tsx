import { DEFERRED_SCRIPT_TYPE } from "@/lib/markdown";
import { ContentScripts } from "@/components/site/content-scripts";

/**
 * Renders pre-built HTML (Markdown output or legacy HTML fragments). Embedded
 * scripts were neutralised at build time; ContentScripts runs them on mount.
 */
export function HtmlContent({ html, className }: { html: string; className?: string }) {
  const hasScripts = html.includes(DEFERRED_SCRIPT_TYPE);
  return (
    <>
      <div className={className} data-html-content dangerouslySetInnerHTML={{ __html: html }} />
      {hasScripts ? <ContentScripts /> : null}
    </>
  );
}
