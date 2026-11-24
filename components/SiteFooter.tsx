import Image from "next/image";
import Link from "next/link";
import OnlineCounter from "@/components/OnlineCounter";
import { CALCULATORS, CATEGORIES } from "@/lib/calculators";
import { FOOTER_LEGAL_LINKS, SITE } from "@/lib/site";
import { STATES_2026 } from "@/lib/tax/states2026";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      {/* Primary footer navigation */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label={`${SITE.name} home`}>
            <Image
              src="/logo.png"
              alt={SITE.name}
              width={1776}
              height={608}
              sizes="164px"
              className="h-14 w-auto"
            />
          </Link>
          <p className="mt-3 text-sm text-slate-600">{SITE.tagline}.</p>
          <p className="mt-3 text-sm text-slate-600">
            <a
              className="underline underline-offset-2 hover:text-teal-800"
              href={`mailto:${SITE.email}`}
            >
              {SITE.email}
            </a>
          </p>
        </div>

        <nav aria-label="Categories">
          <h2 className="text-sm font-semibold text-slate-900">Categories</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline"
                  href={c.href}
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline"
                href="/calculators"
              >
                All calculators
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Calculators">
          <h2 className="text-sm font-semibold text-slate-900">All calculators</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CALCULATORS.map((c) => (
              <li key={c.slug}>
                <Link
                  className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline"
                  href={`/${c.slug}`}
                >
                  {c.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal and company">
          <h2 className="text-sm font-semibold text-slate-900">Site</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline"
                  href={l.href}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Paycheck by State (Dedicated balanced multi-column directory) */}
      <div className="border-t border-slate-100 bg-slate-50/60 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Paycheck Calculator by State (2026)
            </h2>
            <Link
              href="/salary-after-tax"
              className="text-xs font-medium text-teal-800 hover:underline"
            >
              View national overview &amp; map &rarr;
            </Link>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Compare take-home pay with 2026 federal income tax, Social Security, Medicare, and state tax withholding.
          </p>
          <nav aria-label="Paycheck by state" className="mt-5">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {STATES_2026.map((state) => (
                <li key={state.slug}>
                  <Link
                    className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline"
                    href={`/salary-after-tax/${state.slug}`}
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-6 text-xs text-slate-500">
          <div>
            <p>
              {SITE.name} provides free educational calculators. Results are estimates only and are
              not financial, tax, legal or investment advice.
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </div>
          <OnlineCounter />
        </div>
      </div>
    </footer>
  );
}
