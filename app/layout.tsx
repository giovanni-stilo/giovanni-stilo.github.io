import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { MotionLayer } from "@/components/site/motion-layer";
import { JsonLd } from "@/components/site/json-ld";
import { personSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/assets/img/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/assets/img/favicon/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    types: { "application/rss+xml": [{ url: `${site.url}/feed.xml`, title: site.title }] },
  },
};

export const viewport: Viewport = { themeColor: "#f1ede4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang}>
      <head>
        {/* Google's CSS serves a different Archivo build than next/font downloads
            (~3% wider); the layout was tuned against this one. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout: applies to every page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Space+Mono:wght@400;700&display=swap"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <JsonLd data={personSchema} />
      </head>
      <body>
        <ScrollProgress />
        <SiteHeader />
        <main className="site-main" role="main">
          {children}
        </main>
        <SiteFooter />
        <MotionLayer />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.gaId}');`}
        </Script>
      </body>
    </html>
  );
}
