import type { ReactNode } from "react";

/** The Jekyll `page` layout: a titled article inside the content container. */
export function PageShell({
  title,
  subtitle,
  notitle,
  className = "page-content",
  children,
}: {
  title?: string;
  subtitle?: string;
  notitle?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="container">
      <article className={className}>
        {!notitle && title ? (
          <h1 className="page-title">
            {title}
            {subtitle ? <span className="page-subtitle">{subtitle}</span> : null}
          </h1>
        ) : null}
        {children}
      </article>
    </div>
  );
}
