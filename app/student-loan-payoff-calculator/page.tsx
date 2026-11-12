import CalculatorLayout from "@/components/CalculatorLayout";
import StudentLoanPayoffCalculator from "@/components/StudentLoanPayoffCalculator";
import { calculatorMetadata } from "@/lib/metadata";

// Source: studentaid.gov — federal Direct Loan interest rates for loans first
// disbursed on or after July 1, 2026 and before July 1, 2027: 6.52% for
// undergraduate Direct Subsidized/Unsubsidized, 8.07% for graduate unsubsidized,
// 9.07% for Direct PLUS.
// https://studentaid.gov/understand-aid/types/loans/interest-rates
// Last reviewed: 2026-11-12

export const metadata = calculatorMetadata("student-loan-payoff-calculator");

const faqs = [
  {
    q: "How is a student loan payment calculated?",
    a: "On a standard repayment plan the loan is fully amortised: the payment is M = P × r ÷ (1 − (1 + r)^−n), where P is the balance, r is the monthly rate (rate ÷ 12) and n is the number of months in the plan. That payment covers all the interest that accrues each month and pays down the principal. This calculator uses the same formula and then simulates any extra payments.",
  },
  {
    q: "What are current federal student loan interest rates?",
    a: "For loans first disbursed between July 1, 2026 and June 30, 2027, the fixed rate is 6.52% for undergraduate Direct Subsidized and Unsubsidized Loans, 8.07% for graduate or professional Direct Unsubsidized Loans and 9.07% for Direct PLUS Loans. Rates for older loans depend on the year of first disbursement, and private loans are set by the lender.",
  },
  {
    q: "Does paying extra really save money?",
    a: "Every extra dollar goes straight to principal, so it stops accruing interest for the rest of the term. Because interest is charged on the outstanding balance, an extra payment early in the loan saves far more than the same payment made later. The calculator shows both the interest saved and how many months sooner you become debt-free.",
  },
  {
    q: "Does this include income-driven repayment or forgiveness?",
    a: "No. It models a fixed payment on a fully amortised loan. Income-driven plans can set payments below the monthly interest, which causes the balance to grow — often called negative amortisation — and any forgiveness happens after a set number of qualifying payments. Those features are outside this model.",
  },
  {
    q: "How does unpaid interest capitalise?",
    a: "If a payment does not cover all the interest that accrued, the shortfall can be added to the principal balance, a process called capitalisation. Interest is then charged on the larger balance, so the loan costs more overall. Paying at least the interest each month, and ideally more, prevents this.",
  },
];

export default function StudentLoanPayoffCalculatorPage() {
  return (
    <CalculatorLayout
      slug="student-loan-payoff-calculator"
      intro={
        <p>
          Estimate your monthly student loan payment, the total interest you will pay and the date you will be
          debt-free. Add an optional extra monthly payment to see exactly how much interest and time you save.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the student loan payoff calculator works</h2>
          <p>
            A student loan on a standard repayment plan behaves like any other instalment loan: each payment is the
            same size, but the split between interest and principal shifts over time. Early payments are mostly
            interest; later ones are mostly principal. This calculator first derives the scheduled payment for your
            balance, rate and term, then runs a month-by-month simulation that applies any extra payment entirely
            to principal.
          </p>

          <h3>The scheduled payment</h3>
          <p>The level payment for a fully amortised loan is:</p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            M = P × r ÷ (1 − (1 + r)<sup>−n</sup>)
          </p>
          <p>
            <em>P</em> is the balance, <em>r</em> is the monthly interest rate (annual rate ÷ 12) and <em>n</em> is
            the number of months. You can either let the term set the payment or type in the payment you actually
            make. If the payment cannot cover the monthly interest, the balance never falls and the calculator
            flags it instead of looping forever.
          </p>

          <h3>Worked example</h3>
          <p>
            Take a $35,000 balance at 6.5% on a 10-year (120-month) plan. The scheduled payment is about{" "}
            <strong>$397 a month</strong>. Over the full term you would repay roughly $47,700, of which nearly{" "}
            <strong>$12,700 is interest</strong>. Now add $100 of extra principal each month, bringing the payment
            to about $497. The loan clears in roughly 89 months instead of 120 — about two and a half years earlier
            — and saves in the region of $3,400 in interest.
          </p>

          <h3>Why timing matters</h3>
          <p>
            Interest is charged on the outstanding balance, so a dollar of extra principal paid in year one removes
            a dollar that would otherwise have earned interest for the whole remaining term. The same dollar paid in
            the final year saves almost nothing. That is why the calculator shows the interest saved separately from
            the months saved: on a long loan the interest figure often dwarfs the time saved.
          </p>

          <h3>What this calculator does not include</h3>
          <p>
            It does not model income-driven repayment, forbearance, deferment, capitalisation of unpaid interest,
            loan forgiveness or consolidation. It assumes a fixed rate, a fixed payment and interest charged
            monthly, whereas federal loans actually accrue interest daily. Treat the output as an estimate and
            confirm your exact payoff figures with your loan servicer.
          </p>
        </>
      }
    >
      <StudentLoanPayoffCalculator />
    </CalculatorLayout>
  );
}
