import CalculatorLayout from "@/components/CalculatorLayout";
import BonusTaxCalculator from "@/components/BonusTaxCalculator";
import { calculatorMetadata } from "@/lib/metadata";

export const metadata = calculatorMetadata("bonus-tax-calculator");

const faqs = [
  {
    q: "How much tax is taken out of a bonus in 2026?",
    a: "If your employer uses the flat-rate method, federal income tax is withheld at 22% of the bonus, plus 6.2% Social Security (up to the $184,500 wage base), 1.45% Medicare and 0.9% Additional Medicare above the threshold. On a $10,000 bonus that is $2,200 federal, $620 Social Security and $145 Medicare — about $2,965 in total, leaving roughly $7,035.",
  },
  {
    q: "Why is my bonus taxed at 22% when I'm in a higher bracket?",
    a: "The 22% is a flat withholding rate, not your final tax rate. Under IRS Publication 15 the employer may withhold a flat 22% on supplemental wages without looking at your bracket. If your marginal rate is higher, the shortfall is settled when you file your return; if it is lower, you get the difference back. The bonus is not taxed twice — it is simply withheld at a standard rate.",
  },
  {
    q: "What is the aggregate method for bonus withholding?",
    a: "The aggregate method adds the bonus to your regular wages for the period, works out the tax on the combined amount, and subtracts the tax already withheld on the regular pay. The result is the marginal tax the bonus adds. For someone on a $200,000 salary (single), a $50,000 bonus is withheld at about $14,570 under the aggregate method versus $11,000 flat — a difference of roughly $3,570 that gets trued up at tax time.",
  },
  {
    q: "Is there a higher rate on very large bonuses?",
    a: "Yes. Once supplemental wages paid to you during the calendar year exceed $1,000,000, every dollar above that is withheld at the highest rate in effect — 37% for 2026 — regardless of your filing status. A $1,200,000 bonus would be withheld at 22% on the first $1,000,000 ($220,000) and 37% on the $200,000 above it ($74,000), for $294,000 of federal withholding alone.",
  },
  {
    q: "Do bonuses get Social Security and Medicare tax?",
    a: "Yes. A bonus is wages, so the normal FICA rules apply. Social Security is 6.2% on the bonus up to the remaining $184,500 wage base after your year-to-date wages; once you have already earned the full wage base, no more Social Security is due that year. Medicare's 1.45% applies to the whole bonus with no cap, and the 0.9% Additional Medicare Tax applies above $200,000 (single) or $250,000 (married).",
  },
  {
    q: "Why does the calculator show two different taxes for the same bonus?",
    a: "Because employers may choose between two legal withholding methods. The flat method always uses 22%; the aggregate method uses your real marginal bracket. Both are legitimate — your actual tax at the end of the year is the same either way, but how much is withheld now differs. The comparison table shows both so you can predict your take-home and plan for a year-end balance due or refund.",
  },
];

export default function BonusTaxCalculatorPage() {
  return (
    <CalculatorLayout
      slug="bonus-tax-calculator"
      intro={
        <p>
          See how much of your bonus you keep. Compare the IRS flat 22% supplemental-wage method with
          the aggregate method, including Social Security, Medicare and the Additional Medicare Tax,
          using 2026 rates.
        </p>
      }
      faqs={faqs}
      disclaimerVariant="tax"
      updated="2026-11-12"
      content={
        <>
          <h2>How bonus (supplemental wage) tax works</h2>
          <p>
            The IRS treats a bonus as a supplemental wage — pay that is not regular salary, such as a
            bonus, commission, severance or award. Employers are allowed to withhold income tax on
            supplemental wages using one of two methods described in IRS Publication 15 (Circular E),
            section 7. Your final tax is the same under either method; they differ only in how much is
            withheld from the cheque.
          </p>

          <h3>Method A — the flat percentage method</h3>
          <p>
            The simplest method withholds a flat 22% of the bonus for federal income tax, without
            regard to your normal bracket. One rule complicates it: once your supplemental wages for
            the calendar year exceed $1,000,000, every dollar above that amount is withheld at the
            highest rate in effect, which is 37% for 2026. Publication 15 states plainly that &ldquo;the
            withholding rate on supplemental wages remains 22% (37% if supplemental wages paid to an
            employee during the calendar year exceed $1 million).&rdquo;
          </p>

          <h3>Method B — the aggregate method</h3>
          <p>
            The aggregate method is more precise. The employer adds the bonus to your regular wages,
            calculates the tax on the combined amount using the annualised brackets, and subtracts the
            tax already withheld on the regular wages. The bonus is effectively withheld at your
            marginal rate — 24%, 32% or whatever bracket the extra income lands in.
          </p>

          <h3>Payroll taxes apply to a bonus too</h3>
          <p>
            A bonus is wages, so FICA applies on top of income tax: 6.2% Social Security up to the
            $184,500 wage base (reduced by what you have already earned this year), 1.45% Medicare
            with no cap, and an extra 0.9% Additional Medicare Tax on combined wages above $200,000
            (single) or $250,000 (married filing jointly). FICA is the same under both methods — only
            the income-tax withholding changes.
          </p>

          <h3>Worked example</h3>
          <p>
            Take a $50,000 bonus on top of a $200,000 salary for a single filer who has already earned
            $200,000 this year. The flat method withholds 22% × $50,000 = $11,000. Social Security is
            $0 because the wage base is already met, Medicare is $725 and the whole bonus is above the
            $200,000 Additional Medicare threshold, adding $450 — $1,175 of FICA. Total withholding is
            $12,175, leaving $37,825. Under the aggregate method, the federal part is tax($250,000) −
            tax($200,000) = $14,570, for a total of $15,745 and a take-home of $34,255. The $3,570 gap
            is settled when you file.
          </p>

          <h3>What this calculator leaves out</h3>
          <p>
            It covers federal income-tax withholding and FICA only. State and local income tax,
            pre-tax deductions on the bonus, employer-share taxes and any 401(k) contribution from the
            bonus are not modelled. Wages from a second employer, or the $1,000,000 threshold being
            reached across multiple employers, can also change the picture. Use the result as an
            estimate and confirm your numbers with payroll or a tax professional.
          </p>
        </>
      }
    >
      <BonusTaxCalculator />
    </CalculatorLayout>
  );
}
