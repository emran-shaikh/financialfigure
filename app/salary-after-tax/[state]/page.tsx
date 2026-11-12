import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import PaycheckCalculator from "@/components/PaycheckCalculator";
import { STATES_2026, getState } from "@/lib/tax/states2026";
import { calculatePaycheck } from "@/lib/tax/paycheck";

export const dynamicParams = false;
export const generateStaticParams = () => STATES_2026.map((s) => ({ state: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const st = getState((await params).state)!;
  return {
    title: `${st.name} Paycheck Calculator 2026: Salary After Tax`,
    description: `See your take-home pay in ${st.name} for 2026. Includes federal tax, Social Security, Medicare and ${st.none ? "no state income tax on wages" : "state income tax"}.`,
    alternates: { canonical: `/salary-after-tax/${st.slug}` },
  };
}

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const SALARIES = [40000, 60000, 80000, 100000, 150000, 200000];

function describe(slug: string) {
  const st = getState(slug)!;
  if (st.none) return `${st.name} does not tax wages at the state level, so your take-home pay is reduced only by federal income tax and payroll taxes${st.payroll ? ` (plus the ${st.payroll.label} payroll tax)` : ""}.`;
  const top = Math.max(...st.single!.map((b) => b[1]));
  const kind = st.single!.length === 1 ? `a flat rate of ${top}%` : `graduated rates up to ${top}%`;
  return `${st.name} taxes wages at ${kind}. This calculator applies the 2026 state brackets after your standard deduction or exemption.`;
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const st = getState((await params).state)!;
  const rows = SALARIES.map((g) => ({
    g, r: calculatePaycheck({ grossAnnual: g, filing: "single", preTaxAnnual: 0, periodsPerYear: 26, state: st }),
  }));
  const faqs = [
    { q: `How much tax do I pay on a $75,000 salary in ${st.name}?`,
      a: `A single filer earning $75,000 in ${st.name} takes home about ${usd(rows.length ? calculatePaycheck({ grossAnnual: 75000, filing: "single", preTaxAnnual: 0, periodsPerYear: 26, state: st }).net : 0)} per year after federal, state and payroll taxes, based on 2026 rates and the standard deduction.` },
    { q: "Does this include local taxes?", a: st.approx && st.note ? st.note : "This estimate covers federal, state and payroll taxes. Check whether your city or county adds a local income tax." },
    { q: "How accurate is this calculator?", a: "It is an estimate for wage income using 2026 federal and state tax tables. It does not model dependents, credits, itemized deductions or other income. Your employer's withholding and your final return may differ." },
  ];
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-slate-900">
      <h1 className="text-3xl font-semibold">{st.name} paycheck calculator (2026)</h1>
      <p className="mt-2 max-w-prose text-slate-600">{describe(st.slug)}</p>
      <div className="mt-8"><PaycheckCalculator initialState={st.slug} /></div>

      {/* Ad slot directly after the results; reserved height keeps CLS at zero. */}
      <AdSlot slotId="state-after-results" minHeight={280} />

      <section className="max-w-prose">
        <h2 className="text-xl font-semibold">Take-home pay in {st.name} by salary</h2>
        <p className="mt-1 text-sm text-slate-600">Single filer, 2026 tax year, no pre-tax deductions.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm tabular-nums">
            <thead className="bg-slate-100"><tr><th className="p-2">Salary</th><th className="p-2">Take-home / year</th><th className="p-2">Per paycheck (biweekly)</th><th className="p-2">Total tax rate</th></tr></thead>
            <tbody>{rows.map(({ g, r }) => (
              <tr key={g} className="border-t border-slate-100"><td className="p-2">{usd(g)}</td><td className="p-2">{usd(r.net)}</td>
                <td className="p-2">{usd(r.perPeriodNet)}</td><td className="p-2">{(r.effectiveTotalRate * 100).toFixed(1)}%</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 max-w-prose space-y-6">
        <h2 className="text-xl font-semibold">Common questions</h2>
        {faqs.map((f) => (<div key={f.q}><h3 className="font-medium">{f.q}</h3><p className="mt-1 text-slate-600">{f.a}</p></div>))}
        <p className="text-sm text-slate-500">Estimates only, not tax advice. Sources: IRS 2026 inflation adjustments, SSA, Tax Foundation state rate tables.</p>
      </section>

      <nav className="mt-12" aria-label="Other states">
        <h2 className="text-xl font-semibold">Paycheck calculators for other states</h2>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 md:grid-cols-4">
          {STATES_2026.filter((s) => s.slug !== st.slug).map((s) => (
            <li key={s.slug}><Link className="text-teal-800 underline underline-offset-2" href={`/salary-after-tax/${s.slug}`}>{s.name}</Link></li>
          ))}
        </ul>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </main>
  );
}
