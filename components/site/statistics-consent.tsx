"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  enableStatistics, getConsentSnapshot, parseConsent, PREFERENCES_EVENT,
  saveConsent, subscribeToConsent,
} from "@/lib/statistics-consent";

const serverSnapshot = () => null;

export function CookiePreferencesButton() {
  return (
    <button type="button" className="cookie-preferences-link" onClick={() => window.dispatchEvent(new Event(PREFERENCES_EVENT))}>
      Cookie preferences
    </button>
  );
}

export function StatisticsConsent() {
  const snapshot = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, serverSnapshot);
  const choice = parseConsent(snapshot);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const acceptButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const banner = useRef<HTMLElement>(null);
  const visible = !choice || open;

  useEffect(() => {
    const show = () => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setError("");
      setOpen(true);
    };
    window.addEventListener(PREFERENCES_EVENT, show);
    return () => window.removeEventListener(PREFERENCES_EVENT, show);
  }, []);

  useEffect(() => {
    if (open) acceptButton.current?.focus();
  }, [open]);

  useEffect(() => {
    if (choice?.accepted) enableStatistics();
  }, [choice?.accepted]);

  useEffect(() => {
    if (!visible || !banner.current) return;
    const reserveSpace = () => document.documentElement.style.setProperty("--statistics-space", `${banner.current!.offsetHeight + 36}px`);
    const observer = new ResizeObserver(reserveSpace);
    observer.observe(banner.current);
    reserveSpace();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--statistics-space");
    };
  }, [visible]);

  const close = () => {
    setOpen(false);
    returnFocus.current?.focus();
  };

  const choose = (accepted: boolean) => {
    if (!saveConsent(accepted)) {
      setError("Your browser could not save this choice. Statistics remain off.");
      setOpen(true);
      return;
    }
    setError("");
    close();
  };

  if (!visible) return null;

  return (
    <section
      className="statistics-banner"
      ref={banner}
      aria-labelledby="statistics-title"
      aria-describedby="statistics-description"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (choice) close();
          else choose(false);
        }
      }}
    >
      <div className="statistics-copy">
        <h2 id="statistics-title">Your privacy, your choice</h2>
        <p id="statistics-description">
          We use optional cookies to measure visits and improve this website.
          You can accept or refuse. The site works either way.{" "}
          <Link href="/cookies/">Cookie information</Link>
        </p>
        {choice ? <p className="statistics-current">Statistics are currently {choice.accepted ? "on" : "off"}.</p> : null}
        {error ? <p className="statistics-error" role="status">{error}</p> : null}
        <noscript><p>Statistics are disabled while JavaScript is off.</p></noscript>
      </div>
      <div className="statistics-actions">
        <button type="button" className="statistics-choice" ref={acceptButton} onClick={() => choose(true)}>Accept statistics</button>
        <button type="button" className="statistics-choice" onClick={() => choose(false)}>Reject</button>
        {choice && open ? <button type="button" className="statistics-close" onClick={close}>Close preferences</button> : null}
      </div>
    </section>
  );
}
