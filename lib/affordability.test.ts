import { describe, expect, it } from "vitest";
import { calculateAffordability } from "./affordability";
import { monthlyPayment } from "./mortgage";

describe("calculateAffordability", () => {
  it("uses the front-end cap when it is the binding constraint", () => {
    // $120k income -> $10k/month. 28% front-end = $2,800; 36% back-end minus
    // $500 of debts = $3,100, so the $2,800 front-end cap wins.
    const r = calculateAffordability({
      annualIncome: 120_000,
      monthlyDebts: 500,
      downPayment: 60_000,
      annualRatePct: 6.5,
      termYears: 30,
      propertyTaxRatePct: 0,
      annualInsurance: 1_800,
      monthlyHoa: 0,
    });

    expect(r.grossMonthlyIncome).toBeCloseTo(10_000, 6);
    expect(r.frontEndCap).toBeCloseTo(2_800, 6);
    expect(r.backEndCap).toBeCloseTo(3_100, 6);
    expect(r.maxHousingBudget).toBeCloseTo(2_800, 6);
    // Insurance $1,800/yr = $150/mo, so the P&I budget is $2,650.
    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(monthlyPayment(r.maxLoanAmount, 6.5, 360), 2);
    expect(monthlyPayment(r.maxLoanAmount, 6.5, 360)).toBeCloseTo(2_650, 2);
    expect(r.maxHomePrice).toBeCloseTo(r.maxLoanAmount + 60_000, 2);
  });

  it("uses the back-end cap when existing debts are large", () => {
    const r = calculateAffordability({
      annualIncome: 120_000,
      monthlyDebts: 2_500,
      downPayment: 20_000,
      annualRatePct: 6,
      termYears: 30,
      propertyTaxRatePct: 0,
      annualInsurance: 0,
      monthlyHoa: 0,
    });

    // 36% of $10k = $3,600 minus $2,500 debts = $1,100, below the 28% cap.
    expect(r.backEndCap).toBeCloseTo(1_100, 6);
    expect(r.maxHousingBudget).toBeCloseTo(1_100, 6);
  });

  it("keeps PITI + HOA within the housing budget when property tax is included", () => {
    const r = calculateAffordability({
      annualIncome: 120_000,
      monthlyDebts: 500,
      downPayment: 60_000,
      annualRatePct: 6.5,
      termYears: 30,
      propertyTaxRatePct: 1.2,
      annualInsurance: 1_800,
      monthlyHoa: 50,
    });

    expect(r.maxHomePrice).toBeGreaterThan(0);
    expect(r.monthlyPropertyTax).toBeGreaterThan(0);
    expect(r.monthlyTotalAtMax).toBeCloseTo(r.maxHousingBudget, 0);
  });

  it("returns zeros for a zero-income household but still shows the down payment", () => {
    const r = calculateAffordability({
      annualIncome: 0,
      monthlyDebts: 0,
      downPayment: 25_000,
      annualRatePct: 6,
      termYears: 30,
      propertyTaxRatePct: 1,
      annualInsurance: 1_200,
      monthlyHoa: 0,
    });

    expect(r.maxLoanAmount).toBe(0);
    expect(r.maxHomePrice).toBe(25_000);
    expect(r.maxHousingBudget).toBe(0);
  });

  it("survives negative income and debts without returning NaN or Infinity", () => {
    const r = calculateAffordability({
      annualIncome: -50_000,
      monthlyDebts: -200,
      downPayment: 10_000,
      annualRatePct: -3,
      termYears: 30,
      propertyTaxRatePct: -1,
      annualInsurance: -500,
      monthlyHoa: -20,
    });

    for (const value of Object.values(r)) {
      expect(Number.isFinite(value)).toBe(true);
    }
    expect(r.maxHousingBudget).toBe(0);
  });

  it("handles NaN inputs and very large incomes safely", () => {
    const nan = calculateAffordability({
      annualIncome: Number.NaN,
      monthlyDebts: Number.NaN,
      downPayment: Number.NaN,
      annualRatePct: Number.NaN,
      termYears: Number.NaN,
      propertyTaxRatePct: Number.NaN,
      annualInsurance: Number.NaN,
      monthlyHoa: Number.NaN,
    });
    for (const value of Object.values(nan)) {
      expect(Number.isFinite(value)).toBe(true);
    }

    const big = calculateAffordability({
      annualIncome: 5_000_000_000,
      monthlyDebts: 0,
      downPayment: 1_000_000,
      annualRatePct: 6,
      termYears: 30,
      propertyTaxRatePct: 1,
      annualInsurance: 2_000,
      monthlyHoa: 100,
    });
    expect(Number.isFinite(big.maxHomePrice)).toBe(true);
    expect(big.maxHomePrice).toBeGreaterThan(1_000_000);
  });
});
