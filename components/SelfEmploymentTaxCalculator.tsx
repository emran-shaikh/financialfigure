"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { pct, usd, usd2 } from "@/lib/format";
import { calculateSelfEmployment } from "@/lib/selfEmployment";
import type { Filing } from "@/lib/tax/federal2026";

const FILING_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married filing jointly" },
  { value: "head", label: "Head of household" },
];

export default function SelfEmploymentTaxCalculator() {
  const [netProfit, setNetProfit] = useState(100_000);
  const [filing, setFiling] = useState<Filing>("single");
  const [otherWages, setOtherWages] = useState(0);

  const result = useMemo(
    () => calculateSelfEmployment({ netProfit, filing, otherWages }),
    [netProfit, filing, otherWages],
  );

  const rows: [string, string][] = [
    ["Net earnings subject to SECA", usd(result.seBase)],
    ["Social Security (12.4%)", usd(result.socialSecurityTax)],
    ["Medicare (2.9%)", usd(result.medicareTax)],
    ["Additional Medicare (0.9%)", usd(result.additionalMedicareTax)],
    ["Self-employment tax", usd(result.seTax)],
    ["Deductible half of SECA", usd(result.deductibleHalf)],
    ["Federal taxable income", usd(result.federalTaxableIncome)],
    ["Federal income tax", usd(result.federalIncomeTax)],
    ["Effective tax rate", pct(result.effectiveRate)],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Estimated total tax"
          headline={usd(result.totalTax)}
          sub={`Self-employment tax ${usd(result.seTax)} + federal income tax ${usd(result.federalIncomeTax)}`}
          rows={rows}
          footer={
            <p>
              Suggested quarterly estimated payment:{" "}
              <strong>{usd2(result.quarterlyPayment)}</strong> (four payments a year).
            </p>
          }
        />
      }
    >
      <InputGroup legend="Your business income">
        <NumberInput
          label="Net profit (annual)"
          value={netProfit}
          onChange={setNetProfit}
          step={1_000}
          prefix="$"
          hint="Business income minus business expenses."
        />
        <SelectInput
          label="Filing status"
          value={filing}
          onChange={(value) => setFiling(value as Filing)}
          options={FILING_OPTIONS}
        />
        <NumberInput
          label="Other W-2 wages"
          value={otherWages}
          onChange={setOtherWages}
          step={1_000}
          prefix="$"
          hint="Wages from a job; reduces your remaining Social Security wage base."
        />
      </InputGroup>
    </CalculatorGrid>
  );
}
