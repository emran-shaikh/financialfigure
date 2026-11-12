import CalculatorLayout from "@/components/CalculatorLayout";
import RothVsTraditionalIraCalculator from "@/components/RothVsTraditionalIraCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("roth-vs-traditional-ira-calculator");

const faqs = [
  {
    q: "What is the difference between a Roth and a traditional IRA?",
    a: "A traditional IRA is funded with pre-tax dollars, so contributions may reduce your taxable income today, but withdrawals in retirement are taxed as ordinary income. A Roth IRA is funded with money you have already paid tax on, so qualified withdrawals are tax-free. The accounts grow identically; the difference is entirely about when you pay tax.",
  },
  {
    q: "How does this calculator make the comparison fair?",
    a: "Both accounts start from the same pre-tax amount. The traditional IRA invests the full amount and is taxed on the way out. The Roth IRA pays tax at your current rate first and invests the remainder, which then grows and comes out tax-free. Comparing on equal pre-tax dollars is the only way to isolate the tax question without accidentally comparing different amounts of money.",
  },
  {
    q: "Which account wins?",
    a: "The one taxed at the lower rate. If your marginal rate in retirement is lower than today's, the traditional IRA wins because you defer tax to a cheaper period. If your retirement rate is higher, the Roth wins because you lock in today's lower rate. When the two rates are equal, the accounts produce the same after-tax balance — a useful sanity check the calculator demonstrates by returning a tie.",
  },
  {
    q: "What are the 2026 IRA contribution limits?",
    a: "For 2026 you can contribute up to $7,500 to an IRA, plus a $1,100 catch-up if you are 50 or older, for a total of $8,600. These figures come from IRS Notice 2025-67 and news release IR-2025-111. Eligibility to deduct traditional contributions or to contribute to a Roth IRA in full also depends on your income, which this calculator does not model.",
  },
  {
    q: "Why does the calculator assume the same gross contribution?",
    a: "Because a Roth contribution of $7,500 costs you more take-home income than a traditional contribution of $7,500, which is deducted before tax. Holding the gross figure constant accounts for that hidden cost and keeps the comparison honest. If instead you compared equal out-of-pocket amounts, the traditional account would receive more gross dollars and the result would change.",
  },
  {
    q: "Does the $7,500 limit apply per person or per household?",
    a: "It is a per-person limit. A married couple can each contribute up to the individual limit, and each person's contribution is subject to their own income-based eligibility rules. This calculator models a single account; run it twice, once per spouse, to see the household picture.",
  },
];

export default function RothVsTraditionalIraCalculatorPage() {
  return (
    <CalculatorLayout
      slug="roth-vs-traditional-ira-calculator"
      updated="2026-11-12"
      disclaimerVariant="investment"
      intro={
        <p>
          Compare a Roth IRA and a traditional IRA on the same pre-tax contribution. Enter your
          current and expected retirement tax rates and the calculator shows which account leaves
          more after-tax money at retirement, and by how much.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the Roth vs traditional comparison works</h2>
          <p>
            Both IRAs offer the same investments and the same tax-free growth while the money stays
            in the account. The only real difference is timing. A traditional IRA gives you a
            deduction now and taxes your withdrawals later; a Roth IRA gives you no deduction now but
            lets you withdraw tax-free in retirement. Deciding between them is a bet on whether your
            tax rate is higher today or will be higher in retirement.
          </p>

          <h3>Why equal pre-tax dollars matter</h3>
          <p>
            The most common mistake is comparing a $7,500 Roth contribution with a $7,500
            traditional contribution. Those are not the same deal, because the traditional
            contribution is made before tax and the Roth contribution is made after. To keep things
            honest, this calculator starts with the same gross amount for both: the traditional
            account invests all of it, while the Roth account pays tax at your current rate first and
            invests what is left.
          </p>

          <h3>The formula</h3>
          <p>
            Let the gross contribution be <em>C</em>, the annual return be <em>r</em> and the
            holding period be <em>n</em> years. The growth factor is the future value of an ordinary
            annuity:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            G = ((1 + r)<sup>n</sup> − 1) ÷ r
          </p>
          <p>The two after-tax outcomes are then:</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            traditional = C × G × (1 − retirementRate)
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            roth = C × (1 − currentRate) × G
          </p>
          <p>
            Because both share the same growth factor G, the winner depends only on which tax rate
            is smaller. When the rates are equal the two expressions are identical.
          </p>

          <h3>A worked example</h3>
          <p>
            Contribute $1,000 of gross income a year for ten years at a 7% return. The growth factor
            is about 13.82. If your rate is 22% both now and in retirement, the traditional balance
            grows to $13,816 and is taxed at 22%, leaving about $10,777 — exactly the same as the
            Roth, which invests $780 after tax and grows to $10,777 tax-free. Now change the
            retirement rate to 12%: the traditional account leaves about $12,158 against the
            Roth&apos;s $10,777, so the traditional IRA wins by roughly $1,382.
          </p>

          <h3>What the calculator ignores</h3>
          <p>
            It does not model contribution and deduction phase-outs, required minimum distributions,
            state income tax, the Roth five-year rules, or the ability to make Roth conversions in
            low-income years. It also assumes a constant return and that you contribute the full
            amount every year. For 2026 the IRA limit is $7,500 with a $1,100 catch-up at 50 and
            over, per IRS Notice 2025-67, but your actual eligible amount may be lower.
          </p>
        </>
      }
    >
      <RothVsTraditionalIraCalculator />
    </CalculatorLayout>
  );
}
