import CalculatorLayout from "@/components/CalculatorLayout";
import RentVsBuyCalculator from "@/components/RentVsBuyCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("rent-vs-buy-calculator");

const faqs = [
  {
    q: "How does the rent vs buy calculator decide which is cheaper?",
    a: "It adds up every dollar that leaves your pocket over the years you plan to stay. For buying that means the down payment, closing costs, mortgage payments, property tax, insurance and maintenance, minus what you get back when you sell after paying off the remaining loan. For renting it means the rent you pay, grown each year. Whichever total is lower wins.",
  },
  {
    q: "Why does buying win over long periods but lose over short ones?",
    a: "Buying carries large up-front costs — a down payment and closing costs — and selling costs that swallow part of the sale price. Those one-off charges need years of appreciation and principal repayment to overcome. Over a short hold they dominate; over a long hold, rising rent and growing equity tip the balance towards buying.",
  },
  {
    q: "What appreciation rate should I use?",
    a: "There is no single correct figure — home price growth varies enormously by market and over time. Common practice is to test a range, such as 2% to 4% a year, and see whether the conclusion holds. The calculator is a comparison tool, not a forecast; treat the input as an assumption you control.",
  },
  {
    q: "Does the calculator include taxes and insurance?",
    a: "It includes property tax and homeowners insurance as recurring ownership costs, plus a maintenance allowance. It does not model income-tax deductions for mortgage interest or property tax, capital-gains taxes on the sale, or renters insurance. These are deliberately left out to keep the comparison simple and transparent.",
  },
  {
    q: "How does rent growth affect the result?",
    a: "Rent usually rises over time, so the longer you stay the more the rental side costs. A higher rent increase makes buying look better; flat rent favours renting. The calculator compounds the rent increase once a year for the whole holding period.",
  },
];

export default function RentVsBuyPage() {
  return (
    <CalculatorLayout
      slug="rent-vs-buy-calculator"
      intro={
        <p>
          Compare the true cost of renting and buying a home over the years you expect to stay. The
          calculator totals up-front costs, mortgage payments, taxes, insurance and maintenance on the
          buy side, sets them against rent that grows each year, and reports which option comes out
          cheaper and by how much.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the rent vs buy calculator works</h2>
          <p>
            Renting and buying are not compared on the monthly payment alone. Buying front-loads
            costs — a down payment and closing costs — and returns money only when you sell, after
            paying off the loan and the agent. Renting spreads a single, predictable cost across the
            years. The model totals both sides over your holding period and subtracts them.
          </p>

          <h3>The model</h3>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            net cost of buying = down payment + closing costs + all mortgage payments + property tax +
            insurance + maintenance − (sale proceeds − remaining loan balance)
            <br />
            cost of renting = rent, grown once a year, summed over the holding period
          </p>
          <p>
            Because the down payment plus the loan equals the purchase price, the buying figure
            collapses to a simple intuition: the price of the home, plus interest, plus the cost of
            carrying it, plus closing costs, minus the money the sale returns. The mortgage payment
            stops once the loan is repaid, even if you stay longer than the term.
          </p>

          <h3>Worked example</h3>
          <p>
            Take a $500,000 home with $100,000 down at 6% over 30 years, sold after two years with no
            appreciation. Up-front costs are $100,000 down plus $15,000 of closing costs. Two years of
            mortgage payments come to about $57,600, and property tax, insurance and maintenance add
            roughly $25,000. Selling at $470,000 after 6% costs, minus the ~$389,900 still owed,
            returns about $80,100. Net cost of buying lands near $117,500. Renting the same home for
            $1,000 a month with 3% annual increases costs about $24,400. Over two years renting is
            cheaper by roughly $93,000 — the transaction costs simply cannot be recouped that fast.
          </p>

          <h3>Why the answer flips over time</h3>
          <p>
            Extend the holding period and the picture changes. Every extra year pays down principal
            and adds to equity while rent keeps climbing. Once the accumulated equity and appreciation
            outweigh the up-front and selling costs, buying takes the lead. That crossover is the
            number worth finding: run your own assumptions for five, ten and fifteen years and watch
            where the difference crosses zero.
          </p>

          <h3>Limitations</h3>
          <p>
            This is a simplifying model. Property tax, insurance and maintenance are held flat in
            nominal dollars, and the calculation ignores tax deductions, capital-gains taxes, the
            opportunity cost of investing the down payment, moving costs and renters insurance. Real
            appreciation is never a straight line. Use the tool to weigh the trade-offs, not to
            predict a specific outcome.
          </p>
        </>
      }
    >
      <RentVsBuyCalculator />
    </CalculatorLayout>
  );
}
