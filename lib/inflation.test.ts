import { describe, expect, it } from "vitest";
import { calculateInflation } from "./inflation";

describe("calculateInflation", () => {
  it("computes nominal, purchasing-power and real values together", () => {
    const result = calculateInflation({
      currentAmount: 10_000,
      inflationRatePct: 3,
      investmentReturnPct: 6,
      years: 10,
    });
    expect(result.futureNominalValue).toBeCloseTo(17_908.48, 1);
    expect(result.futurePurchasingPower).toBeCloseTo(7_440.94, 1);
    expect(result.realValueOfInvestment).toBeCloseTo(13_325.59, 1);
    expect(result.realReturnPct).toBeCloseTo(2.91, 2);
    expect(result.purchasingPowerLoss).toBeCloseTo(2_559.06, 1);
    expect(result.nominalGain).toBeCloseTo(7_908.48, 1);
  });

  it("leaves purchasing power untouched at 0% inflation", () => {
    const result = calculateInflation({
      currentAmount: 10_000,
      inflationRatePct: 0,
      investmentReturnPct: 5,
      years: 5,
    });
    expect(result.futurePurchasingPower).toBe(10_000);
    expect(result.futureNominalValue).toBeCloseTo(12_762.82, 1);
    expect(result.realValueOfInvestment).toBeCloseTo(12_762.82, 1);
    expect(result.purchasingPowerLoss).toBe(0);
  });

  it("returns the input amount unchanged over a zero-year horizon", () => {
    const result = calculateInflation({
      currentAmount: 5_000,
      inflationRatePct: 4,
      investmentReturnPct: 7,
      years: 0,
    });
    expect(result.futureNominalValue).toBe(5_000);
    expect(result.futurePurchasingPower).toBe(5_000);
    expect(result.realValueOfInvestment).toBe(5_000);
    expect(result.purchasingPowerLoss).toBe(0);
  });

  it("reports a negative real return when inflation beats the investment", () => {
    const result = calculateInflation({
      currentAmount: 1_000,
      inflationRatePct: 4,
      investmentReturnPct: 2,
      years: 10,
    });
    expect(result.realReturnPct).toBeCloseTo(-1.92, 2);
    expect(result.realReturnPct).toBeLessThan(0);
  });

  it("handles deflation, where cash gains purchasing power", () => {
    const result = calculateInflation({
      currentAmount: 1_000,
      inflationRatePct: -2,
      investmentReturnPct: 0,
      years: 1,
    });
    expect(result.futurePurchasingPower).toBeCloseTo(1_020.41, 1);
    expect(result.realReturnPct).toBeCloseTo(2.04, 2);
  });

  it("clamps negatives, zeros and NaN without producing NaN/Infinity", () => {
    const negative = calculateInflation({
      currentAmount: -1_000,
      inflationRatePct: 3,
      investmentReturnPct: 6,
      years: 5,
    });
    expect(negative.futureNominalValue).toBe(0);

    const nan = calculateInflation({
      currentAmount: Number.NaN,
      inflationRatePct: Number.NaN,
      investmentReturnPct: Number.NaN,
      years: Number.NaN,
    });
    expect(Number.isFinite(nan.futureNominalValue)).toBe(true);
    expect(Number.isFinite(nan.realReturnPct)).toBe(true);
    expect(nan.futureNominalValue).toBe(0);
  });

  it("stays finite on very large inputs", () => {
    const result = calculateInflation({
      currentAmount: 1_000_000_000,
      inflationRatePct: 3,
      investmentReturnPct: 8,
      years: 60,
    });
    expect(Number.isFinite(result.futureNominalValue)).toBe(true);
    expect(Number.isFinite(result.futurePurchasingPower)).toBe(true);
    expect(Number.isFinite(result.realValueOfInvestment)).toBe(true);
  });
});
