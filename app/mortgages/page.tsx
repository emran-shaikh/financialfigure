import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CategoryCards from "@/components/CategoryCards";
import { calculatorsByCategory } from "@/lib/calculators";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Mortgage & Home Calculators",
  description:
    "Free US mortgage and home calculators: monthly payments, amortization schedule, home affordability, refinance break-even and rent vs buy comparison.",
  path: "/mortgages",
});

export default function MortgagesPage() {
  const mortgageCalcs = calculatorsByCategory("mortgage");

  return (
    <PageShell
      title="Mortgage & home calculators"
      crumbs={[{ href: "/mortgages", label: "Mortgage" }]}
      adSlotId="category-mortgage-footer"
      collection={{
        path: "/mortgages",
        name: "Mortgage & Home Calculators",
        description:
          "Free US mortgage and home calculators: monthly payments, amortization schedule, home affordability, refinance break-even and rent vs buy comparison.",
        items: mortgageCalcs.map((c) => ({ name: c.title, path: `/${c.slug}` })),
      }}
      intro={
        <p>
          Buying or refinancing a home is the largest financial transaction most US households will ever make.
          These calculators help you project monthly payments, calculate true borrowing costs, explore payoff
          schedules, and determine whether buying or refinancing makes financial sense.
        </p>
      }
    >
      <CategoryCards items={mortgageCalcs} />

      <h2>Understanding your monthly mortgage payment (PITI)</h2>
      <p>
        A home loan payment is rarely just principal and interest. Lenders calculate your total monthly obligation
        using <strong>PITI</strong>:
      </p>
      <ul>
        <li>
          <strong>Principal:</strong> The portion of your payment that directly reduces the loan balance.
        </li>
        <li>
          <strong>Interest:</strong> The fee charged by the lender for borrowing the money. Early in the loan,
          interest makes up the majority of every payment.
        </li>
        <li>
          <strong>Taxes:</strong> Real estate property taxes assessed by your county or municipality, held in an
          escrow account and paid on your behalf.
        </li>
        <li>
          <strong>Insurance:</strong> Homeowners insurance policies protecting against damage, plus Private Mortgage
          Insurance (PMI) if your down payment was less than 20%.
        </li>
        <li>
          <strong>HOA Dues:</strong> Homeowners association fees if you live in a planned community, condo, or co-op.
        </li>
      </ul>
      <p>
        The <Link href="/mortgage-calculator">mortgage calculator</Link> accounts for all of these components so you
        see your realistic monthly outlay, not just the principal and interest.
      </p>

      <h2>How much house can you afford?</h2>
      <p>
        Lenders evaluate home loan applications using debt-to-income (DTI) ratios. The standard guideline is the{" "}
        <strong>28/36 rule</strong>:
      </p>
      <ul>
        <li>
          <strong>Front-end ratio (28%):</strong> Your housing costs (mortgage, taxes, insurance, HOA) should not
          exceed 28% of your gross monthly income.
        </li>
        <li>
          <strong>Back-end ratio (36%):</strong> Your total monthly debt obligations (housing plus auto loans, student
          loans, and minimum credit card payments) should not exceed 36% of your gross monthly income.
        </li>
      </ul>
      <p>
        The <Link href="/mortgage-affordability-calculator">how much house can I afford calculator</Link> applies these
        thresholds to your income, monthly debts, and down payment to determine your safe budget and loan ceiling.
      </p>

      <h2>Amortization and the power of extra payments</h2>
      <p>
        Fixed-rate mortgages are amortized on a schedule that front-loads interest payments. Over a 30-year term, you
        can pay more in interest than the original home purchase price.
      </p>
      <p>
        Adding even a modest extra payment each month directly attacks the principal balance. Because subsequent
        interest charges are computed on the remaining balance, prepaying principal shortens the repayment term and
        saves thousands in lifetime financing costs. Use the{" "}
        <Link href="/amortization-schedule">amortization schedule calculator</Link> to inspect the full monthly
        breakdown and simulate prepayments.
      </p>

      <h2>Refinancing and renting vs. buying</h2>
      <p>
        If interest rates drop or your credit score improves, refinancing can lower your monthly rate. However,
        refinancing requires paying closing costs (typically 2% to 5% of the loan amount). The{" "}
        <Link href="/refinance-break-even-calculator">refinance break-even calculator</Link> shows how many months it
        will take for monthly payment savings to cover those upfront fees.
      </p>
      <p>
        Deciding whether to buy a home or continue renting? Buying builds equity and offers tax advantages, but home
        ownership entails closing costs, maintenance, insurance, and opportunity costs. The{" "}
        <Link href="/rent-vs-buy-calculator">rent vs buy calculator</Link> compares both paths across your projected
        holding period to help you choose the most cost-effective option.
      </p>
    </PageShell>
  );
}
