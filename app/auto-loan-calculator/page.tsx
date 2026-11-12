import CalculatorLayout from "@/components/CalculatorLayout";
import AutoLoanCalculator from "@/components/AutoLoanCalculator";
import { calculatorMetadata } from "@/lib/metadata";

// Source: Federal Reserve G.19 Consumer Credit release (August 2026 data,
// released 2026-10-07): average commercial-bank new-car loan APR 7.54% over 60
// months and 7.17% over 72 months.
// https://www.federalreserve.gov/releases/g19/current/
// Last reviewed: 2026-11-12

export const metadata = calculatorMetadata("auto-loan-calculator");

const faqs = [
  {
    q: "How is a car payment calculated?",
    a: "The finance office first works out the amount financed: the negotiated price minus your down payment and any trade-in, plus sales tax and title, registration and dealer fees. That amount is then repaid with the standard amortisation formula M = P × r ÷ (1 − (1 + r)^−n), where P is the amount financed, r is the monthly interest rate (APR ÷ 12) and n is the number of monthly payments.",
  },
  {
    q: "Do I pay sales tax on a trade-in?",
    a: "Most states charge sales tax only on the difference between the new vehicle's price and your trade-in value, which is why a trade-in lowers your tax bill as well as the amount you borrow. A handful of states tax the full purchase price regardless. The calculator lets you set the rate and taxes only the post-trade-in figure.",
  },
  {
    q: "Does a longer loan term lower my monthly payment?",
    a: "Yes, but it costs more overall. Stretching a loan from 60 to 72 or 84 months spreads the principal over more payments, so each one is smaller. Because the balance stays high for longer, more interest accrues, so the total cost of the car rises. Compare two terms side by side before you decide.",
  },
  {
    q: "What is a typical auto loan rate right now?",
    a: "The Federal Reserve's G.19 release for August 2026 put the average 60-month new-car loan rate at commercial banks at 7.54% and the 72-month rate at 7.17%. Your rate depends heavily on credit score, term length, new versus used and whether the dealer or a bank finances the purchase, so treat those figures as a rough benchmark only.",
  },
  {
    q: "Which fees should I watch for?",
    a: "Dealer documentation fees, title and registration charges, and add-ons such as GAP insurance, paint protection and extended warranties. Only the first two are unavoidable; the rest are negotiable or optional and quietly increase the amount you finance.",
  },
];

export default function AutoLoanCalculatorPage() {
  return (
    <CalculatorLayout
      slug="auto-loan-calculator"
      intro={
        <p>
          Work out your monthly car payment from the vehicle price, your down payment and trade-in, sales tax,
          dealer fees and the loan term. The calculator shows the amount financed, the monthly payment, the total
          interest and the all-in cost of the car — calculated entirely in your browser.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the auto loan calculator works</h2>
          <p>
            Buying a car is rarely as simple as the sticker price. Sales tax, a trade-in, title and registration
            costs and dealer documentation fees all change what you actually borrow — and therefore what you pay
            each month and in total. This calculator rebuilds the deal the way a finance office does, line by line,
            so you can see where every dollar goes before you sign.
          </p>

          <h3>What goes into the amount financed</h3>
          <p>The amount financed is built up from four parts:</p>
          <ul>
            <li>
              <strong>Purchase price net of credits:</strong> the negotiated price minus your down payment and the
              trade-in allowance.
            </li>
            <li>
              <strong>Sales tax:</strong> charged on the price after the trade-in, which is how most states
              calculate it. A trade-in therefore reduces your tax as well as your loan.
            </li>
            <li>
              <strong>Government fees:</strong> title, registration and other mandatory charges.
            </li>
            <li>
              <strong>Dealer fees:</strong> documentation and other dealer-imposed charges.
            </li>
          </ul>
          <p>
            The result is floored at zero: a trade-in or down payment larger than the price can never produce a
            negative loan.
          </p>

          <h3>The monthly payment formula</h3>
          <p>
            Once the amount financed is known, the payment is the standard amortised-loan payment, the same
            mathematics that underlies a mortgage:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            M = P × r ÷ (1 − (1 + r)<sup>−n</sup>)
          </p>
          <p>
            <em>P</em> is the amount financed, <em>r</em> is the monthly rate (APR ÷ 12) and <em>n</em> is the term
            in months. At a 0% rate the payment is simply the amount financed divided by the number of months.
          </p>

          <h3>Worked example</h3>
          <p>
            Suppose you buy a $35,000 car with a $5,000 down payment and no trade-in, 6.5% sales tax, $400 of title
            and registration fees, $500 of dealer fees and a 7.5% APR over 60 months. Sales tax is $2,275, so the
            amount financed is $35,000 − $5,000 + $2,275 + $400 + $500 = $33,175. The monthly payment works out to
            about <strong>$665</strong>. Over five years you repay roughly $39,900, of which about{" "}
            <strong>$6,700 is interest</strong>, bringing the all-in cost of the car to roughly $44,900.
          </p>

          <h3>What this calculator does not include</h3>
          <p>
            Insurance, GAP coverage, extended warranties, prepaid maintenance and manufacturer rebates are not
            modelled, and state tax rules vary — some states tax the full price, others offer trade-in credits or
            cap the rate. Rates are set by the lender and move with credit score and the market. Use the result as
            a planning estimate and confirm the final numbers with the dealer&apos;s finance office.
          </p>
        </>
      }
    >
      <AutoLoanCalculator />
    </CalculatorLayout>
  );
}
