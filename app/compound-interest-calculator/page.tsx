import CalculatorLayout from "@/components/CalculatorLayout";
import CompoundInterestCalculator from "@/components/CompoundInterestCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("compound-interest-calculator");

const faqs = [
  {
    q: "What is compound interest?",
    a: "Compound interest is interest that earns interest. Each period your balance grows by the return rate, and the next period's return is calculated on that larger balance. A lump sum left alone grows geometrically rather than linearly, which is why an extra decade of time usually matters more than an extra percentage point of return.",
  },
  {
    q: "How is future value with monthly contributions calculated?",
    a: "The calculator splits your money into two parts. The starting principal grows as P × (1 + rm)^n, where rm is the effective monthly rate and n is the number of months. The stream of monthly contributions grows as an annuity, C × [((1 + rm)^n − 1) ÷ rm]. Adding the two gives the future value; subtracting everything you paid in leaves the interest.",
  },
  {
    q: "Does compounding frequency really change the result?",
    a: "Yes, but only a little for typical rates. A 12% nominal rate compounded monthly produces an effective annual rate of about 12.68%, while the same rate compounded once a year gives exactly 12%. More frequent compounding always means a slightly higher effective annual rate (APY), and the difference widens as the nominal rate rises.",
  },
  {
    q: "Why does the timing of a contribution matter?",
    a: "Money deposited at the start of a month earns a full month of interest; money deposited at the end earns none for that month. Over a single month the gap is small, but multiplied across hundreds of deposits and compounded for decades it becomes a meaningful sum. Switching the calculator between start and end of month shows the size of that effect for your numbers.",
  },
  {
    q: "What is not included in this estimate?",
    a: "Taxes, investment fees and inflation are not deducted. In a taxable account, dividends and realised gains are taxed as they occur, which drags on the effective growth rate. A 0.5% annual fund fee, for instance, can cost a large fraction of your final balance over several decades. Use the inflation calculator to see what the future value is worth in today's dollars.",
  },
];

export default function CompoundInterestCalculatorPage() {
  return (
    <CalculatorLayout
      slug="compound-interest-calculator"
      disclaimerVariant="investment"
      intro={
        <p>
          See how a lump sum plus a regular monthly contribution grows over time. Enter your
          starting balance, monthly deposit, expected return and horizon, and the future value,
          total contributions and interest earned update instantly — everything runs in your
          browser.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the compound interest calculator works</h2>
          <p>
            Compounding turns a steady return into accelerating growth because each period&apos;s
            earnings are added to the base that produces the next period&apos;s earnings. The
            calculator models two sources of money: the balance you start with and the contributions
            you add every month. Both grow at the same rate, but the starting balance grows as a
            lump sum while the contributions arrive gradually, so they follow different formulas.
          </p>

          <h3>The formula behind the result</h3>
          <p>
            The nominal annual rate is first converted into an effective monthly rate so that any
            compounding frequency can be modelled consistently:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            rm = (1 + r ÷ m)<sup>m/12</sup> − 1
          </p>
          <p>The future value then combines the two growing parts:</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            FV = P × (1 + rm)<sup>n</sup> + C × [((1 + rm)<sup>n</sup> − 1) ÷ rm]
          </p>
          <p>
            Here <em>P</em> is your starting principal, <em>C</em> is the monthly contribution,{" "}
            <em>n</em> is the number of months and <em>rm</em> is the effective monthly rate. If the
            rate is zero the contribution term simply becomes C × n. Total interest is the future
            value minus the principal and all the contributions you made.
          </p>

          <h3>A worked example</h3>
          <p>
            Suppose you start with $10,000, add $500 a month and earn 7% compounded monthly for 20
            years. The starting balance grows to roughly $40,400. The 240 monthly contributions of
            $500 total $120,000 and, thanks to compounding, grow to about $260,500. The combined
            future value is around $300,900, of which about $170,900 is interest — more than the
            $130,000 you actually put in. Change the horizon to 30 years and the interest figure
            climbs far faster than the contributions do.
          </p>

          <h3>Frequency, timing and assumptions</h3>
          <p>
            Compounding frequency changes the effective annual rate (APY) shown in the results. The
            timing setting decides whether each monthly contribution is credited at the start or the
            end of the month, which shifts the final total by roughly one month of return per
            deposit. The model assumes a constant rate and constant contribution, which real markets
            never deliver, so treat the output as a projection rather than a promise.
          </p>

          <h3>What this calculator leaves out</h3>
          <p>
            Investment fees, taxes on dividends and capital gains, and inflation are all excluded.
            Each of those reduces real-world growth. If you want to see the effect of tax-advantaged
            accounts or the drag from rising prices, the 401(k) calculator and the inflation
            calculator build on the same maths with those factors in view.
          </p>
        </>
      }
    >
      <CompoundInterestCalculator />
    </CalculatorLayout>
  );
}
