/**
 * Number formatting helpers.
 *
 * Every helper is NaN/Infinity safe: calculators may receive empty, negative or
 * absurdly large inputs, and the UI must never render "NaN" or "$Infinity".
 */

const safe = (n: number): number => (Number.isFinite(n) ? n : 0);

/** Currency with 0 decimals by default, e.g. $1,234. */
export function usd(n: number, decimals = 0): string {
  return safe(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Currency with cents, e.g. $1,234.56. */
export function usd2(n: number): string {
  return usd(n, 2);
}

/** Compact currency for chart axes and summaries, e.g. $1.2M. */
export function usdCompact(n: number): string {
  return safe(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

/** Percentage from a decimal fraction, e.g. 0.072 -> "7.2%". */
export function pct(fraction: number, decimals = 1): string {
  return `${(safe(fraction) * 100).toFixed(decimals)}%`;
}

/** Appends a percent sign to a value already expressed in percent. */
export function pctValue(percent: number, decimals = 1): string {
  return `${safe(percent).toFixed(decimals)}%`;
}

/** Plain number with thousands separators. */
export function num(n: number, decimals = 0): string {
  return safe(n).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Turns a month count into a human phrase such as "12 years 4 months". */
export function monthsToText(months: number): string {
  const total = Math.max(0, Math.round(safe(months)));
  const years = Math.floor(total / 12);
  const rest = total % 12;
  const yearPart = years > 0 ? `${years} year${years === 1 ? "" : "s"}` : "";
  const monthPart = rest > 0 ? `${rest} month${rest === 1 ? "" : "s"}` : "";
  return [yearPart, monthPart].filter(Boolean).join(" ") || "0 months";
}

/** Parses a form input value into a finite number, defaulting to 0. */
export function parseNumber(raw: string): number {
  if (raw.trim() === "") return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}
