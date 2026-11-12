"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { usd, usd2, pctValue } from "@/lib/format";
import { calculateCompound } from "@/lib/compound";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10_000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRatePct, setAnnualRatePct] = useState(7);
  const [years, setYears] = useState(20);
  const [frequency, setFrequency] = useState("12");
  const [timing, setTiming] = useState("end");

  const result = useMemo(
    () =>
      calculateCompound({
        principal,
        monthlyContribution,
        annualRatePct,
        years,
        compoundFrequencyPerYear: Number(frequency),
        contributionsAtStartOfPeriod: timing === "start",
      }),
    [principal, monthlyContribution, annualRatePct, years, frequency, timing],
  );

  const rows: [string, string][] = [
    ["Starting principal", usd(principal)],
    ["Total contributions", usd(result.totalContributions)],
    ["Total interest earned", usd(result.totalInterest)],
    ["Effective annual rate (APY)", pctValue(result.effectiveAnnualRatePct, 2)],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Future value"
          headline={usd(result.futureValue)}
          sub={`${usd(result.totalContributions)} contributed over ${years} years`}
          rows={rows}
          footer={
            <>
              <p>
                Compounded {result.compoundFrequencyPerYear === 12 ? "monthly" : `${result.compoundFrequencyPerYear}× per year`} at{" "}
                {pctValue(annualRatePct, 2)} nominal.
              </p>
              <p className="mt-1">
                Growth on your money: <strong>{usd(result.totalInterest)}</strong>
              </p>
            </>
          }
        />
      }
    >
      <InputGroup legend="Your saving plan">
        <NumberInput
          label="Starting principal"
          value={principal}
          onChange={setPrincipal}
          step={1_000}
          prefix="$"
        />
        <NumberInput
          label="Monthly contribution"
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          step={50}
          prefix="$"
          suffix="/mo"
        />
        <NumberInput
          label="Annual interest rate"
          value={annualRatePct}
          onChange={setAnnualRatePct}
          step={0.25}
          suffix="%"
          hint="Nominal annual rate before compounding."
        />
        <NumberInput
          label="Years to grow"
          value={years}
          onChange={setYears}
          step={1}
          max={120}
          suffix="yrs"
        />
        <SelectInput
          label="Compounding frequency"
          value={frequency}
          onChange={setFrequency}
          options={[
            { value: "1", label: "Annually" },
            { value: "2", label: "Semi-annually" },
            { value: "4", label: "Quarterly" },
            { value: "12", label: "Monthly" },
          ]}
        />
        <SelectInput
          label="Contributions added"
          value={timing}
          onChange={setTiming}
          options={[
            { value: "end", label: "End of each month" },
            { value: "start", label: "Start of each month" },
          ]}
        />
      </InputGroup>

      <p className="text-sm text-slate-500">
        Assumes the contribution amount stays constant and no tax or fees are deducted. In
        {timing === "start" ? " start-of-month" : " end-of-month"} deposits, each payment earns
        interest {timing === "start" ? "from the moment it is made" : "only for the following month"}. Future
        value after {years} years: <strong>{usd2(result.futureValue)}</strong>.
      </p>
    </CalculatorGrid>
  );
}
