import { describe, expect, it } from "vitest";
import { calculateRoi } from "./roi";

describe("calculateRoi", () => {
  it("computes a simple 50% return over one year", () => {
    const result = calculateRoi({
      initialInvestment: 1_000,
      finalValue: 1_500,
      additionalCosts: 0,
      years: 1,
    });
    expect(result.roiPct).toBeCloseTo(50, 6);
    expect(result.annualizedRoiPct).toBeCloseTo(50, 6);
    expect(result.absoluteProfit).toBe(500);
    expect(result.totalCost).toBe(1_000);
  });

  it("includes additional costs in both the profit and the cost basis", () => {
    const result = calculateRoi({
      initialInvestment: 1_000,
      finalValue: 1_500,
      additionalCosts: 100,
      years: 1,
    });
    // (1500 - 1000 - 100) / (1000 + 100) = 400 / 1100 = 36.36%.
    expect(result.absoluteProfit).toBe(400);
    expect(result.totalCost).toBe(1_100);
    expect(result.roiPct).toBeCloseTo(36.36, 2);
  });

  it("annualises a multi-year return", () => {
    const result = calculateRoi({
      initialInvestment: 1_000,
      finalValue: 1_210,
      additionalCosts: 0,
      years: 2,
    });
    expect(result.roiPct).toBeCloseTo(21, 6);
    expect(result.annualizedRoiPct).toBeCloseTo(10, 6);
  });

  it("handles a total loss", () => {
    const result = calculateRoi({
      initialInvestment: 1_000,
      finalValue: 0,
      additionalCosts: 0,
      years: 1,
    });
    expect(result.roiPct).toBe(-100);
    expect(result.annualizedRoiPct).toBe(-100);
    expect(result.absoluteProfit).toBe(-1_000);
  });

  it("does not annualise a sub-year holding period", () => {
    const result = calculateRoi({
      initialInvestment: 1_000,
      finalValue: 1_100,
      additionalCosts: 0,
      years: 0.5,
    });
    expect(result.roiPct).toBeCloseTo(10, 6);
    expect(result.annualizedRoiPct).toBeCloseTo(10, 6);
  });

  it("flags a zero cost basis instead of dividing by zero", () => {
    const result = calculateRoi({
      initialInvestment: 0,
      finalValue: 500,
      additionalCosts: 0,
      years: 1,
    });
    expect(result.roiPct).toBe(0);
    expect(result.error).toBeDefined();
    expect(Number.isNaN(result.roiPct)).toBe(false);
  });

  it("clamps negative costs and survives NaN inputs", () => {
    const negative = calculateRoi({
      initialInvestment: -1_000,
      finalValue: -500,
      additionalCosts: -100,
      years: -3,
    });
    expect(negative.totalCost).toBe(0);
    expect(negative.error).toBeDefined();

    const nan = calculateRoi({
      initialInvestment: Number.NaN,
      finalValue: Number.NaN,
      additionalCosts: Number.NaN,
      years: Number.NaN,
    });
    expect(Number.isFinite(nan.roiPct)).toBe(true);
    expect(Number.isFinite(nan.annualizedRoiPct)).toBe(true);
  });

  it("stays finite on very large inputs", () => {
    const result = calculateRoi({
      initialInvestment: 1_000_000_000,
      finalValue: 5_000_000_000,
      additionalCosts: 0,
      years: 20,
    });
    expect(Number.isFinite(result.roiPct)).toBe(true);
    expect(Number.isFinite(result.annualizedRoiPct)).toBe(true);
    expect(result.roiPct).toBeCloseTo(400, 6);
  });
});
