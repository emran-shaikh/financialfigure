import { describe, expect, it } from "vitest";
import { calculateDebtPayoff, MONTH_CAP, type Debt } from "./debtPayoff";

const debts: Debt[] = [
  { name: "A", balance: 600, ratePct: 0, minPayment: 100 },
  { name: "B", balance: 900, ratePct: 0, minPayment: 150 },
];

describe("calculateDebtPayoff", () => {
  it("clears two interest-free debts and records the payoff order", () => {
    const r = calculateDebtPayoff({ debts, extraMonthly: 150, strategy: "snowball" });
    expect(r.totalMinimum).toBe(250);
    expect(r.monthlyBudget).toBe(400);
    expect(r.snowball.months).toBe(4);
    expect(r.snowball.totalInterest).toBe(0);
    expect(r.snowball.totalPaid).toBe(1_500);
    expect(r.snowball.debtFree).toBe(true);
    expect(r.snowball.order.map((s) => s.name)).toEqual(["A", "B"]);
    expect(r.snowball.order[0].month).toBe(3);
  });

  it("computes both strategies even though one is chosen", () => {
    const r = calculateDebtPayoff({ debts, extraMonthly: 150, strategy: "avalanche" });
    expect(r.chosen).toBe("avalanche");
    expect(r.snowball.months).toBe(4);
    expect(r.avalanche.months).toBe(4);
  });

  it("avalanche pays less interest when a high-rate debt exists", () => {
    const mixed: Debt[] = [
      { name: "A", balance: 2_000, ratePct: 0, minPayment: 100 },
      { name: "B", balance: 2_000, ratePct: 24, minPayment: 100 },
    ];
    const r = calculateDebtPayoff({ debts: mixed, extraMonthly: 300, strategy: "snowball" });
    expect(r.avalanche.totalInterest).toBeLessThan(r.snowball.totalInterest);
    expect(r.snowball.order[0].name).toBe("A");
    expect(r.avalanche.order[0].name).toBe("B");
  });

  it("rolls freed-up minimums into the snowball", () => {
    const withExtra = calculateDebtPayoff({ debts, extraMonthly: 150, strategy: "snowball" });
    const noExtra = calculateDebtPayoff({ debts, extraMonthly: 0, strategy: "snowball" });
    expect(withExtra.snowball.months).toBeLessThan(noExtra.snowball.months);
  });

  it("handles a single debt", () => {
    const r = calculateDebtPayoff({
      debts: [{ name: "Only", balance: 1_200, ratePct: 0, minPayment: 100 }],
      extraMonthly: 0,
      strategy: "snowball",
    });
    expect(r.snowball.months).toBe(12);
    expect(r.snowball.totalInterest).toBe(0);
    expect(r.snowball.order).toEqual([{ name: "Only", month: 12 }]);
    expect(r.avalanche.months).toBe(12);
  });

  it("caps the simulation when minimums cannot cover interest", () => {
    const r = calculateDebtPayoff({
      debts: [{ name: "Trap", balance: 1_000, ratePct: 36, minPayment: 20 }],
      extraMonthly: 0,
      strategy: "snowball",
    });
    expect(r.snowball.capped).toBe(true);
    expect(r.snowball.debtFree).toBe(false);
    expect(r.snowball.months).toBe(MONTH_CAP);
    expect(Number.isFinite(r.snowball.totalInterest)).toBe(true);
  });

  it("returns an empty, debt-free result for no debts or bad data", () => {
    const empty = calculateDebtPayoff({ debts: [], extraMonthly: 100, strategy: "snowball" });
    expect(empty.snowball.months).toBe(0);
    expect(empty.snowball.debtFree).toBe(true);

    const dirty = calculateDebtPayoff({
      debts: [{ name: "", balance: Number.NaN, ratePct: Number.POSITIVE_INFINITY, minPayment: -5 }],
      extraMonthly: Number.NaN,
      strategy: "avalanche",
    });
    expect(Number.isFinite(dirty.avalanche.totalInterest)).toBe(true);
    expect(dirty.avalanche.debtFree).toBe(true);
  });
});
