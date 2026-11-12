/**
 * Multi-debt payoff engine. It runs a month-by-month simulation of paying a
 * fixed monthly budget across a list of debts under the two common strategies:
 *
 *  - snowball:  attack the smallest balance first;
 *  - avalanche: attack the highest interest rate first.
 *
 * Every month each debt is paid its minimum, then the remaining budget — the
 * extra payment plus any minimums freed up by cleared debts — is aimed at the
 * target debt, cascading to the next when it is cleared. A hard month cap keeps
 * the loop bounded, and debts whose minimum does not cover their interest are
 * reported rather than spinning forever.
 *
 * Last reviewed: 2026-11-12
 */

import { round2 } from "./mortgage";

/** Hard cap on simulated months (50 years) so the loop always terminates. */
export const MONTH_CAP = 600;

const MONTHS_PER_YEAR = 12;

const finite = (n: number | undefined, fallback = 0): number =>
  Number.isFinite(n) ? (n as number) : fallback;

export interface Debt {
  name: string;
  balance: number;
  ratePct: number;
  minPayment: number;
}

export type DebtStrategy = "snowball" | "avalanche";

export interface DebtPayoffInput {
  debts: Debt[];
  /** Extra money added to the sum of the minimum payments each month. */
  extraMonthly: number;
  /** Which strategy the user prefers (both are always computed). */
  strategy: DebtStrategy;
}

export interface DebtPayoffStep {
  name: string;
  /** Month the debt was cleared (1-based). */
  month: number;
}

export interface StrategyResult {
  strategy: DebtStrategy;
  months: number;
  totalInterest: number;
  totalPaid: number;
  order: DebtPayoffStep[];
  debtFree: boolean;
  capped: boolean;
}

export interface DebtPayoffResult {
  chosen: DebtStrategy;
  /** Sum of every debt's minimum payment. */
  totalMinimum: number;
  /** Total paid each month (minimums + extra). */
  monthlyBudget: number;
  snowball: StrategyResult;
  avalanche: StrategyResult;
}

interface WorkingDebt {
  name: string;
  balance: number;
  monthlyRate: number;
  minPayment: number;
}

function simulate(debts: Debt[], extraMonthly: number, strategy: DebtStrategy): StrategyResult {
  const working: WorkingDebt[] = debts
    .map((d) => ({
      name: typeof d.name === "string" && d.name.trim() ? d.name.trim() : "Debt",
      balance: Math.max(0, finite(d.balance)),
      monthlyRate: Math.max(0, finite(d.ratePct)) / 100 / MONTHS_PER_YEAR,
      minPayment: Math.max(0, finite(d.minPayment)),
    }))
    .filter((d) => d.balance > 0.005);

  const totalMinimum = working.reduce((sum, d) => sum + d.minPayment, 0);
  const budget = totalMinimum + Math.max(0, finite(extraMonthly));

  const order: DebtPayoffStep[] = [];
  const cleared = new Set<number>();
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  const outstanding = (): boolean =>
    working.some((d, i) => !cleared.has(i) && d.balance > 0.005);

  while (outstanding() && month < MONTH_CAP) {
    month++;

    // 1. Accrue interest on every debt still owing.
    for (const d of working) {
      if (d.balance <= 0.005) continue;
      const interest = d.balance * d.monthlyRate;
      d.balance += interest;
      totalInterest += interest;
    }

    // 2. Pay every debt its minimum.
    let available = budget;
    working.forEach((d, i) => {
      if (d.balance <= 0.005) return;
      const pay = Math.min(d.minPayment, d.balance);
      d.balance -= pay;
      available -= pay;
      totalPaid += pay;
      if (d.balance <= 0.005 && !cleared.has(i)) {
        cleared.add(i);
        order.push({ name: d.name, month });
      }
    });

    // 3. Aim the remaining budget at the strategy's target debt.
    const active = working
      .map((d, i) => ({ d, i }))
      .filter(({ d, i }) => !cleared.has(i) && d.balance > 0.005);
    active.sort((a, b) =>
      strategy === "snowball"
        ? a.d.balance - b.d.balance
        : b.d.monthlyRate - a.d.monthlyRate || b.d.balance - a.d.balance,
    );

    for (const { d, i } of active) {
      if (available <= 0.005) break;
      const pay = Math.min(available, d.balance);
      d.balance -= pay;
      available -= pay;
      totalPaid += pay;
      if (d.balance <= 0.005 && !cleared.has(i)) {
        cleared.add(i);
        order.push({ name: d.name, month });
      }
    }
  }

  const debtFree = !outstanding();

  return {
    strategy,
    months: debtFree ? month : MONTH_CAP,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    order,
    debtFree,
    capped: !debtFree,
  };
}

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const debts = Array.isArray(input.debts) ? input.debts : [];
  const extra = Math.max(0, finite(input.extraMonthly));
  const chosen: DebtStrategy = input.strategy === "avalanche" ? "avalanche" : "snowball";
  const totalMinimum = debts.reduce((sum, d) => sum + Math.max(0, finite(d.minPayment)), 0);

  return {
    chosen,
    totalMinimum: round2(totalMinimum),
    monthlyBudget: round2(totalMinimum + extra),
    snowball: simulate(debts, extra, "snowball"),
    avalanche: simulate(debts, extra, "avalanche"),
  };
}
