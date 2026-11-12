import CalculatorLayout from "@/components/CalculatorLayout";
import RoiCalculator from "@/components/RoiCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("roi-calculator");

const faqs = [
  {
    q: "What is ROI?",
    a: "ROI stands for return on investment. It expresses the profit from an investment as a percentage of what the investment cost. If you put in $1,000 and end up with $1,500, your profit is $500 and your ROI is 50%. It is the simplest way to judge whether a use of money paid off.",
  },
  {
    q: "What is the ROI formula?",
    a: "ROI = (final value − initial investment − additional costs) ÷ (initial investment + additional costs) × 100%. Both the profit and the cost basis include any additional costs, so fees and upkeep are properly counted rather than ignored.",
  },
  {
    q: "Why does the calculator annualise the ROI?",
    a: "A 50% return is excellent over one year but mediocre over ten. Annualising converts the total return into an equivalent yearly rate using (1 + ROI)^(1 ÷ years) − 1, which lets you compare deals of different lengths on the same basis. For holding periods shorter than a year the simple ROI is shown, because annualising a fraction of a year distorts the picture.",
  },
  {
    q: "How are additional costs treated?",
    a: "They are added to the cost basis and subtracted from the profit. If you invest $1,000, pay $100 in fees and the final value is $1,500, the profit is $400 against a $1,100 basis, giving an ROI of about 36.4% rather than the 50% you would see from ignoring the fees. Small costs compound into a much lower return.",
  },
  {
    q: "Is ROI the same as CAGR?",
    a: "No. ROI measures the total return on a single investment over its whole life, while CAGR measures the constant annual growth rate. ROI answers how much you made; CAGR answers how fast you made it per year. They are close cousins, and the CAGR calculator is the natural companion to this one when you want a yearly growth rate.",
  },
];

export default function RoiCalculatorPage() {
  return (
    <CalculatorLayout
      slug="roi-calculator"
      disclaimerVariant="investment"
      intro={
        <p>
          Work out the return on any investment from its cost, its final value, any extra fees and
          how long you held it. The calculator reports the ROI percentage, the annualised return and
          the dollar profit, including additional costs in both.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the ROI calculator works</h2>
          <p>
            Return on investment answers one deceptively simple question: for every dollar you put
            in, how many dollars came back? By expressing the profit as a percentage of the cost, ROI
            lets you compare completely different investments — a rental property, a share
            portfolio, a piece of equipment — on a common footing. The catch is that ROI is only
            meaningful when you are honest about the full cost and careful about the time frame.
          </p>

          <h3>The formulas</h3>
          <p>With an initial investment I, a final value F, additional costs X and a holding period n years:</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            profit = F − I − X
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            ROI = profit ÷ (I + X)
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            annualised ROI = (1 + ROI)<sup>1/n</sup> − 1
          </p>
          <p>
            The annualised figure applies the same compounding logic as a savings account, converting
            a total gain into a per-year rate. It is only computed when the holding period is at
            least one year; for shorter periods the simple ROI is shown unchanged.
          </p>

          <h3>A worked example</h3>
          <p>
            You invest $10,000, pay $500 in fees, and the investment is worth $14,000 after three
            years. The profit is $14,000 − $10,000 − $500 = $3,500 against a cost basis of $10,500,
            so the ROI is about 33.3%. Annualised over three years, that is (1.333)^(1/3) − 1 ≈
            10.1% a year. Notice how the fees pulled the headline return down and how annualising
            gives a figure you can compare against a simple savings rate.
          </p>

          <h3>Why annualising matters</h3>
          <p>
            Two investments both returning 50% look identical until you learn that one took a year
            and the other took ten. The first is a superb result; the second barely beats inflation.
            Annualising forces the comparison onto a common timescale, exactly as CAGR does for growth
            rates. Without it, ROI can flatter slow, long-dated deals and understate quick ones.
          </p>

          <h3>What ROI does not capture</h3>
          <p>
            ROI says nothing about risk, liquidity or the size of the investment, and it assumes a
            single lump sum in and a single lump sum out. If you added or removed money along the
            way, a simpler total-return calculation will mislead you. It also ignores taxes on the
            gain, which reduce the real return, and it cannot annualise a total loss of 100% or more
            because there is no positive base to take a root of — the calculator reports the simple
            figure in that case. Treat ROI as the starting point of an evaluation, not the whole of
            it.
          </p>
        </>
      }
    >
      <RoiCalculator />
    </CalculatorLayout>
  );
}
