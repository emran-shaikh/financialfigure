import CalculatorLayout from "@/components/CalculatorLayout";
import CreditCardPayoffCalculator from "@/components/CreditCardPayoffCalculator";
import { calculatorMetadata } from "@/lib/metadata";

// Source: Federal Reserve G.19 Consumer Credit release (August 2026 data,
// released 2026-10-07): average credit card APR 21.19% across all accounts and
// 22.36% for accounts assessed interest.
// https://www.federalreserve.gov/releases/g19/current/
// Last reviewed: 2026-11-12

export const metadata = calculatorMetadata("credit-card-payoff-calculator");

const faqs = [
  {
    q: "How long will it take to pay off my credit card?",
    a: "It depends entirely on the payment. At a fixed monthly payment the payoff time is n = −ln(1 − balance × r ÷ payment) ÷ ln(1 + r), where r is the monthly rate (APR ÷ 12). A larger payment shortens the time dramatically because it reduces the balance that interest is charged on. Enter your balance, APR and payment to see the exact number of months.",
  },
  {
    q: "Why does paying only the minimum take so long?",
    a: "Card minimums are usually a small percentage of the balance — often 1% to 3% plus interest. On a high balance the minimum can barely exceed the monthly interest, so almost nothing goes to principal. If the minimum ever falls below the monthly interest, the balance actually grows, and the debt can last decades.",
  },
  {
    q: "How is credit card interest calculated?",
    a: "Interest is charged on the outstanding balance at the annual percentage rate divided by twelve (the monthly periodic rate), though issuers may use an average daily balance and compound it. This calculator uses a monthly rate of APR ÷ 100 ÷ 12 applied to the balance, which closely matches how a statement's finance charge behaves month to month.",
  },
  {
    q: "What is the average credit card interest rate?",
    a: "The Federal Reserve's G.19 release for August 2026 reported an average APR of 21.19% across all accounts and 22.36% for accounts that were assessed interest. Your rate depends on the issuer, the card and your creditworthiness, so use the figure as a benchmark and enter your own APR for an accurate result.",
  },
  {
    q: "Is a balance transfer worth it?",
    a: "A 0% introductory balance transfer can help if you can clear the balance before the promotional period ends and the transfer fee is smaller than the interest you would otherwise pay. If you cannot clear it in time, the standard APR returns and the fee is wasted. Compare the total cost of both approaches.",
  },
];

export default function CreditCardPayoffCalculatorPage() {
  return (
    <CalculatorLayout
      slug="credit-card-payoff-calculator"
      intro={
        <p>
          Find out how long it takes to clear a credit card balance and how much interest you pay. Fix a monthly
          payment to see the payoff time, or set a target date and see the payment you would need to hit it.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the credit card payoff calculator works</h2>
          <p>
            A credit card is an open-ended loan. Instead of a fixed term, you choose a payment each month, and the
            balance either falls, stalls or grows depending on whether that payment beats the interest. This
            calculator models the balance month by month at a rate of APR ÷ 100 ÷ 12, and can answer the question
            in both directions: given a payment, how long will it take; or given a deadline, what must I pay?
          </p>

          <h3>The two directions</h3>
          <ul>
            <li>
              <strong>Fixed payment:</strong> the balance is reduced by (payment − monthly interest) each month and
              we count how many months it takes to reach zero.
            </li>
            <li>
              <strong>Target time:</strong> we invert the amortisation formula to find the payment that clears the
              balance in exactly the number of months you choose.
            </li>
          </ul>

          <h3>Worked example</h3>
          <p>
            Suppose you owe $6,000 at an APR of 22.5%. The monthly rate is 1.875%, so the first month&apos;s interest is
            about $112.50. If you pay a flat $250 a month, the balance clears in roughly <strong>33 months</strong>{" "}
            and you pay about <strong>$2,100 in interest</strong>. If instead you pay only $112.50 — exactly the
            monthly interest — the balance never falls at all, and the debt would never be repaid. The gap between
            those two outcomes is the whole point of the calculator.
          </p>

          <h3>The minimum payment trap</h3>
          <p>
            Card issuers normally set the minimum as a small percentage of the balance, so it shrinks as the balance
            shrinks. That makes the payoff asymptotically long. Whenever the minimum drops below the monthly
            interest, the balance grows and the calculator raises a warning. Fixing your own payment — the same
            amount every month regardless of the minimum — is the single most effective way to escape that trap.
          </p>

          <h3>What this calculator does not include</h3>
          <p>
            It assumes you add no new purchases and that the APR stays constant. Real statements use an average
            daily balance, may compound interest, and can change the rate. Fees, promotional rates and balance
            transfer offers are not modelled. Use the result as a guide and check your statement for the exact
            finance charge.
          </p>
        </>
      }
    >
      <CreditCardPayoffCalculator />
    </CalculatorLayout>
  );
}
