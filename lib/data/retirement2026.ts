/**
 * 2026 IRS retirement contribution limits (tax year 2026).
 *
 * Source of truth (verified against official IRS material):
 *  - IRS Notice 2025-67, "2026 Amounts Relating to Retirement Plans and IRAs,
 *    as Adjusted for Changes in Cost-of-Living".
 *    https://www.irs.gov/pub/irs-drop/n-25-67.pdf
 *  - IRS News Release IR-2025-111 (Nov. 13, 2025), "401(k) limit increases to
 *    $24,500 for 2026, IRA limit increases to $7,500".
 *    https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
 *  - IRS "Retirement topics - 401(k) and profit-sharing plan contribution limits".
 *    https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits
 *
 * Last reviewed: 2026-11-12
 *
 * Do not edit these numbers without an authoritative citation. If you believe a
 * value is wrong, record it in DATA_REVIEW.md instead of changing it here.
 */

export interface DeferralLimits {
  /** Maximum employee elective deferral (IRC §402(g)). */
  electiveDeferralLimit: number;
  /** Additional catch-up for participants aged 50 and over. */
  catchUpAge50: number;
  /** Higher catch-up for participants aged 60, 61, 62 and 63 (SECURE 2.0). */
  catchUpAge60to63: number;
  /** Elective deferral + standard catch-up (age 50+). */
  totalWithCatchUp50: number;
}

export interface IraLimits {
  /** Maximum annual IRA contribution (traditional or Roth). */
  contributionLimit: number;
  /** Additional catch-up for individuals aged 50 and over. */
  catchUpAge50: number;
}

export interface RetirementLimits2026 {
  /** 401(k)/403(b)/governmental 457(b)/TSP elective deferral limits. */
  deferral401k: DeferralLimits;
  /** Traditional and Roth IRA limits. */
  ira: IraLimits;
}

/** 2026 limits as announced by the IRS in Notice 2025-67 / IR-2025-111. */
export const RETIREMENT_2026: RetirementLimits2026 = {
  deferral401k: {
    electiveDeferralLimit: 24_500,
    catchUpAge50: 8_000,
    catchUpAge60to63: 11_250,
    totalWithCatchUp50: 32_500,
  },
  ira: {
    contributionLimit: 7_500,
    catchUpAge50: 1_100,
  },
};

/**
 * The employee elective deferral cap that applies to a participant of a given
 * age in 2026, including any catch-up contribution.
 */
export function deferralLimitForAge(age: number): number {
  const { electiveDeferralLimit, catchUpAge50, catchUpAge60to63 } = RETIREMENT_2026.deferral401k;
  if (age >= 60 && age <= 63) return electiveDeferralLimit + catchUpAge60to63;
  if (age >= 50) return electiveDeferralLimit + catchUpAge50;
  return electiveDeferralLimit;
}
