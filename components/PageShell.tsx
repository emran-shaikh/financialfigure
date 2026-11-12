import type { ReactNode } from "react";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs, { breadcrumbJsonLd } from "@/components/Breadcrumbs";

interface PageShellProps {
  title: string;
  /** Short lead paragraph under the H1. */
  intro?: ReactNode;
  /** Last-updated date (ISO) shown under the title. */
  updated?: string;
  /** Breadcrumb trail, excluding the leading "Home" item. */
  crumbs: { href: string; label: string }[];
  /**
   * AdSense `data-ad-slot` id for a single ad reserved *below* the page content.
   *
   * Opt-in, and only for hub/category pages that carry substantial original
   * copy (the calculator directory, category pages, the state index). Leave it
   * unset on about, contact, methodology and the legal pages: Google's
   * placement policies require ads to sit on pages with real content, and
   * utility pages should stay clean.
   */
  adSlotId?: string;
  children: ReactNode;
}

/**
 * Simple content page shell used by the static pages (hub, category, legal).
 * Renders no advertising unless `adSlotId` is set, so legal and utility pages
 * stay clean by construction.
 */
export default function PageShell({ title, intro, updated, crumbs, adSlotId, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {updated && (
        <p className="mt-2 text-sm text-slate-500">
          Last updated <time dateTime={updated}>{updated}</time>
        </p>
      )}
      {intro && <div className="mt-4 text-lg text-slate-600">{intro}</div>}
      <div className="mt-8 space-y-4 text-slate-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-slate-900 [&_a]:text-teal-800 [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_table]:w-full [&_table]:text-left [&_table]:text-sm [&_td]:border-t [&_td]:border-slate-200 [&_td]:p-2 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
      {/* Ad slot below all content — never above the fold, reserved height = no CLS. */}
      {adSlotId && <AdSlot slotId={adSlotId} minHeight={280} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ href: "/", label: "Home" }, ...crumbs])),
        }}
      />
    </main>
  );
}
