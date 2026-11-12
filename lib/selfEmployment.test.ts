import { describe, expect, it } from "vitest";
import { calculateSelfEmployment } from "./selfEmployment";
import { PAYROLL_2026 } from "./tax/federal2026";

describe("calculateSelfEmployment", () => {
  it("computes SECA and federal income tax for $100,000 of net profit", () => {
    const r = calculateSelfEmployment({ netProfit: 100_000, filing: "single", otherWages: 0 });

    // Net earnings = 100,000 × 0.9235 = 92,350
    expect(r.seBase).toBeCloseTo(92_350, 2);
    // Social Security 12.4% of the base
    expect(r.socialSecurityTax).toBeCloseTo(11_451.4, 2);
    // Medicare 2.9% of the base
    expect(r.medicareTax).toBeCloseTo(2_678.15, 2);
    expect(r.additionalMedicareTax).toBe(0);
    expect(r.seTax).toBeCloseTo(14_129.55, 2);
    // Half of SECA is deductible: 7,064.775
    expect(r.deductibleHalf).toBeCloseTo(7_064.775, 3);
    // Taxable = 100,000 − 7,064.775 − 16,100 = 76,835.225
    expect(r.federalTaxableIncome).toBeCloseTo(76_835.225, 3);
    // Federal: 1,240 + 4,560 + 22% × 26,435.225 = 11,615.75
    expect(r.federalIncomeTax).toBeCloseTo(11_615.75, 2);
    expect(r.totalTax).toBeCloseTo(25_745.3, 2);
    expect(r.effectiveRate).toBeCloseTo(0.25745, 4);
    expect(r.quarterlyPayment).toBeCloseTo(6_436.32, 2);
  });

  it("caps Social Security using the wage base headroom left after other W-2 wages", () => {
    const r = calculateSelfEmployment({ netProfit: 200_000, filing: "single", otherWages: 150_000 });
    expect(r.seBase).toBeCloseTo(184_700, 2);
    // Headroom = 184,500 − 150,000 = 34,500; 34,500 × 12.4% = 4,278
    expect(r.socialSecurityTax).toBeCloseTo(4_278, 2);
    expect(r.medicareTax).toBeCloseTo(5_356.3, 2);
    expect(r.seTax).toBeCloseTo(9_634.3, 2);
  });

  it("charges no Social Security tax once other wages exceed the wage base", () => {
    const r = calculateSelfEmployment({ netProfit: 50_000, filing: "single", otherWages: 200_000 });
    expect(r.socialSecurityTax).toBe(0);
    // Medicare still applies: 46,175 × 2.9% = 1,339.075
    expect(r.medicareTax).toBeCloseTo(1_339.075, 3);
  });

  it("adds the 0.9% Additional Medicare Tax above the threshold", () => {
    const r = calculateSelfEmployment({ netProfit: 300_000, filing: "single", otherWages: 0 });
    expect(r.seBase).toBeCloseTo(277_050, 2);
    expect(r.socialSecurityTax).toBeCloseTo(22_878, 2);
    expect(r.medicareTax).toBeCloseTo(8_034.45, 2);
    // (277,050 − 200,000) × 0.9% = 693.45
    expect(r.additionalMedicareTax).toBeCloseTo(693.45, 2);
    expect(r.seTax).toBeCloseTo(31_605.9, 2);
  });

  it("uses the higher threshold for married filing jointly", () => {
    const single = calculateSelfEmployment({ netProfit: 250_000, filing: "single" });
    const married = calculateSelfEmployment({ netProfit: 250_000, filing: "married" });
    // Base = 230,875; single threshold 200k → 30,875 × 0.9% = 277.875; married threshold 250k → 0
    expect(single.additionalMedicareTax).toBeCloseTo(277.875, 3);
    expect(married.additionalMedicareTax).toBe(0);
    expect(married.totalTax).toBeLessThan(single.totalTax);
  });

  it("returns all zeros for zero net profit", () => {
    const r = calculateSelfEmployment({ netProfit: 0, filing: "single" });
    expect(r.seTax).toBe(0);
    expect(r.federalIncomeTax).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
    expect(r.quarterlyPayment).toBe(0);
  });

  it("never returns negative figures for a business loss", () => {
    const r = calculateSelfEmployment({ netProfit: -50_000, filing: "single" });
    expect(r.seBase).toBe(0);
    expect(r.seTax).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });

  it("survives NaN and missing inputs", () => {
    const r = calculateSelfEmployment({
      netProfit: Number.NaN,
      filing: "single",
      otherWages: Number.NaN,
    });
    expect(Number.isFinite(r.totalTax)).toBe(true);
    expect(Number.isFinite(r.effectiveRate)).toBe(true);
    expect(r.totalTax).toBe(0);
  });

  it("stays finite for a very large profit", () => {
    const r = calculateSelfEmployment({ netProfit: 5_000_000, filing: "single" });
    expect(Number.isFinite(r.totalTax)).toBe(true);
    // Social Security is capped at the 2026 wage base
    expect(r.socialSecurityTax).toBeCloseTo(
      PAYROLL_2026.socialSecurityWageBase * 0.124,
      2,
    );
    expect(r.effectiveRate).toBeGreaterThan(0);
    expect(r.effectiveRate).toBeLessThan(1);
  });
});
