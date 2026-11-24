import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConsentBanner from "@/components/ConsentBanner";
import ConsentScripts from "@/components/ConsentScripts";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE } from "@/lib/site";
import { siteSchema } from "@/lib/structuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Free US Finance Calculators`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: `${SITE.url}/`,
    title: `${SITE.name} — Free US Finance Calculators`,
    description: SITE.description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${SITE.name}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Free US Finance Calculators`,
    description: SITE.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  // Favicon/apple-icon are auto-discovered from app/icon.png and app/apple-icon.png.
} as Metadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-teal-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <SiteFooter />
        <ConsentBanner />
        <ConsentScripts />
        <JsonLd data={siteSchema} />
      </body>
    </html>
  );
}
