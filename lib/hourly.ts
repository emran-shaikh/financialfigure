/**
 * Hourly <-> salary conversion engine. Pure functions, no UI, no I/O.
 *
 * Formulas (a standard 40-hour, 52-week work year unless changed):
 *   weekly base pay    = hourlyRate × hoursPerWeek
 *   weekly overtime    = overtimeHoursPerWeek × hourlyRate × overtimeMultiplier
 *   annualSalary       = (weekly base pay + weekly overtime) × weeksPerYear
 *   monthlyPay         = annualSalary ÷ 12
 *   biweeklyPay        = annualSalary ÷ 26
 *   weeklyPay          = annualSalary ÷ weeksPerYear
 *   dailyPay           = weeklyPay ÷ 5     (five working days per week)
 *   effectiveHourly    = annualSalary ÷ (total annual hours worked)
 *                      = annualSalary ÷ ((hoursPerWeek + overtimeHoursPerWeek) × weeksPerYear)
 *
 * No government data is used, so no official source is cited.
 * Last reviewed: 2026-11-12
 */

export interface HourlyInput {
  /** Base hourly rate in dollars. */
  hourlyRate: number;
  /** Hours worked per week at the base rate. Default 40. */
  hoursPerWeek?: number;
  /** Paid weeks per year. Default 52. */
  weeksPerYear?: number;
  /** Overtime hours worked per week, paid at `overtimeMultiplier`. Default 0. */
  overtimeHoursPerWeek?: number;
  /** Overtime pay multiplier. Default 1.5 (time-and-a-half). */
  overtimeMultiplier?: number;
}

export interface HourlyResult {
  /** Total gross annual pay including overtime. */
  annualSalary: number;
  monthlyPay: number;
  biweeklyPay: number;
  weeklyPay: number;
  /** Weekly pay spread over five working days. */
  dailyPay: number;
  /** Annual pay divided by every hour worked (base + overtime), i.e. the real hourly value. */
  effectiveHourlyRate: number;
  /** Total hours worked in the year (base + overtime). */
  annualHours: number;
  /** The overtime component of the annual salary. */
  annualOvertimePay: number;
}

/** Coerces an optional input to a non-negative finite number, using `fallback` when it is absent. */
const resolve = (value: number | undefined, fallback: number): number => {
  if (value === undefined || value === null) return fallback;
  return Number.isFinite(value) && value > 0 ? value : 0;
};

/** Coerces a required input to a non-negative finite number. */
const nonNegative = (value: number): number =>
  Number.isFinite(value) && value > 0 ? value : 0;

export function calculateHourly(input: HourlyInput): HourlyResult {
  const rate = nonNegative(input.hourlyRate);
  const hoursPerWeek = resolve(input.hoursPerWeek, 40);
  const weeksPerYear = resolve(input.weeksPerYear, 52);
  const overtimeHoursPerWeek = resolve(input.overtimeHoursPerWeek, 0);
  const overtimeMultiplier = resolve(input.overtimeMultiplier, 1.5);

  const baseWeekly = rate * hoursPerWeek;
  const overtimeWeekly = overtimeHoursPerWeek * rate * overtimeMultiplier;
  const annualSalary = (baseWeekly + overtimeWeekly) * weeksPerYear;

  const weeklyPay = weeksPerYear > 0 ? annualSalary / weeksPerYear : 0;
  const biweeklyPay = annualSalary / 26;
  const monthlyPay = annualSalary / 12;
  const dailyPay = weeklyPay / 5;

  const annualHours = (hoursPerWeek + overtimeHoursPerWeek) * weeksPerYear;
  const effectiveHourlyRate = annualHours > 0 ? annualSalary / annualHours : 0;

  return {
    annualSalary,
    monthlyPay,
    biweeklyPay,
    weeklyPay,
    dailyPay,
    effectiveHourlyRate,
    annualHours,
    annualOvertimePay: overtimeWeekly * weeksPerYear,
  };
}

/**
 * Converts an annual salary back into an hourly rate. Returns 0 (never NaN or
 * Infinity) for a zero salary or a zero-hours work year.
 */
export function salaryToHourly(
  annualSalary: number,
  hoursPerWeek = 40,
  weeksPerYear = 52,
): number {
  const salary = nonNegative(annualSalary);
  const hpw = nonNegative(hoursPerWeek);
  const wpy = nonNegative(weeksPerYear);
  const hours = hpw * wpy;
  return hours > 0 ? salary / hours : 0;
}
