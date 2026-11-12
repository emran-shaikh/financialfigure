"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary. Catches render/runtime errors below the root
 * layout and offers a retry instead of a blank screen. In production the
 * `digest` is the only detail Next exposes — full errors are logged to the
 * browser console and to your monitoring tool.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Forward to your monitoring integration (see DEPLOYMENT.md).
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 text-slate-600">
        This page failed to load. Try again — if it keeps happening, please tell us which page you
        were on.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Go to the home page
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Report the problem
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-slate-400">Reference: {error.digest}</p>
      )}
    </main>
  );
}
