import CalculatorLayout from "@/components/CalculatorLayout";
import CagrCalculator from "@/components/CagrCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("cagr-calculator");

const faqs = [
  {
    q: "What is CAGR?",
    a: "CAGR stands for compound annual growth rate. It is the single constant yearly rate that would take an investment from its beginning value to its ending value over the holding period. It smooths out the ups and downs of the actual journey into one comparable number, which makes investments of different lengths easier to compare.",
  },
  {
    q: "What is the CAGR formula?",
    a: "CAGR = (ending value ÷ beginning value)^(1 ÷ years) − 1. The calculator expresses the result as a percentage. The total return, by contrast, is simply (ending value − beginning value) ÷ beginning value, which does not account for how long the investment was held.",
  },
  {
    q: "Why is CAGR lower than the average annual return?",
    a: "CAGR is a geometric average, while an average of yearly returns is arithmetic, and the geometric figure is always lower when returns vary. A fund that gains 50% then loses 50% has an average annual return of 0% but a CAGR of about −13.4%, because the two moves compound to a 25% loss. CAGR tells the truth about the money you actually have.",
  },
  {
    q: "What if my beginning value is zero or negative?",
    a: "CAGR cannot be computed from a zero or negative starting point because the calculation divides by the beginning value and takes a root of the ratio. The calculator detects that case and shows a clear message instead of returning a meaningless number. The same applies to a zero holding period or a negative ending value.",
  },
  {
    q: "When should I use CAGR instead of ROI?",
    a: "Use CAGR whenever the holding periods you are comparing differ, because it puts every investment on a per-year basis. Use plain ROI when you only care about the total gain on a single deal over one known period. In practice the two are companions: ROI answers how much you made, and CAGR answers how fast you made it each year.",
  },
];

export default function CagrCalculatorPage() {
  return (
    <CalculatorLayout
      slug="cagr-calculator"
      disclaimerVariant="investment"
      intro={
        <p>
          Turn a beginning value, an ending value and a holding period into a compound annual growth
          rate — the constant yearly return that would produce the same result. The calculator also
          reports the total return and the absolute gain.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the CAGR calculator works</h2>
          <p>
            Comparing investments by their total return is unfair when the holding periods differ. A
            40% gain over two years is a much stronger result than the same 40% spread over eight
            years. CAGR removes that distortion by asking a single question: what constant yearly
            rate would have taken the investment from where it started to where it ended? The answer
            is comparable across any two investments, no matter how long each was held.
          </p>

          <h3>The formulas</h3>
          <p>
            Let the beginning value be <em>B</em>, the ending value be <em>E</em> and the holding
            period be <em>n</em> years:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            CAGR = (E ÷ B)<sup>1/n</sup> − 1
          </p>
          <p>The calculator also reports two related figures:</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            total return = (E − B) ÷ B
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            absolute gain = E − B
          </p>
          <p>
            The total return is the raw percentage you gained, and the absolute gain is the dollar
            profit. Only the CAGR adjusts for time.
          </p>

          <h3>A worked example</h3>
          <p>
            Suppose an investment grows from $10,000 to $20,000 over ten years. The total return is
            100% and the absolute gain is $10,000. But the CAGR is only about 7.18% a year, because
            that modest annual rate is what doubles the money over a decade. Now imagine the same
            doubling happened in just three years: the total return is still 100%, but the CAGR
            jumps to about 26%, which is a very different and far better outcome. The total-return
            figure alone would have hidden that difference.
          </p>

          <h3>CAGR is a smoothing device</h3>
          <p>
            Real returns are never constant. A portfolio might gain 18%, lose 5%, gain 12% and lose
            2% across four years and still end up with a CAGR that looks calm. CAGR is deliberately
            blind to volatility; it describes the destination, not the ride. Two investments with the
            same CAGR can feel completely different to hold, which is why risk measures matter
            alongside the growth rate.
          </p>

          <h3>What the calculator leaves out</h3>
          <p>
            The calculation ignores the timing of cash flows — it assumes money went in once at the
            start and stayed put. If you added or withdrew money along the way, use a
            money-weighted return instead, because CAGR will misrepresent your experience. The model
            also ignores taxes and fees, and it cannot compute a result from a zero, negative or
            non-positive starting point, which it flags rather than guess.
          </p>
        </>
      }
    >
      <CagrCalculator />
    </CalculatorLayout>
  );
}
