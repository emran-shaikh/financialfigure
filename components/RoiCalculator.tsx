"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { usd, pctValue } from "@/lib/format";
import { calculateRoi } from "@/lib/roi";

export default function RoiCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10_000);
  const [finalValue, setFinalValue] = useState(15_000);
  const [additionalCosts, setAdditionalCosts] = useState(0);
  const [years, setYears] = useState(3);

  const result = useMemo(
    () => calculateRoi({ initialInvestment, finalValue, additionalCosts, years }),
    [initialInvestment, finalValue, additionalCosts, years],
  );

  const error = result.error;

  const rows: [string, string][] = [
    ["Annualised return", pctValue(result.annualizedRoiPct, 2)],
    ["Absolute profit", usd(result.absoluteProfit)],
    ["Total cost basis", usd(result.totalCost)],
    ["Holding period", `${result.years} years`],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Return on investment"
          headline={error ? "—" : pctValue(result.roiPct, 2)}
          sub={error ?? `${usd(result.absoluteProfit)} profit on ${usd(result.totalCost)} invested`}
          rows={error ? undefined : rows}
          footer={
            error ? undefined : (
              <p>
                Over {result.years >= 1 ? `${result.years} years` : "under a year"} that equals{" "}
                <strong>{pctValue(result.annualizedRoiPct, 2)}</strong> a year.
              </p>
            )
          }
        />
      }
    >
      <InputGroup legend="The investment">
        <NumberInput
          label="Initial investment"
          value={initialInvestment}
          onChange={setInitialInvestment}
          step={500}
          prefix="$"
        />
        <NumberInput
          label="Final value"
          value={finalValue}
          onChange={setFinalValue}
          step={500}
          prefix="$"
        />
        <NumberInput
          label="Additional costs"
          value={additionalCosts}
          onChange={setAdditionalCosts}
          step={100}
          prefix="$"
          hint="Fees, commissions or upkeep added to your cost basis."
        />
        <NumberInput
          label="Holding period"
          value={years}
          onChange={setYears}
          step={1}
          max={120}
          suffix="yrs"
          hint="Annualised return is applied for periods of one year or more."
        />
      </InputGroup>

      {error && (
        <p role="status" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      <p className="text-sm text-slate-500">
        ROI measures profit against everything you put in, including costs. Comparing a{" "}
        {error ? "return" : pctValue(result.roiPct, 1)} total return over different time frames is
        misleading, so the annualised figure converts it into an equivalent yearly rate.
      </p>
    </CalculatorGrid>
  );
}
