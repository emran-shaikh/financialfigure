/**
 * Mortgage engine: monthly payment, full amortisation schedule, extra payments
 * and affordability. Pure functions, no UI, no I/O.
 *
 * Formulas (standard amortised-loan mathematics):
 *   M = P · r / (1 − (1 + r)^−n)
 * where P = principal, r = monthly rate (annual / 12), n = number of months.
 * When r = 0 the payment is simply P / n.
 *
 * Last reviewed: 2026-11-12
 */

const MONTHS_PER_YEAR = 12;

export interface AmortizationInput {
  /** Loan principal in dollars. */
  principal: number;
  /** Nominal annual interest rate as a percentage, e.g. 6.5. */
  annualRatePct: number;
  /** Loan term in months. */
  months: number;
  /** Extra principal paid every month. */
  extraMonthly?: number;
  /** Extra principal paid once a year (applied in month 12, 24, ...). */
  extraYearly?: number;
}

export interface AmortizationRow {
  /** 1-based month number. */
  month: number;
  payment: number;
  principal: number;
  interest: number;
  /** Extra principal applied this month. */
  extra: number;
  /** Remaining balance after this payment. */
  balance: number;
}

export interface AmortizationResult {
  rows: AmortizationRow[];
  /** Scheduled monthly payment (principal + interest), excluding extra payments. */
  monthlyPayment: number;
  /** Total interest paid over the life of the loan. */
  totalInterest: number;
  /** Total of all payments including extra principal. */
  totalPaid: number;
  /** Number of months actually required (shorter when extra payments are made). */
  monthsWithExtras: number;
  /** Interest saved compared to making no extra payments. */
  interestSaved: number;
  /** Months saved compared to the original term. */
  monthsSaved: number;
}

const finite = (n: number | undefined, fallback = 0): number =>
  Number.isFinite(n) ? (n as number) : fallback;

/** Rounds to the nearest cent. */
export const round2 = (n: number): number => Math.round((finite(n) + Number.EPSILON) * 100) / 100;

/** Level monthly payment (principal + interest) for a fully amortised loan. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  const p = finite(principal);
  const n = Math.floor(finite(months));
  if (p <= 0 || n <= 0) return 0;
  const r = finite(annualRatePct) / 100 / MONTHS_PER_YEAR;
  if (r === 0) return p / n;
  return (p * r) / (1 - Math.pow(1 + r, -n));
}

/**
 * Builds a month-by-month amortisation schedule. Extra payments go entirely to
 * principal and shorten the loan rather than reducing the monthly payment.
 */
export function amortization(input: AmortizationInput): AmortizationResult {
  const principal = Math.max(0, finite(input.principal));
  const months = Math.max(0, Math.floor(finite(input.months)));
  const r = finite(input.annualRatePct) / 100 / MONTHS_PER_YEAR;
  const extraMonthly = Math.max(0, finite(input.extraMonthly));
  const extraYearly = Math.max(0, finite(input.extraYearly));
  const payment = monthlyPayment(principal, input.annualRatePct, months);

  const rows: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;

  // Safety cap so an under-paying loan can never loop forever.
  const maxMonths = months + 12;

  for (let month = 1; balance > 0.005 && month <= maxMonths; month++) {
    const interest = balance * r;
    const scheduledPrincipal = Math.min(payment - interest, balance);
    const extra = Math.min(
      extraMonthly + (month % MONTHS_PER_YEAR === 0 ? extraYearly : 0),
      balance - Math.max(0, scheduledPrincipal),
    );
    const principalPaid = Math.max(0, scheduledPrincipal) + extra;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    totalPaid += Math.max(0, scheduledPrincipal) + interest + extra;
    rows.push({
      month,
      payment: round2(Math.max(0, scheduledPrincipal) + interest),
      principal: round2(Math.max(0, scheduledPrincipal)),
      interest: round2(interest),
      extra: round2(extra),
      balance: round2(balance),
    });
  }

  const baseline = baselineInterest(principal, input.annualRatePct, months);

  return {
    rows,
    monthlyPayment: round2(payment),
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    monthsWithExtras: rows.length,
    interestSaved: round2(Math.max(0, baseline - totalInterest)),
    monthsSaved: Math.max(0, months - rows.length),
  };
}

/** Total interest with no extra payments, used to compute savings. */
function baselineInterest(principal: number, annualRatePct: number, months: number): number {
  const payment = monthlyPayment(principal, annualRatePct, months);
  return Math.max(0, payment * months - principal);
}

export interface MortgageInput {
  homePrice: number;
  /** Down payment in dollars. */
  downPayment: number;
  annualRatePct: number;
  termYears: number;
  /** Annual property tax as a percentage of the home price. */
  propertyTaxRatePct?: number;
  /** Annual homeowners insurance in dollars. */
  annualInsurance?: number;
  /** Monthly HOA dues in dollars. */
  monthlyHoa?: number;
  /** Annual PMI rate as a percentage of the loan amount. */
  pmiRatePct?: number;
}

export interface MortgageResult {
  homePrice: number;
  loanAmount: number;
  downPayment: number;
  /** Down payment as a fraction of the home price. */
  downPaymentPct: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPmi: number;
  monthlyHoa: number;
  /** Full monthly housing cost (PITI + HOA + PMI). */
  monthlyTotal: number;
  totalInterest: number;
  /** Loan amount + total interest. */
  totalOfPayments: number;
  months: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const homePrice = Math.max(0, finite(input.homePrice));
  const downPayment = Math.min(Math.max(0, finite(input.downPayment)), homePrice);
  const loanAmount = Math.max(0, homePrice - downPayment);
  const months = Math.max(1, Math.round(finite(input.termYears, 30) * MONTHS_PER_YEAR));

  const pi = monthlyPayment(loanAmount, input.annualRatePct, months);
  const monthlyPropertyTax = (homePrice * Math.max(0, finite(input.propertyTaxRatePct))) / 100 / MONTHS_PER_YEAR;
  const monthlyInsurance = Math.max(0, finite(input.annualInsurance)) / MONTHS_PER_YEAR;
  const monthlyHoa = Math.max(0, finite(input.monthlyHoa));
  const monthlyPmi = (loanAmount * Math.max(0, finite(input.pmiRatePct))) / 100 / MONTHS_PER_YEAR;

  const totalInterest = Math.max(0, pi * months - loanAmount);

  return {
    homePrice,
    loanAmount,
    downPayment,
    downPaymentPct: homePrice > 0 ? downPayment / homePrice : 0,
    monthlyPrincipalAndInterest: round2(pi),
    monthlyPropertyTax: round2(monthlyPropertyTax),
    monthlyInsurance: round2(monthlyInsurance),
    monthlyPmi: round2(monthlyPmi),
    monthlyHoa: round2(monthlyHoa),
    monthlyTotal: round2(
      pi + monthlyPropertyTax + monthlyInsurance + monthlyHoa + monthlyPmi,
    ),
    totalInterest: round2(totalInterest),
    totalOfPayments: round2(loanAmount + totalInterest),
    months,
  };
}

/**
 * Maximum loan principal affordable for a given monthly principal-and-interest
 * budget (the inverse of `monthlyPayment`).
 */
export function affordableLoan(
  monthlyBudget: number,
  annualRatePct: number,
  termYears: number,
): number {
  const budget = Math.max(0, finite(monthlyBudget));
  const months = Math.max(1, Math.round(finite(termYears, 30) * MONTHS_PER_YEAR));
  const r = finite(annualRatePct) / 100 / MONTHS_PER_YEAR;
  if (budget === 0) return 0;
  if (r === 0) return budget * months;
  return (budget * (1 - Math.pow(1 + r, -months))) / r;
}
