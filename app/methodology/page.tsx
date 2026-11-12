import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Methodology",
  description:
    "The data sources, update schedule, formulas and limitations behind every calculator on this site — so you can check our numbers against primary sources.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <PageShell
      title="Methodology"
      updated="2026-11-12"
      crumbs={[{ href: "/methodology", label: "Methodology" }]}
      intro={
        <p>
          This page explains where the numbers come from, how often they are updated, and what the
          calculators deliberately leave out. It is meant to be read together with the{" "}
          <Link href="/disclaimer">disclaimer</Link>: the figures here are traceable, but they are
          still estimates.
        </p>
      }
    >
      <h2>Principles</h2>
      <ol>
        <li>
          <strong>Every number has a source.</strong> Tax and rate data lives in dedicated files that
          carry the source and the date we last reviewed them. We do not invent figures.
        </li>
        <li>
          <strong>Formulas are published.</strong> Each calculator uses the standard textbook or
          statutory formula for its problem, shown on the page.
        </li>
        <li>
          <strong>Logic is separate from the interface.</strong> The maths lives in tested modules, so
          a design change cannot alter an answer.
        </li>
        <li>
          <strong>What we cannot verify is flagged, not guessed.</strong> Where a figure is
          best-effort, it is marked in the code and listed in DATA_REVIEW.md.
        </li>
      </ol>

      <h2>Data sources</h2>
      <p>
        The tax calculators use the figures below. Where a figure changes for a new tax year, only the
        relevant data file is edited — the formulas stay the same.
      </p>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Primary source</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2026 federal income tax brackets, standard deduction and rates</td>
            <td>
              IRS Revenue Procedure 2025-32 (annual inflation adjustments) and IRS news release
              IR-2025-103
            </td>
            <td>lib/tax/federal2026.ts</td>
          </tr>
          <tr>
            <td>Social Security wage base and Medicare rates</td>
            <td>Social Security Administration 2026 fact sheet (COLA and contribution base)</td>
            <td>lib/tax/federal2026.ts</td>
          </tr>
          <tr>
            <td>State income tax brackets and standard deductions, 51 jurisdictions</td>
            <td>
              Tax Foundation, &ldquo;State Individual Income Tax Rates and Brackets&rdquo;; state
              revenue department publications for recent changes
            </td>
            <td>lib/tax/states2026.ts</td>
          </tr>
        </tbody>
      </table>
      <p>
        Loan, mortgage and investment calculators use closed-form formulas rather than external data.
        Their only inputs are the numbers you type, the rate you enter and the time period you choose.
      </p>

      <h2>How tax is calculated</h2>
      <p>
        Federal and state income tax are calculated by applying each marginal rate only to the slice of
        taxable income that falls inside its bracket — the same way the IRS rate schedules work — not
        by multiplying your whole income by your top rate. Payroll tax (Social Security and Medicare)
        is applied to gross wages, with Social Security capped at the annual wage base and the
        additional 0.9% Medicare rate applied above the statutory threshold. Pre-tax deductions such as
        a traditional 401(k) reduce income tax but not Social Security or Medicare.
      </p>

      <h2>Update schedule</h2>
      <ul>
        <li>
          <strong>Federal figures</strong> are usually published by the IRS in October or November for
          the following tax year, and by the Social Security Administration around the same time. We
          aim to update within a few weeks of publication.
        </li>
        <li>
          <strong>State figures</strong> change on each state&apos;s own timetable — some on 1 January,
          some when the legislature meets. We review all 51 jurisdictions at the start of each tax
          year and whenever a state publishes a change.
        </li>
        <li>
          <strong>Rate and loan data</strong> is not fixed and is entered by you, so it does not go
          stale in the same way. The formulas do not need annual updates.
        </li>
      </ul>

      <h2>Assumptions and limitations</h2>
      <p>
        The calculators model a defined set of inputs. They do not attempt to reproduce a complete tax
        return or a lender&apos;s underwriting, and the following are outside their scope:
      </p>
      <ul>
        <li>
          Tax credits (including the child tax credit and earned income tax credit), itemised
          deductions, the alternative minimum tax and the qualified business income deduction.
        </li>
        <li>
          Local and city income taxes, which exist in several states and are noted on the relevant
          state page where significant.
        </li>
        <li>
          Filing-status eligibility rules, residency and part-year rules, and state-specific
          reciprocity agreements.
        </li>
        <li>
          Loan features such as variable rates, origination fees, prepayment penalties and escrow
          adjustments.
        </li>
        <li>
          Market variability: investment projections use a constant assumed return, which real markets
          do not provide.
        </li>
      </ul>
      <p>
        Head-of-household state brackets are not modelled where a state publishes them separately and
        they were unavailable from the cited source; those cases are flagged for review rather than
        estimated. The project&apos;s DATA_REVIEW.md file lists the figures we want a human to confirm
        before launch.
      </p>

      <h2>Corrections</h2>
      <p>
        If a figure looks wrong, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the page
        and the number. When we can verify a source, we fix it and update the reviewed date. When we
        cannot, we add it to the review list instead of changing the number.
      </p>
    </PageShell>
  );
}
