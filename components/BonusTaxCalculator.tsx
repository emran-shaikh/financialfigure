"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, DataTable, ResultPanel } from "@/components/ResultPanel";
import { usd, usd2 } from "@/lib/format";
import { calculateBonus } from "@/lib/bonus";
import type { Filing } from "@/lib/tax/federal2026";

const FILING_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married filing jointly" },
  { value: "head", label: "Head of household" },
];

export default function BonusTaxCalculator() {
  const [bonusAmount, setBonusAmount] = useState(10_000);
  const [regularAnnualSalary, setRegularAnnualSalary] = useState(80_000);
  const [ytdWages, setYtdWages] = useState(80_000);
  const [filing, setFiling] = useState<Filing>("single");

  const result = useMemo(
    () => calculateBonus({ bonusAmount, regularAnnualSalary, ytdWages, filing }),
    [bonusAmount, regularAnnualSalary, ytdWages, filing],
  );

  const medicareTotal = result.medicare + result.additionalMedicare;

  const rows: [string, string][] = [
    ["Federal income tax (flat 22%)", usd(result.federalFlat)],
    ["Social Security", usd(result.socialSecurity)],
    ["Medicare (+ additional)", usd(medicareTotal)],
    ["Total tax withheld", usd(result.totalTaxFlat)],
  ];

  const comparison: string[][] = [
    ["Federal income tax", usd(result.federalFlat), usd(result.federalAggregate)],
    ["FICA (Social Security + Medicare)", usd(result.fica), usd(result.fica)],
    ["Total tax", usd(result.totalTaxFlat), usd(result.totalTaxAggregate)],
    ["Bonus you keep", usd2(result.netBonusFlat), usd2(result.netBonusAggregate)],
  ];

  const differenceIsFlatHigher = result.taxDifference > 0;

  return (
    <CalculatorGrid
      results={
        <div className="grid gap-6">
          <ResultPanel
            eyebrow="Bonus you keep (flat 22% method)"
            headline={usd2(result.netBonusFlat)}
            sub={`On a ${usd(result.bonusAmount)} bonus`}
            rows={rows}
            footer={
              <p>
                Aggregate method withholds <strong>{usd(result.totalTaxAggregate)}</strong> in total,
                so you keep <strong>{usd2(result.netBonusAggregate)}</strong>. The aggregate method
                withholds {usd2(Math.abs(result.taxDifference))}{" "}
                {differenceIsFlatHigher ? "more" : "less"} than the flat 22% method.
              </p>
            }
          />
          <DataTable
            caption="Method comparison"
            headers={["", "Flat 22%", "Aggregate"]}
            rows={comparison}
          />
        </div>
      }
    >
      <InputGroup legend="Your bonus and pay">
        <NumberInput
          label="Bonus amount"
          value={bonusAmount}
          onChange={setBonusAmount}
          step={500}
          prefix="$"
        />
        <SelectInput
          label="Filing status"
          value={filing}
          onChange={(value) => setFiling(value as Filing)}
          options={FILING_OPTIONS}
        />
        <NumberInput
          label="Regular annual salary"
          value={regularAnnualSalary}
          onChange={setRegularAnnualSalary}
          step={1_000}
          prefix="$"
          hint="Used for the aggregate method's marginal tax calculation."
        />
        <NumberInput
          label="Wages already paid this year"
          value={ytdWages}
          onChange={setYtdWages}
          step={1_000}
          prefix="$"
          hint="Year-to-date wages; sets the remaining Social Security wage base."
        />
      </InputGroup>
    </CalculatorGrid>
  );
}
