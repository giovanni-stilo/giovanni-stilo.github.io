"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

const noop = () => () => {};

/** Scrolling ticker; copies after the first are hidden from assistive tech. */
export function HighlightBanner({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // false during prerender/hydration, true afterwards: the static HTML keeps a single copy
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  if (!mounted || reduce) return <div className="highlight-banner">{children}</div>;

  return (
    <div className="highlight-banner is-marquee">
      <span className="marquee-track">
        {[0, 1, 2, 3].map((n) => (
          <span key={n} className="marquee-item" aria-hidden={n > 0 || undefined}>
            {children}
          </span>
        ))}
      </span>
    </div>
  );
}
