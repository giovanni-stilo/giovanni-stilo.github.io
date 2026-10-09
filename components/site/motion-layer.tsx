"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Elements that slide in on scroll. Much of the content is Markdown/HTML
// rendered at build time, so this works on selectors rather than wrappers;
// styles/site.css owns the transition itself.
const GROUPS = [
  ".section-title", ".page-title", ".research-area", ".stat-item", ".card",
  ".news-item", ".event-card", ".person-card", ".people-section h3",
  ".course-card", ".timeline-item", ".pub-year h3", ".view-all",
].join(",");

export function MotionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll<HTMLElement>(GROUPS).forEach((el) => {
      if (el.classList.contains("is-in")) return;
      const idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty("--reveal-delay", Math.min(idx % 6, 5) * 0.08 + "s");
      el.setAttribute("data-reveal", "");
      io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
