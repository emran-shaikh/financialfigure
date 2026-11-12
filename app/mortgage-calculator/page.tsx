import CalculatorLayout from "@/components/CalculatorLayout";
import MortgageCalculator from "@/components/MortgageCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("mortgage-calculator");

const faqs = [
  {
    q: "What is included in a monthly mortgage payment?",
    a: "Lenders quote a payment made up of four parts, often called PITI: principal, interest, property taxes and insurance. If your down payment is below 20% you also pay private mortgage insurance (PMI), and condos or planned communities add HOA dues. This calculator shows each part separately so you can see where the money goes.",
  },
  {
    q: "How is a monthly mortgage payment calculated?",
    a: "The principal-and-interest part uses the standard amortisation formula M = P × r / (1 − (1 + r)^−n), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12) and n is the number of monthly payments. Property tax is the annual tax rate multiplied by the home price and divided by 12. Insurance is the annual premium divided by 12.",
  },
  {
    q: "How much does a $400,000 house cost per month at 6.5%?",
    a: "With a 20% down payment ($80,000) you borrow $320,000. At 6.5% over 30 years the principal-and-interest payment is about $2,023. Add 1.2% property tax ($400), $1,800 a year in insurance ($150) and the total lands near $2,573 a month before HOA dues. Total interest over the full term is roughly $408,000.",
  },
  {
    q: "Does a bigger down payment always save money?",
    a: "Not always the most money, but usually the most interest. A larger down payment reduces the loan balance, removes PMI at 20% and lowers the monthly payment. The trade-off is opportunity cost: money spent on the down payment is not invested elsewhere. Run both scenarios through the calculator and compare with the compound interest calculator.",
  },
  {
    q: "Why does a 15-year loan cost more each month but less overall?",
    a: "A shorter term means fewer payments, so each payment must be larger to retire the same balance. Because the balance falls faster, far less interest accrues over the life of the loan. The amortisation schedule calculator shows the month-by-month difference.",
  },
];

export default function MortgageCalculatorPage() {
  return (
    <CalculatorLayout
      slug="mortgage-calculator"
      intro={
        <p>
          Estimate your monthly mortgage payment, including principal, interest, property tax,
          homeowners insurance, PMI and HOA dues. Change any input and the figures update instantly —
          the calculation runs entirely in your browser.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the mortgage calculator works</h2>
          <p>
            A mortgage is a fully amortising loan: every payment is the same size, but the mix of
            interest and principal changes over time. Early payments are mostly interest; later
            payments are mostly principal. This calculator applies that structure to your numbers and
            then adds the ongoing costs a lender rolls into escrow.
          </p>

          <h3>The principal and interest formula</h3>
          <p>
            The monthly principal-and-interest payment is calculated with the standard amortisation
            formula:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            M = P × r ÷ (1 − (1 + r)<sup>−n</sup>)
          </p>
          <p>
            <em>P</em> is the loan amount (home price minus down payment), <em>r</em> is the monthly
            interest rate — the annual rate divided by 12 — and <em>n</em> is the total number of
            monthly payments, so 360 for a 30-year loan and 180 for a 15-year loan.
          </p>

          <h3>Adding taxes, insurance and fees</h3>
          <ul>
            <li>
              <strong>Property tax:</strong> state and county rates vary widely, from under 0.5% to
              over 2% of assessed value per year. The national average is roughly 1%–1.2%.
            </li>
            <li>
              <strong>Homeowners insurance:</strong> annual premium divided by twelve.
            </li>
            <li>
              <strong>PMI:</strong> usually charged when you put down less than 20%, and typically
              removable once you reach 20% equity.
            </li>
            <li>
              <strong>HOA dues:</strong> monthly fees for condominiums and planned communities.
            </li>
          </ul>

          <h3>Worked example</h3>
          <p>
            Take a $400,000 home with a 20% down payment at 6.5% over 30 years. The loan is $320,000.
            Plugging into the formula gives a monthly principal-and-interest payment of about $2,023.
            Property tax at 1.2% adds $400 and insurance of $1,800 a year adds $150, for a total near
            $2,573 — before HOA dues. Over 360 payments you would repay roughly $728,000, of which
            about $408,000 is interest.
          </p>

          <h3>What this calculator does not include</h3>
          <p>
            Closing costs, mortgage points, prepaid interest, flood or earthquake insurance, and any
            changes in your escrow balance are not modelled. Rates move daily, so always confirm the
            final numbers with your lender. For a month-by-month breakdown, use the amortisation
            schedule calculator.
          </p>
        </>
      }
    >
      <MortgageCalculator />
    </CalculatorLayout>
  );
}
