import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { STATES_2026 } from "@/lib/tax/states2026";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Paycheck Calculator by State (2026)",
  description:
    "Choose your state to see take-home pay for 2026, including federal income tax, Social Security, Medicare and state income tax for all 50 states and Washington DC.",
  path: "/salary-after-tax",
});

const noTax = STATES_2026.filter((s) => s.none);
const rest = STATES_2026.filter((s) => !s.none);

export default function SalaryAfterTaxIndex() {
  return (
    <PageShell
      title="Paycheck calculator by state"
      updated="2026-11-12"
      crumbs={[{ href: "/salary-after-tax", label: "Paycheck by state" }]}
      intro={
        <p>
          Your take-home pay depends on where you live as much as on what you earn. Pick a state to see
          a 2026 estimate of your net pay per paycheck, including federal income tax, Social Security,
          Medicare and state income tax.
        </p>
      }
    >
      <h2>States with no income tax on wages</h2>
      <p>
        Nine states do not tax wage income at all. Your paycheck in these states is reduced only by
        federal income tax withheld, Social Security and Medicare.
      </p>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
        {noTax.map((s) => (
          <li key={s.slug}>
            <Link href={`/salary-after-tax/${s.slug}`}>{s.name} paycheck calculator</Link>
          </li>
        ))}
      </ul>

      <h2>All states and the District of Columbia</h2>
      <p>
        Each page uses that state&apos;s own 2026 brackets and standard deduction or exemption, so the
        numbers change with the state rather than being a national average.
      </p>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
        {rest.map((s) => (
          <li key={s.slug}>
            <Link href={`/salary-after-tax/${s.slug}`}>{s.name} paycheck calculator</Link>
          </li>
        ))}
      </ul>

      <h2>What changes from state to state</h2>
      <p>
        Three things drive the difference. First, the top marginal rate — from 0% in the nine no-tax
        states up to 13.3% in California. Second, the bracket structure: some states use a single flat
        rate for all income, others use graduated brackets that only touch higher earnings. Third, the
        starting point: each state sets its own standard deduction or personal exemption before any
        tax is calculated, and a few states add city or county income taxes on top.
      </p>
      <p>
        Our{" "}
        <Link href="/methodology">methodology page</Link> explains exactly which figures we use, where
        they come from and what the calculator leaves out. If you are self-employed rather than a
        W-2 employee, start with the{" "}
        <Link href="/self-employment-tax-calculator">self-employment tax calculator</Link> instead. For
        an hourly rate, use the{" "}
        <Link href="/hourly-to-salary-calculator">hourly to salary calculator</Link>.
      </p>

      <p className="text-sm text-slate-500">
        {SITE.name} provides estimates only. Confirm withholding with your employer or a tax
        professional.
      </p>
    </PageShell>
  );
}
