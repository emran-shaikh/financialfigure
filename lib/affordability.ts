/**
 * Home affordability engine — the largest home price a buyer can support from
 * their income, existing debts and down payment.
 *
 * Method (the conventional "28/36" debt-to-income rule):
 *   1. frontEndCap   = frontEndDti% x gross monthly income
 *   2. backEndCap    = backEndDti%  x gross monthly income - monthly debts
 *   3. housingBudget = min(frontEndCap, backEndCap)
 *   4. P&I budget    = housingBudget - property tax - insurance - HOA
 *   5. maxLoan       = affordableLoan(P&I budget, rate, termYears)
 *   6. maxHomePrice  = maxLoan + down payment
 *
 * Property tax is charged on the home price we are solving for, so steps 4–6
 * are iterated a few times until the price stabilises (a fixed point). The
 * result is the largest price that keeps PITI + HOA inside the DTI caps.
 *
 * Rule-of-thumb figures: the 28% / 36% split is the widely used "28/36 rule".
 * Fannie Mae's Selling Guide B3-6-02 caps total DTI at 50% for Desktop
 * Underwriter loans and 36% (up to 45% with credit score and reserve minimums)
 * for manually underwritten loans; FHA Handbook 4000.1 uses 31% front-end /
 * 43% back-end. Confirm current limits with the lender before relying on them.
 * Source: https://selling-guide.fanniemae.com/sel/b3-6-02/debt-to-income-ratios/
 * Last reviewed: 2026-11-12
 */

import { affordableLoan, monthlyPayment, round2 } from "@/lib/mortgage";

const MONTHS_PER_YEAR = 12;

const finite = (n: number | undefined, fallback = 0): number =>
  Number.isFinite(n) ? (n as number) : fallback;

const clampPct = (n: number): number => Math.min(100, Math.max(0, n));

export interface AffordabilityInput {
  /** Gross annual household income in dollars. */
  annualIncome: number;
  /** Total minimum monthly debt payments (cars, cards, student loans). */
  monthlyDebts: number;
  /** Cash available for the down payment in dollars. */
  downPayment: number;
  /** Nominal annual mortgage rate as a percentage, e.g. 6.5. */
  annualRatePct: number;
  /** Loan term in years. */
  termYears: number;
  /** Annual property tax as a percentage of the home price. */
  propertyTaxRatePct: number;
  /** Annual homeowners insurance in dollars. */
  annualInsurance: number;
  /** Monthly HOA dues in dollars. */
  monthlyHoa: number;
  /** Front-end DTI cap, percent of gross monthly income. Defaults to 28. */
  frontEndDtiPct?: number;
  /** Back-end DTI cap, percent of gross monthly income. Defaults to 36. */
  backEndDtiPct?: number;
}

export interface AffordabilityResult {
  /** Gross monthly income. */
  grossMonthlyIncome: number;
  /** Maximum housing payment implied by the front-end DTI cap. */
  frontEndCap: number;
  /** Maximum housing payment implied by the back-end DTI cap after debts. */
  backEndCap: number;
  /** min(frontEndCap, backEndCap) — the total monthly housing budget. */
  maxHousingBudget: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  /** Principal-and-interest the budget supports. */
  monthlyPrincipalAndInterest: number;
  /** Largest loan the P&I budget supports. */
  maxLoanAmount: number;
  /** Largest home price = maxLoanAmount + down payment. */
  maxHomePrice: number;
  /** Down payment as a fraction of the affordable home price. */
  downPaymentPct: number;
  /** Loan-to-value at the affordable home price. */
  loanToValuePct: number;
  /** Full monthly cost (PITI + HOA) at the affordable home price. */
  monthlyTotalAtMax: number;
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const grossMonthlyIncome = Math.max(0, finite(input.annualIncome)) / MONTHS_PER_YEAR;
  const monthlyDebts = Math.max(0, finite(input.monthlyDebts));
  const downPayment = Math.max(0, finite(input.downPayment));
  const monthlyInsurance = Math.max(0, finite(input.annualInsurance)) / MONTHS_PER_YEAR;
  const monthlyHoa = Math.max(0, finite(input.monthlyHoa));
  const monthlyTaxRate = Math.max(0, finite(input.propertyTaxRatePct)) / 100 / MONTHS_PER_YEAR;

  const frontEndPct = clampPct(finite(input.frontEndDtiPct, 28));
  const backEndPct = clampPct(finite(input.backEndDtiPct, 36));

  const frontEndCap = (grossMonthlyIncome * frontEndPct) / 100;
  const backEndCap = Math.max(0, (grossMonthlyIncome * backEndPct) / 100 - monthlyDebts);
  const maxHousingBudget = Math.max(0, Math.min(frontEndCap, backEndCap));

  const fixedCosts = monthlyInsurance + monthlyHoa;

  // Fixed-point iteration: loan -> price -> tax -> loan. Converges quickly.
  let maxLoanAmount = 0;
  let monthlyPropertyTax = 0;
  for (let i = 0; i < 40; i++) {
    const piBudget = Math.max(0, maxHousingBudget - fixedCosts - monthlyPropertyTax);
    const nextLoan = affordableLoan(piBudget, input.annualRatePct, input.termYears);
    const nextTax = (nextLoan + downPayment) * monthlyTaxRate;
    if (Math.abs(nextLoan - maxLoanAmount) < 0.01) {
      maxLoanAmount = nextLoan;
      monthlyPropertyTax = nextTax;
      break;
    }
    maxLoanAmount = nextLoan;
    monthlyPropertyTax = nextTax;
  }

  const maxHomePrice = maxLoanAmount + downPayment;
  const monthlyPI = monthlyPayment(
    maxLoanAmount,
    input.annualRatePct,
    Math.round(input.termYears * MONTHS_PER_YEAR),
  );
  // Derive tax from the final price so the displayed parts stay consistent.
  monthlyPropertyTax = maxHomePrice * monthlyTaxRate;

  return {
    grossMonthlyIncome: round2(grossMonthlyIncome),
    frontEndCap: round2(frontEndCap),
    backEndCap: round2(backEndCap),
    maxHousingBudget: round2(maxHousingBudget),
    monthlyPropertyTax: round2(monthlyPropertyTax),
    monthlyInsurance: round2(monthlyInsurance),
    monthlyHoa: round2(monthlyHoa),
    monthlyPrincipalAndInterest: round2(monthlyPI),
    maxLoanAmount: round2(maxLoanAmount),
    maxHomePrice: round2(maxHomePrice),
    downPaymentPct: maxHomePrice > 0 ? downPayment / maxHomePrice : 0,
    loanToValuePct: maxHomePrice > 0 ? maxLoanAmount / maxHomePrice : 0,
    monthlyTotalAtMax: round2(
      monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyHoa,
    ),
  };
}
