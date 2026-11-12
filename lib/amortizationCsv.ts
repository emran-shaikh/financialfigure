/**
 * Serialise a mortgage amortisation schedule to CSV so it can be opened in a
 * spreadsheet. Pure string transformation — no DOM, no I/O.
 *
 * Columns: Month,Payment,Principal,Interest,Extra,Balance
 *
 * Every numeric cell is guarded so a stray NaN/Infinity can never leak into the
 * downloaded file (it is written as 0 instead).
 *
 * Last reviewed: 2026-11-12
 */

import type { AmortizationRow } from "@/lib/mortgage";

const HEADER = "Month,Payment,Principal,Interest,Extra,Balance";

/** Finite-safe number -> CSV cell. */
const cell = (n: number): string => (Number.isFinite(n) ? String(n) : "0");

/** Converts amortisation rows into a CSV string (header row included). */
export function amortizationToCsv(rows: AmortizationRow[]): string {
  const lines = rows.map((r) =>
    [r.month, r.payment, r.principal, r.interest, r.extra, r.balance].map(cell).join(","),
  );
  return [HEADER, ...lines].join("\n");
}

/** Suggested file name for the downloaded schedule. */
export const AMORTIZATION_CSV_FILENAME = "amortization-schedule.csv";
