import { describe, expect, it } from "vitest";
import { calculateCreditCard, MAX_MONTHS } from "./creditCard";
import { monthlyPayment, round2 } from "./mortgage";

describe("calculateCreditCard", () => {
  it("simulates months to payoff at a fixed payment", () => {
    const r = calculateCreditCard({ balance: 5_000, aprPct: 24, monthlyPayment: 200 });
    const expected = Math.ceil(Math.log(200 / (200 - 5_000 * (0.24 / 12))) / Math.log(1 + 0.24 / 12));
    expect(Math.abs(r.months - expected)).toBeLessThanOrEqual(1);
    expect(r.totalPaid).toBeGreaterThan(5_000);
    expect(r.totalInterest).toBeGreaterThan(0);
    expect(r.minimumPaymentWarning).toBe(false);
    expect(r.fromTarget).toBe(false);
  });

  it("solves for the payment needed to clear a balance in a target time", () => {
    const r = calculateCreditCard({ balance: 5_000, aprPct: 24, targetMonths: 24 });
    expect(r.fromTarget).toBe(true);
    expect(r.months).toBe(24);
    expect(r.payment).toBeCloseTo(round2(monthlyPayment(5_000, 24, 24)), 2);
    expect(r.totalInterest).toBeCloseTo(round2(monthlyPayment(5_000, 24, 24) * 24 - 5_000), 1);
    expect(r.minimumPaymentWarning).toBe(false);
  });

  it("computes a one-month payment equal to the balance plus one month of interest", () => {
    const r = calculateCreditCard({ balance: 1_000, aprPct: 12, targetMonths: 1 });
    expect(r.payment).toBeCloseTo(1_010, 2);
    expect(r.months).toBe(1);
  });

  it("warns when the payment does not cover the monthly interest", () => {
    const r = calculateCreditCard({ balance: 1_000, aprPct: 24, monthlyPayment: 20 });
    expect(r.minimumPaymentWarning).toBe(true);
    expect(r.capped).toBe(true);
    expect(r.months).toBe(MAX_MONTHS);
  });

  it("returns a zero result for a zero balance", () => {
    const r = calculateCreditCard({ balance: 0, aprPct: 20, monthlyPayment: 100 });
    expect(r.months).toBe(0);
    expect(r.totalInterest).toBe(0);
    expect(r.totalPaid).toBe(0);
  });

  it("handles zero APR as a simple division", () => {
    const r = calculateCreditCard({ balance: 1_200, aprPct: 0, monthlyPayment: 100 });
    expect(r.months).toBe(12);
    expect(r.totalInterest).toBe(0);
  });

  it("never returns NaN for malformed input", () => {
    const r = calculateCreditCard({
      balance: Number.NaN,
      aprPct: Number.POSITIVE_INFINITY,
      monthlyPayment: Number.NaN,
    });
    expect(Number.isFinite(r.months)).toBe(true);
    expect(Number.isFinite(r.totalPaid)).toBe(true);
  });

  it("stays finite for a very large balance", () => {
    const r = calculateCreditCard({ balance: 1_000_000, aprPct: 29.99, monthlyPayment: 20_000 });
    expect(Number.isFinite(r.totalInterest)).toBe(true);
    expect(Number.isFinite(r.totalPaid)).toBe(true);
    expect(r.months).toBeGreaterThan(0);
  });
});
