import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "Important limits on the accuracy and use of this site's calculators: estimates only, not financial, tax, legal or investment advice.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <PageShell
      title="Disclaimer"
      updated="2026-11-12"
      crumbs={[{ href: "/disclaimer", label: "Disclaimer" }]}
      intro={
        <p>
          The calculators and articles on {SITE.name} give general information and rough estimates.
          They are not professional advice and should not be the only thing you rely on.
        </p>
      }
    >
      <h2>Estimates, not advice</h2>
      <p>
        Every result on this site is an estimate based on the inputs you enter and a defined set of
        assumptions. Nothing here is financial, investment, tax, legal or accounting advice, and using
        the site does not create an adviser-client relationship.
      </p>

      <h2>Tax calculations</h2>
      <p>
        Tax results use published federal and state rate schedules, standard deductions and statutory
        payroll-tax rates. They do not model every rule that applies to a real return, including but
        not limited to: filing-status eligibility, dependents, the child tax credit and other credits,
        itemised deductions, alternative minimum tax, the qualified business income deduction,
        additional Medicare tax on combined household income, state or local add-ons, or any
        retroactive legislative change. Your employer&apos;s withholding and your final tax return will
        differ. Confirm anything important with the IRS, your state revenue department or a licensed
        tax professional.
      </p>

      <h2>Loan and mortgage calculations</h2>
      <p>
        Loan results assume a fixed interest rate, no missed or late payments, and no changes to fees.
        Real loans can have variable rates, origination fees, prepayment penalties, escrow adjustments
        and lender-specific terms. Property tax and insurance amounts vary by location and change over
        time. Contact a licensed lender or mortgage broker for an accurate quote.
      </p>

      <h2>Investment calculations</h2>
      <p>
        Investment projections use assumed constant rates of return, which markets do not provide.
        Actual returns vary, and you can lose money. Projections ignore taxes on gains and withdrawals
        except where explicitly stated. Nothing here is a recommendation to buy or sell any security or
        account type.
      </p>

      <h2>Third-party data</h2>
      <p>
        Where we use data published by another organisation, we name the source on the page and in our{" "}
        <Link href="/methodology">methodology</Link>. We do not control that data and are not
        responsible for errors in it or for changes made after we last reviewed it.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE.name} accepts no liability for any loss or damage
        arising from reliance on the information or results on this site. See the{" "}
        <Link href="/terms">terms of use</Link> for the full terms.
      </p>

      <h2>Questions</h2>
      <p>
        If you believe a figure on this site is wrong, please tell us at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> so we can check it against the primary source.
      </p>
    </PageShell>
  );
}
