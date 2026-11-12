"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { usd, pctValue } from "@/lib/format";
import { calculateInflation } from "@/lib/inflation";

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(50_000);
  const [inflationRatePct, setInflationRatePct] = useState(3);
  const [investmentReturnPct, setInvestmentReturnPct] = useState(6);
  const [years, setYears] = useState(20);

  const result = useMemo(
    () =>
      calculateInflation({ currentAmount, inflationRatePct, investmentReturnPct, years }),
    [currentAmount, inflationRatePct, investmentReturnPct, years],
  );

  const rows: [string, string][] = [
    ["Future nominal value", usd(result.futureNominalValue)],
    ["Purchasing power of the cash", usd(result.futurePurchasingPower)],
    ["Real (today's-dollars) value", usd(result.realValueOfInvestment)],
    ["Real annual return", pctValue(result.realReturnPct, 2)],
    ["Buying power lost to inflation", usd(result.purchasingPowerLoss)],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Value in today's dollars"
          headline={usd(result.realValueOfInvestment)}
          sub={`${usd(currentAmount)} invested for ${years} years at ${pctValue(investmentReturnPct, 1)}`}
          rows={rows}
          footer={
            <>
              <p>
                Nominal gain: <strong>{usd(result.nominalGain)}</strong> · real return{" "}
                <strong>{pctValue(result.realReturnPct, 2)}</strong> a year.
              </p>
            </>
          }
        />
      }
    >
      <InputGroup legend="What you are tracking">
        <NumberInput
          label="Amount today"
          value={currentAmount}
          onChange={setCurrentAmount}
          step={1_000}
          prefix="$"
        />
        <NumberInput
          label="Expected inflation"
          value={inflationRatePct}
          onChange={setInflationRatePct}
          step={0.1}
          suffix="%/yr"
        />
        <NumberInput
          label="Investment return"
          value={investmentReturnPct}
          onChange={setInvestmentReturnPct}
          step={0.25}
          suffix="%/yr"
        />
        <NumberInput
          label="Years"
          value={years}
          onChange={setYears}
          step={1}
          max={120}
          suffix="yrs"
        />
      </InputGroup>

      <p className="text-sm text-slate-500">
        Inflation shrinks what a dollar buys; a positive real return means your investment outruns
        rising prices. With {pctValue(inflationRatePct, 1)} inflation, today&apos;s{" "}
        {usd(currentAmount)} of idle cash would need to grow to keep pace, and the money left in
        cash instead loses about {usd(result.purchasingPowerLoss)} of buying power over {years} years.
      </p>
    </CalculatorGrid>
  );
}
