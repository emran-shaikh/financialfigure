import { describe, expect, it } from "vitest";
import { calculateCagr } from "./cagr";

describe("calculateCagr", () => {
  it("matches the CAGR formula for a doubling over ten years", () => {
    const result = calculateCagr({ beginningValue: 1_000, endingValue: 2_000, years: 10 });
    expect(result.cagrPct).toBeCloseTo(7.18, 2);
    expect(result.totalReturnPct).toBeCloseTo(100, 6);
    expect(result.absoluteGain).toBe(1_000);
    expect(result.error).toBeUndefined();
  });

  it("returns a clean 10% for a two-period 21% gain", () => {
    const result = calculateCagr({ beginningValue: 1_000, endingValue: 1_210, years: 2 });
    expect(result.cagrPct).toBeCloseTo(10, 6);
    expect(result.totalReturnPct).toBeCloseTo(21, 6);
    expect(result.absoluteGain).toBe(210);
  });

  it("reports a negative CAGR for a loss", () => {
    const result = calculateCagr({ beginningValue: 1_000, endingValue: 800, years: 5 });
    expect(result.totalReturnPct).toBeCloseTo(-20, 6);
    expect(result.cagrPct).toBeCloseTo(-4.36, 2);
    expect(result.cagrPct).toBeLessThan(0);
  });

  it("returns a −100% CAGR when the investment goes to zero", () => {
    const result = calculateCagr({ beginningValue: 1_000, endingValue: 0, years: 5 });
    expect(result.cagrPct).toBe(-100);
    expect(result.absoluteGain).toBe(-1_000);
    expect(result.error).toBeUndefined();
  });

  it("flags a zero or negative beginning value instead of returning NaN", () => {
    const zero = calculateCagr({ beginningValue: 0, endingValue: 1_000, years: 5 });
    expect(zero.cagrPct).toBe(0);
    expect(zero.error).toBeDefined();
    expect(Number.isNaN(zero.cagrPct)).toBe(false);

    const negative = calculateCagr({ beginningValue: -100, endingValue: 1_000, years: 5 });
    expect(negative.error).toBeDefined();
  });

  it("flags a non-positive holding period", () => {
    const result = calculateCagr({ beginningValue: 1_000, endingValue: 2_000, years: 0 });
    expect(result.cagrPct).toBe(0);
    expect(result.error).toBeDefined();
  });

  it("flags a negative ending value", () => {
    const result = calculateCagr({ beginningValue: 1_000, endingValue: -50, years: 3 });
    expect(result.cagrPct).toBe(0);
    expect(result.error).toBeDefined();
  });

  it("survives NaN inputs without returning NaN/Infinity", () => {
    const result = calculateCagr({
      beginningValue: Number.NaN,
      endingValue: Number.NaN,
      years: Number.NaN,
    });
    expect(Number.isFinite(result.cagrPct)).toBe(true);
    expect(Number.isFinite(result.totalReturnPct)).toBe(true);
    expect(result.error).toBeDefined();
  });

  it("stays finite on very large values", () => {
    const result = calculateCagr({
      beginningValue: 1_000,
      endingValue: 1_000_000_000_000,
      years: 40,
    });
    expect(Number.isFinite(result.cagrPct)).toBe(true);
    expect(result.cagrPct).toBeGreaterThan(0);
  });
});
