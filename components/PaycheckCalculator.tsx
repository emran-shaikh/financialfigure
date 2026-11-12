"use client";
import { useMemo, useState } from "react";
import { calculatePaycheck } from "@/lib/tax/paycheck";
import { STATES_2026, getState } from "@/lib/tax/states2026";
import type { Filing } from "@/lib/tax/federal2026";

const usd = (n: number, d = 0) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d, minimumFractionDigits: d });
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const FREQ = [
  { label: "Weekly", n: 52 }, { label: "Every two weeks", n: 26 },
  { label: "Twice a month", n: 24 }, { label: "Monthly", n: 12 },
];
const inputCls = "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-teal-700";

export default function PaycheckCalculator({ initialState = "texas", initialSalary = 75000 }: { initialState?: string; initialSalary?: number }) {
  const [salary, setSalary] = useState(initialSalary);
  const [stateSlug, setStateSlug] = useState(initialState);
  const [filing, setFiling] = useState<Filing>("single");
  const [periods, setPeriods] = useState(26);
  const [preTax, setPreTax] = useState(0);

  const state = getState(stateSlug)!;
  const r = useMemo(
    () => calculatePaycheck({ grossAnnual: salary, filing, preTaxAnnual: preTax, periodsPerYear: periods, state }),
    [salary, filing, preTax, periods, state]
  );
  const rows: [string, number][] = [
    ["Gross pay", r.gross],
    ["Pre-tax deductions", -r.preTax],
    ["Federal income tax", -r.federalIncomeTax],
    ["Social Security", -r.socialSecurity],
    ["Medicare", -r.medicare],
    [`${state.name} income tax`, -r.stateIncomeTax],
    ...(state.payroll ? ([[state.payroll.label, -r.statePayroll]] as [string, number][]) : []),
  ];

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">Annual salary (USD)
          <input type="number" inputMode="decimal" min={0} step={1000} value={salary}
            onChange={(e) => setSalary(parseFloat(e.target.value) || 0)} className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-slate-700">State
          <select value={stateSlug} onChange={(e) => setStateSlug(e.target.value)} className={inputCls}>
            {STATES_2026.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">Filing status
          <select value={filing} onChange={(e) => setFiling(e.target.value as Filing)} className={inputCls}>
            <option value="single">Single</option><option value="married">Married filing jointly</option><option value="head">Head of household</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">Pay frequency
          <select value={periods} onChange={(e) => setPeriods(Number(e.target.value))} className={inputCls}>
            {FREQ.map((f) => <option key={f.n} value={f.n}>{f.label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Pre-tax contributions per year (401(k), HSA)
          <input type="number" inputMode="decimal" min={0} step={500} value={preTax}
            onChange={(e) => setPreTax(parseFloat(e.target.value) || 0)} className={inputCls} />
        </label>
        {state.note && <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900 sm:col-span-2">{state.note}</p>}
      </div>

      <aside aria-live="polite" className="rounded-lg bg-teal-900 p-6 text-white">
        <p className="text-sm text-teal-100">Take-home pay per paycheck</p>
        <p className="mt-1 text-4xl font-semibold tabular-nums">{usd(r.perPeriodNet, 2)}</p>
        <p className="mt-1 text-sm text-teal-100">{usd(r.net)} per year, {usd(r.net / 12)} per month</p>
        <dl className="mt-5 space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between"><dt className="text-teal-100">{k}</dt><dd className="tabular-nums">{usd(v)}</dd></div>
          ))}
          <div className="flex justify-between border-t border-teal-700 pt-2 font-medium"><dt>Net pay</dt><dd className="tabular-nums">{usd(r.net)}</dd></div>
        </dl>
        <p className="mt-4 text-xs text-teal-100">
          Federal marginal rate {r.federalMarginalRate}% · total tax rate {pct(r.effectiveTotalRate)}
        </p>
      </aside>
    </section>
  );
}
