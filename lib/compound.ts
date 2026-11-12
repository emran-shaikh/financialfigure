/**
 * Compound interest engine: future value of a lump sum plus a regular monthly
 * contribution, at any compounding frequency. Pure functions, no UI, no I/O.
 *
 * Formula (standard compound-interest / future-value-of-annuity mathematics):
 *   rm = (1 + r/m)^(m/12) − 1        (effective monthly rate)
 *   FV = P·(1 + rm)^n
 *      + C·[((1 + rm)^n − 1) / rm]·(1 + rm if contributions are at the start)
 * where r = nominal annual rate as a decimal, m = compounding periods per year,
 * P = principal, C = monthly contribution and n = number of months.
 * When rm = 0 the contribution term is simply C·n.
 *
 * No external rate data is used — every figure comes from user input.
 *
 * Last reviewed: 2026-11-12
 */

const MONTHS_PER_YEAR = 12;
const MAX_YEARS = 120;

const safe = (n: number): number => (Number.isFinite(n) ? n : 0);

/** Rounds to the nearest cent without overflowing on very large finite values. */
const round2 = (n: number): number => {
  const v = safe(n);
  return Math.abs(v) < 1e15 ? Math.round((v + Number.EPSILON) * 100) / 100 : v;
};

/** Allowed compounding frequencies per year. */
export const COMPOUND_FREQUENCIES = [1, 2, 4, 12] as const;

export interface CompoundInput {
  /** Starting balance in dollars. */
  principal: number;
  /** Amount added every month. */
  monthlyContribution: number;
  /** Nominal annual interest rate as a percentage, e.g. 7. */
  annualRatePct: number;
  /** Investment horizon in years. */
  years: number;
  /** Compounding periods per year: 1, 2, 4 or 12. */
  compoundFrequencyPerYear: number;
  /** True adds each monthly contribution at the start of the month. */
  contributionsAtStartOfPeriod: boolean;
}

export interface CompoundResult {
  /** Balance at the end of the term. */
  futureValue: number;
  /** Principal + all monthly contributions. */
  totalContributions: number;
  /** Future value minus total contributions. */
  totalInterest: number;
  /** Effective monthly rate as a percentage, for transparency. */
  effectiveMonthlyRatePct: number;
  /** Effective annual rate (APY) as a percentage. */
  effectiveAnnualRatePct: number;
  /** Number of months in the projection. */
  months: number;
  /** Compounding frequency actually applied. */
  compoundFrequencyPerYear: number;
}

/**
 * Effective monthly rate derived from a nominal annual rate and a compounding
 * frequency. Returns −1 (total loss) if the growth base collapses to zero, so
 * callers never see NaN from a fractional power of a negative base.
 */
export function effectiveMonthlyRate(annualRatePct: number, periodsPerYear: number): number {
  const i = safe(annualRatePct) / 100;
  const m = COMPOUND_FREQUENCIES.includes(periodsPerYear as (typeof COMPOUND_FREQUENCIES)[number])
    ? periodsPerYear
    : MONTHS_PER_YEAR;
  const base = 1 + i / m;
  if (base <= 0) return -1;
  return Math.pow(base, m / MONTHS_PER_YEAR) - 1;
}

export function calculateCompound(input: CompoundInput): CompoundResult {
  const principal = Math.max(0, safe(input.principal));
  const contribution = Math.max(0, safe(input.monthlyContribution));
  const years = Math.min(MAX_YEARS, Math.max(0, safe(input.years)));
  const frequency = COMPOUND_FREQUENCIES.includes(
    input.compoundFrequencyPerYear as (typeof COMPOUND_FREQUENCIES)[number],
  )
    ? input.compoundFrequencyPerYear
    : MONTHS_PER_YEAR;

  const months = Math.max(0, Math.round(years * MONTHS_PER_YEAR));
  const rm = effectiveMonthlyRate(input.annualRatePct, frequency);
  const growth = Math.pow(1 + rm, months); // 1 when months = 0; 0 when rm = −1 and months > 0.

  const principalFV = principal * growth;

  let contributionFV: number;
  if (rm === 0) {
    contributionFV = contribution * months;
  } else {
    contributionFV = (contribution * (growth - 1)) / rm;
    if (input.contributionsAtStartOfPeriod) contributionFV *= 1 + rm;
  }

  const futureValue = principalFV + contributionFV;
  const totalContributions = principal + contribution * months;

  return {
    futureValue: round2(futureValue),
    totalContributions: round2(totalContributions),
    totalInterest: round2(futureValue - totalContributions),
    effectiveMonthlyRatePct: round2(rm * 100),
    effectiveAnnualRatePct: round2((Math.pow(1 + rm, MONTHS_PER_YEAR) - 1) * 100),
    months,
    compoundFrequencyPerYear: frequency,
  };
}
