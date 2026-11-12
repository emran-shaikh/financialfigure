/**
 * Bonus (supplemental-wage) withholding comparison — tax year 2026.
 *
 * Employers may withhold federal income tax on a bonus using one of two IRS
 * methods, described in IRS Publication 15 (Circular E), section 7, "Supplemental
 * Wages" (https://www.irs.gov/publications/p15):
 *
 *   Method A — flat percentage (optional). Supplemental wages paid during the
 *     calendar year are withheld at a flat 22%, except that the part of the
 *     supplemental wages above $1,000,000 in the calendar year is withheld at the
 *     highest rate in effect (37% for 2026). Pub. 15: "The withholding rate on
 *     supplemental wages remains 22% (37% if supplemental wages paid to an
 *     employee during the calendar year exceed $1 million)."
 *
 *   Method B — aggregate. Withhold on the combined regular + supplemental wages
 *     as if it were a single payment, then subtract the tax already withheld on
 *     the regular wages; equivalently, the marginal federal income tax the bonus
 *     adds at the annualised brackets.
 *
 * FICA is identical under either method (IRS Topic No. 751 and the SSA 2026 COLA
 * fact sheet, both encoded in lib/tax/federal2026.ts):
 *   Social Security 6.2% up to the $184,500 wage base (reduced by year-to-date wages)
 *   Medicare 1.45% (uncapped)
 *   Additional Medicare 0.9% on combined wages above the statutory threshold
 *
 * Last reviewed: 2026-11-12
 */

import { FEDERAL_2026, PAYROLL_2026, applyBrackets, type Filing } from "./tax/federal2026";

/** Flat supplemental-wage withholding rate (IRS Pub. 15). */
const FLAT_RATE = 0.22;
/** Highest-rate supplemental withholding that applies above the $1,000,000 threshold (IRS Pub. 15). */
const HIGH_RATE = 0.37;
/** Calendar-year supplemental-wage amount above which the 37% rate applies (IRS Pub. 15). */
const SUPPLEMENTAL_THRESHOLD = 1_000_000;

export interface BonusInput {
  /** The bonus (supplemental wage) amount being paid. */
  bonusAmount: number;
  /** Annualised regular salary, used by the aggregate method. */
  regularAnnualSalary: number;
  /** Wages already paid this year; reduces the Social Security wage base and the Additional Medicare headroom. */
  ytdWages?: number;
  filing: Filing;
}

export interface BonusResult {
  bonusAmount: number;
  /** Method A: flat-percentage federal income tax withholding. */
  federalFlat: number;
  /** Method B: aggregate federal income tax withholding (marginal). */
  federalAggregate: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  /** FICA (Social Security + Medicare + Additional Medicare); the same under both methods. */
  fica: number;
  /** Total withholding under Method A. */
  totalTaxFlat: number;
  /** Total withholding under Method B. */
  totalTaxAggregate: number;
  /** Bonus kept under Method A. */
  netBonusFlat: number;
  /** Bonus kept under Method B. */
  netBonusAggregate: number;
  /** totalTaxAggregate − totalTaxFlat; positive means the aggregate method withholds more. */
  taxDifference: number;
}

const nonNegative = (n: number | undefined): number =>
  Number.isFinite(n) && (n as number) > 0 ? (n as number) : 0;

export function calculateBonus(input: BonusInput): BonusResult {
  const bonus = nonNegative(input.bonusAmount);
  const regular = nonNegative(input.regularAnnualSalary);
  const ytd = nonNegative(input.ytdWages);
  const filing: Filing = input.filing;
  const params = PAYROLL_2026;

  // Method A — flat percentage: 22% up to $1,000,000, 37% above it.
  const flatPortion = Math.min(bonus, SUPPLEMENTAL_THRESHOLD);
  const excessPortion = Math.max(0, bonus - SUPPLEMENTAL_THRESHOLD);
  const federalFlat = flatPortion * FLAT_RATE + excessPortion * HIGH_RATE;

  // Method B — aggregate: the marginal federal income tax the bonus adds.
  const standardDeduction = FEDERAL_2026[filing].standardDeduction;
  const taxRegular = applyBrackets(
    Math.max(0, regular - standardDeduction),
    FEDERAL_2026[filing].brackets,
  ).tax;
  const taxCombined = applyBrackets(
    Math.max(0, regular + bonus - standardDeduction),
    FEDERAL_2026[filing].brackets,
  ).tax;
  const federalAggregate = Math.max(0, taxCombined - taxRegular);

  // FICA — identical under both methods.
  const remainingSsBase = Math.max(0, params.socialSecurityWageBase - ytd);
  const socialSecurity = Math.min(bonus, remainingSsBase) * params.socialSecurityRate;
  const medicare = bonus * params.medicareRate;
  const threshold = params.additionalMedicareThreshold[filing];
  const combinedWages = ytd + bonus;
  const additionalMedicare = Math.max(
    0,
    (Math.max(0, combinedWages - threshold) - Math.max(0, ytd - threshold)) *
      params.additionalMedicareRate,
  );

  const fica = socialSecurity + medicare + additionalMedicare;
  const totalTaxFlat = federalFlat + fica;
  const totalTaxAggregate = federalAggregate + fica;

  return {
    bonusAmount: bonus,
    federalFlat,
    federalAggregate,
    socialSecurity,
    medicare,
    additionalMedicare,
    fica,
    totalTaxFlat,
    totalTaxAggregate,
    netBonusFlat: bonus - totalTaxFlat,
    netBonusAggregate: bonus - totalTaxAggregate,
    taxDifference: totalTaxAggregate - totalTaxFlat,
  };
}
