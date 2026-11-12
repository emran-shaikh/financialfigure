"use client";

import Link from "next/link";
import { setConsent, useConsent } from "@/lib/consent";

const CMP_ID = process.env.NEXT_PUBLIC_CMP_ID;

/**
 * Lightweight cookie notice / opt-out banner.
 *
 * It is a non-blocking strip pinned to the bottom of the viewport — it never
 * covers content and can be dismissed. Advertising and analytics are on by
 * default (opt-out, US-first); choosing "Essential only" turns both off
 * immediately and persists the choice.
 *
 * When NEXT_PUBLIC_CMP_ID is set, a Google-certified CMP renders its own,
 * TCF-compliant prompt for EEA/UK/CH visitors, so this fallback banner stands
 * down.
 */
export default function ConsentBanner() {
  const consent = useConsent();

  if (CMP_ID) return null;
  if (consent.decided) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/98 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          We use cookies for advertising (Google AdSense) and analytics to keep this site free.
          Choose &ldquo;Accept all&rdquo;, or &ldquo;Essential only&rdquo; to turn them off. Read our{" "}
          <Link href="/privacy-policy" className="text-teal-800 underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent({ advertising: false, analytics: false })}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => setConsent({ advertising: true, analytics: true })}
            className="rounded-md bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
