import CalculatorLayout from "@/components/CalculatorLayout";
import MortgageAffordabilityCalculator from "@/components/MortgageAffordabilityCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("mortgage-affordability-calculator");

const faqs = [
  {
    q: "How much house can I afford on my salary?",
    a: "A common starting point is the 28/36 rule: keep housing costs at or below 28% of your gross monthly income and total debt at or below 36%. On a $120,000 salary that means about $2,800 a month of housing cost. Subtract insurance, HOA and property tax, convert what's left into a loan amount at your interest rate, and add your down payment to get a rough price ceiling.",
  },
  {
    q: "What is the difference between front-end and back-end DTI?",
    a: "The front-end ratio compares only housing costs to income; the back-end ratio adds every other monthly debt you owe. Lenders look at both. This calculator caps your housing budget at whichever limit binds first, so a large car or student-loan payment lowers the home price you can afford.",
  },
  {
    q: "What debt-to-income limit do lenders actually accept?",
    a: "Guidelines vary by loan programme. Fannie Mae's Selling Guide B3-6-02 allows a maximum total DTI of 50% for loans underwritten through Desktop Underwriter, and 36% (extendable to 45% with credit-score and reserve minimums) for manually underwritten loans. FHA loans use a 31% front-end and 43% back-end framework. Confirm the limit that applies to your loan with your lender.",
  },
  {
    q: "Does the down payment change how much I can borrow?",
    a: "The down payment does not change the monthly budget your income allows, but it does change the price you can reach. A bigger down payment means a smaller loan for the same monthly payment, so the same housing budget stretches to a more expensive home. It can also remove private mortgage insurance once you reach 20% equity.",
  },
  {
    q: "Why is the number here lower than what a lender pre-approves me for?",
    a: "Lenders often approve borrowers right up to the maximum allowable DTI. This calculator defaults to the more conservative 28/36 rule, which leaves margin for the costs of ownership that a pre-approval letter ignores: maintenance, moving, furnishing and future rate changes. Raising the DTI fields shows the more aggressive ceiling.",
  },
];

export default function MortgageAffordabilityPage() {
  return (
    <CalculatorLayout
      slug="mortgage-affordability-calculator"
      intro={
        <p>
          Enter your income, monthly debts and down payment to see the largest home price you can
          comfortably afford. The calculator applies the 28/36 debt-to-income rule, subtracts
          property tax, insurance and HOA dues, and works back to a loan amount and price — all in
          your browser.
        </p>
      }
      faqs={faqs}
      content={
        <>
          <h2>How the affordability calculator works</h2>
          <p>
            A lender does not start with a home price; it starts with your budget. Affordability
            calculators reverse the usual mortgage calculation: instead of turning a price into a
            payment, they turn the payment you can support into the price you can buy.
          </p>

          <h3>The debt-to-income method</h3>
          <p>
            The calculator uses the widely used 28/36 rule. It computes two ceilings and takes the
            lower one:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            front-end cap = 28% × gross monthly income
            <br />
            back-end cap = 36% × gross monthly income − monthly debts
          </p>
          <p>
            That shared figure is your total monthly housing budget. From it the calculator subtracts
            the monthly property tax, homeowners insurance and HOA dues, leaving the amount available
            for principal and interest. It then inverts the standard amortisation formula to find the
            loan that fits that payment, and finally adds your down payment to reach the home price.
            Because property tax is charged on the price you are solving for, the calculator repeats
            the last steps until the price settles.
          </p>

          <h3>Worked example</h3>
          <p>
            Take a household earning $120,000 a year — $10,000 a month. The front-end cap is 28% of
            $10,000, or $2,800. The back-end cap is 36% of $10,000 minus $500 of car and card
            payments, or $3,100. The front-end figure is lower, so the housing budget is $2,800.
            Insurance of $1,800 a year adds $150 a month, leaving $2,650 for principal and interest.
            At 6.5% over 30 years that payment supports a loan of roughly $419,000. Add a $60,000
            down payment and the affordable price is near $479,000. Property tax of about 1.2% would
            trim that figure, which is why the calculator folds tax into the loop rather than
            ignoring it.
          </p>

          <h3>What the number leaves out</h3>
          <p>
            This is a budget ceiling, not a promise. It does not include closing costs, moving costs,
            furnishing, emergency repairs or an emergency fund, and it holds your debts and the
            interest rate constant. A lender may also add mortgage insurance when the down payment is
            below 20%, which lowers the affordable price. Treat the result as a sensible upper bound
            and confirm the financing terms with a lender before you shop.
          </p>
        </>
      }
    >
      <MortgageAffordabilityCalculator />
    </CalculatorLayout>
  );
}
