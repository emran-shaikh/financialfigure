import CalculatorLayout from "@/components/CalculatorLayout";
import InflationCalculator from "@/components/InflationCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("investments-vs-inflation-calculator");

const faqs = [
  {
    q: "What does inflation actually do to my money?",
    a: "Inflation reduces the number of goods and services a dollar can buy. At 3% a year, $10,000 of idle cash buys what roughly $7,440 buys after ten years and about $5,530 buys after twenty. The dollar amount on the bank statement never changes, but its purchasing power quietly shrinks every year.",
  },
  {
    q: "What is the difference between a nominal and a real return?",
    a: "A nominal return is the headline percentage your investment earns. A real return is what is left after inflation is stripped out. If your investment earns 6% and inflation runs at 3%, the real return is about 2.91%, not 3%, because the two factors multiply rather than simply subtract. Measuring real return is the only way to know whether you are actually getting richer.",
  },
  {
    q: "How is the real return calculated?",
    a: "The real return is (1 + investment return) ÷ (1 + inflation) − 1. Dividing rather than subtracting captures the compounding interaction between the two rates. For a 6% return and 3% inflation this gives 1.06 ÷ 1.03 − 1 ≈ 2.91% a year, which is the rate at which your purchasing power grows.",
  },
  {
    q: "How much must my investments earn just to break even?",
    a: "If you want to keep pace with inflation, your nominal return must at least match the inflation rate; anything above that is real growth. In this calculator, setting the investment return equal to the inflation rate produces a real return of zero and a real value equal to the amount in today's dollars, which is the break-even line.",
  },
  {
    q: "Does the calculator assume the inflation rate stays constant?",
    a: "Yes, it applies a single inflation rate and a single return for the whole period. Real inflation moves around and can be negative during deflationary periods, which the model handles because you can enter a negative rate. Over long horizons, a constant-rate assumption is a convenience, not a forecast.",
  },
];

export default function InflationCalculatorPage() {
  return (
    <CalculatorLayout
      slug="investments-vs-inflation-calculator"
      disclaimerVariant="investment"
      intro={
        <p>
          See what inflation does to the buying power of your money and how much an investment has
          to earn to beat it. Enter an amount, an inflation rate and a return, and the calculator
          reports the nominal value, the real value in today&apos;s dollars and the true annual
          return.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>Why inflation matters more than the headline number</h2>
          <p>
            A balance that grows from $50,000 to $80,000 looks like a healthy gain, but if prices
            have risen by more than half over the same period, you can afford less than before.
            Investors who only look at nominal returns can feel wealthier while their real standard
            of living declines. This calculator separates the two effects so you can judge whether an
            investment is genuinely ahead of rising prices.
          </p>

          <h3>Nominal value versus purchasing power</h3>
          <p>
            There are two different questions hiding inside one projection. The first is how much
            money the investment is worth in future dollars — its nominal value. The second is what
            that money will actually buy — its purchasing power, measured in today&apos;s dollars.
            The calculator reports both, along with the purchasing power of cash that is left idle,
            so the erosion is visible side by side with the growth.
          </p>

          <h3>The formulas</h3>
          <p>With amount A, inflation i, return r and n years:</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            nominal value = A × (1 + r)<sup>n</sup>
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            purchasing power of cash = A ÷ (1 + i)<sup>n</sup>
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            real value = A × (1 + r)<sup>n</sup> ÷ (1 + i)<sup>n</sup>
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            real return = (1 + r) ÷ (1 + i) − 1
          </p>

          <h3>A worked example</h3>
          <p>
            Put $10,000 into an investment earning 6% while inflation runs at 3% for ten years. The
            nominal balance grows to about $17,908, which sounds like a 79% gain. But prices have
            risen by roughly 34%, so in today&apos;s dollars the investment is really worth about
            $13,326 — a real gain of about 33% — and the real return is 2.91% a year rather than the
            headline 6%. Meanwhile $10,000 left as idle cash would buy only about $7,441 of
            today&apos;s goods, a loss of roughly $2,559 in purchasing power.
          </p>

          <h3>Limitations</h3>
          <p>
            The model applies a single constant inflation rate and return, ignores taxes and fees,
            and does not attempt to predict actual inflation, which varies by category and over time.
            Use it to build intuition about the gap between nominal and real returns, not as a
            forecast of any specific period. A taxable account or a high fund fee will widen the gap
            between the nominal value and what you can really spend.
          </p>
        </>
      }
    >
      <InflationCalculator />
    </CalculatorLayout>
  );
}
