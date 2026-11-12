import Link from "next/link";
import type { ReactNode } from "react";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";
import FaqSection, { faqJsonLd, type FaqItem } from "@/components/FaqSection";
import { getCalculator, getCategory, relatedCalculators } from "@/lib/calculators";
import { absoluteUrl, SITE } from "@/lib/site";

interface CalculatorLayoutProps {
  /** Slug from lib/calculators.ts. */
  slug: string;
  /** Lead paragraph(s) shown under the H1. */
  intro: ReactNode;
  /** The interactive calculator itself. */
  children: ReactNode;
  /** 400+ words of original long-form content (how it works, formula, example). */
  content: ReactNode;
  faqs: FaqItem[];
  /** Optional override for the "last updated" line. */
  updated?: string;
  disclaimerVariant?: "general" | "tax" | "investment";
}

/**
 * Shared shell for every calculator page. Guarantees the SEO and AdSense
 * requirements are met consistently: one H1, breadcrumbs, reserved ad slots,
 * a visible disclaimer, FAQ schema and internal links to related calculators.
 */
export default function CalculatorLayout({
  slug,
  intro,
  children,
  content,
  faqs,
  updated,
  disclaimerVariant = "general",
}: CalculatorLayoutProps) {
  const meta = getCalculator(slug);
  if (!meta) throw new Error(`Unknown calculator slug: ${slug}`);
  const category = getCategory(meta.category);
  const related = relatedCalculators(slug);
  const canonical = absoluteUrl(`/${meta.slug}`);

  const crumbs = [
    { href: category.href, label: category.name },
    { href: `/${meta.slug}`, label: meta.navTitle },
  ];

  const webAppLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: meta.title,
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description: meta.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {meta.title}
      </h1>

      {meta.dataDriven && updated && (
        <p className="mt-2 text-sm text-slate-500">
          Updated <time dateTime={updated}>{updated}</time> · 2026 tax year data
        </p>
      )}

      <div className="prose-slate mt-4 max-w-prose text-slate-600">{intro}</div>

      <div className="mt-8">{children}</div>

      <Disclaimer variant={disclaimerVariant} reviewed={meta.dataDriven ? updated : undefined} />

      {/* Ad slot 1: directly after the calculator results. Reserved height = no CLS. */}
      <AdSlot slotId="after-results" minHeight={280} />

      <div className="max-w-prose space-y-6 text-slate-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_a]:text-teal-800 [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
        {content}
      </div>

      {/* Ad slot 2: inside long-form content, after the reader has scrolled past the detail. */}
      <AdSlot slotId="in-content" minHeight={280} />

      <FaqSection faqs={faqs} />

      {related.length > 0 && (
        <nav aria-label="Related calculators" className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900">People also use</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/${r.slug}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-700 hover:shadow-sm"
                >
                  <span className="font-medium text-teal-900">{r.navTitle}</span>
                  <span className="mt-1 block text-sm text-slate-600">{r.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ href: "/", label: "Home" }, ...crumbs])) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }} />
    </main>
  );
}
