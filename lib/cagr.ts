/**
 * CAGR (compound annual growth rate) engine.
 *
 * Converts a total gain over a holding period into an equivalent constant
 * annual rate, and reports the total return and absolute gain.
 *
 * Formulas:
 *   CAGR            = (endingValue / beginningValue)^(1 / years) − 1   (as a decimal)
 *   totalReturn     = (endingValue − beginningValue) / beginningValue
 *   absoluteGain    = endingValue − beginningValue
 *
 * Degenerate inputs (a zero/negative beginning value, a non-positive holding
 * period, or a negative ending value) cannot be annualised and return an
 * explicit `error` string with a 0 result instead of NaN.
 * Last reviewed: 2026-11-12
 */

const safe = (n: number | undefined): number => (Number.isFinite(n) ? (n as number) : 0);

const round2 = (n: number): number => {
  const v = safe(n);
  return Math.abs(v) < 1e15 ? Math.round((v + Number.EPSILON) * 100) / 100 : v;
};

export interface CagrInput {
  /** Starting value of the investment. */
  beginningValue: number;
  /** Ending value of the investment. */
  endingValue: number;
  /** Holding period in years. */
  years: number;
}

export interface CagrResult {
  /** Compound annual growth rate as a percentage. */
  cagrPct: number;
  /** Total return over the whole period as a percentage. */
  totalReturnPct: number;
  /** Ending value minus beginning value. */
  absoluteGain: number;
  /** Holding period actually used. */
  years: number;
  /** Set when the inputs cannot produce a meaningful CAGR. */
  error?: string;
}

export function calculateCagr(input: CagrInput): CagrResult {
  const beginning = safe(input.beginningValue);
  const ending = safe(input.endingValue);
  const years = Math.max(0, safe(input.years));
  const absoluteGain = round2(ending - beginning);

  if (beginning <= 0) {
    return {
      cagrPct: 0,
      totalReturnPct: 0,
      absoluteGain,
      years,
      error: "Beginning value must be greater than zero.",
    };
  }

  if (years <= 0) {
    return {
      cagrPct: 0,
      totalReturnPct: 0,
      absoluteGain,
      years,
      error: "The holding period must be greater than zero years.",
    };
  }

  if (ending < 0) {
    return {
      cagrPct: 0,
      totalReturnPct: 0,
      absoluteGain,
      years,
      error: "Ending value cannot be negative.",
    };
  }

  const totalReturnPct = ((ending - beginning) / beginning) * 100;
  const cagrPct = (Math.pow(ending / beginning, 1 / years) - 1) * 100;

  return {
    cagrPct: round2(cagrPct),
    totalReturnPct: round2(totalReturnPct),
    absoluteGain,
    years,
  };
}
