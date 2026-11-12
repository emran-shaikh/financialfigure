import { describe, expect, it } from "vitest";
import { calculateAutoLoan } from "./autoLoan";
import { monthlyPayment, round2 } from "./mortgage";

describe("calculateAutoLoan", () => {
  it("finances price minus down payment and trade-in, plus tax and fees", () => {
    const r = calculateAutoLoan({
      vehiclePrice: 30_000,
      downPayment: 5_000,
      tradeInValue: 0,
      salesTaxPct: 8,
      fees: 500,
      dealerFees: 300,
      annualRatePct: 6,
      termMonths: 60,
    });

    expect(r.taxableAmount).toBe(30_000);
    expect(r.salesTax).toBe(2_400);
    expect(r.amountFinanced).toBe(28_200);
    expect(r.monthlyPayment).toBeCloseTo(round2(monthlyPayment(28_200, 6, 60)), 2);
    expect(Math.abs(r.totalInterest - (r.monthlyPayment * 60 - 28_200))).toBeLessThan(1);
    expect(r.totalCost).toBeCloseTo(30_000 + 2_400 + 500 + 300 + r.totalInterest, 2);
    expect(r.termMonths).toBe(60);
  });

  it("charges sales tax only on the price after the trade-in", () => {
    const r = calculateAutoLoan({
      vehiclePrice: 40_000,
      downPayment: 0,
      tradeInValue: 10_000,
      salesTaxPct: 10,
      fees: 0,
      dealerFees: 0,
      annualRatePct: 0,
      termMonths: 48,
    });

    expect(r.taxableAmount).toBe(30_000);
    expect(r.salesTax).toBe(3_000);
    expect(r.amountFinanced).toBe(33_000);
    expect(r.monthlyPayment).toBeCloseTo(33_000 / 48, 2);
  });

  it("never returns a negative amount financed", () => {
    const r = calculateAutoLoan({
      vehiclePrice: 20_000,
      downPayment: 25_000,
      tradeInValue: 0,
      salesTaxPct: 6,
      fees: 0,
      dealerFees: 0,
      annualRatePct: 5,
      termMonths: 60,
    });

    expect(r.amountFinanced).toBe(0);
    expect(r.monthlyPayment).toBe(0);
    expect(r.totalInterest).toBe(0);
    expect(r.totalLoanPayments).toBe(0);
  });

  it("handles a zero term", () => {
    const r = calculateAutoLoan({
      vehiclePrice: 20_000,
      downPayment: 0,
      tradeInValue: 0,
      salesTaxPct: 0,
      fees: 0,
      dealerFees: 0,
      annualRatePct: 6,
      termMonths: 0,
    });

    expect(r.monthlyPayment).toBe(0);
    expect(r.totalInterest).toBe(0);
  });

  it("survives NaN and negative inputs without NaN output", () => {
    const r = calculateAutoLoan({
      vehiclePrice: Number.NaN,
      downPayment: -5_000,
      tradeInValue: -1,
      salesTaxPct: -3,
      fees: -100,
      dealerFees: -100,
      annualRatePct: Number.POSITIVE_INFINITY,
      termMonths: -12,
    });

    expect(r.amountFinanced).toBe(0);
    expect(Number.isFinite(r.monthlyPayment)).toBe(true);
    expect(Number.isFinite(r.totalCost)).toBe(true);
    expect(Number.isFinite(r.salesTax)).toBe(true);
  });

  it("stays finite for very large values", () => {
    const r = calculateAutoLoan({
      vehiclePrice: 5_000_000,
      downPayment: 100_000,
      tradeInValue: 0,
      salesTaxPct: 12,
      fees: 5_000,
      dealerFees: 2_000,
      annualRatePct: 9,
      termMonths: 84,
    });

    expect(r.amountFinanced).toBeGreaterThan(0);
    expect(Number.isFinite(r.monthlyPayment)).toBe(true);
    expect(Number.isFinite(r.totalInterest)).toBe(true);
    expect(Number.isFinite(r.totalCost)).toBe(true);
  });
});
