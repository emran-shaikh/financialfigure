import { describe, expect, it } from "vitest";
import { calculateRentVsBuy } from "./rentVsBuy";
import { monthlyPayment } from "./mortgage";

describe("calculateRentVsBuy", () => {
  it("nets to zero when a zero-rate loan is fully repaid and the home does not move", () => {
    // $300k home, $60k down, 0% over 30 years, sold after 30 years for the same
    // price: down payment + payments = $300k = sale price, so cost is zero.
    const r = calculateRentVsBuy({
      homePrice: 300_000,
      downPayment: 60_000,
      ratePct: 0,
      termYears: 30,
      monthlyRent: 1_500,
      rentGrowthPct: 0,
      appreciationPct: 0,
      propertyTaxRatePct: 0,
      maintenancePct: 0,
      annualInsurance: 0,
      yearsToStay: 30,
      purchaseClosingCostPct: 0,
      sellingCostPct: 0,
    });

    expect(r.loanAmount).toBe(240_000);
    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(666.67, 2);
    expect(r.remainingLoanBalance).toBe(0);
    // Summing the rounded monthly rows leaves a sub-dollar rounding residue.
    expect(Math.abs(r.totalBuyingCost)).toBeLessThan(5);
    expect(r.totalRentingCost).toBeCloseTo(540_000, 2);
    expect(r.difference).toBeLessThan(-539_000);
    expect(r.cheaperOption).toBe("buy");
  });

  it("reports the same monthly P&I as the mortgage engine", () => {
    const r = calculateRentVsBuy({
      homePrice: 400_000,
      downPayment: 80_000,
      ratePct: 6.5,
      termYears: 30,
      monthlyRent: 2_000,
      rentGrowthPct: 3,
      appreciationPct: 3,
      propertyTaxRatePct: 1.2,
      maintenancePct: 1,
      annualInsurance: 1_800,
      yearsToStay: 7,
      purchaseClosingCostPct: 2,
      sellingCostPct: 6,
    });

    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(monthlyPayment(320_000, 6.5, 360), 2);
    expect(r.monthlyOwnershipCost).toBeGreaterThan(r.monthlyPrincipalAndInterest);
  });

  it("favours renting over a short hold with heavy transaction costs", () => {
    const r = calculateRentVsBuy({
      homePrice: 500_000,
      downPayment: 100_000,
      ratePct: 6,
      termYears: 30,
      monthlyRent: 1_000,
      rentGrowthPct: 3,
      appreciationPct: 0,
      propertyTaxRatePct: 1.2,
      maintenancePct: 1,
      annualInsurance: 1_500,
      yearsToStay: 2,
      purchaseClosingCostPct: 3,
      sellingCostPct: 6,
    });

    expect(r.cheaperOption).toBe("rent");
    expect(r.difference).toBeGreaterThan(0);
    expect(r.totalBuyingCost).toBeGreaterThan(r.totalRentingCost);
  });

  it("favours buying over a long hold with strong rent growth and appreciation", () => {
    const r = calculateRentVsBuy({
      homePrice: 400_000,
      downPayment: 80_000,
      ratePct: 5,
      termYears: 30,
      monthlyRent: 3_000,
      rentGrowthPct: 5,
      appreciationPct: 5,
      propertyTaxRatePct: 1,
      maintenancePct: 1,
      annualInsurance: 1_800,
      yearsToStay: 10,
      purchaseClosingCostPct: 1,
      sellingCostPct: 6,
    });

    expect(r.cheaperOption).toBe("buy");
    expect(r.difference).toBeLessThan(0);
    expect(r.homeValueAtSale).toBeGreaterThan(400_000);
  });

  it("compounds home appreciation correctly", () => {
    const r = calculateRentVsBuy({
      homePrice: 400_000,
      downPayment: 80_000,
      ratePct: 5,
      termYears: 30,
      monthlyRent: 2_000,
      rentGrowthPct: 0,
      appreciationPct: 3,
      propertyTaxRatePct: 0,
      maintenancePct: 0,
      annualInsurance: 0,
      yearsToStay: 10,
      purchaseClosingCostPct: 0,
      sellingCostPct: 0,
    });

    // 400,000 * 1.03^10 = 537,566.6
    expect(r.homeValueAtSale).toBeCloseTo(537_566.6, 0);
  });

  it("grows rent once a year", () => {
    const r = calculateRentVsBuy({
      homePrice: 400_000,
      downPayment: 80_000,
      ratePct: 5,
      termYears: 30,
      monthlyRent: 1_000,
      rentGrowthPct: 5,
      appreciationPct: 0,
      propertyTaxRatePct: 0,
      maintenancePct: 0,
      annualInsurance: 0,
      yearsToStay: 2,
      purchaseClosingCostPct: 0,
      sellingCostPct: 0,
    });

    // Year 1: 12,000; year 2: 12,600; total 24,600.
    expect(r.totalRentingCost).toBeCloseTo(24_600, 2);
  });

  it("returns a zero-cost tie for a zero holding period", () => {
    const r = calculateRentVsBuy({
      homePrice: 300_000,
      downPayment: 60_000,
      ratePct: 6,
      termYears: 30,
      monthlyRent: 1_500,
      rentGrowthPct: 3,
      appreciationPct: 3,
      propertyTaxRatePct: 1,
      maintenancePct: 1,
      annualInsurance: 1_200,
      yearsToStay: 0,
      purchaseClosingCostPct: 0,
      sellingCostPct: 0,
    });

    expect(r.totalBuyingCost).toBeCloseTo(0, 2);
    expect(r.totalRentingCost).toBeCloseTo(0, 2);
    expect(r.difference).toBeCloseTo(0, 2);
    expect(r.cheaperOption).toBe("buy");
  });

  it("survives negatives, NaN and very large inputs without NaN or Infinity", () => {
    const bad = calculateRentVsBuy({
      homePrice: -400_000,
      downPayment: -80_000,
      ratePct: Number.NaN,
      termYears: -30,
      monthlyRent: -2_000,
      rentGrowthPct: -200,
      appreciationPct: -200,
      propertyTaxRatePct: -1,
      maintenancePct: -1,
      annualInsurance: -1_800,
      yearsToStay: -7,
      purchaseClosingCostPct: -2,
      sellingCostPct: -6,
    });
    for (const value of Object.values(bad)) {
      if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
    }

    const big = calculateRentVsBuy({
      homePrice: 500_000_000_000,
      downPayment: 50_000_000_000,
      ratePct: 6,
      termYears: 30,
      monthlyRent: 1_000_000,
      rentGrowthPct: 4,
      appreciationPct: 4,
      propertyTaxRatePct: 1,
      maintenancePct: 1,
      annualInsurance: 5_000_000,
      yearsToStay: 90,
      purchaseClosingCostPct: 3,
      sellingCostPct: 6,
    });
    for (const value of Object.values(big)) {
      if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
    }
  });
});
