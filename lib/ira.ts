/**
 * Roth vs traditional IRA comparison engine.
 *
 * Both accounts are compared on the same pre-tax ("gross") contribution:
 *   • Traditional: the full gross amount goes in pre-tax and grows untaxed;
 *     withdrawals are taxed at the projected retirement rate.
 *   • Roth: the gross amount is taxed now at the current marginal rate, the net
 *     amount grows, and withdrawals are tax-free.
 *
 * Formula (equal gross contribution C, growth factor G over n years):
 *   G = ((1 + r)^n − 1) / r           (r = annual return as a decimal; G = n when r = 0)
 *   traditionalAfterTax = C·G·(1 − retirementRate)
 *   rothAfterTax        = C·(1 − currentRate)·G
 *
 * Because both use the same G, the account with the lower tax rate wins — the
 * classic result. No rate data is hard-coded; IRA limits for reference come from
 * lib/data/retirement2026.ts (IRS Notice 2025-67). Last reviewed: 2026-11-12
 */

import { RETIREMENT_2026 } from "./data/retirement2026";

const MAX_YEARS = 80;

const safe = (n: number | undefined): number => (Number.isFinite(n) ? (n as number) : 0);

const round2 = (n: number): number => {
  const v = safe(n);
  return Math.abs(v) < 1e15 ? Math.round((v + Number.EPSILON) * 100) / 100 : v;
};

export interface IraInput {
  currentAge: number;
  retirementAge: number;
  /** Gross (pre-tax) amount contributed each year. */
  annualContribution: number;
  /** Marginal tax rate while working, as a percentage. */
  currentMarginalTaxRatePct: number;
  /** Expected marginal tax rate in retirement, as a percentage. */
  retirementTaxRatePct: number;
  /** Expected annual investment return as a percentage. */
  annualReturnPct: number;
}

export interface IraResult {
  years: number;
  /** Pre-tax dollars contributed each year (same for both accounts). */
  grossContribution: number;
  /** Roth contribution after paying today's tax. */
  netRothContribution: number;
  /** Pre-tax balance the traditional IRA reaches. */
  traditionalPreTaxBalance: number;
  /** Tax owed when the traditional IRA is withdrawn. */
  taxOnWithdrawal: number;
  /** Traditional balance after retirement tax. */
  traditionalAfterTax: number;
  /** Roth balance (already tax-free). */
  rothAfterTax: number;
  /** Absolute gap between the two accounts. */
  difference: number;
  winner: "traditional" | "roth" | "tie";
}

export function calculateIra(input: IraInput): IraResult {
  const currentAge = Math.max(0, Math.floor(safe(input.currentAge)));
  const retirementAge = Math.max(currentAge, Math.floor(safe(input.retirementAge)));
  const years = Math.min(MAX_YEARS, Math.max(0, retirementAge - currentAge));

  const gross = Math.max(0, safe(input.annualContribution));
  const currentRate = Math.min(1, Math.max(0, safe(input.currentMarginalTaxRatePct) / 100));
  const retirementRate = Math.min(1, Math.max(0, safe(input.retirementTaxRatePct) / 100));
  const r = safe(input.annualReturnPct) / 100;
  const base = 1 + r;

  let factor: number;
  if (base <= 0) factor = 0; // total loss: contributions become worthless
  else if (r === 0) factor = years;
  else factor = (Math.pow(base, years) - 1) / r;

  const netRothContribution = gross * (1 - currentRate);
  const traditionalPreTaxBalance = gross * factor;
  const taxOnWithdrawal = traditionalPreTaxBalance * retirementRate;
  const traditionalAfterTax = traditionalPreTaxBalance - taxOnWithdrawal;
  const rothAfterTax = netRothContribution * factor;

  const difference = traditionalAfterTax - rothAfterTax;
  const winner: IraResult["winner"] =
    Math.abs(difference) < 0.005 ? "tie" : difference > 0 ? "traditional" : "roth";

  return {
    years,
    grossContribution: round2(gross),
    netRothContribution: round2(netRothContribution),
    traditionalPreTaxBalance: round2(traditionalPreTaxBalance),
    taxOnWithdrawal: round2(taxOnWithdrawal),
    traditionalAfterTax: round2(traditionalAfterTax),
    rothAfterTax: round2(rothAfterTax),
    difference: round2(Math.abs(difference)),
    winner,
  };
}

/** Reference IRA limits for display (2026, IRS Notice 2025-67). */
export { RETIREMENT_2026 };
