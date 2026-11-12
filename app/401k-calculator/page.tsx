import CalculatorLayout from "@/components/CalculatorLayout";
import Retirement401kCalculator from "@/components/Retirement401kCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("401k-calculator");

const faqs = [
  {
    q: "What are the 2026 401(k) contribution limits?",
    a: "For tax year 2026 the IRS elective deferral limit is $24,500 (up from $23,500 in 2025). Workers aged 50 and over may add an $8,000 catch-up for a $32,500 total, and workers aged 60 to 63 get a higher catch-up of $11,250 for a $35,750 total. These figures come from IRS Notice 2025-67 and news release IR-2025-111, published November 13, 2025.",
  },
  {
    q: "How does the employer match work in this calculator?",
    a: "The employer match is modelled as a percentage of your own contribution, capped at a share of your salary. A common design is a 50% match on contributions up to 6% of salary: if you defer 10%, the employer matches only the first 6%, so the match is 6% × 50% = 3% of your salary. Deferring less than the cap reduces the match proportionally, and nothing is matched beyond the cap.",
  },
  {
    q: "Why does my projection stop increasing my deferral above a point?",
    a: "Because the IRS caps elective deferrals. Once your chosen percentage would exceed the deferral limit for your age, the calculator holds your contribution at the dollar limit and lets the rest of the percentage drop away. That is why raising the contribution percentage above a certain level stops changing the projection — the cap, not your percentage, is binding.",
  },
  {
    q: "How is investment growth applied?",
    a: "Each year the model adds your deferral and the employer match to the balance, then grows the whole amount by the expected annual return. Salary rises by your annual raise percentage, which increases both your contributions and the dollar value of any match. The projection assumes a constant average return; real markets fluctuate, so actual balances will differ.",
  },
  {
    q: "Does this include the overall limit on total contributions?",
    a: "No. The IRS also caps the combined employee and employer contributions that can go into a defined contribution plan each year — the section 415(c) limit, which IRS Notice 2025-67 sets at $72,000 for 2026, up from $70,000 in 2025. This calculator focuses on the elective deferral limit that constrains your own contributions. Check with your plan administrator if your total, including a generous match, might approach the combined cap.",
  },
  {
    q: "Is the 401(k) projection tax-adjusted?",
    a: "No. A traditional 401(k) defers tax: contributions reduce your taxable income now and withdrawals are taxed later, so the projected balance is a pre-tax figure. A Roth 401(k) works in reverse. To compare the tax treatment of deferring income now versus paying tax later, use the Roth vs traditional IRA calculator, which applies the same growth maths with taxes attached.",
  },
];

export default function Retirement401kCalculatorPage() {
  return (
    <CalculatorLayout
      slug="401k-calculator"
      updated="2026-11-12"
      disclaimerVariant="investment"
      intro={
        <p>
          Project your 401(k) balance at retirement from your salary, deferral percentage, employer
          match and expected return. Contributions are automatically capped at the official 2026 IRS
          elective deferral limits, including the age-50 and age 60–63 catch-ups.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the 401(k) growth calculator works</h2>
          <p>
            A 401(k) projection is really a compound-interest problem with a tax-advantaged wrapper
            and a helping hand from your employer. Each year you defer part of your salary into the
            plan, your employer may add a matching contribution, and the whole balance grows at the
            market return you expect. Repeating that year after year, with a salary that rises over
            time, is what produces the final balance.
          </p>

          <h3>The 2026 contribution limits</h3>
          <p>
            The IRS sets the maximum elective deferral each year. For 2026 the limit is{" "}
            <strong>$24,500</strong>, with an $8,000 catch-up for savers aged 50 and over and a
            higher $11,250 catch-up for ages 60 to 63. These numbers were published in{" "}
            <a href="https://www.irs.gov/pub/irs-drop/n-25-67.pdf">IRS Notice 2025-67</a> and{" "}
            <a href="https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500">
              news release IR-2025-111
            </a>
            . The calculator applies the limit that matches your age, so a high contribution
            percentage is trimmed to the legal maximum rather than applied in full.
          </p>

          <h3>The projection formula</h3>
          <p>For each plan year the model computes:</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            employee = min(salary × pct, deferralLimit(age))
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            match = salary × min(effectivePct, capPct) × matchPct
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            balance = (balance + employee + match) × (1 + return)
          </p>
          <p>
            The employer match is applied only to the portion of your deferral that falls within the
            company&apos;s cap, so contributing below the cap leaves matching money on the table. The
            salary then grows by your annual raise before the next year begins.
          </p>

          <h3>A worked example</h3>
          <p>
            Start at age 30 with $25,000, a $75,000 salary, a 10% deferral and a 50% employer match
            on the first 6% of salary. Your first-year deferral is $7,500 and the match is $2,250, so
            $9,750 goes in. With a 3% annual raise and a 7% return, the balance compounds for 35
            years. The projection lands in the high six figures, and the split between your
            contributions, the employer&apos;s and investment growth shows how much of the total the
            market — not you — did the heavy lifting for. The milestone table breaks the journey down
            by age.
          </p>

          <h3>Limitations</h3>
          <p>
            The model assumes a level average return, no fees, and continuous employment with the
            same match formula. It does not apply income taxes to contributions or withdrawals, does
            not account for plan fees, and does not model the section 415(c) overall cap on combined
            contributions. Use it to build intuition about the levers you control — starting early,
            capturing the full match and raising your deferral — rather than as a precise forecast.
          </p>
        </>
      }
    >
      <Retirement401kCalculator />
    </CalculatorLayout>
  );
}
