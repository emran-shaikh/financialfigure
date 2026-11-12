import { describe, expect, it } from "vitest";
import { amortizationToCsv } from "./amortizationCsv";
import type { AmortizationRow } from "./mortgage";

const row = (over: Partial<AmortizationRow> = {}): AmortizationRow => ({
  month: 1,
  payment: 1798.65,
  principal: 298.65,
  interest: 1500,
  extra: 0,
  balance: 299701.35,
  ...over,
});

describe("amortizationToCsv", () => {
  it("emits the header row followed by one line per month", () => {
    const csv = amortizationToCsv([row({ month: 1 }), row({ month: 2, balance: 299_402.5 })]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("Month,Payment,Principal,Interest,Extra,Balance");
    expect(lines[1]).toBe("1,1798.65,298.65,1500,0,299701.35");
    expect(lines[2]).toBe("2,1798.65,298.65,1500,0,299402.5");
  });

  it("returns just the header for an empty schedule", () => {
    expect(amortizationToCsv([])).toBe("Month,Payment,Principal,Interest,Extra,Balance");
  });

  it("writes a header with the six expected columns", () => {
    const [header] = amortizationToCsv([]).split("\n");
    expect(header.split(",")).toEqual([
      "Month",
      "Payment",
      "Principal",
      "Interest",
      "Extra",
      "Balance",
    ]);
  });

  it("never writes NaN or Infinity into the file", () => {
    const csv = amortizationToCsv([
      row({ payment: Number.NaN, interest: Number.POSITIVE_INFINITY, balance: Number.NEGATIVE_INFINITY }),
    ]);
    expect(csv).not.toContain("NaN");
    expect(csv).not.toContain("Infinity");
    expect(csv.split("\n")[1]).toBe("1,0,298.65,0,0,0");
  });

  it("handles negative values by writing them verbatim", () => {
    const csv = amortizationToCsv([row({ balance: -12.5, extra: -3 })]);
    expect(csv.split("\n")[1]).toBe("1,1798.65,298.65,1500,-3,-12.5");
  });

  it("handles very large balances without breaking the row shape", () => {
    const csv = amortizationToCsv([row({ balance: 9_007_199_254_740_000 })]);
    const cells = csv.split("\n")[1].split(",");
    expect(cells).toHaveLength(6);
    expect(Number(cells[5])).toBe(9_007_199_254_740_000);
  });
});
