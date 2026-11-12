/**
 * Self-employment tax (SECA) plus federal income tax engine — tax year 2026.
 *
 * Model (a self-employed person pays both the employee and employer halves of FICA):
 *   seBase              = netProfit × 92.35%                 (IRC §1402(a)(12))
 *   Social Security     = 12.4% × min(seBase, remaining wage base)
 *   Medicare            = 2.9%  × seBase                     (uncapped)
 *   Additional Medicare = 0.9%  × max(0, seBase − threshold) (IRC §3101(b)(2))
 *   seTax               = Social Security + Medicare + Additional Medicare
 *   deductible half     = seTax × 50%                        (Schedule 1 adjustment)
 *   federal taxable     = netProfit − deductible half − standard deduction
 *   federal income tax  = progressive brackets on the federal taxable income
 *   total tax           = seTax + federal income tax
 *   quarterly estimate  = total tax ÷ 4
 *
 * Sources (2026):
 *  - IRS Topic No. 751 (Social Security/Medicare rates) and the SECA rules:
 *    12.4% OASDI + 2.9% Medicare, 92.35% net-earnings factor, 50% deduction.
 *    https://www.irs.gov/taxtopics/tc751
 *  - SSA 2026 COLA Fact Sheet: Social Security wage base of $184,500 for 2026.
 *    https://www.ssa.gov/oact/cola/cbb.html
 *  - IRS Rev. Proc. 2025-32 / IR-2025-103: 2026 brackets and standard deduction.
 *    https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
 * These are the same parameters already encoded in lib/tax/federal2026.ts, which
 * this module reuses rather than duplicating.
 *
 * Limitation: the Additional Medicare Tax threshold is applied to the
 * self-employment base alone. When a filer also has W-2 wages the statutory
 * threshold is measured against combined wages; that interaction is not modelled
 * here (otherWages is used only to reduce the Social Security wage base).
 *
 * Last reviewed: 2026-11-12
 */

import {
  FEDERAL_2026,
  PAYROLL_2026,
  applyBrackets,
  type Filing,
} from "./tax/federal2026";

export interface SelfEmploymentInput {
  /** Annual net profit from self-employment (business income minus expenses). */
  netProfit: number;
  filing: Filing;
  /** W-2 wages earned from other work this year; reduces the Social Security wage base headroom. */
  otherWages?: number;
}

export interface SelfEmploymentResult {
  netProfit: number;
  /** Net earnings subject to SECA (92.35% of net profit). */
  seBase: number;
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  /** Total SECA tax: Social Security + Medicare + Additional Medicare. */
  seTax: number;
  /** The employer-equivalent half of SECA, deductible against income tax. */
  deductibleHalf: number;
  /** Federal taxable income after the deduction and the standard deduction. */
  federalTaxableIncome: number;
  federalIncomeTax: number;
  /** SECA plus federal income tax. */
  totalTax: number;
  /** Total tax as a fraction of net profit. */
  effectiveRate: number;
  /** Suggested quarterly estimated payment (total tax ÷ 4). */
  quarterlyPayment: number;
}

const nonNegative = (n: number | undefined): number =>
  Number.isFinite(n) && (n as number) > 0 ? (n as number) : 0;

export function calculateSelfEmployment(input: SelfEmploymentInput): SelfEmploymentResult {
  const netProfit = nonNegative(input.netProfit);
  const otherWages = nonNegative(input.otherWages);
  const filing: Filing = input.filing;
  const params = PAYROLL_2026;

  const seBase = netProfit * params.selfEmploymentNetEarningsFactor;

  // Social Security is 12.4% (= 2 × 6.2%) of the base, capped by whatever wage
  // base headroom is left after other W-2 wages.
  const remainingSsBase = Math.max(0, params.socialSecurityWageBase - otherWages);
  const socialSecurityTax = Math.min(seBase, remainingSsBase) * (params.socialSecurityRate * 2);

  // Medicare is 2.9% (= 2 × 1.45%) of the whole base, with no cap.
  const medicareTax = seBase * (params.medicareRate * 2);

  const threshold = params.additionalMedicareThreshold[filing];
  const additionalMedicareTax =
    Math.max(0, seBase - threshold) * params.additionalMedicareRate;

  const seTax = socialSecurityTax + medicareTax + additionalMedicareTax;
  const deductibleHalf = seTax * params.selfEmploymentDeductionShare;

  const standardDeduction = FEDERAL_2026[filing].standardDeduction;
  const federalTaxableIncome = Math.max(0, netProfit - deductibleHalf - standardDeduction);
  const federalIncomeTax = applyBrackets(
    federalTaxableIncome,
    FEDERAL_2026[filing].brackets,
  ).tax;

  const totalTax = seTax + federalIncomeTax;

  return {
    netProfit,
    seBase,
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    seTax,
    deductibleHalf,
    federalTaxableIncome,
    federalIncomeTax,
    totalTax,
    effectiveRate: netProfit > 0 ? totalTax / netProfit : 0,
    quarterlyPayment: totalTax / 4,
  };
}
