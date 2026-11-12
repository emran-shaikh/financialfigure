import CalculatorLayout from "@/components/CalculatorLayout";
import AmortizationSchedule from "@/components/AmortizationSchedule";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("amortization-schedule");

const faqs = [
  {
    q: "What is an amortization schedule?",
    a: "An amortization schedule is a table showing every payment on a loan. Each row lists the payment number, the amount paid, how much went to principal, how much went to interest and the balance left afterwards. It reveals how the mix shifts over time: early payments are mostly interest, later payments are mostly principal.",
  },
  {
    q: "Why is most of my early payment interest?",
    a: "Interest is charged on the outstanding balance, which is highest at the start. With a $320,000 loan at 6.5% the first month's interest is about $1,733; only the remainder of the payment touches the balance. As the balance falls, the interest portion shrinks and more of each payment goes to principal.",
  },
  {
    q: "How do extra payments change the schedule?",
    a: "This calculator applies extra payments straight to principal, which shortens the loan rather than lowering the monthly payment. Because the balance falls faster, less interest accrues, the payoff date moves earlier and the total interest drops. The summary shows exactly how many months and dollars the extras save.",
  },
  {
    q: "Can I download the schedule?",
    a: "Yes. The Download CSV button builds the full month-by-month table in your browser and saves it as a CSV file that opens in any spreadsheet. Nothing is uploaded — the file is generated entirely on your device.",
  },
  {
    q: "Does the schedule account for taxes and insurance?",
    a: "No. Amortization describes only the loan itself: principal and interest. Property tax, homeowners insurance and HOA dues are separate recurring costs, so add them on top of the payment shown here when you build a full housing budget.",
  },
];

export default function AmortizationSchedulePage() {
  return (
    <CalculatorLayout
      slug="amortization-schedule"
      intro={
        <p>
          Generate a full month-by-month amortization schedule for any fixed-rate loan. See how each
          payment splits between principal and interest, add extra payments, review a year-by-year
          summary and download the whole table as a CSV file.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the amortization schedule works</h2>
          <p>
            A fully amortising loan spreads the repayment of principal evenly across the term while
            charging interest on whatever balance is still outstanding. The result is a payment of
            constant size that changes in composition every month. This page builds that table for
            your loan and lets you add extra principal to see the effect on the payoff date.
          </p>

          <h3>The payment formula</h3>
          <p>
            The fixed monthly payment comes from the standard amortisation formula:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            M = P × r ÷ (1 − (1 + r)<sup>−n</sup>)
          </p>
          <p>
            <em>P</em> is the loan amount, <em>r</em> is the monthly interest rate (the annual rate
            divided by twelve) and <em>n</em> is the number of monthly payments. Each month the
            schedule charges interest equal to the balance times <em>r</em>, applies the rest of the
            payment to principal, and records the new balance until the loan reaches zero.
          </p>

          <h3>Worked example</h3>
          <p>
            Borrow $320,000 at 6.5% for 30 years. The formula gives a monthly principal-and-interest
            payment of about $2,022.62. In the first month the interest charge is roughly $1,733, so
            only about $290 goes to principal. By the final year the split has reversed: almost all of
            each payment reduces the balance. Over the full 360 payments you would repay about
            $728,000 — some $408,000 of which is interest. Add $200 a month of extra principal and
            the loan is retired years earlier with far less interest, all of which the schedule spells
            out month by month.
          </p>

          <h3>Reading the year-by-year summary</h3>
          <p>
            The monthly table is precise but long, so the summary groups twelve payments at a time. It
            shows how much principal and interest you pay in each loan year and the balance left at
            the end of it — the fastest way to see the crossover where principal payments overtake
            interest. The CSV download contains every individual month if you need the detail.
          </p>

          <h3>Limitations</h3>
          <p>
            The schedule assumes a fixed interest rate and on-time payments, and it ignores escrow,
            taxes and insurance. Real loans can also charge late fees or allow adjustable rates, which
            this table does not model. Use it to understand the shape of the loan, then confirm the
            precise figures with your lender&apos;s own statement.
          </p>
        </>
      }
    >
      <AmortizationSchedule />
    </CalculatorLayout>
  );
}
