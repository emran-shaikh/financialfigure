/**
 * Credit card payoff engine. It works two ways:
 *   - given a fixed monthly payment it simulates how many months the balance
 *     lasts; or
 *   - given a target number of months it returns the payment required to clear
 *     the balance in that time.
 *
 * Interest is charged monthly at apr / 100 / 12 on the outstanding balance.
 * The simulation is hard-capped and flags the common trap where the payment is
 * smaller than the monthly interest, so the balance never falls.
 *
 * Last reviewed: 2026-11-12
 */

import { monthlyPayment, round2 } from "./mortgage";

const MONTHS_PER_YEAR = 12;

/** Hard cap on simulated months (100 years) so the loop always terminates. */
export const MAX_MONTHS = 1200;

const finite = (n: number | undefined, fallback = 0): number =>
  Number.isFinite(n) ? (n as number) : fallback;

export interface CreditCardInput {
  /** Outstanding balance in dollars. */
  balance: number;
  /** Annual percentage rate as a percentage, e.g. 21.5. */
  aprPct: number;
  /** Fixed monthly payment, used when targetMonths is not supplied. */
  monthlyPayment?: number;
  /** Desired payoff time in months; when > 0 the required payment is computed. */
  targetMonths?: number;
}

export interface CreditCardResult {
  balance: number;
  /** Monthly interest rate as a fraction (apr / 100 / 12). */
  monthlyRate: number;
  /** The payment used (given) or required (from targetMonths). */
  payment: number;
  months: number;
  totalInterest: number;
  totalPaid: number;
  /** True when the payment is at or below the monthly interest. */
  minimumPaymentWarning: boolean;
  /** True when the balance cannot be cleared within the month cap. */
  capped: boolean;
  /** True when the payment was derived from targetMonths. */
  fromTarget: boolean;
}

const EMPTY: Omit<CreditCardResult, "monthlyRate" | "fromTarget"> = {
  balance: 0,
  payment: 0,
  months: 0,
  totalInterest: 0,
  totalPaid: 0,
  minimumPaymentWarning: false,
  capped: false,
};

export function calculateCreditCard(input: CreditCardInput): CreditCardResult {
  const balance = Math.max(0, finite(input.balance));
  const monthlyRate = Math.max(0, finite(input.aprPct)) / 100 / MONTHS_PER_YEAR;
  const target = Math.floor(finite(input.targetMonths));

  if (balance <= 0) {
    return { ...EMPTY, monthlyRate, fromTarget: target > 0 };
  }

  // Mode 1: a target payoff time — solve for the required payment.
  if (target > 0) {
    const payment = monthlyPayment(balance, input.aprPct, target);
    const totalPaid = payment * target;
    return {
      balance: round2(balance),
      monthlyRate,
      payment: round2(payment),
      months: target,
      totalInterest: round2(Math.max(0, totalPaid - balance)),
      totalPaid: round2(totalPaid),
      minimumPaymentWarning: false,
      capped: false,
      fromTarget: true,
    };
  }

  // Mode 2: a fixed monthly payment — simulate the payoff.
  const payment = Math.max(0, finite(input.monthlyPayment));
  const minimumPaymentWarning = payment <= balance * monthlyRate;

  if (payment <= 0 || minimumPaymentWarning) {
    return {
      balance: round2(balance),
      monthlyRate,
      payment: round2(payment),
      months: MAX_MONTHS,
      totalInterest: 0,
      totalPaid: 0,
      minimumPaymentWarning,
      capped: true,
      fromTarget: false,
    };
  }

  let remaining = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  while (remaining > 0.005 && month < MAX_MONTHS) {
    month++;
    const interest = remaining * monthlyRate;
    const pay = Math.min(payment, remaining + interest);
    remaining = Math.max(0, remaining - (pay - interest));
    totalInterest += interest;
    totalPaid += pay;
  }

  return {
    balance: round2(balance),
    monthlyRate,
    payment: round2(payment),
    months: month,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    minimumPaymentWarning: false,
    capped: remaining > 0.005,
    fromTarget: false,
  };
}
