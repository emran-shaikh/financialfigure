import { describe, expect, it } from "vitest";
import { calculatePaycheck, stateBrackets, stateIncomeTax } from "./paycheck";
import { STATES_2026, getState } from "./states2026";
import { PAYROLL_2026 } from "./federal2026";

const TX = getState("texas")!;
const CA = getState("california")!;

describe("calculatePaycheck — federal layer", () => {
  it("computes federal tax, FICA and net pay for $75,000 in Texas", () => {
    const r = calculatePaycheck({
      grossAnnual: 75_000,
      filing: "single",
      preTaxAnnual: 0,
      periodsPerYear: 26,
      state: TX,
    });

    // Taxable = 75,000 - 16,100 standard deduction = 58,900
    expect(r.federalTaxable).toBe(58_900);
    // 1,240 + 4,560 + 1,870 = 7,670
    expect(r.federalIncomeTax).toBeCloseTo(7_670, 2);
    expect(r.socialSecurity).toBeCloseTo(4_650, 2);
    expect(r.medicare).toBeCloseTo(1_087.5, 2);
    expect(r.stateIncomeTax).toBe(0);
    expect(r.net).toBeCloseTo(61_592.5, 2);
    expect(r.perPeriodNet).toBeCloseTo(2_368.94, 2);
    expect(r.federalMarginalRate).toBe(22);
    expect(r.effectiveTotalRate).toBeCloseTo(13_407.5 / 75_000, 6);
  });

  it("caps Social Security at the 2026 wage base and adds Additional Medicare Tax", () => {
    const r = calculatePaycheck({
      grossAnnual: 300_000,
      filing: "single",
      preTaxAnnual: 0,
      periodsPerYear: 12,
      state: TX,
    });
    expect(r.socialSecurity).toBeCloseTo(PAYROLL_2026.socialSecurityWageBase * 0.062, 2);
    // 1.45% on all wages + 0.9% above $200,000
    expect(r.medicare).toBeCloseTo(300_000 * 0.0145 + 100_000 * 0.009, 2);
  });

  it("pre-tax deductions lower income tax but not payroll tax", () => {
    const without = calculatePaycheck({
      grossAnnual: 100_000,
      filing: "single",
      preTaxAnnual: 0,
      periodsPerYear: 26,
      state: TX,
    });
    const with401k = calculatePaycheck({
      grossAnnual: 100_000,
      filing: "single",
      preTaxAnnual: 20_000,
      periodsPerYear: 26,
      state: TX,
    });
    expect(with401k.federalIncomeTax).toBeLessThan(without.federalIncomeTax);
    expect(with401k.socialSecurity).toBe(without.socialSecurity);
    expect(with401k.medicare).toBe(without.medicare);
  });

  it("uses higher thresholds for married filing jointly", () => {
    const single = calculatePaycheck({
      grossAnnual: 120_000,
      filing: "single",
      preTaxAnnual: 0,
      periodsPerYear: 12,
      state: TX,
    });
    const married = calculatePaycheck({
      grossAnnual: 120_000,
      filing: "married",
      preTaxAnnual: 0,
      periodsPerYear: 12,
      state: TX,
    });
    expect(married.federalIncomeTax).toBeLessThan(single.federalIncomeTax);
  });
});

describe("calculatePaycheck — state layer", () => {
  it("applies California's graduated brackets after the state deduction", () => {
    const r = calculatePaycheck({
      grossAnnual: 75_000,
      filing: "single",
      preTaxAnnual: 0,
      periodsPerYear: 26,
      state: CA,
    });
    // 5,540 state standard deduction -> 69,460 taxable.
    // 110.79 + 303.70 + 607.52 + 965.40 + 953.44 = 2,940.85
    expect(r.stateIncomeTax).toBeCloseTo(2_940.85, 1);
    expect(r.net).toBeLessThan(61_592.5);
  });

  it("charges no state income tax in the nine no-tax states", () => {
    const noTax = STATES_2026.filter((s) => s.none);
    expect(noTax).toHaveLength(9);
    for (const state of noTax) {
      const r = calculatePaycheck({
        grossAnnual: 90_000,
        filing: "single",
        preTaxAnnual: 0,
        periodsPerYear: 26,
        state,
      });
      expect(r.stateIncomeTax).toBe(0);
    }
  });

  it("models a flat tax state as a single-rate schedule", () => {
    // Illinois is a flat 4.95% state in this dataset.
    const il = getState("illinois")!;
    const brackets = stateBrackets(il, "single")!;
    expect(brackets).toHaveLength(1);
    expect(brackets[0][1]).toBeCloseTo(4.95, 2);
  });
});

describe("stateIncomeTax — bracket mechanics", () => {
  it("returns 0 for empty, non-positive or non-finite input", () => {
    expect(stateIncomeTax(50_000, undefined)).toBe(0);
    expect(stateIncomeTax(50_000, [])).toBe(0);
    expect(stateIncomeTax(0, [[0, 5]])).toBe(0);
    expect(stateIncomeTax(-100, [[0, 5]])).toBe(0);
    expect(stateIncomeTax(Number.NaN, [[0, 5]])).toBe(0);
  });

  it("only taxes income above each threshold", () => {
    const brackets = [
      [0, 1],
      [10_000, 5],
    ] as [number, number][];
    expect(stateIncomeTax(10_000, brackets)).toBeCloseTo(100, 6);
    expect(stateIncomeTax(20_000, brackets)).toBeCloseTo(100 + 500, 6);
  });
});

describe("data integrity across all 51 jurisdictions", () => {
  it("has 51 entries with unique slugs", () => {
    expect(STATES_2026).toHaveLength(51);
    expect(new Set(STATES_2026.map((s) => s.slug)).size).toBe(51);
  });

  it("every taxable state has brackets that start at 0 and ascend", () => {
    for (const state of STATES_2026) {
      if (state.none) continue;
      const brackets = stateBrackets(state, "single");
      expect(brackets, `${state.name} is missing brackets`).toBeDefined();
      expect(brackets![0][0], `${state.name} must start at 0`).toBe(0);
      for (let i = 1; i < brackets!.length; i++) {
        expect(brackets![i][0], `${state.name} thresholds must ascend`).toBeGreaterThan(
          brackets![i - 1][0],
        );
      }
    }
  });

  it("never produces NaN, Infinity or a negative net for any state or salary", () => {
    const salaries = [0, 1, 25_000, 75_000, 250_000, 5_000_000];
    const filings = ["single", "married", "head"] as const;
    const periods = [52, 26, 24, 12];

    for (const state of STATES_2026) {
      for (const salary of salaries) {
        for (const filing of filings) {
          for (const periodsPerYear of periods) {
            const r = calculatePaycheck({
              grossAnnual: salary,
              filing,
              preTaxAnnual: 0,
              periodsPerYear,
              state,
            });
            const label = `${state.slug}/${salary}/${filing}/${periodsPerYear}`;
            expect(Number.isFinite(r.net), label).toBe(true);
            expect(Number.isFinite(r.perPeriodNet), label).toBe(true);
            expect(r.net, label).toBeGreaterThanOrEqual(-0.01);
            expect(r.effectiveTotalRate, label).toBeGreaterThanOrEqual(0);
            expect(r.effectiveTotalRate, label).toBeLessThanOrEqual(1);
          }
        }
      }
    }
  });

  it("handles empty, negative and undefined salary without crashing", () => {
    for (const grossAnnual of [0, -1, Number.NaN]) {
      const r = calculatePaycheck({
        grossAnnual,
        filing: "single",
        preTaxAnnual: 0,
        periodsPerYear: 26,
        state: TX,
      });
      expect(Number.isFinite(r.net)).toBe(true);
      expect(Number.isNaN(r.net)).toBe(false);
      expect(Number.isFinite(r.perPeriodNet)).toBe(true);
    }
  });

  it("never lets a pre-tax deduction exceed gross pay", () => {
    const r = calculatePaycheck({
      grossAnnual: 30_000,
      filing: "single",
      preTaxAnnual: 999_999,
      periodsPerYear: 26,
      state: TX,
    });
    // The deduction is capped at gross pay, income tax drops to zero, and only
    // FICA remains — so take-home can never fall below minus payroll tax.
    expect(r.preTax).toBe(30_000);
    expect(r.federalTaxable).toBe(0);
    expect(r.net).toBeCloseTo(-(r.socialSecurity + r.medicare), 2);
  });

  it("getState returns undefined for an unknown slug", () => {
    expect(getState("not-a-state")).toBeUndefined();
  });
});
