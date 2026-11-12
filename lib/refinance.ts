/**
 * Refinance break-even engine.
 *
 * Given the current mortgage and a proposed replacement loan, work out the
 * monthly saving and how many months of that saving are needed to recover the
 * closing costs.
 *
 *   currentPayment = monthlyPayment(balance, currentRatePct, remainingMonths)
 *   newPayment     = monthlyPayment(balance, newRatePct,     newTermMonths)
 *   monthlySaving  = currentPayment - newPayment
 *   breakEven      = ceil(closingCosts / monthlySaving)   (null when saving<=0)
 *   interestCurrent = currentPayment * remainingMonths - balance
 *   interestNew     = newPayment     * newTermMonths    - balance
 *
 * A refinance "pays off" when the break-even point falls inside the new loan
 * term, i.e. the saving can be recovered before the loan is retired.
 *
 * Last reviewed: 2026-11-12
 */

import { monthlyPayment, round2 } from "@/lib/mortgage";

const MONTHS_PER_YEAR = 12;

const finite = (n: number | undefined, fallback = 0): number =>
  Number.isFinite(n) ? (n as number) : fallback;

export interface RefinanceInput {
  /** Outstanding principal on the current loan. */
  currentBalance: number;
  /** Current annual interest rate as a percentage. */
  currentRatePct: number;
  /** Months left on the current loan. */
  remainingMonths: number;
  /** Annual interest rate on the new loan as a percentage. */
  newRatePct: number;
  /** Term of the new loan in months. */
  newTermMonths: number;
  /** Up-front costs of the refinance (fees, points, title). */
  closingCosts: number;
}

export interface RefinanceResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  /** Payment saved each month. Negative when the new loan costs more. */
  monthlySavings: number;
  /** Months to recover the closing costs, or null when there is no saving. */
  breakEvenMonths: number | null;
  /** Interest paid if the current loan runs its remaining term. */
  lifetimeInterestCurrent: number;
  /** Interest paid over the full term of the new loan. */
  lifetimeInterestNew: number;
  /** Positive means the refinance saves interest over the modeled terms. */
  lifetimeInterestSavings: number;
  /** True when the break-even point falls within the new loan term. */
  paysOffWithinTerm: boolean;
}

export function calculateRefinance(input: RefinanceInput): RefinanceResult {
  const balance = Math.max(0, finite(input.currentBalance));
  const remainingMonths = Math.max(0, Math.floor(finite(input.remainingMonths)));
  const newTermMonths = Math.max(0, Math.floor(finite(input.newTermMonths)));
  const closingCosts = Math.max(0, finite(input.closingCosts));

  const currentMonthlyPayment = monthlyPayment(balance, input.currentRatePct, remainingMonths);
  const newMonthlyPayment = monthlyPayment(balance, input.newRatePct, newTermMonths);
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;

  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : null;

  const lifetimeInterestCurrent = Math.max(0, currentMonthlyPayment * remainingMonths - balance);
  const lifetimeInterestNew = Math.max(0, newMonthlyPayment * newTermMonths - balance);
  const lifetimeInterestSavings = lifetimeInterestCurrent - lifetimeInterestNew;

  const paysOffWithinTerm = breakEvenMonths !== null && breakEvenMonths <= newTermMonths;

  return {
    currentMonthlyPayment: round2(currentMonthlyPayment),
    newMonthlyPayment: round2(newMonthlyPayment),
    monthlySavings: round2(monthlySavings),
    breakEvenMonths,
    lifetimeInterestCurrent: round2(lifetimeInterestCurrent),
    lifetimeInterestNew: round2(lifetimeInterestNew),
    lifetimeInterestSavings: round2(lifetimeInterestSavings),
    paysOffWithinTerm,
  };
}
