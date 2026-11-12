/**
 * US paycheck (take-home pay) engine — tax year 2026.
 *
 * Combines the federal engine in ./federal2026 with the state schedules in
 * ./states2026. This module is intentionally UI-free so it can be reused by the
 * paycheck calculator, the self-employment calculator and the bonus calculator.
 *
 * Model and assumptions (documented in /methodology):
 *  - Wages are annualised, then divided by the number of pay periods.
 *  - Pre-tax deductions (401(k), HSA, traditional IRA via payroll) reduce federal
 *    and state taxable income but NOT Social Security or Medicare wages.
 *  - The standard deduction is applied for both federal and state tax where the
 *    state has one. Credits, dependents and itemised deductions are not modelled.
 *  - Only the employee's share of payroll taxes is shown.
 *
 * Last reviewed: 2026-11-12
 */

import {
  FEDERAL_2026,
  applyBrackets,
  federalMarginalRate,
  medicareTax,
  socialSecurityTax,
  type Filing,
} from "./federal2026";
import type { StateBracket, StateDef } from "./states2026";

export interface PaycheckInput {
  /** Gross annual wage income in dollars. */
  grossAnnual: number;
  filing: Filing;
  /** Annual pre-tax payroll deductions (401(k), HSA, ...). */
  preTaxAnnual: number;
  /** Pay periods per year (52, 26, 24 or 12). */
  periodsPerYear: number;
  state: StateDef;
}

export interface PaycheckResult {
  /** Gross annual pay. */
  gross: number;
  /** Annual pre-tax deductions. */
  preTax: number;
  /** Federal taxable income after the standard deduction. */
  federalTaxable: number;
  federalIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  stateIncomeTax: number;
  /** Employee-side state payroll tax (paid leave, disability, ...). Not income tax. */
  statePayroll: number;
  /** Annual take-home pay after all taxes and pre-tax deductions. */
  net: number;
  /** Take-home pay per pay period. */
  perPeriodNet: number;
  /** Federal marginal rate in whole percent (e.g. 22). */
  federalMarginalRate: number;
  /** Total tax (federal + FICA + state) as a fraction of gross pay. */
  effectiveTotalRate: number;
}

/** Brackets for the requested filing status, falling back to the single schedule. */
export function stateBrackets(state: StateDef, filing: Filing): StateBracket[] | undefined {
  if (!state.single) return undefined;
  if (filing === "married") return state.married ?? state.single;
  if (filing === "head") return state.head ?? state.single;
  return state.single;
}

/** State standard deduction / exemption for the requested filing status. */
export function stateDeduction(state: StateDef, filing: Filing): number {
  if (!state.deduction) return 0;
  if (filing === "married") return state.deduction.married;
  if (filing === "head") return state.deduction.head;
  return state.deduction.single;
}

/**
 * State income tax on wage income. `brackets` use `[threshold, ratePercent]`
 * pairs (percent, not decimal) sorted ascending with a 0 threshold first.
 */
export function stateIncomeTax(taxable: number, brackets: StateBracket[] | undefined): number {
  if (!brackets || brackets.length === 0 || !Number.isFinite(taxable) || taxable <= 0) return 0;

  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const [threshold, ratePercent] = brackets[i];
    const nextThreshold = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity;
    if (taxable <= threshold) break;
    const amountInBracket = Math.min(taxable, nextThreshold) - threshold;
    if (amountInBracket > 0) tax += amountInBracket * (ratePercent / 100);
  }
  return tax;
}

const clampNonNegative = (n: number, fallback = 0): number =>
  Number.isFinite(n) && n > 0 ? n : fallback;

/** Total tax as a fraction of gross pay. Returns 0 when gross is 0. */
export function effectiveTotalRate(result: PaycheckResult): number {
  const totalTax =
    result.federalIncomeTax +
    result.socialSecurity +
    result.medicare +
    result.stateIncomeTax +
    result.statePayroll;
  return result.gross > 0 ? totalTax / result.gross : 0;
}

export function calculatePaycheck(input: PaycheckInput): PaycheckResult {
  const gross = clampNonNegative(input.grossAnnual);
  const preTax = Math.min(clampNonNegative(input.preTaxAnnual), gross);
  const periods = input.periodsPerYear > 0 && Number.isFinite(input.periodsPerYear) ? input.periodsPerYear : 12;

  const federalTaxable = Math.max(0, gross - preTax - FEDERAL_2026[input.filing].standardDeduction);
  const fed = applyBrackets(federalTaxable, FEDERAL_2026[input.filing].brackets);
  const socialSecurity = socialSecurityTax(gross);
  const medicare = medicareTax(gross, input.filing);

  const stateTaxable = Math.max(
    0,
    gross - preTax - stateDeduction(input.state, input.filing),
  );
  const stateTax = input.state.none
    ? 0
    : stateIncomeTax(stateTaxable, stateBrackets(input.state, input.filing));
  const statePayroll = input.state.payroll
    ? clampNonNegative(gross) * input.state.payroll.rate
    : 0;

  const net = gross - preTax - fed.tax - socialSecurity - medicare - stateTax - statePayroll;

  const result: PaycheckResult = {
    gross,
    preTax,
    federalTaxable,
    federalIncomeTax: fed.tax,
    socialSecurity,
    medicare,
    stateIncomeTax: stateTax,
    statePayroll,
    net,
    perPeriodNet: net / periods,
    federalMarginalRate: federalMarginalRate(federalTaxable, input.filing) * 100,
    effectiveTotalRate: 0,
  };
  result.effectiveTotalRate = effectiveTotalRate(result);
  return result;
}
