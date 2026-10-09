"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts up to its value (keeping any suffix such as "+") once scrolled into view. */
function StatNumber({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const m = value.match(/^(\d+)(.*)$/);
    if (!inView || reduce || !m || !ref.current) return;
    const el = ref.current;
    const [, end, suffix] = m;
    const controls = animate(0, Number(end), {
      duration: 1.4,
      ease: (p) => 1 - Math.pow(1 - p, 4),
      onUpdate: (v) => (el.textContent = Math.round(v) + suffix),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <div ref={ref} className="stat-number">
      {value}
    </div>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="stats-bar">
      {items.map((s) => (
        <div className="stat-item" key={s.label}>
          <StatNumber value={s.value} />
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
