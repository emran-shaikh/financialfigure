"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { usd, pctValue } from "@/lib/format";
import { calculateIra } from "@/lib/ira";

export default function RothVsTraditionalIraCalculator() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [annualContribution, setAnnualContribution] = useState(7_500);
  const [currentMarginalTaxRatePct, setCurrentMarginalTaxRatePct] = useState(24);
  const [retirementTaxRatePct, setRetirementTaxRatePct] = useState(22);
  const [annualReturnPct, setAnnualReturnPct] = useState(7);

  const result = useMemo(
    () =>
      calculateIra({
        currentAge,
        retirementAge,
        annualContribution,
        currentMarginalTaxRatePct,
        retirementTaxRatePct,
        annualReturnPct,
      }),
    [
      currentAge,
      retirementAge,
      annualContribution,
      currentMarginalTaxRatePct,
      retirementTaxRatePct,
      annualReturnPct,
    ],
  );

  const winnerLabel =
    result.winner === "traditional"
      ? "Traditional IRA"
      : result.winner === "roth"
        ? "Roth IRA"
        : "a tie";

  const best = Math.max(result.traditionalAfterTax, result.rothAfterTax);

  const rows: [string, string][] = [
    ["Traditional IRA (after tax)", usd(result.traditionalAfterTax)],
    ["Roth IRA (tax-free)", usd(result.rothAfterTax)],
    ["Difference", usd(result.difference)],
    ["Roth contribution after tax", usd(result.netRothContribution)],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="After-tax balance at retirement"
          headline={usd(best)}
          sub={`${winnerLabel} comes out ahead after ${result.years} years`}
          rows={rows}
          footer={
            <>
              <p>
                Traditional balance before withdrawal tax: <strong>{usd(result.traditionalPreTaxBalance)}</strong>
              </p>
              <p className="mt-1">
                Tax due at withdrawal ({pctValue(retirementTaxRatePct, 0)}):{" "}
                <strong>{usd(result.taxOnWithdrawal)}</strong>
              </p>
            </>
          }
        />
      }
    >
      <InputGroup legend="Your assumptions">
        <NumberInput label="Current age" value={currentAge} onChange={setCurrentAge} step={1} max={100} suffix="yrs" />
        <NumberInput
          label="Retirement age"
          value={retirementAge}
          onChange={setRetirementAge}
          step={1}
          max={100}
          suffix="yrs"
        />
        <NumberInput
          label="Gross yearly contribution"
          value={annualContribution}
          onChange={setAnnualContribution}
          step={500}
          prefix="$"
          hint="The same pre-tax amount is used for both accounts."
        />
        <NumberInput
          label="Expected annual return"
          value={annualReturnPct}
          onChange={setAnnualReturnPct}
          step={0.25}
          suffix="%"
        />
        <NumberInput
          label="Tax rate now"
          value={currentMarginalTaxRatePct}
          onChange={setCurrentMarginalTaxRatePct}
          step={1}
          max={100}
          suffix="%"
          hint="Marginal rate applied to Roth contributions today."
        />
        <NumberInput
          label="Tax rate in retirement"
          value={retirementTaxRatePct}
          onChange={setRetirementTaxRatePct}
          step={1}
          max={100}
          suffix="%"
          hint="Marginal rate applied to traditional withdrawals."
        />
      </InputGroup>

      <p className="text-sm text-slate-500">
        Both accounts start from the same pre-tax dollars: the traditional IRA invests the full
        amount, while the Roth IRA invests what remains after paying {pctValue(currentMarginalTaxRatePct, 0)} tax
        today. Whichever tax rate is lower tends to win — the Roth when you expect to pay more tax
        later, the traditional when you expect to pay less.
      </p>
    </CalculatorGrid>
  );
}
