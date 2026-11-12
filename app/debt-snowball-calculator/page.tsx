import CalculatorLayout from "@/components/CalculatorLayout";
import DebtSnowballCalculator from "@/components/DebtSnowballCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("debt-snowball-calculator");

const faqs = [
  {
    q: "What is the debt snowball method?",
    a: "You list your debts from smallest balance to largest and pay the minimum on everything, then throw every spare dollar at the smallest balance. When it is cleared, its minimum payment rolls into the next debt, like a snowball growing as it rolls. The appeal is psychological: quick wins early keep you motivated.",
  },
  {
    q: "What is the debt avalanche method?",
    a: "The avalanche method targets the highest interest rate first, again paying minimums on everything else and rolling freed-up payments forward. Because it retires the most expensive debt first, it always costs the least in interest — sometimes only marginally more than the snowball, occasionally much less.",
  },
  {
    q: "Which method should I choose?",
    a: "Mathematically the avalanche always wins on interest. In practice the snowball often wins on completion, because clearing a small balance early gives a visible reward that keeps people going. If your highest-rate debt is also your largest, the difference can be small; if a high rate sits on a small balance, the two methods may even agree on the first target.",
  },
  {
    q: "Does this calculator use my extra payment correctly?",
    a: "Yes. Each month every debt is paid its minimum, then your extra payment plus any minimums freed up by cleared debts are aimed at the target debt, cascading to the next once it is cleared. The total monthly budget stays the same throughout, which is exactly how the method works in real life.",
  },
  {
    q: "What if my minimum payment is too low?",
    a: "If a debt's minimum does not cover its monthly interest, that balance will keep growing and the plan can stall. The calculator caps the simulation and reports that the debts cannot be cleared with the current minimums, so you know to increase the payment or renegotiate before relying on the plan.",
  },
];

export default function DebtSnowballCalculatorPage() {
  return (
    <CalculatorLayout
      slug="debt-snowball-calculator"
      intro={
        <p>
          List your debts, add any extra you can afford each month, and compare the debt snowball and debt
          avalanche methods side by side. See which clears your balances sooner and which costs less in interest.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the debt payoff comparison works</h2>
          <p>
            Both the snowball and the avalanche method use the same amount of money every month. The only thing
            that changes is which debt receives the spare cash. This calculator simulates both orders at once, month
            by month, so you can see the trade-off in real numbers rather than slogans.
          </p>

          <h3>The simulation, step by step</h3>
          <ol>
            <li>Each month, interest is added to every debt that still has a balance.</li>
            <li>Every debt is then paid its minimum payment.</li>
            <li>
              The remaining budget — your extra payment plus the minimums freed up by debts you have already cleared
              — is aimed at the target debt. Under the snowball the target is the smallest balance; under the
              avalanche it is the highest interest rate.
            </li>
            <li>When a debt reaches zero it drops out, its minimum joins the pool, and the next target is chosen.</li>
          </ol>
          <p>
            The total budget never changes, because rolling forward a cleared minimum is the mechanism the whole
            method relies on. The simulation is capped at 600 months so it can never run forever.
          </p>

          <h3>Why the two methods diverge</h3>
          <p>
            Interest is charged on the outstanding balance, so paying down the most expensive debt first saves the
            most interest. A balance of $1,200 at 18% costs $18 in interest in the first month alone — more than
            three times the $5.50 that a $1,200 balance at 5.5% would cost. The avalanche attacks numbers like that
            first. The snowball ignores rates and attacks the smallest balance, which clears a debt sooner and frees
            its minimum sooner, but occasionally leaves a costly rate running.
          </p>

          <h3>Worked example</h3>
          <p>
            Imagine two $1,000 debts, one at 0% and one at 24%, with $200 a month on top of the minimums. The
            snowball focuses the spare cash on the interest-free balance, which clears quickly, while the 24% debt
            keeps accruing interest in the background. The avalanche reverses the order and pays the expensive debt
            off first. On the same money, the avalanche pays noticeably less interest — the calculator shows the
            exact dollar difference for your own list.
          </p>

          <h3>What this calculator does not include</h3>
          <p>
            It assumes fixed rates, that you add no new debt and that you stick to the same monthly budget. It does
            not model balance transfers, consolidation loans, settlement, fees or promotions. Real minimums change
            as balances fall, and a single missed month can undo months of progress. Use the comparison to pick a
            strategy, then track it carefully.
          </p>
        </>
      }
    >
      <DebtSnowballCalculator />
    </CalculatorLayout>
  );
}
