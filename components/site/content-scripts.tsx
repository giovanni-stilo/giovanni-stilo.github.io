"use client";

import { useEffect } from "react";

const PENDING = '[data-html-content] script[type="text/x-deferred-script"]:not([data-claimed])';

/**
 * Executes the scripts embedded in Markdown content (e.g. the interactive
 * charts in the PRIN 2026 article) in document order. External scripts are
 * awaited before the next one runs, matching how the browser would parse them.
 * Scripts are claimed synchronously so a re-run effect never executes one twice.
 */
export function ContentScripts() {
  useEffect(() => {
    const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>(PENDING));
    scripts.forEach((s) => s.setAttribute("data-claimed", ""));

    (async () => {
      for (const old of scripts) {
        const s = document.createElement("script");
        for (const { name, value } of Array.from(old.attributes)) {
          if (name !== "type" && name !== "data-src" && name !== "data-claimed") s.setAttribute(name, value);
        }
        const src = old.getAttribute("data-src");
        if (src) {
          await new Promise<void>((resolve) => {
            s.onload = s.onerror = () => resolve();
            s.src = src;
            old.replaceWith(s);
          });
        } else {
          s.textContent = old.textContent;
          old.replaceWith(s);
        }
      }
    })();
  }, []);

  return null;
}
