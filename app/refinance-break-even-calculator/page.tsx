import CalculatorLayout from "@/components/CalculatorLayout";
import RefinanceBreakEvenCalculator from "@/components/RefinanceBreakEvenCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("refinance-break-even-calculator");

const faqs = [
  {
    q: "What is a refinance break-even point?",
    a: "The break-even point is how long it takes for the monthly savings from a refinance to add up to the closing costs you paid. If refinancing cuts your payment by $400 a month and costs $6,000, you recover that cost in fifteen months. Stay in the home longer than that and the refinance has put you ahead.",
  },
  {
    q: "How is the break-even point calculated?",
    a: "Divide the total closing costs by the monthly saving, then round up to a whole number of months. The calculator first works out the current and new payments from the standard amortisation formula, subtracts one from the other for the saving, and then divides the closing costs by it.",
  },
  {
    q: "Is a shorter term better for breaking even?",
    a: "Not necessarily. Moving from a 30-year loan to a 15-year loan lowers the interest rate but usually raises the monthly payment, which can wipe out the monthly saving entirely. A break-even calculator handles this: if the new payment is higher, there is no saving to recover the closing costs and the refinance never breaks even.",
  },
  {
    q: "Should I refinance if I plan to move soon?",
    a: "Only if you expect to stay past the break-even point. Closing costs are paid up front, so selling before the break-even date means you refinanced at a loss. Estimate how long you are likely to keep the home, and compare it with the break-even figure shown here.",
  },
  {
    q: "Does a lower rate always save interest?",
    a: "Not automatically — the term matters too. A lower rate over a much longer term can still add up to more total interest, even though the monthly payment falls. This calculator shows the lifetime interest for both loans so you can compare the monthly saving against the total cost.",
  },
];

export default function RefinanceBreakEvenPage() {
  return (
    <CalculatorLayout
      slug="refinance-break-even-calculator"
      intro={
        <p>
          Find out how long a refinance takes to pay for itself. Enter your current balance, rate and
          remaining term alongside the new loan and its closing costs to see the monthly saving, the
          break-even point and the difference in lifetime interest.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the refinance break-even calculator works</h2>
          <p>
            Refinancing replaces one mortgage with another, usually at a lower rate. The catch is that
            the new loan carries closing costs — fees, points and title charges paid up front. The
            break-even point is the number of months of monthly saving needed to earn those costs
            back.
          </p>

          <h3>The method</h3>
          <p>
            The calculator prices both loans with the standard amortisation formula and compares the
            results:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            monthly saving = current payment − new payment
            <br />
            break-even = closing costs ÷ monthly saving
          </p>
          <p>
            Each payment follows <em>M = P × r ÷ (1 − (1 + r)<sup>−n</sup>)</em>, where <em>P</em> is
            the outstanding balance, <em>r</em> the monthly rate and <em>n</em> the number of
            payments left. If the new payment is not lower, the saving is zero or negative and there
            is nothing to recover the costs, so the break-even point does not exist.
          </p>

          <h3>Worked example</h3>
          <p>
            Suppose you owe $300,000 at 7% with 300 months left. The current payment is about $2,120
            a month. A new 30-year loan at 5.5% would cost roughly $1,703 a month, a saving of about
            $417. With $6,000 of closing costs, the break-even point is $6,000 ÷ $417, or about
            fifteen months. Stay longer than fifteen months and the refinance is worthwhile on
            strictly monthly terms; sell before then and it loses money.
          </p>

          <h3>Lifetime interest</h3>
          <p>
            Lower payments are not the whole story. The calculator also compares the interest you
            would pay on the current loan&apos;s remaining term against the interest across the new loan&apos;s
            full term. Stretching a balance over more years can raise the total interest even when the
            rate falls, so weigh the monthly relief against the extra interest the longer schedule
            produces.
          </p>

          <h3>Limitations</h3>
          <p>
            The model ignores the tax treatment of mortgage interest, roll-in of closing costs into
            the new loan, cash-out amounts and any changes to insurance or escrow. It also assumes
            both loans run to term. Use it to compare scenarios, and ask your lender for a Loan
            Estimate to get exact closing costs before you commit.
          </p>
        </>
      }
    >
      <RefinanceBreakEvenCalculator />
    </CalculatorLayout>
  );
}
