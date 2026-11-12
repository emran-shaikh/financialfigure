/**
 * 2026 federal income tax and payroll (FICA) parameters.
 *
 * Source of truth:
 *  - IRS Rev. Proc. 2025-32 / IR-2025-103 (Oct 9, 2025): tax rate schedules,
 *    standard deduction and other inflation adjustments for tax year 2026.
 *    https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
 *  - SSA 2026 COLA Fact Sheet: Social Security contribution and benefit base
 *    (taxable maximum) for 2026. https://www.ssa.gov/oact/cola/cbb.html
 *  - IRS Topic No. 751: Social Security and Medicare withholding rates.
 *    https://www.irs.gov/taxtopics/tc751
 *
 * Last reviewed: 2026-11-12
 *
 * Do not edit these numbers without an authoritative citation. If you believe a
 * value is wrong, record it in DATA_REVIEW.md instead of changing it here.
 */

/** Filing statuses supported by the calculator. */
export type Filing = "single" | "married" | "head";

/** A single marginal bracket. `upTo` is the top of the bracket (inclusive); `null` means no limit. */
export interface Bracket {
  /** Upper bound of taxable income taxed at `rate`. `null` for the top bracket. */
  upTo: number | null;
  /** Marginal rate as a decimal (e.g. 0.22). */
  rate: number;
}

export interface FilingTable {
  /** Standard deduction for this filing status (tax year 2026). */
  standardDeduction: number;
  /** Progressive brackets, ordered from lowest to highest. */
  brackets: Bracket[];
}

const bracket = (rate: number, upTo: number | null): Bracket => ({ rate, upTo });

/** 2026 federal ordinary income tax tables (IRS Rev. Proc. 2025-32). */
export const FEDERAL_2026: Record<Filing, FilingTable> = {
  single: {
    standardDeduction: 16_100,
    brackets: [
      bracket(0.1, 12_400),
      bracket(0.12, 50_400),
      bracket(0.22, 105_700),
      bracket(0.24, 201_775),
      bracket(0.32, 256_225),
      bracket(0.35, 640_600),
      bracket(0.37, null),
    ],
  },
  married: {
    standardDeduction: 32_200,
    brackets: [
      bracket(0.1, 24_800),
      bracket(0.12, 100_800),
      bracket(0.22, 211_400),
      bracket(0.24, 403_550),
      bracket(0.32, 512_450),
      bracket(0.35, 768_700),
      bracket(0.37, null),
    ],
  },
  head: {
    standardDeduction: 24_150,
    brackets: [
      bracket(0.1, 17_700),
      bracket(0.12, 67_450),
      bracket(0.22, 105_700),
      bracket(0.24, 201_750),
      bracket(0.32, 256_200),
      bracket(0.35, 640_600),
      bracket(0.37, null),
    ],
  },
};

/** FICA — employee-side payroll tax parameters for 2026. */
export const PAYROLL_2026 = {
  /** OASDI (Social Security) employee rate. */
  socialSecurityRate: 0.062,
  /** OASDI taxable maximum (wage base). SSA 2026 COLA fact sheet. */
  socialSecurityWageBase: 184_500,
  /** Hospital Insurance (Medicare) employee rate; not capped. */
  medicareRate: 0.0145,
  /** Additional Medicare Tax rate on wages above the threshold (IRC §3101(b)(2)). */
  additionalMedicareRate: 0.009,
  /** Additional Medicare Tax thresholds by filing status. */
  additionalMedicareThreshold: {
    single: 200_000,
    married: 250_000,
    head: 200_000,
  } as Record<Filing, number>,
  /** Total self-employment (SECA) rate: 12.4% OASDI + 2.9% Medicare. */
  selfEmploymentRate: 0.153,
  /** Self-employment income subject to SECA is multiplied by this factor (IRC §1402(a)(12)). */
  selfEmploymentNetEarningsFactor: 0.9235,
  /** The employer-equivalent half of SECA tax is deductible. */
  selfEmploymentDeductionShare: 0.5,
} as const;

/**
 * Progressively tax `income` using `brackets`.
 * Returns total tax and the marginal rate that applies to the last dollar.
 */
export function applyBrackets(
  income: number,
  brackets: Bracket[],
): { tax: number; marginalRate: number } {
  let tax = 0;
  let marginalRate = 0;
  let lower = 0;

  for (const b of brackets) {
    const upper = b.upTo ?? Infinity;
    if (income <= lower) break;
    const taxableInBracket = Math.min(income, upper) - lower;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * b.rate;
      marginalRate = b.rate;
    }
    lower = upper;
  }

  return { tax, marginalRate: income > 0 ? marginalRate : 0 };
}

/** Federal income tax on ordinary income for a given filing status (ignores credits). */
export function federalIncomeTax(taxableIncome: number, filing: Filing): number {
  if (!Number.isFinite(taxableIncome) || taxableIncome <= 0) return 0;
  return applyBrackets(taxableIncome, FEDERAL_2026[filing].brackets).tax;
}

/** Federal marginal rate that applies to the next dollar of taxable income. */
export function federalMarginalRate(taxableIncome: number, filing: Filing): number {
  if (!Number.isFinite(taxableIncome) || taxableIncome <= 0) return FEDERAL_2026[filing].brackets[0].rate;
  return applyBrackets(taxableIncome, FEDERAL_2026[filing].brackets).marginalRate;
}

/** Employee Social Security (OASDI) tax, capped at the 2026 wage base. */
export function socialSecurityTax(grossWages: number): number {
  if (!Number.isFinite(grossWages) || grossWages <= 0) return 0;
  const taxable = Math.min(grossWages, PAYROLL_2026.socialSecurityWageBase);
  return taxable * PAYROLL_2026.socialSecurityRate;
}

/** Employee Medicare tax, including the 0.9% Additional Medicare Tax above the threshold. */
export function medicareTax(grossWages: number, filing: Filing): number {
  if (!Number.isFinite(grossWages) || grossWages <= 0) return 0;
  const base = grossWages * PAYROLL_2026.medicareRate;
  const threshold = PAYROLL_2026.additionalMedicareThreshold[filing];
  const excess = Math.max(0, grossWages - threshold);
  return base + excess * PAYROLL_2026.additionalMedicareRate;
}
