import { describe, expect, it } from "vitest";
import { calculateIra } from "./ira";

const base = {
  currentAge: 30,
  retirementAge: 40,
  annualContribution: 1_000,
  currentMarginalTaxRatePct: 22,
  retirementTaxRatePct: 22,
  annualReturnPct: 7,
};

describe("calculateIra", () => {
  it("ties when the tax rate is the same in both periods", () => {
    const result = calculateIra(base);
    expect(result.years).toBe(10);
    expect(result.traditionalAfterTax).toBeCloseTo(10_776.83, 1);
    expect(result.rothAfterTax).toBeCloseTo(10_776.83, 1);
    expect(result.winner).toBe("tie");
    expect(result.difference).toBeCloseTo(0, 2);
  });

  it("favours the traditional IRA when retirement tax is lower", () => {
    const result = calculateIra({ ...base, retirementTaxRatePct: 12 });
    expect(result.traditionalAfterTax).toBeCloseTo(12_158.47, 1);
    expect(result.rothAfterTax).toBeCloseTo(10_776.83, 1);
    expect(result.winner).toBe("traditional");
    expect(result.difference).toBeCloseTo(1_381.64, 1);
  });

  it("favours the Roth IRA when the current tax rate is lower", () => {
    const result = calculateIra({ ...base, currentMarginalTaxRatePct: 12 });
    expect(result.rothAfterTax).toBeCloseTo(12_158.47, 1);
    expect(result.traditionalAfterTax).toBeCloseTo(10_776.83, 1);
    expect(result.winner).toBe("roth");
  });

  it("shows the Roth advantage from tax-free growth at a 0% return", () => {
    const result = calculateIra({
      ...base,
      annualContribution: 6_000,
      retirementTaxRatePct: 25,
      currentMarginalTaxRatePct: 20,
      annualReturnPct: 0,
    });
    // Traditional: 6,000 * 10 * 0.75 = 45,000. Roth: 6,000 * 0.8 * 10 = 48,000.
    expect(result.traditionalAfterTax).toBe(45_000);
    expect(result.rothAfterTax).toBe(48_000);
    expect(result.winner).toBe("roth");
    expect(result.difference).toBe(3_000);
  });

  it("returns a zero tie when nothing is contributed", () => {
    const result = calculateIra({ ...base, annualContribution: 0 });
    expect(result.traditionalAfterTax).toBe(0);
    expect(result.rothAfterTax).toBe(0);
    expect(result.winner).toBe("tie");
  });

  it("clamps a negative contribution to zero and never returns NaN", () => {
    const result = calculateIra({ ...base, annualContribution: -5_000 });
    expect(result.grossContribution).toBe(0);
    expect(Number.isFinite(result.traditionalAfterTax)).toBe(true);
    expect(result.traditionalAfterTax).toBe(0);
  });

  it("survives NaN inputs and a negative horizon", () => {
    const result = calculateIra({
      currentAge: 50,
      retirementAge: 40,
      annualContribution: Number.NaN,
      currentMarginalTaxRatePct: Number.NaN,
      retirementTaxRatePct: Number.NaN,
      annualReturnPct: Number.NaN,
    });
    expect(result.years).toBe(0);
    expect(Number.isFinite(result.traditionalAfterTax)).toBe(true);
    expect(Number.isFinite(result.rothAfterTax)).toBe(true);
  });

  it("stays finite on very large inputs", () => {
    const result = calculateIra({
      currentAge: 20,
      retirementAge: 70,
      annualContribution: 7_500,
      currentMarginalTaxRatePct: 37,
      retirementTaxRatePct: 10,
      annualReturnPct: 9,
    });
    expect(Number.isFinite(result.traditionalAfterTax)).toBe(true);
    expect(Number.isFinite(result.rothAfterTax)).toBe(true);
    expect(result.winner).toBe("traditional");
  });
});
