import { describe, expect, it } from "vitest";
import { calculateHourly, salaryToHourly } from "./hourly";

describe("calculateHourly", () => {
  it("converts a typical hourly rate to salary, weekly and monthly pay", () => {
    const r = calculateHourly({ hourlyRate: 25 });
    // 25 × 40 × 52 = 52,000
    expect(r.annualSalary).toBeCloseTo(52_000, 2);
    expect(r.monthlyPay).toBeCloseTo(4_333.33, 2);
    expect(r.biweeklyPay).toBeCloseTo(2_000, 2);
    expect(r.weeklyPay).toBeCloseTo(1_000, 2);
    expect(r.dailyPay).toBeCloseTo(200, 2);
    expect(r.annualHours).toBe(2_080);
    expect(r.effectiveHourlyRate).toBeCloseTo(25, 6);
    expect(r.annualOvertimePay).toBe(0);
  });

  it("adds overtime pay at the given multiplier", () => {
    const r = calculateHourly({
      hourlyRate: 20,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      overtimeHoursPerWeek: 10,
      overtimeMultiplier: 1.5,
    });
    // Weekly: 800 base + 10 × 20 × 1.5 = 300 overtime = 1,100. Annual: 1,100 × 52 = 57,200
    expect(r.weeklyPay).toBeCloseTo(1_100, 2);
    expect(r.annualSalary).toBeCloseTo(57_200, 2);
    expect(r.annualOvertimePay).toBeCloseTo(15_600, 2);
    // Effective rate = 57,200 / (50 × 52) = 22
    expect(r.annualHours).toBe(2_600);
    expect(r.effectiveHourlyRate).toBeCloseTo(22, 6);
    expect(r.dailyPay).toBeCloseTo(220, 2);
  });

  it("returns all zeros for a zero hourly rate", () => {
    const r = calculateHourly({ hourlyRate: 0 });
    expect(r.annualSalary).toBe(0);
    expect(r.monthlyPay).toBe(0);
    expect(r.dailyPay).toBe(0);
    expect(r.effectiveHourlyRate).toBe(0);
  });

  it("clamps negative inputs to zero", () => {
    const r = calculateHourly({ hourlyRate: -30, hoursPerWeek: -10, overtimeHoursPerWeek: -5 });
    expect(r.annualSalary).toBe(0);
    expect(r.effectiveHourlyRate).toBe(0);
    expect(Number.isFinite(r.annualSalary)).toBe(true);
  });

  it("survives NaN / empty inputs without rendering NaN", () => {
    const r = calculateHourly({
      hourlyRate: Number.NaN,
      hoursPerWeek: Number.NaN,
      weeksPerYear: Number.NaN,
      overtimeHoursPerWeek: Number.NaN,
      overtimeMultiplier: Number.NaN,
    });
    expect(Number.isFinite(r.annualSalary)).toBe(true);
    expect(Number.isFinite(r.effectiveHourlyRate)).toBe(true);
    expect(r.annualSalary).toBe(0);
    expect(r.effectiveHourlyRate).toBe(0);
  });

  it("handles a very large hourly rate", () => {
    const r = calculateHourly({ hourlyRate: 1_000_000, hoursPerWeek: 168, weeksPerYear: 52 });
    expect(Number.isFinite(r.annualSalary)).toBe(true);
    // 1,000,000 × 168 × 52 = 8,736,000,000
    expect(r.annualSalary).toBeCloseTo(8_736_000_000, 0);
    expect(r.effectiveHourlyRate).toBeCloseTo(1_000_000, 0);
  });

  it("never divides by zero when the work year has no weeks", () => {
    const r = calculateHourly({ hourlyRate: 30, weeksPerYear: 0 });
    expect(r.annualSalary).toBe(0);
    expect(r.weeklyPay).toBe(0);
    expect(Number.isNaN(r.weeklyPay)).toBe(false);
    expect(Number.isFinite(r.effectiveHourlyRate)).toBe(true);
  });

  it("returns a finite effective rate when no hours are worked", () => {
    const r = calculateHourly({ hourlyRate: 30, hoursPerWeek: 0 });
    expect(r.effectiveHourlyRate).toBe(0);
    expect(Number.isFinite(r.effectiveHourlyRate)).toBe(true);
  });
});

describe("salaryToHourly", () => {
  it("is the inverse of calculateHourly for a standard work year", () => {
    expect(salaryToHourly(52_000, 40, 52)).toBeCloseTo(25, 6);
    expect(salaryToHourly(100_000, 40, 50)).toBeCloseTo(50, 6);
  });

  it("returns 0 for a zero salary or a zero-hours work year", () => {
    expect(salaryToHourly(0, 40, 52)).toBe(0);
    expect(salaryToHourly(52_000, 0, 52)).toBe(0);
    expect(salaryToHourly(52_000, 40, 0)).toBe(0);
    expect(salaryToHourly(Number.NaN, Number.NaN, Number.NaN)).toBe(0);
  });
});
