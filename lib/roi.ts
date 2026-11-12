/**
 * ROI (return on investment) engine.
 *
 * ROI expresses the profit of an investment as a percentage of everything it
 * cost, and annualises that return so deals of different lengths are comparable.
 *
 * Formulas:
 *   profit        = finalValue − initialInvestment − additionalCosts
 *   ROI           = profit / (initialInvestment + additionalCosts)
 *   annualisedROI = (1 + ROI)^(1 / years) − 1      (years ≥ 1)
 *
 * When the total cost is zero there is no base to measure a return against, so
 * the module returns an explicit `error` string with a 0 result instead of a
 * division by zero. Annualisation is only applied for a holding period of at
 * least one year. Last reviewed: 2026-11-12
 */

const safe = (n: number | undefined): number => (Number.isFinite(n) ? (n as number) : 0);

const round2 = (n: number): number => {
  const v = safe(n);
  return Math.abs(v) < 1e15 ? Math.round((v + Number.EPSILON) * 100) / 100 : v;
};

export interface RoiInput {
  /** Money invested up front. */
  initialInvestment: number;
  /** Value of the investment when it is sold or measured. */
  finalValue: number;
  /** Any extra costs (fees, commissions, upkeep). */
  additionalCosts: number;
  /** Holding period in years. */
  years: number;
}

export interface RoiResult {
  /** Return on investment as a percentage. */
  roiPct: number;
  /** Annualised ROI as a percentage (equals the simple ROI for periods under a year). */
  annualizedRoiPct: number;
  /** Profit in dollars (final value minus all costs). */
  absoluteProfit: number;
  /** Total cost basis that the profit is measured against. */
  totalCost: number;
  /** Holding period actually used. */
  years: number;
  /** Set when the inputs cannot produce a meaningful ROI. */
  error?: string;
}

export function calculateRoi(input: RoiInput): RoiResult {
  const initial = Math.max(0, safe(input.initialInvestment));
  const costs = Math.max(0, safe(input.additionalCosts));
  const final = safe(input.finalValue);
  const years = Math.max(0, safe(input.years));

  const totalCost = initial + costs;
  const profit = final - initial - costs;

  if (totalCost <= 0) {
    return {
      roiPct: 0,
      annualizedRoiPct: 0,
      absoluteProfit: round2(profit),
      totalCost: 0,
      years,
      error: "Enter an initial investment or additional cost greater than zero.",
    };
  }

  const roiPct = (profit / totalCost) * 100;

  let annualizedRoiPct: number;
  if (years >= 1) {
    const base = 1 + roiPct / 100;
    // A total loss of 100% or more cannot be annualised with a real root.
    annualizedRoiPct = base <= 0 ? -100 : (Math.pow(base, 1 / years) - 1) * 100;
  } else {
    annualizedRoiPct = roiPct;
  }

  return {
    roiPct: round2(roiPct),
    annualizedRoiPct: round2(annualizedRoiPct),
    absoluteProfit: round2(profit),
    totalCost: round2(totalCost),
    years,
  };
}
