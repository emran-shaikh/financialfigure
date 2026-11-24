import Link from "next/link";
import type { ReactNode } from "react";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";
import EmbedModal from "@/components/EmbedModal";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import QuickCalculator from "@/components/QuickCalculator";
import { getCalculator, getCategory, relatedCalculators } from "@/lib/calculators";
import { absoluteUrl } from "@/lib/site";
import { calculatorSchema } from "@/lib/structuredData";

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

  const calculatorLd = calculatorSchema({
    path: `/${meta.slug}`,
    name: meta.title,
    description: meta.description,
    crumbs: [
      { path: "/", name: "Home" },
      { path: category.href, name: category.name },
      { path: `/${meta.slug}`, name: meta.navTitle },
    ],
    faqs,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 xl:pr-72">
      <Breadcrumbs crumbs={crumbs} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {meta.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Editorial Verified
            </span>
            <span>·</span>
            {meta.dataDriven && updated ? (
              <span>
                Updated <time dateTime={updated}>{updated}</time> (2026 tax year)
              </span>
            ) : (
              <span>2026 standard formula model</span>
            )}
          </div>
        </div>

        <div className="pt-1">
          <EmbedModal slug={meta.slug} title={meta.title} />
        </div>
      </div>

      <div className="prose-slate mt-4 max-w-prose text-slate-600">{intro}</div>

      <div className="mt-8">{children}</div>

      <Disclaimer variant={disclaimerVariant} reviewed={meta.dataDriven ? updated : undefined} />

      {/* Ad slot 1: directly after the calculator results. Reserved height = no CLS. */}
      <AdSlot slotId="after-results" minHeight={280} />

      <div className="max-w-prose space-y-6 text-slate-700 [&_a]:text-teal-800 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
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

      <JsonLd data={calculatorLd} />
      <QuickCalculator />
    </main>
  );
}
