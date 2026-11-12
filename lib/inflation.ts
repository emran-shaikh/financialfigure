/**
 * Inflation / purchasing-power engine.
 *
 * Inflation erodes the buying power of cash while an investment compounds at
 * its nominal return. This module reports both effects and the "real" return.
 *
 * Formulas (i = inflation rate, r = investment return, n = years, all as decimals):
 *   future nominal value        = amount · (1 + r)^n
 *   future purchasing power     = amount / (1 + i)^n      (what today's cash buys later)
 *   real value of the investment = amount · (1 + r)^n / (1 + i)^n
 *   real (inflation-adjusted) return = (1 + r) / (1 + i) − 1
 *   purchasing-power loss       = amount − futurePurchasingPower
 *
 * No external data: both rates are user inputs. Rates below −99% are clamped so
 * the growth bases stay positive and the result is always finite.
 * Last reviewed: 2026-11-12
 */

const MAX_YEARS = 120;

const safe = (n: number | undefined): number => (Number.isFinite(n) ? (n as number) : 0);

const round2 = (n: number): number => {
  const v = safe(n);
  return Math.abs(v) < 1e15 ? Math.round((v + Number.EPSILON) * 100) / 100 : v;
};

export interface InflationInput {
  /** Amount of money today (cash or an investment). */
  currentAmount: number;
  /** Expected annual inflation rate as a percentage, e.g. 3. */
  inflationRatePct: number;
  /** Expected annual investment return as a percentage, e.g. 6. */
  investmentReturnPct: number;
  /** Number of years to project. */
  years: number;
}

export interface InflationResult {
  /** Nominal value of the investment after `years`. */
  futureNominalValue: number;
  /** Purchasing power of today's cash after `years` of inflation. */
  futurePurchasingPower: number;
  /** Investment value expressed in today's (inflation-adjusted) dollars. */
  realValueOfInvestment: number;
  /** Real (inflation-adjusted) annual return as a percentage. */
  realReturnPct: number;
  /** Dollars of buying power lost to inflation on idle cash. */
  purchasingPowerLoss: number;
  /** Nominal gain of the investment. */
  nominalGain: number;
}

export function calculateInflation(input: InflationInput): InflationResult {
  const amount = Math.max(0, safe(input.currentAmount));
  const years = Math.min(MAX_YEARS, Math.max(0, safe(input.years)));
  const inflation = Math.max(-99, safe(input.inflationRatePct)) / 100;
  const ret = Math.max(-99, safe(input.investmentReturnPct)) / 100;

  const inflationFactor = Math.pow(1 + inflation, years);
  const returnFactor = Math.pow(1 + ret, years);

  const futureNominalValue = amount * returnFactor;
  const futurePurchasingPower = amount / inflationFactor;
  const realValueOfInvestment = futureNominalValue / inflationFactor;
  const realReturnPct = ((1 + ret) / (1 + inflation) - 1) * 100;

  return {
    futureNominalValue: round2(futureNominalValue),
    futurePurchasingPower: round2(futurePurchasingPower),
    realValueOfInvestment: round2(realValueOfInvestment),
    realReturnPct: round2(realReturnPct),
    purchasingPowerLoss: round2(Math.max(0, amount - futurePurchasingPower)),
    nominalGain: round2(futureNominalValue - amount),
  };
}
