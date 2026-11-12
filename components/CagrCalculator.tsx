"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { usd, pctValue } from "@/lib/format";
import { calculateCagr } from "@/lib/cagr";

export default function CagrCalculator() {
  const [beginningValue, setBeginningValue] = useState(10_000);
  const [endingValue, setEndingValue] = useState(20_000);
  const [years, setYears] = useState(10);

  const result = useMemo(
    () => calculateCagr({ beginningValue, endingValue, years }),
    [beginningValue, endingValue, years],
  );

  const error = result.error;

  const rows: [string, string][] = [
    ["Total return", pctValue(result.totalReturnPct, 2)],
    ["Absolute gain", usd(result.absoluteGain)],
    ["Holding period", `${result.years} years`],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Compound annual growth rate"
          headline={error ? "—" : pctValue(result.cagrPct, 2)}
          sub={
            error ??
            `${usd(beginningValue)} grew to ${usd(endingValue)} over ${result.years} years`
          }
          rows={error ? undefined : rows}
          footer={
            error ? undefined : (
              <p>
                A {pctValue(result.totalReturnPct, 1)} total return equals{" "}
                <strong>{pctValue(result.cagrPct, 2)}</strong> a year compounded.
              </p>
            )
          }
        />
      }
    >
      <InputGroup legend="Investment values">
        <NumberInput
          label="Beginning value"
          value={beginningValue}
          onChange={setBeginningValue}
          step={1_000}
          prefix="$"
        />
        <NumberInput
          label="Ending value"
          value={endingValue}
          onChange={setEndingValue}
          step={1_000}
          prefix="$"
        />
        <NumberInput
          label="Holding period"
          value={years}
          onChange={setYears}
          step={1}
          max={120}
          suffix="yrs"
        />
      </InputGroup>

      {error && (
        <p role="status" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      <p className="text-sm text-slate-500">
        CAGR smooths a bumpy ride into one constant yearly rate: it is the rate that turns your
        beginning value into the ending value in the given time. It is{" "}
        {error ? "unavailable" : pctValue(result.cagrPct, 2)} here, regardless of how the returns
        were actually earned year to year.
      </p>
    </CalculatorGrid>
  );
}
