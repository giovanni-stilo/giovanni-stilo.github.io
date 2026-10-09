"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/site";

// Blog articles live at /blog/<slug>/; dated news posts at /blog/YYYY/MM/DD/<slug>/
// belong to News, so only the former highlight the Blog tab.
const isActive = (href: string, pathname: string) =>
  href === "/blog/" ? /^\/blog\/([^/]+\/)?$/.test(pathname) : pathname === href;

export function SiteHeader() {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <header className="site-header" role="banner">
      <div className="container header-inner">
        <Link className="site-logo" href="/">
          <span className="logo-dot" />
          <span className="logo-text">Giovanni Stilo</span>
        </Link>
        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          <span className="hamburger" />
        </button>
        <nav
          className={`site-nav${open ? " is-open" : ""}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="nav-list">
            {nav.map(({ href, label }) => {
              const active = isActive(href, pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={active ? "active" : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
