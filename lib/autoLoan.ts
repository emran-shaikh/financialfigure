/**
 * Auto loan engine: amount financed, monthly payment, total interest and the
 * total cost of the vehicle. Pure functions, no UI, no I/O.
 *
 * Amount financed mirrors how most car deals are structured:
 *   (vehicle price − down payment − trade-in)
 *   + sales tax charged on (vehicle price − trade-in)
 *   + title/registration fees + dealer fees
 * The result is floored at zero so a trade-in or down payment larger than the
 * price can never produce a negative loan. The monthly payment reuses the
 * standard amortisation formula from lib/mortgage.ts:
 *   M = P · r / (1 − (1 + r)^−n)
 *
 * Last reviewed: 2026-11-12
 */

import { monthlyPayment, round2 } from "./mortgage";

const finite = (n: number | undefined, fallback = 0): number =>
  Number.isFinite(n) ? (n as number) : fallback;

export interface AutoLoanInput {
  /** Negotiated price of the vehicle in dollars. */
  vehiclePrice: number;
  /** Cash down payment in dollars. */
  downPayment: number;
  /** Trade-in allowance in dollars. */
  tradeInValue: number;
  /** Sales tax as a percentage of the taxable amount, e.g. 6.5. */
  salesTaxPct: number;
  /** Title, registration and other government fees in dollars. */
  fees: number;
  /** Dealer documentation and add-on fees in dollars. */
  dealerFees: number;
  /** Nominal annual interest rate as a percentage, e.g. 7.5. */
  annualRatePct: number;
  /** Loan term in months. */
  termMonths: number;
}

export interface AutoLoanResult {
  /** Amount sales tax is charged on (vehicle price − trade-in, floored at 0). */
  taxableAmount: number;
  salesTax: number;
  /** Total borrowed after tax and fees (never negative). */
  amountFinanced: number;
  monthlyPayment: number;
  totalInterest: number;
  /** Sum of every loan payment (amount financed + interest). */
  totalLoanPayments: number;
  /** Vehicle price + sales tax + fees + interest over the life of the loan. */
  totalCost: number;
  termMonths: number;
}

export function calculateAutoLoan(input: AutoLoanInput): AutoLoanResult {
  const vehiclePrice = Math.max(0, finite(input.vehiclePrice));
  const downPayment = Math.max(0, finite(input.downPayment));
  const tradeInValue = Math.max(0, finite(input.tradeInValue));
  const salesTaxPct = Math.max(0, finite(input.salesTaxPct));
  const fees = Math.max(0, finite(input.fees));
  const dealerFees = Math.max(0, finite(input.dealerFees));
  const termMonths = Math.max(0, Math.floor(finite(input.termMonths)));

  const taxableAmount = Math.max(0, vehiclePrice - tradeInValue);
  const salesTax = (taxableAmount * salesTaxPct) / 100;
  const amountFinanced = Math.max(
    0,
    vehiclePrice - downPayment - tradeInValue + salesTax + fees + dealerFees,
  );

  const payment = monthlyPayment(amountFinanced, input.annualRatePct, termMonths);
  const totalInterest = Math.max(0, payment * termMonths - amountFinanced);
  const totalLoanPayments = amountFinanced + totalInterest;
  const totalCost = vehiclePrice + salesTax + fees + dealerFees + totalInterest;

  return {
    taxableAmount: round2(taxableAmount),
    salesTax: round2(salesTax),
    amountFinanced: round2(amountFinanced),
    monthlyPayment: round2(payment),
    totalInterest: round2(totalInterest),
    totalLoanPayments: round2(totalLoanPayments),
    totalCost: round2(totalCost),
    termMonths,
  };
}
