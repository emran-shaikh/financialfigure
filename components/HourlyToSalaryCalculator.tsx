"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, DataTable, ResultPanel } from "@/components/ResultPanel";
import { num, usd, usd2 } from "@/lib/format";
import { calculateHourly, salaryToHourly } from "@/lib/hourly";

type Mode = "hourly" | "salary";

export default function HourlyToSalaryCalculator() {
  const [mode, setMode] = useState<Mode>("hourly");
  const [hourlyRate, setHourlyRate] = useState(25);
  const [annualSalary, setAnnualSalary] = useState(52_000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [overtimeHoursPerWeek, setOvertimeHoursPerWeek] = useState(0);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5);

  const result = useMemo(() => {
    const rate =
      mode === "hourly"
        ? hourlyRate
        : salaryToHourly(annualSalary, hoursPerWeek, weeksPerYear);

    return calculateHourly({
      hourlyRate: rate,
      hoursPerWeek,
      weeksPerYear,
      // Overtime is only modelled when converting from an hourly rate.
      overtimeHoursPerWeek: mode === "hourly" ? overtimeHoursPerWeek : 0,
      overtimeMultiplier,
    });
  }, [
    mode,
    hourlyRate,
    annualSalary,
    hoursPerWeek,
    weeksPerYear,
    overtimeHoursPerWeek,
    overtimeMultiplier,
  ]);

  const baseRate = mode === "hourly" ? hourlyRate : result.effectiveHourlyRate;

  const rows: [string, string][] = [
    ["Effective hourly rate", usd2(result.effectiveHourlyRate)],
    ["Annual hours", num(result.annualHours)],
    ...(result.annualOvertimePay > 0
      ? ([[ "Overtime pay / year", usd(result.annualOvertimePay)]] as [string, string][])
      : []),
  ];

  const tableRows: string[][] = [
    ["Hourly (base rate)", usd2(baseRate)],
    ["Daily (5-day week)", usd2(result.dailyPay)],
    ["Weekly", usd2(result.weeklyPay)],
    ["Bi-weekly", usd2(result.biweeklyPay)],
    ["Monthly", usd2(result.monthlyPay)],
    ["Annual", usd(result.annualSalary)],
  ];

  return (
    <CalculatorGrid
      results={
        <div className="grid gap-6">
          <ResultPanel
            eyebrow={mode === "hourly" ? "Estimated annual salary" : "Estimated hourly rate"}
            headline={
              mode === "hourly" ? usd(result.annualSalary) : usd2(result.effectiveHourlyRate)
            }
            sub={`${num(hoursPerWeek)} hours/week · ${num(weeksPerYear)} weeks/year`}
            rows={rows}
            footer={
              <p>
                {usd(result.annualSalary)} a year is {usd(result.monthlyPay)} a month and{" "}
                {usd2(result.weeklyPay)} a week.
              </p>
            }
          />
          <DataTable caption="Gross pay by period" headers={["Period", "Gross pay"]} rows={tableRows} />
        </div>
      }
    >
      <InputGroup legend="What do you know?">
        <SelectInput
          label="Conversion"
          value={mode}
          onChange={(value) => setMode(value as Mode)}
          options={[
            { value: "hourly", label: "Hourly rate → salary" },
            { value: "salary", label: "Salary → hourly rate" },
          ]}
        />
        {mode === "hourly" ? (
          <NumberInput
            label="Hourly rate"
            value={hourlyRate}
            onChange={setHourlyRate}
            step={0.25}
            prefix="$"
          />
        ) : (
          <NumberInput
            label="Annual salary"
            value={annualSalary}
            onChange={setAnnualSalary}
            step={1_000}
            prefix="$"
          />
        )}
      </InputGroup>

      <InputGroup legend="Work schedule">
        <NumberInput
          label="Hours per week"
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          step={1}
          suffix="h"
          hint="Full time is usually 40 hours."
        />
        <NumberInput
          label="Weeks per year"
          value={weeksPerYear}
          onChange={setWeeksPerYear}
          step={1}
          suffix="wk"
          hint="52 paid weeks; use 50 for two unpaid weeks off."
        />
        {mode === "hourly" && (
          <>
            <NumberInput
              label="Overtime hours per week"
              value={overtimeHoursPerWeek}
              onChange={setOvertimeHoursPerWeek}
              step={1}
              suffix="h"
            />
            <NumberInput
              label="Overtime multiplier"
              value={overtimeMultiplier}
              onChange={setOvertimeMultiplier}
              step={0.25}
              suffix="×"
              hint="Time-and-a-half is 1.5×."
            />
          </>
        )}
      </InputGroup>
    </CalculatorGrid>
  );
}
