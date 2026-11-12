import { describe, expect, it } from "vitest";
import {
  affordableLoan,
  amortization,
  calculateMortgage,
  monthlyPayment,
  round2,
} from "./mortgage";

describe("monthlyPayment", () => {
  it("matches the standard amortisation formula for a 30-year loan", () => {
    // $300,000 at 6% for 30 years = $1,798.65 / month.
    expect(monthlyPayment(300_000, 6, 360)).toBeCloseTo(1798.65, 2);
  });

  it("matches the formula for a 15-year loan", () => {
    // $200,000 at 5.5% for 15 years = $1,634.17 / month.
    expect(monthlyPayment(200_000, 5.5, 180)).toBeCloseTo(1634.17, 2);
  });

  it("handles a zero interest rate as principal / months", () => {
    expect(monthlyPayment(120_000, 0, 240)).toBeCloseTo(500, 6);
  });

  it("returns 0 for degenerate inputs", () => {
    expect(monthlyPayment(0, 6, 360)).toBe(0);
    expect(monthlyPayment(-5_000, 6, 360)).toBe(0);
    expect(monthlyPayment(100_000, 6, 0)).toBe(0);
    expect(monthlyPayment(Number.NaN, 6, 360)).toBe(0);
  });
});

describe("amortization", () => {
  it("produces one row per month and pays the loan off", () => {
    const result = amortization({ principal: 300_000, annualRatePct: 6, months: 360 });
    expect(result.rows).toHaveLength(360);
    expect(result.rows[result.rows.length - 1].balance).toBeCloseTo(0, 1);
  });

  it("sums to the expected total interest for $300k at 6% over 30 years", () => {
    const result = amortization({ principal: 300_000, annualRatePct: 6, months: 360 });
    // 1798.65 * 360 - 300000 ≈ 347,514.57
    expect(Math.abs(result.totalInterest - 347_514.57)).toBeLessThan(1);
  });

  it("splits each payment into principal and interest that sum to the payment", () => {
    const result = amortization({ principal: 100_000, annualRatePct: 5, months: 120 });
    for (const row of result.rows) {
      expect(round2(row.principal + row.interest)).toBeCloseTo(row.payment, 1);
    }
  });

  it("extra monthly payments shorten the term and cut interest", () => {
    const base = amortization({ principal: 300_000, annualRatePct: 6, months: 360 });
    const extra = amortization({
      principal: 300_000,
      annualRatePct: 6,
      months: 360,
      extraMonthly: 200,
    });
    expect(extra.monthsWithExtras).toBeLessThan(base.monthsWithExtras);
    expect(extra.totalInterest).toBeLessThan(base.totalInterest);
    expect(extra.monthsSaved).toBeGreaterThan(0);
    expect(extra.interestSaved).toBeGreaterThan(0);
  });

  it("a yearly lump sum also reduces the term", () => {
    const extra = amortization({
      principal: 300_000,
      annualRatePct: 6,
      months: 360,
      extraYearly: 2_000,
    });
    expect(extra.monthsWithExtras).toBeLessThan(360);
  });

  it("never loops forever or returns NaN on bad input", () => {
    const result = amortization({
      principal: Number.NaN,
      annualRatePct: Number.POSITIVE_INFINITY,
      months: -10,
    });
    expect(result.rows).toHaveLength(0);
    expect(result.totalInterest).toBe(0);
    expect(Number.isNaN(result.totalPaid)).toBe(false);
  });
});

describe("calculateMortgage", () => {
  it("computes loan amount, PITI and totals", () => {
    const result = calculateMortgage({
      homePrice: 400_000,
      downPayment: 80_000,
      annualRatePct: 6.5,
      termYears: 30,
      propertyTaxRatePct: 1.2,
      annualInsurance: 1_800,
      monthlyHoa: 50,
      pmiRatePct: 0.5,
    });

    expect(result.loanAmount).toBe(320_000);
    expect(result.downPaymentPct).toBeCloseTo(0.2, 6);
    expect(result.monthlyPrincipalAndInterest).toBeCloseTo(2022.62, 1);
    expect(result.monthlyPropertyTax).toBeCloseTo(400, 1);
    expect(result.monthlyInsurance).toBeCloseTo(150, 1);
    expect(result.monthlyHoa).toBe(50);
    // PMI: 320,000 * 0.5% / 12 = 133.33
    expect(result.monthlyPmi).toBeCloseTo(133.33, 2);
    expect(result.months).toBe(360);
    expect(result.monthlyTotal).toBeGreaterThan(result.monthlyPrincipalAndInterest);
    expect(result.totalOfPayments).toBeGreaterThan(320_000);
  });

  it("never returns a negative loan amount when the down payment exceeds the price", () => {
    const result = calculateMortgage({
      homePrice: 200_000,
      downPayment: 500_000,
      annualRatePct: 5,
      termYears: 30,
    });
    expect(result.loanAmount).toBe(0);
    expect(result.monthlyTotal).toBe(0);
  });

  it("survives zeros and negative values", () => {
    const result = calculateMortgage({
      homePrice: 0,
      downPayment: 0,
      annualRatePct: 0,
      termYears: 30,
    });
    expect(result.monthlyTotal).toBe(0);
    expect(Number.isFinite(result.totalInterest)).toBe(true);
  });
});

describe("affordableLoan", () => {
  it("is the inverse of monthlyPayment", () => {
    const principal = affordableLoan(1_800, 6, 30);
    expect(monthlyPayment(principal, 6, 360)).toBeCloseTo(1_800, 2);
  });

  it("returns 0 for a zero budget and handles a zero rate", () => {
    expect(affordableLoan(0, 6, 30)).toBe(0);
    expect(affordableLoan(1_000, 0, 10)).toBeCloseTo(120_000, 6);
  });
});
