import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { CALCULATORS, CATEGORIES, FEATURED_CALCULATORS, calculatorsByCategory } from "@/lib/calculators";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `${SITE.name} — Free US Finance Calculators`,
  description:
    "Free US finance calculators for mortgage payments, take-home pay in all 50 states, auto and student loans, debt payoff and investment growth. No sign-up, no data collected.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="mt-8 rounded-2xl bg-gradient-to-br from-teal-900 to-teal-700 px-6 py-12 text-white sm:px-10 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Free US finance calculators you can actually trust
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-teal-50">
          Work out your mortgage payment, your real take-home pay in any state, loan payoff dates and
          investment growth. Every calculator shows the formula it uses and the data behind it — and
          nothing you type ever leaves your browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/mortgage-calculator"
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-50"
          >
            Mortgage calculator
          </Link>
          <Link
            href="/salary-after-tax"
            className="rounded-lg border border-teal-200/70 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Paycheck calculator by state
          </Link>
        </div>
        <p className="mt-6 text-sm text-teal-100">
          {CALCULATORS.length} calculators · 51 state tax pages · updated for the 2026 tax year
        </p>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories-heading" className="mt-14">
        <h2 id="categories-heading" className="text-2xl font-semibold text-slate-900">
          Browse by category
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={category.href}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:border-teal-700 hover:shadow-sm"
              >
                <span className="font-semibold text-teal-900">{category.name}</span>
                <span className="mt-2 text-sm text-slate-600">{category.blurb}</span>
                <span className="mt-4 text-xs font-medium text-slate-500">
                  {calculatorsByCategory(category.id).length} calculators
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured */}
      <section aria-labelledby="featured-heading" className="mt-14">
        <h2 id="featured-heading" className="text-2xl font-semibold text-slate-900">
          Most popular calculators
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CALCULATORS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}`}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:border-teal-700 hover:shadow-sm"
              >
                <span className="font-semibold text-teal-900">{c.title}</span>
                <span className="mt-2 text-sm text-slate-600">{c.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/calculators" className="text-sm font-medium text-teal-800 underline underline-offset-2">
            See all {CALCULATORS.length} calculators →
          </Link>
        </p>
      </section>

      {/* How our calculators work */}
      <section aria-labelledby="how-heading" className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
        <h2 id="how-heading" className="text-2xl font-semibold text-slate-900">
          How our calculators work
        </h2>
        <div className="mt-4 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-slate-900">Standard, published formulas</h3>
            <p className="mt-2 text-sm text-slate-600">
              Every result comes from the textbook formula for that problem — the amortisation formula
              for loans, the IRS rate schedules for income tax, and the 6.2% / 1.45% FICA rates for
              payroll tax. The formula is printed on each calculator page, so you can check the maths
              yourself.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Traceable data</h3>
            <p className="mt-2 text-sm text-slate-600">
              Tax brackets, the Social Security wage base and state rates come from primary sources:
              the IRS, the Social Security Administration and each state&apos;s revenue department. Each
              data file names its source and the date it was last reviewed.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Runs in your browser</h3>
            <p className="mt-2 text-sm text-slate-600">
              Calculations happen in your browser. We do not ask you to sign up, and we do not send
              your salary, debts or home price to a server. See the{" "}
              <Link href="/methodology">methodology</Link> for the full list of assumptions and
              limitations.
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-600">
          These tools give estimates, not advice. Tax and finance rules depend on your personal
          circumstances — see our <Link href="/disclaimer">disclaimer</Link>.
        </p>
      </section>

      {/* Single ad slot below all content — never above the fold. */}
      <AdSlot slotId="home-footer" minHeight={280} />
    </main>
  );
}
