import Link from "next/link";

/**
 * Custom 404. Next.js returns a real 404 status for this route, so search
 * engines drop dead URLs instead of indexing them. `robots` is inherited from
 * the root metadata, which is index/follow — the 404 status is the signal that
 * matters.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        We could not find that page
      </h1>
      <p className="mt-4 text-slate-600">
        The link may be out of date, or the calculator may have moved. Everything on the site is
        listed on the calculators page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/calculators"
          className="rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900"
        >
          Browse all calculators
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Go to the home page
        </Link>
      </div>
      <nav aria-label="Popular calculators" className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900">Popular calculators</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link className="text-teal-800 underline underline-offset-2" href="/mortgage-calculator">
              Mortgage calculator
            </Link>
          </li>
          <li>
            <Link className="text-teal-800 underline underline-offset-2" href="/salary-after-tax">
              Paycheck calculator by state
            </Link>
          </li>
          <li>
            <Link className="text-teal-800 underline underline-offset-2" href="/auto-loan-calculator">
              Auto loan calculator
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
