/**
 * Rent vs buy engine — a clearly simplified model of the total cost of owning
 * a home versus renting it over a fixed holding period.
 *
 * Simplifying assumptions (kept explicit so the result is not over-trusted):
 *   - Property tax, insurance and maintenance are held flat in nominal dollars
 *     across the whole holding period (in reality they usually rise).
 *   - Maintenance is modelled as a percentage of the purchase price per year.
 *   - Rent rises once a year by rentGrowthPct.
 *   - The home value compounds annually at appreciationPct.
 *   - The mortgage is amortised with no extra payments; payments stop once the
 *     loan is repaid even when the holding period is longer than the term.
 *   - Selling costs are a percentage of the sale price.
 *   - Gains taxes, the opportunity cost of the down payment, renters insurance,
 *     moving costs and mortgage-interest tax deductions are NOT modelled.
 *
 *   netCostOfBuying = down payment + purchase closing costs
 *                   + mortgage payments + property tax + insurance + maintenance
 *                   - (sale proceeds - remaining loan balance)
 *   costOfRenting   = rent, grown annually, summed over the holding period.
 *
 * The lower total wins. Because down payment + loan = purchase price, the net
 * buying cost reduces to price + interest + carrying costs + closing costs
 * - net sale proceeds, which is an intuitive read of the result.
 *
 * Last reviewed: 2026-11-12
 */

import { amortization, monthlyPayment, round2 } from "@/lib/mortgage";

const MONTHS_PER_YEAR = 12;

const finite = (n: number | undefined, fallback = 0): number =>
  Number.isFinite(n) ? (n as number) : fallback;

const clampPct = (n: number): number => Math.min(100, Math.max(0, n));

export interface RentVsBuyInput {
  homePrice: number;
  /** Down payment in dollars. */
  downPayment: number;
  /** Annual mortgage rate as a percentage. */
  ratePct: number;
  /** Mortgage term in years. */
  termYears: number;
  /** Rent in the first year, per month. */
  monthlyRent: number;
  /** Annual rent increase as a percentage. */
  rentGrowthPct: number;
  /** Annual home appreciation as a percentage. */
  appreciationPct: number;
  /** Annual property tax as a percentage of the home price. */
  propertyTaxRatePct: number;
  /** Annual maintenance as a percentage of the home price. */
  maintenancePct: number;
  /** Annual homeowners insurance in dollars. */
  annualInsurance: number;
  /** How long you expect to stay, in years. */
  yearsToStay: number;
  /** One-off purchase closing costs as a percentage of the home price. */
  purchaseClosingCostPct: number;
  /** Selling costs as a percentage of the sale price. */
  sellingCostPct: number;
}

export interface RentVsBuyResult {
  yearsToStay: number;
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  /** P&I + property tax + insurance + maintenance each month. */
  monthlyOwnershipCost: number;
  /** Down payment + purchase closing costs. */
  totalUpfrontCosts: number;
  /** Net cost of owning over the holding period (money out minus money back). */
  totalBuyingCost: number;
  /** Total rent paid over the holding period. */
  totalRentingCost: number;
  /** totalBuyingCost - totalRentingCost (negative means buying is cheaper). */
  difference: number;
  cheaperOption: "buy" | "rent";
  homeValueAtSale: number;
  remainingLoanBalance: number;
  saleProceeds: number;
  /** Mortgage interest paid during the holding period. */
  totalInterestPaid: number;
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const homePrice = Math.max(0, finite(input.homePrice));
  const downPayment = Math.min(Math.max(0, finite(input.downPayment)), homePrice);
  const loanAmount = Math.max(0, homePrice - downPayment);
  const termYears = Math.min(100, Math.max(1, finite(input.termYears, 30)));
  const termMonths = Math.round(termYears * MONTHS_PER_YEAR);
  const yearsToStay = Math.min(100, Math.max(0, finite(input.yearsToStay)));
  const monthsHeld = Math.round(yearsToStay * MONTHS_PER_YEAR);

  const monthlyPI = monthlyPayment(loanAmount, input.ratePct, termMonths);
  const monthlyPropertyTax =
    (homePrice * Math.max(0, finite(input.propertyTaxRatePct))) / 100 / MONTHS_PER_YEAR;
  const monthlyInsurance = Math.max(0, finite(input.annualInsurance)) / MONTHS_PER_YEAR;
  const monthlyMaintenance =
    (homePrice * Math.max(0, finite(input.maintenancePct))) / 100 / MONTHS_PER_YEAR;
  const monthlyOwnershipCost = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance;

  // Mortgage cash flows over the holding period (payments stop when repaid).
  const schedule = amortization({
    principal: loanAmount,
    annualRatePct: input.ratePct,
    months: termMonths,
  });
  const heldMonths = Math.min(Math.max(0, monthsHeld), schedule.rows.length);
  let mortgagePayments = 0;
  let totalInterestPaid = 0;
  let principalPaid = 0;
  for (let i = 0; i < heldMonths; i++) {
    const row = schedule.rows[i];
    mortgagePayments += row.payment;
    totalInterestPaid += row.interest;
    principalPaid += row.principal;
  }
  const remainingLoanBalance = Math.max(0, loanAmount - principalPaid);

  const downPaymentOut = downPayment;
  const purchaseClosingCosts =
    (homePrice * clampPct(finite(input.purchaseClosingCostPct))) / 100;
  const totalUpfrontCosts = downPaymentOut + purchaseClosingCosts;

  const appreciation = Math.max(-1, finite(input.appreciationPct)) / 100;
  const homeValueAtSale = homePrice * Math.pow(1 + appreciation, yearsToStay);
  const saleProceeds = homeValueAtSale * (1 - clampPct(finite(input.sellingCostPct)) / 100);

  const totalBuyingCost =
    totalUpfrontCosts +
    mortgagePayments +
    monthlyPropertyTax * monthsHeld +
    monthlyInsurance * monthsHeld +
    monthlyMaintenance * monthsHeld -
    (saleProceeds - remainingLoanBalance);

  // Rent, grown once a year. g is floored so (1 + g) stays positive.
  const g = Math.max(-0.99, finite(input.rentGrowthPct) / 100);
  const annualRent = Math.max(0, finite(input.monthlyRent)) * MONTHS_PER_YEAR;
  const totalRentingCost =
    g === 0 ? annualRent * yearsToStay : (annualRent * (Math.pow(1 + g, yearsToStay) - 1)) / g;

  const difference = totalBuyingCost - totalRentingCost;

  return {
    yearsToStay,
    loanAmount: round2(loanAmount),
    monthlyPrincipalAndInterest: round2(monthlyPI),
    monthlyOwnershipCost: round2(monthlyOwnershipCost),
    totalUpfrontCosts: round2(totalUpfrontCosts),
    totalBuyingCost: round2(totalBuyingCost),
    totalRentingCost: round2(totalRentingCost),
    difference: round2(difference),
    cheaperOption: difference <= 0 ? "buy" : "rent",
    homeValueAtSale: round2(homeValueAtSale),
    remainingLoanBalance: round2(remainingLoanBalance),
    saleProceeds: round2(saleProceeds),
    totalInterestPaid: round2(totalInterestPaid),
  };
}
