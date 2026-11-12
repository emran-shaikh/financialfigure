import { describe, expect, it } from "vitest";
import { calculateRefinance } from "./refinance";

describe("calculateRefinance", () => {
  it("computes the break-even point for a typical rate drop", () => {
    const r = calculateRefinance({
      currentBalance: 300_000,
      currentRatePct: 7,
      remainingMonths: 300,
      newRatePct: 5.5,
      newTermMonths: 360,
      closingCosts: 6_000,
    });

    expect(r.monthlySavings).toBeGreaterThan(0);
    expect(r.newMonthlyPayment).toBeLessThan(r.currentMonthlyPayment);
    // ~$417/mo saved on a $6,000 cost -> about 14.4 months, rounded up to 15.
    expect(r.breakEvenMonths).not.toBeNull();
    expect(Math.abs((r.breakEvenMonths as number) - 6_000 / r.monthlySavings)).toBeLessThan(1);
    expect(r.breakEvenMonths).toBe(15);
    expect(r.paysOffWithinTerm).toBe(true);
    expect(r.lifetimeInterestSavings).toBeGreaterThan(0);
  });

  it("returns null break-even when the new rate offers no saving", () => {
    const r = calculateRefinance({
      currentBalance: 250_000,
      currentRatePct: 6,
      remainingMonths: 240,
      newRatePct: 6,
      newTermMonths: 240,
      closingCosts: 4_000,
    });

    expect(r.monthlySavings).toBeCloseTo(0, 6);
    expect(r.breakEvenMonths).toBeNull();
    expect(r.paysOffWithinTerm).toBe(false);
  });

  it("reports negative savings when the new rate is higher", () => {
    const r = calculateRefinance({
      currentBalance: 250_000,
      currentRatePct: 5,
      remainingMonths: 240,
      newRatePct: 7,
      newTermMonths: 240,
      closingCosts: 4_000,
    });

    expect(r.monthlySavings).toBeLessThan(0);
    expect(r.breakEvenMonths).toBeNull();
    expect(r.lifetimeInterestSavings).toBeLessThan(0);
  });

  it("handles a zero balance", () => {
    const r = calculateRefinance({
      currentBalance: 0,
      currentRatePct: 6,
      remainingMonths: 300,
      newRatePct: 5,
      newTermMonths: 360,
      closingCosts: 5_000,
    });

    expect(r.currentMonthlyPayment).toBe(0);
    expect(r.newMonthlyPayment).toBe(0);
    expect(r.breakEvenMonths).toBeNull();
    expect(Number.isFinite(r.lifetimeInterestSavings)).toBe(true);
  });

  it("treats zero closing costs as an immediate break-even", () => {
    const r = calculateRefinance({
      currentBalance: 300_000,
      currentRatePct: 7,
      remainingMonths: 300,
      newRatePct: 5.5,
      newTermMonths: 360,
      closingCosts: 0,
    });

    expect(r.breakEvenMonths).toBe(0);
    expect(r.paysOffWithinTerm).toBe(true);
  });

  it("survives negatives, NaN and very large balances", () => {
    const bad = calculateRefinance({
      currentBalance: -100_000,
      currentRatePct: Number.NaN,
      remainingMonths: -12,
      newRatePct: -4,
      newTermMonths: Number.POSITIVE_INFINITY,
      closingCosts: -1_000,
    });
    for (const value of [
      bad.currentMonthlyPayment,
      bad.newMonthlyPayment,
      bad.monthlySavings,
      bad.lifetimeInterestCurrent,
      bad.lifetimeInterestNew,
      bad.lifetimeInterestSavings,
    ]) {
      expect(Number.isFinite(value)).toBe(true);
    }
    expect(bad.breakEvenMonths === null || Number.isFinite(bad.breakEvenMonths)).toBe(true);

    const big = calculateRefinance({
      currentBalance: 9_000_000_000,
      currentRatePct: 6,
      remainingMonths: 360,
      newRatePct: 4,
      newTermMonths: 360,
      closingCosts: 20_000,
    });
    expect(Number.isFinite(big.newMonthlyPayment)).toBe(true);
    expect(big.breakEvenMonths).not.toBeNull();
  });
});
