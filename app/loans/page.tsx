import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CategoryCards from "@/components/CategoryCards";
import { calculatorsByCategory } from "@/lib/calculators";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Loan & Debt Calculators",
  description:
    "Free US loan and debt calculators: auto loan payments, student loan payoff, credit card payoff and a side-by-side debt snowball vs avalanche comparison.",
  path: "/loans",
});

export default function LoansPage() {
  return (
    <PageShell
      title="Loans & debt calculators"
      crumbs={[{ href: "/loans", label: "Loans" }]}
      adSlotId="category-loans-footer"
      intro={
        <p>
          Borrowing costs less when you know the numbers before you sign. These calculators cover the
          three debts most US households carry — cars, student loans and credit cards — plus the two
          common strategies for clearing them faster.
        </p>
      }
    >
      <CategoryCards items={calculatorsByCategory("loans")} />

      <h2>How loan interest actually works</h2>
      <p>
        An instalment loan such as an auto loan or student loan is amortised: each fixed payment covers
        the interest that accrued since the last payment, and whatever is left reduces the balance.
        Because interest is charged on the outstanding balance, a payment made early in the loan saves
        far more than the same payment made later.
      </p>
      <p>
        Credit cards work differently. The minimum payment is usually a small percentage of the balance,
        which can be less than the interest charged in that month. When that happens the balance barely
        falls and the debt can last decades. The{" "}
        <Link href="/credit-card-payoff-calculator">credit card payoff calculator</Link> shows exactly
        how long the minimum payment takes, and what a fixed payment would do instead.
      </p>

      <h2>Snowball or avalanche?</h2>
      <p>
        With the avalanche method you throw every spare dollar at the highest interest rate first,
        which always costs the least in interest. With the snowball method you clear the smallest
        balance first, which produces quicker wins and is often easier to stick to. The{" "}
        <Link href="/debt-snowball-calculator">debt snowball vs avalanche calculator</Link> runs both
        side by side on your own balances so you can see the trade-off in dollars and months.
      </p>
    </PageShell>
  );
}
