import { describe, expect, it } from "vitest";
import { calculateBonus } from "./bonus";

describe("calculateBonus", () => {
  it("matches the flat 22% method and the aggregate method at the same bracket", () => {
    const r = calculateBonus({
      bonusAmount: 10_000,
      regularAnnualSalary: 100_000,
      ytdWages: 100_000,
      filing: "single",
    });
    // Flat: 10,000 × 22% = 2,200
    expect(r.federalFlat).toBeCloseTo(2_200, 2);
    // Aggregate: 110,000 and 100,000 are both in the 22% bracket → marginal = 2,200
    expect(r.federalAggregate).toBeCloseTo(2_200, 2);
    expect(r.socialSecurity).toBeCloseTo(620, 2);
    expect(r.medicare).toBeCloseTo(145, 2);
    expect(r.additionalMedicare).toBe(0);
    expect(r.fica).toBeCloseTo(765, 2);
    expect(r.totalTaxFlat).toBeCloseTo(2_965, 2);
    expect(r.netBonusFlat).toBeCloseTo(7_035, 2);
    expect(r.taxDifference).toBeCloseTo(0, 2);
  });

  it("withholds more under the aggregate method when the bonus crosses into a higher bracket", () => {
    const r = calculateBonus({
      bonusAmount: 50_000,
      regularAnnualSalary: 200_000,
      ytdWages: 200_000,
      filing: "single",
    });
    expect(r.federalFlat).toBeCloseTo(11_000, 2);
    // tax(250,000) − tax(200,000) = 51,304 − 36,734 = 14,570
    expect(r.federalAggregate).toBeCloseTo(14_570, 2);
    // Social Security already maxed out at 200,000 of YTD wages
    expect(r.socialSecurity).toBe(0);
    expect(r.medicare).toBeCloseTo(725, 2);
    // Entire bonus is above the $200,000 single threshold → 0.9% × 50,000 = 450
    expect(r.additionalMedicare).toBeCloseTo(450, 2);
    expect(r.totalTaxFlat).toBeCloseTo(12_175, 2);
    expect(r.totalTaxAggregate).toBeCloseTo(15_745, 2);
    expect(r.netBonusFlat).toBeCloseTo(37_825, 2);
    expect(r.netBonusAggregate).toBeCloseTo(34_255, 2);
    expect(r.taxDifference).toBeCloseTo(3_570, 2);
  });

  it("applies the 37% rate to the portion of a bonus above $1,000,000", () => {
    const r = calculateBonus({
      bonusAmount: 1_200_000,
      regularAnnualSalary: 500_000,
      ytdWages: 500_000,
      filing: "single",
    });
    // 1,000,000 × 22% + 200,000 × 37% = 220,000 + 74,000 = 294,000
    expect(r.federalFlat).toBeCloseTo(294_000, 2);
    expect(r.socialSecurity).toBe(0);
    expect(r.medicare).toBeCloseTo(17_400, 2);
    // Incremental additional Medicare = 0.9% × 1,200,000 = 10,800
    expect(r.additionalMedicare).toBeCloseTo(10_800, 2);
    expect(r.fica).toBeCloseTo(28_200, 2);
  });

  it("only charges Additional Medicare on the portion of the bonus above the threshold", () => {
    const r = calculateBonus({
      bonusAmount: 20_000,
      regularAnnualSalary: 190_000,
      ytdWages: 190_000,
      filing: "single",
    });
    // Combined 210,000; only 10,000 is above the $200,000 threshold → 90
    expect(r.additionalMedicare).toBeCloseTo(90, 2);
  });

  it("returns all zeros for a zero bonus", () => {
    const r = calculateBonus({
      bonusAmount: 0,
      regularAnnualSalary: 80_000,
      ytdWages: 80_000,
      filing: "single",
    });
    expect(r.federalFlat).toBe(0);
    expect(r.federalAggregate).toBe(0);
    expect(r.fica).toBe(0);
    expect(r.totalTaxFlat).toBe(0);
    expect(r.netBonusFlat).toBe(0);
  });

  it("never returns negative figures for a negative bonus", () => {
    const r = calculateBonus({
      bonusAmount: -5_000,
      regularAnnualSalary: 80_000,
      filing: "single",
    });
    expect(r.bonusAmount).toBe(0);
    expect(r.federalFlat).toBe(0);
    expect(r.totalTaxFlat).toBe(0);
    expect(r.netBonusFlat).toBe(0);
  });

  it("survives NaN and missing inputs", () => {
    const r = calculateBonus({
      bonusAmount: Number.NaN,
      regularAnnualSalary: Number.NaN,
      ytdWages: Number.NaN,
      filing: "single",
    });
    expect(Number.isFinite(r.totalTaxFlat)).toBe(true);
    expect(Number.isFinite(r.totalTaxAggregate)).toBe(true);
    expect(r.totalTaxFlat).toBe(0);
  });

  it("stays finite for a very large bonus", () => {
    const r = calculateBonus({
      bonusAmount: 5_000_000,
      regularAnnualSalary: 300_000,
      ytdWages: 300_000,
      filing: "single",
    });
    // 1,000,000 × 22% + 4,000,000 × 37% = 220,000 + 1,480,000 = 1,700,000
    expect(r.federalFlat).toBeCloseTo(1_700_000, 2);
    expect(Number.isFinite(r.netBonusFlat)).toBe(true);
    expect(Number.isFinite(r.netBonusAggregate)).toBe(true);
  });

  it("caps Social Security precisely at the remaining wage base", () => {
    const r = calculateBonus({
      bonusAmount: 4_500,
      regularAnnualSalary: 180_000,
      ytdWages: 180_000,
      filing: "single",
    });
    // Headroom = 184,500 − 180,000 = 4,500; the whole bonus is taxable: 4,500 × 6.2% = 279
    expect(r.socialSecurity).toBeCloseTo(279, 2);
  });
});
