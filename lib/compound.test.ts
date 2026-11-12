import { describe, expect, it } from "vitest";
import { calculateCompound, effectiveMonthlyRate } from "./compound";

describe("effectiveMonthlyRate", () => {
  it("reduces to the nominal monthly rate when compounding monthly", () => {
    // 5% compounded monthly -> 0.05 / 12 per month.
    expect(effectiveMonthlyRate(5, 12)).toBeCloseTo(0.05 / 12, 10);
  });

  it("falls back to monthly compounding for an unsupported frequency", () => {
    expect(effectiveMonthlyRate(5, 3)).toBeCloseTo(effectiveMonthlyRate(5, 12), 12);
  });
});

describe("calculateCompound", () => {
  it("matches the standard future-value formula for a lump sum", () => {
    // $10,000 at 5% compounded annually for 10 years = $10,000 * 1.05^10.
    const result = calculateCompound({
      principal: 10_000,
      monthlyContribution: 0,
      annualRatePct: 5,
      years: 10,
      compoundFrequencyPerYear: 1,
      contributionsAtStartOfPeriod: false,
    });
    expect(result.futureValue).toBeCloseTo(16_288.95, 1);
    expect(result.totalContributions).toBe(10_000);
    expect(result.totalInterest).toBeCloseTo(6_288.95, 1);
  });

  it("grows a monthly contribution annuity at 0% into pure contributions", () => {
    const result = calculateCompound({
      principal: 0,
      monthlyContribution: 100,
      annualRatePct: 0,
      years: 10,
      compoundFrequencyPerYear: 12,
      contributionsAtStartOfPeriod: false,
    });
    expect(result.futureValue).toBe(12_000);
    expect(result.totalContributions).toBe(12_000);
    expect(result.totalInterest).toBe(0);
  });

  it("adds principal and contributions with no interest", () => {
    const result = calculateCompound({
      principal: 5_000,
      monthlyContribution: 100,
      annualRatePct: 0,
      years: 5,
      compoundFrequencyPerYear: 12,
      contributionsAtStartOfPeriod: false,
    });
    expect(result.futureValue).toBe(11_000);
  });

  it("earns more at a higher compounding frequency", () => {
    const base = {
      principal: 1_000,
      monthlyContribution: 0,
      annualRatePct: 12,
      years: 1,
      contributionsAtStartOfPeriod: false,
    };
    const monthly = calculateCompound({ ...base, compoundFrequencyPerYear: 12 });
    const annual = calculateCompound({ ...base, compoundFrequencyPerYear: 1 });
    expect(monthly.futureValue).toBeCloseTo(1_126.83, 1);
    expect(annual.futureValue).toBeCloseTo(1_120, 1);
    expect(monthly.futureValue).toBeGreaterThan(annual.futureValue);
  });

  it("values start-of-period contributions above end-of-period ones", () => {
    const base = {
      principal: 0,
      monthlyContribution: 1_000,
      annualRatePct: 12,
      years: 1,
      compoundFrequencyPerYear: 12,
    };
    const atStart = calculateCompound({ ...base, contributionsAtStartOfPeriod: true });
    const atEnd = calculateCompound({ ...base, contributionsAtStartOfPeriod: false });
    expect(atEnd.futureValue).toBeCloseTo(12_682.5, 1);
    expect(atStart.futureValue).toBeCloseTo(12_809.33, 1);
    expect(atStart.futureValue).toBeGreaterThan(atEnd.futureValue);
  });

  it("returns the principal unchanged for a zero-year horizon", () => {
    const result = calculateCompound({
      principal: 4_500,
      monthlyContribution: 250,
      annualRatePct: 7,
      years: 0,
      compoundFrequencyPerYear: 12,
      contributionsAtStartOfPeriod: false,
    });
    expect(result.futureValue).toBe(4_500);
    expect(result.months).toBe(0);
  });

  it("handles zeros, negatives and NaN without ever producing NaN/Infinity", () => {
    const zeros = calculateCompound({
      principal: 0,
      monthlyContribution: 0,
      annualRatePct: 0,
      years: 0,
      compoundFrequencyPerYear: 12,
      contributionsAtStartOfPeriod: false,
    });
    expect(zeros.futureValue).toBe(0);

    const negative = calculateCompound({
      principal: -10_000,
      monthlyContribution: -500,
      annualRatePct: 5,
      years: -3,
      compoundFrequencyPerYear: 12,
      contributionsAtStartOfPeriod: false,
    });
    expect(negative.futureValue).toBe(0);
    expect(Number.isFinite(negative.totalInterest)).toBe(true);

    const nan = calculateCompound({
      principal: Number.NaN,
      monthlyContribution: Number.NaN,
      annualRatePct: Number.NaN,
      years: Number.NaN,
      compoundFrequencyPerYear: Number.NaN,
      contributionsAtStartOfPeriod: false,
    });
    expect(Number.isFinite(nan.futureValue)).toBe(true);
    expect(nan.futureValue).toBe(0);
  });

  it("stays finite on very large inputs", () => {
    const result = calculateCompound({
      principal: 1_000_000_000_000,
      monthlyContribution: 10_000,
      annualRatePct: 8,
      years: 50,
      compoundFrequencyPerYear: 12,
      contributionsAtStartOfPeriod: true,
    });
    expect(Number.isFinite(result.futureValue)).toBe(true);
    expect(result.futureValue).toBeGreaterThan(1_000_000_000_000);
  });
});
