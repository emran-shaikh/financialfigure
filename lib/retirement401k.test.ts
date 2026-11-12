import { describe, expect, it } from "vitest";
import { calculate401k } from "./retirement401k";
import { RETIREMENT_2026, deferralLimitForAge } from "./data/retirement2026";

describe("deferralLimitForAge", () => {
  it("uses the plain 2026 elective deferral limit below age 50", () => {
    expect(deferralLimitForAge(40)).toBe(RETIREMENT_2026.deferral401k.electiveDeferralLimit);
    expect(deferralLimitForAge(40)).toBe(24_500);
  });

  it("adds the age-50 catch-up from 50 to 59", () => {
    expect(deferralLimitForAge(50)).toBe(32_500);
    expect(deferralLimitForAge(59)).toBe(32_500);
  });

  it("adds the higher 60–63 super catch-up for ages 60 to 63", () => {
    expect(deferralLimitForAge(60)).toBe(35_750);
    expect(deferralLimitForAge(63)).toBe(35_750);
    expect(deferralLimitForAge(64)).toBe(32_500);
  });
});

describe("calculate401k", () => {
  it("projects one year of employee and employer contributions", () => {
    const result = calculate401k({
      currentAge: 30,
      retirementAge: 31,
      currentBalance: 0,
      annualSalary: 100_000,
      contributionPct: 10,
      employerMatchPct: 50,
      employerMatchCapPctOfSalary: 6,
      annualRaisePct: 0,
      annualReturnPct: 0,
    });
    // Employee 10% = $10,000; match = 6% * 50% * $100,000 = $3,000.
    expect(result.years).toBe(1);
    expect(result.totalEmployeeContributions).toBe(10_000);
    expect(result.totalEmployerMatch).toBe(3_000);
    expect(result.projectedBalance).toBe(13_000);
    expect(result.totalGrowth).toBe(0);
  });

  it("applies the annual return to contributions", () => {
    const result = calculate401k({
      currentAge: 30,
      retirementAge: 31,
      currentBalance: 0,
      annualSalary: 100_000,
      contributionPct: 10,
      employerMatchPct: 50,
      employerMatchCapPctOfSalary: 6,
      annualRaisePct: 0,
      annualReturnPct: 10,
    });
    expect(result.projectedBalance).toBe(14_300);
    expect(result.totalGrowth).toBe(1_300);
  });

  it("compounds across two plan years", () => {
    const result = calculate401k({
      currentAge: 30,
      retirementAge: 32,
      currentBalance: 0,
      annualSalary: 100_000,
      contributionPct: 10,
      employerMatchPct: 50,
      employerMatchCapPctOfSalary: 6,
      annualRaisePct: 0,
      annualReturnPct: 10,
    });
    expect(result.years).toBe(2);
    expect(result.totalEmployeeContributions).toBe(20_000);
    expect(result.totalEmployerMatch).toBe(6_000);
    expect(result.projectedBalance).toBe(30_030);
    expect(result.totalGrowth).toBe(4_030);
  });

  it("caps the deferral at the age-50 catch-up limit", () => {
    const result = calculate401k({
      currentAge: 50,
      retirementAge: 51,
      currentBalance: 0,
      annualSalary: 200_000,
      contributionPct: 20,
      employerMatchPct: 0,
      employerMatchCapPctOfSalary: 0,
      annualRaisePct: 0,
      annualReturnPct: 0,
    });
    expect(result.totalEmployeeContributions).toBe(32_500);
  });

  it("caps the deferral at the higher 60–63 super catch-up limit", () => {
    const result = calculate401k({
      currentAge: 60,
      retirementAge: 61,
      currentBalance: 0,
      annualSalary: 200_000,
      contributionPct: 20,
      employerMatchPct: 0,
      employerMatchCapPctOfSalary: 0,
      annualRaisePct: 0,
      annualReturnPct: 0,
    });
    expect(result.totalEmployeeContributions).toBe(35_750);
  });

  it("limits the match to the cap percentage of salary", () => {
    const result = calculate401k({
      currentAge: 30,
      retirementAge: 31,
      currentBalance: 0,
      annualSalary: 100_000,
      contributionPct: 3,
      employerMatchPct: 50,
      employerMatchCapPctOfSalary: 6,
      annualRaisePct: 0,
      annualReturnPct: 0,
    });
    // 3% deferral * 50% match = $1,500 even though the cap allows 6%.
    expect(result.totalEmployerMatch).toBe(1_500);
  });

  it("grows salary with the annual raise in the schedule", () => {
    const result = calculate401k({
      currentAge: 30,
      retirementAge: 32,
      currentBalance: 0,
      annualSalary: 100_000,
      contributionPct: 10,
      employerMatchPct: 0,
      employerMatchCapPctOfSalary: 0,
      annualRaisePct: 10,
      annualReturnPct: 0,
    });
    expect(result.schedule[0].salary).toBe(100_000);
    expect(result.schedule[1].salary).toBe(110_000);
  });

  it("survives zeros, inverted ages, negatives and NaN", () => {
    const degenerate = calculate401k({
      currentAge: 65,
      retirementAge: 60,
      currentBalance: Number.NaN,
      annualSalary: Number.NaN,
      contributionPct: -5,
      employerMatchPct: Number.NaN,
      employerMatchCapPctOfSalary: -1,
      annualRaisePct: Number.NaN,
      annualReturnPct: Number.NaN,
    });
    expect(degenerate.years).toBe(0);
    expect(degenerate.projectedBalance).toBe(0);
    expect(degenerate.schedule).toHaveLength(0);
    expect(Number.isFinite(degenerate.totalGrowth)).toBe(true);
  });

  it("stays finite on very large inputs over a long horizon", () => {
    const result = calculate401k({
      currentAge: 25,
      retirementAge: 70,
      currentBalance: 1_000_000,
      annualSalary: 500_000,
      contributionPct: 20,
      employerMatchPct: 100,
      employerMatchCapPctOfSalary: 10,
      annualRaisePct: 4,
      annualReturnPct: 8,
    });
    expect(Number.isFinite(result.projectedBalance)).toBe(true);
    expect(result.schedule).toHaveLength(45);
    expect(result.projectedBalance).toBeGreaterThan(0);
  });
});
