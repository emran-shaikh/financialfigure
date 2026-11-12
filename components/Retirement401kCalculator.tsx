"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput } from "@/components/Inputs";
import { CalculatorGrid, DataTable, ResultPanel } from "@/components/ResultPanel";
import { usd } from "@/lib/format";
import { calculate401k, type Retirement401kYear } from "@/lib/retirement401k";

export default function Retirement401kCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(25_000);
  const [annualSalary, setAnnualSalary] = useState(75_000);
  const [contributionPct, setContributionPct] = useState(10);
  const [employerMatchPct, setEmployerMatchPct] = useState(50);
  const [employerMatchCapPctOfSalary, setEmployerMatchCapPctOfSalary] = useState(6);
  const [annualRaisePct, setAnnualRaisePct] = useState(3);
  const [annualReturnPct, setAnnualReturnPct] = useState(7);

  const result = useMemo(
    () =>
      calculate401k({
        currentAge,
        retirementAge,
        currentBalance,
        annualSalary,
        contributionPct,
        employerMatchPct,
        employerMatchCapPctOfSalary,
        annualRaisePct,
        annualReturnPct,
      }),
    [
      currentAge,
      retirementAge,
      currentBalance,
      annualSalary,
      contributionPct,
      employerMatchPct,
      employerMatchCapPctOfSalary,
      annualRaisePct,
      annualReturnPct,
    ],
  );

  // Sample a readable set of milestone years for the schedule table.
  const milestones = useMemo<Retirement401kYear[]>(() => {
    const s = result.schedule;
    if (s.length <= 12) return s;
    const step = Math.ceil(s.length / 10);
    const picked = s.filter((_, i) => i % step === 0);
    const last = s[s.length - 1];
    if (picked[picked.length - 1] !== last) picked.push(last);
    return picked;
  }, [result.schedule]);

  const rows: [string, string][] = [
    ["Your contributions", usd(result.totalEmployeeContributions)],
    ["Employer match", usd(result.totalEmployerMatch)],
    ["Investment growth", usd(result.totalGrowth)],
    ["2026 deferral limit (your age)", usd(result.currentDeferralLimit)],
  ];

  return (
    <div className="grid gap-8">
      <CalculatorGrid
        results={
          <ResultPanel
            eyebrow={`Projected balance at age ${retirementAge}`}
            headline={usd(result.projectedBalance)}
            sub={`${result.years} years of contributions`}
            rows={rows}
            footer={
              <>
                <p>Deferral caps use the 2026 IRS limits (Notice 2025-67): $24,500 plus the age-50 and 60–63 catch-ups.</p>
              </>
            }
          />
        }
      >
        <InputGroup legend="You">
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
            label="Current 401(k) balance"
            value={currentBalance}
            onChange={setCurrentBalance}
            step={1_000}
            prefix="$"
          />
          <NumberInput
            label="Annual salary"
            value={annualSalary}
            onChange={setAnnualSalary}
            step={1_000}
            prefix="$"
          />
        </InputGroup>

        <InputGroup legend="Contributions and growth">
          <NumberInput
            label="Your contribution"
            value={contributionPct}
            onChange={setContributionPct}
            step={0.5}
            max={100}
            suffix="% of salary"
            hint={`Capped at the 2026 IRS limit of ${usd(result.currentDeferralLimit)} at your age.`}
          />
          <NumberInput
            label="Annual raise"
            value={annualRaisePct}
            onChange={setAnnualRaisePct}
            step={0.5}
            suffix="%/yr"
          />
          <NumberInput
            label="Employer match"
            value={employerMatchPct}
            onChange={setEmployerMatchPct}
            step={5}
            max={200}
            suffix="% of your contribution"
          />
          <NumberInput
            label="Match limit"
            value={employerMatchCapPctOfSalary}
            onChange={setEmployerMatchCapPctOfSalary}
            step={0.5}
            max={100}
            suffix="% of salary"
            hint="The employer only matches up to this share of your salary."
          />
          <NumberInput
            label="Expected annual return"
            value={annualReturnPct}
            onChange={setAnnualReturnPct}
            step={0.25}
            suffix="%"
          />
        </InputGroup>
      </CalculatorGrid>

      {milestones.length > 0 && (
        <DataTable
          caption={`Milestone projection to age ${retirementAge} (contributions assumed to land during each year)`}
          headers={["Age", "Salary", "You contribute", "Employer match", "End balance"]}
          rows={milestones.map((m) => [
            m.age,
            usd(m.salary),
            usd(m.employeeContribution),
            usd(m.employerMatch),
            usd(m.endBalance),
          ])}
        />
      )}
    </div>
  );
}
