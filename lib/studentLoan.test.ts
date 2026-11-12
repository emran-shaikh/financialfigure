import { describe, expect, it } from "vitest";
import { calculateStudentLoan, MAX_MONTHS } from "./studentLoan";

describe("calculateStudentLoan", () => {
  it("computes the scheduled payment and shortens the term with extra payments", () => {
    const base = calculateStudentLoan({ balance: 30_000, annualRatePct: 6, termMonths: 120 });
    const extra = calculateStudentLoan({
      balance: 30_000,
      annualRatePct: 6,
      termMonths: 120,
      extraMonthly: 100,
    });

    expect(base.scheduledPayment).toBeCloseTo(333.06, 1);
    expect(base.months).toBeGreaterThanOrEqual(119);
    expect(base.months).toBeLessThanOrEqual(120);
    expect(extra.months).toBeLessThan(base.months);
    expect(extra.totalInterest).toBeLessThan(base.totalInterest);
    expect(extra.interestSaved).toBeGreaterThan(0);
    expect(extra.monthsSaved).toBeGreaterThan(0);
  });

  it("returns a zero-month result for a zero balance", () => {
    const r = calculateStudentLoan({ balance: 0, annualRatePct: 6, termMonths: 120 });
    expect(r.months).toBe(0);
    expect(r.totalInterest).toBe(0);
    expect(r.totalPaid).toBe(0);
    expect(Number.isFinite(r.scheduledPayment)).toBe(true);
  });

  it("flags a payment that cannot cover the monthly interest", () => {
    const r = calculateStudentLoan({
      balance: 10_000,
      annualRatePct: 24,
      termMonths: 60,
      monthlyPayment: 100,
    });
    expect(r.neverPaysOff).toBe(true);
    expect(r.capped).toBe(true);
    expect(r.payoffDate).toBeNull();
    expect(r.months).toBe(MAX_MONTHS);
  });

  it("projects the payoff date from a supplied start date", () => {
    const r = calculateStudentLoan({
      balance: 1_200,
      annualRatePct: 0,
      termMonths: 12,
      startDate: new Date(Date.UTC(2026, 0, 1)),
    });
    expect(r.months).toBe(12);
    expect(r.payoffDate).toBe("2027-01-01");
  });

  it("pays off in half the time with a doubled payment at zero interest", () => {
    const base = calculateStudentLoan({ balance: 12_000, annualRatePct: 0, termMonths: 24 });
    const extra = calculateStudentLoan({
      balance: 12_000,
      annualRatePct: 0,
      termMonths: 24,
      extraMonthly: 500,
    });
    expect(base.months).toBe(24);
    expect(extra.months).toBe(12);
  });

  it("never returns NaN for malformed input", () => {
    const r = calculateStudentLoan({
      balance: Number.NaN,
      annualRatePct: Number.POSITIVE_INFINITY,
      termMonths: -10,
      extraMonthly: -50,
    });
    expect(Number.isFinite(r.scheduledPayment)).toBe(true);
    expect(Number.isFinite(r.months)).toBe(true);
    expect(Number.isFinite(r.totalInterest)).toBe(true);
  });

  it("stays finite for a very large balance", () => {
    const r = calculateStudentLoan({
      balance: 10_000_000,
      annualRatePct: 7,
      termMonths: 360,
      extraMonthly: 500,
    });
    expect(Number.isFinite(r.totalInterest)).toBe(true);
    expect(Number.isFinite(r.totalPaid)).toBe(true);
    expect(r.months).toBeLessThanOrEqual(360);
    expect(r.monthsSaved).toBeGreaterThanOrEqual(0);
  });
});
