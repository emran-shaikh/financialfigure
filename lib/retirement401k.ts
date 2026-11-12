/**
 * 401(k) growth projection engine.
 *
 * Each plan year the employee defers a chosen percentage of salary, capped at
 * the IRS elective deferral limit for that participant's age (including the
 * age-50 and age 60–63 catch-up amounts). The employer matches a percentage of
 * the employee's contribution up to a ceiling expressed as a percentage of
 * salary. The whole balance then compounds at the expected annual return.
 *
 * Formula (per year, contributions assumed to land during the year):
 *   employee = min(salary · pct, deferralLimit(age))
 *   match    = salary · min(effectivePct, capPct) · matchPct
 *   balance  = (balance + employee + match) · (1 + return)
 *
 * Limits: lib/data/retirement2026.ts, verified against IRS Notice 2025-67 and
 * IR-2025-111 (see that file for citations). Last reviewed: 2026-11-12
 */

import { deferralLimitForAge, RETIREMENT_2026 } from "./data/retirement2026";

const MAX_YEARS = 80;

const safe = (n: number | undefined): number => (Number.isFinite(n) ? (n as number) : 0);

const round2 = (n: number): number => {
  const v = safe(n);
  return Math.abs(v) < 1e15 ? Math.round((v + Number.EPSILON) * 100) / 100 : v;
};

export interface Retirement401kInput {
  /** Current age in years. */
  currentAge: number;
  /** Age at which contributions stop and the balance is read. */
  retirementAge: number;
  /** Current 401(k) balance in dollars. */
  currentBalance: number;
  /** Current gross annual salary in dollars. */
  annualSalary: number;
  /** Employee deferral as a percentage of salary. */
  contributionPct: number;
  /** Employer match rate applied to matched contributions, e.g. 50 for 50%. */
  employerMatchPct: number;
  /** Maximum percentage of salary the employer will match. */
  employerMatchCapPctOfSalary: number;
  /** Annual salary growth as a percentage, e.g. 3. */
  annualRaisePct: number;
  /** Expected annual investment return as a percentage, e.g. 7. */
  annualReturnPct: number;
}

export interface Retirement401kYear {
  /** Age reached during this plan year. */
  age: number;
  salary: number;
  /** Employee elective deferral (already capped at the 2026 IRS limit). */
  employeeContribution: number;
  /** Employer matching contribution. */
  employerMatch: number;
  /** Balance at the end of the year. */
  endBalance: number;
}

export interface Retirement401kResult {
  /** Whole years of contributions. */
  years: number;
  /** Projected balance at retirement. */
  projectedBalance: number;
  /** Sum of all employee contributions. */
  totalEmployeeContributions: number;
  /** Sum of all employer matching contributions. */
  totalEmployerMatch: number;
  /** Growth on the starting balance plus all contributions. */
  totalGrowth: number;
  /** Year-by-year projection. */
  schedule: Retirement401kYear[];
  /** The 2026 deferral limit applied this year (useful for display). */
  currentDeferralLimit: number;
}

export function calculate401k(input: Retirement401kInput): Retirement401kResult {
  const currentAge = Math.max(0, Math.floor(safe(input.currentAge)));
  const retirementAge = Math.max(currentAge, Math.floor(safe(input.retirementAge)));
  const years = Math.min(MAX_YEARS, Math.max(0, retirementAge - currentAge));

  let balance = Math.max(0, safe(input.currentBalance));
  let salary = Math.max(0, safe(input.annualSalary));
  const contributionPct = Math.max(0, safe(input.contributionPct));
  const matchPct = Math.max(0, safe(input.employerMatchPct)) / 100;
  const matchCapPct = Math.max(0, safe(input.employerMatchCapPctOfSalary));
  const raisePct = safe(input.annualRaisePct) / 100;
  const returnPct = safe(input.annualReturnPct) / 100;

  let totalEmployeeContributions = 0;
  let totalEmployerMatch = 0;
  const schedule: Retirement401kYear[] = [];

  for (let i = 0; i < years; i++) {
    const age = currentAge + i;
    const limit = deferralLimitForAge(age);

    const rawEmployee = (salary * contributionPct) / 100;
    const employeeContribution = Math.max(0, Math.min(rawEmployee, limit));

    const effectivePct = salary > 0 ? (employeeContribution / salary) * 100 : 0;
    const matchedPct = Math.min(effectivePct, matchCapPct);
    const employerMatch = Math.max(0, (salary * matchedPct * matchPct) / 100);

    balance = (balance + employeeContribution + employerMatch) * (1 + returnPct);
    totalEmployeeContributions += employeeContribution;
    totalEmployerMatch += employerMatch;

    schedule.push({
      age,
      salary: round2(salary),
      employeeContribution: round2(employeeContribution),
      employerMatch: round2(employerMatch),
      endBalance: round2(balance),
    });

    salary *= 1 + raisePct;
  }

  const openingBalance = Math.max(0, safe(input.currentBalance));
  const totalGrowth = balance - openingBalance - totalEmployeeContributions - totalEmployerMatch;

  return {
    years,
    projectedBalance: round2(balance),
    totalEmployeeContributions: round2(totalEmployeeContributions),
    totalEmployerMatch: round2(totalEmployerMatch),
    totalGrowth: round2(totalGrowth),
    schedule,
    currentDeferralLimit: deferralLimitForAge(currentAge),
  };
}

/** Re-exported so UI code can show the source limits without another import. */
export { RETIREMENT_2026 };
