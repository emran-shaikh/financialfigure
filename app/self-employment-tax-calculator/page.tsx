import CalculatorLayout from "@/components/CalculatorLayout";
import SelfEmploymentTaxCalculator from "@/components/SelfEmploymentTaxCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("self-employment-tax-calculator");

const faqs = [
  {
    q: "What is the self-employment tax rate for 2026?",
    a: "Self-employment tax is 15.3% of your net earnings: 12.4% for Social Security and 2.9% for Medicare. You pay both the employee and the employer halves because you are both. It applies to 92.35% of your net profit, so on $100,000 of profit the tax base is $92,350 and the tax is about $14,130 before any federal income tax.",
  },
  {
    q: "Why is only 92.35% of my profit taxed?",
    a: "The IRS multiplies net profit by 92.35% to approximate the employer half of the tax being deductible. This mirrors the fact that an employer would have paid half of FICA on your wages. The remaining 7.65% is effectively removed from the base, which is why the figure is 0.9235 and not 1.0 (IRC §1402(a)(12)).",
  },
  {
    q: "Is there a cap on self-employment tax?",
    a: "Only the Social Security part is capped. For 2026 you pay 12.4% on net earnings up to the $184,500 Social Security wage base; earnings above that are not charged Social Security. Medicare's 2.9% has no cap, and an extra 0.9% Additional Medicare Tax applies to net earnings above $200,000 for single filers or $250,000 for married couples filing jointly.",
  },
  {
    q: "How much do I owe on $100,000 of self-employment income?",
    a: "On $100,000 of net profit (single, no other wages) the self-employment tax is about $14,130. Half of it — roughly $7,065 — is deductible, leaving federal taxable income of about $76,835 after the $16,100 standard deduction. Federal income tax is about $11,616, so total tax is near $25,745, an effective rate of about 25.7% and roughly $6,436 per quarter.",
  },
  {
    q: "Do I have to make quarterly estimated payments?",
    a: "If you expect to owe $1,000 or more for the year, the IRS generally requires quarterly estimated payments, due roughly in mid-April, mid-June, mid-September and mid-January. This calculator divides the estimated total tax by four as a starting point. If your income is uneven, use the annualized income installment method instead so you are not overpaying early in the year.",
  },
  {
    q: "How do I reduce my self-employment tax?",
    a: "Because the tax is charged on net profit, every legitimate business expense you deduct lowers it directly. Retirement contributions, a health insurance deduction and the deductible half of SECA reduce income tax as well. There is no way to avoid the 15.3% on genuine net earnings, but S-corporation elections can reduce it for some profitable businesses — talk to a tax professional first.",
  },
];

export default function SelfEmploymentTaxCalculatorPage() {
  return (
    <CalculatorLayout
      slug="self-employment-tax-calculator"
      intro={
        <p>
          Estimate the self-employment tax (Social Security and Medicare) you owe on freelance, 1099
          and business income, plus your federal income tax and suggested quarterly payment. Figures
          use 2026 IRS and SSA limits and run entirely in your browser.
        </p>
      }
      faqs={faqs}
      disclaimerVariant="tax"
      updated="2026-11-12"
      content={
        <>
          <h2>How self-employment tax works</h2>
          <p>
            When you work for yourself, no employer withholds Social Security and Medicare for you and
            no employer pays half on your behalf. Instead you pay both halves yourself through the
            self-employment tax (also called SECA). The tax funds exactly the same benefits as
            employee payroll tax — it is not an extra penalty, just a different collection method.
          </p>

          <h3>The formula</h3>
          <p>
            The starting point is your net profit: business income minus business expenses. The IRS
            taxes 92.35% of that number, a factor that stands in for the employer&apos;s deductible share
            of the tax:
          </p>
          <p className="rounded-md bg-slate-100 p-3 font-mono text-sm">
            net earnings = net profit × 0.9235
          </p>
          <p>Tax is then charged in two parts:</p>
          <ul>
            <li>
              <strong>Social Security — 12.4%</strong> of net earnings, capped at the $184,500 wage
              base for 2026. If you also have W-2 wages, that cap is reduced by those wages first.
            </li>
            <li>
              <strong>Medicare — 2.9%</strong> of net earnings, with no cap, plus an extra 0.9%
              Additional Medicare Tax on net earnings above $200,000 (single) or $250,000 (married
              filing jointly).
            </li>
          </ul>
          <p>
            Half of the resulting self-employment tax is deductible. It reduces your income tax, not
            the self-employment tax itself. The calculator subtracts this deduction and your standard
            deduction before applying the 2026 federal brackets to your profit.
          </p>

          <h3>Worked example</h3>
          <p>
            Say your net profit is $100,000 and you file single with no other wages. Net earnings are
            $100,000 × 0.9235 = $92,350. Social Security is 12.4% × $92,350 = $11,451 and Medicare is
            2.9% × $92,350 = $2,678, for a self-employment tax of $14,130. Half of that, $7,065, is
            deductible, so federal taxable income is $100,000 − $7,065 − $16,100 (standard deduction)
            = $76,835. Federal income tax on that is about $11,616. Total tax is roughly $25,745 — an
            effective rate of 25.7% — or around $6,436 per quarter.
          </p>

          <h3>What this calculator leaves out</h3>
          <p>
            It models self-employment tax and basic federal income tax only. It does not include state
            income tax, the Qualified Business Income deduction, retirement or self-employed health
            insurance deductions, the Child Tax Credit or the earned income credit. When you also hold
            a W-2 job, the Additional Medicare Tax threshold is measured against combined wages — this
            calculator applies it to self-employment income alone. Treat the result as a close estimate
            and confirm your situation with a tax professional.
          </p>
        </>
      }
    >
      <SelfEmploymentTaxCalculator />
    </CalculatorLayout>
  );
}
