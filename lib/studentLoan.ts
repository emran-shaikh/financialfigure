/**
 * Student loan payoff engine: scheduled payment, actual payoff time with extra
 * payments, interest saved and a projected payoff date.
 *
 * The scheduled payment is the level payment for a fully amortised loan
 * (reused from lib/mortgage.ts). A month-by-month simulation then applies any
 * extra monthly payment entirely to principal. The loop is hard-capped so an
 * under-paying loan can never run forever; when the payment cannot cover the
 * monthly interest the result is flagged instead of looping.
 *
 * Last reviewed: 2026-11-12
 */

import { monthlyPayment, round2 } from "./mortgage";

const MONTHS_PER_YEAR = 12;

/** Hard cap on simulated months (60 years) so the loop always terminates. */
export const MAX_MONTHS = 720;

const finite = (n: number | undefined, fallback = 0): number =>
  Number.isFinite(n) ? (n as number) : fallback;

export interface StudentLoanInput {
  /** Outstanding principal in dollars. */
  balance: number;
  /** Nominal annual interest rate as a percentage, e.g. 6.5. */
  annualRatePct: number;
  /** Contractual term in months; ignored when monthlyPayment is supplied. */
  termMonths: number;
  /** Optional fixed monthly payment that overrides the term-derived payment. */
  monthlyPayment?: number;
  /** Extra principal paid every month. */
  extraMonthly?: number;
  /** Date of the first payment; defaults to today. */
  startDate?: Date;
}

export interface StudentLoanResult {
  /** Scheduled (contract) monthly payment. */
  scheduledPayment: number;
  /** Actual monthly outlay including the extra payment. */
  actualMonthlyPayment: number;
  /** Months required to clear the balance with the extra payment. */
  months: number;
  totalInterest: number;
  totalPaid: number;
  /** Interest avoided versus paying only the scheduled payment. */
  interestSaved: number;
  monthsSaved: number;
  /** ISO date (YYYY-MM-DD) the loan is cleared, or null if it never is. */
  payoffDate: string | null;
  /** True when the payment cannot cover the monthly interest. */
  neverPaysOff: boolean;
  /** True when the simulation hit the month cap without clearing the balance. */
  capped: boolean;
}

interface Simulation {
  months: number;
  totalInterest: number;
  totalPaid: number;
  paidOff: boolean;
}

/** Simulates a single amortising balance paying a fixed monthly amount. */
function simulate(balance: number, monthlyRate: number, payment: number): Simulation {
  if (balance <= 0) {
    return { months: 0, totalInterest: 0, totalPaid: 0, paidOff: true };
  }
  // A payment at or below the monthly interest can never reduce the balance.
  if (payment <= 0 || payment <= balance * monthlyRate) {
    return { months: MAX_MONTHS, totalInterest: 0, totalPaid: 0, paidOff: false };
  }

  let remaining = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  while (remaining > 0.005 && month < MAX_MONTHS) {
    month++;
    const interest = remaining * monthlyRate;
    const principalPaid = Math.min(payment - interest, remaining);
    const paid = Math.min(payment, remaining + interest);
    remaining = Math.max(0, remaining - principalPaid);
    totalInterest += interest;
    totalPaid += paid;
  }

  return {
    months: month,
    totalInterest,
    totalPaid,
    paidOff: remaining <= 0.005,
  };
}

/** Adds whole months to a start date and returns an ISO (YYYY-MM-DD) string. */
function payoffDate(monthsAhead: number, start?: Date): string | null {
  const base = start instanceof Date && Number.isFinite(start.getTime()) ? start : new Date();
  const d = new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + Math.max(0, Math.round(monthsAhead)), base.getUTCDate()),
  );
  if (!Number.isFinite(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export function calculateStudentLoan(input: StudentLoanInput): StudentLoanResult {
  const balance = Math.max(0, finite(input.balance));
  const termMonths = Math.max(0, Math.floor(finite(input.termMonths)));
  const monthlyRate = Math.max(0, finite(input.annualRatePct)) / 100 / MONTHS_PER_YEAR;
  const extra = Math.max(0, finite(input.extraMonthly));

  const override = finite(input.monthlyPayment);
  const scheduled = override > 0 ? override : monthlyPayment(balance, input.annualRatePct, termMonths);
  const paymentWithExtra = scheduled + extra;

  const neverPaysOff = balance > 0 && paymentWithExtra <= balance * monthlyRate;

  const baseline = simulate(balance, monthlyRate, scheduled);
  const actual = simulate(balance, monthlyRate, paymentWithExtra);

  return {
    scheduledPayment: round2(scheduled),
    actualMonthlyPayment: round2(paymentWithExtra),
    months: actual.paidOff ? actual.months : MAX_MONTHS,
    totalInterest: round2(actual.totalInterest),
    totalPaid: round2(actual.totalPaid),
    interestSaved: round2(Math.max(0, baseline.totalInterest - actual.totalInterest)),
    monthsSaved: Math.max(0, baseline.months - actual.months),
    payoffDate: actual.paidOff ? payoffDate(actual.months, input.startDate) : null,
    neverPaysOff,
    capped: !actual.paidOff,
  };
}
