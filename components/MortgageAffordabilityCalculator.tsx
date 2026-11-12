"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { calculateAffordability } from "@/lib/affordability";
import { usd } from "@/lib/format";

export default function MortgageAffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(120_000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60_000);
  const [annualRatePct, setAnnualRatePct] = useState(6.5);
  const [termYears, setTermYears] = useState("30");
  const [propertyTaxRatePct, setPropertyTaxRatePct] = useState(1.2);
  const [annualInsurance, setAnnualInsurance] = useState(1_800);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [frontEndDtiPct, setFrontEndDtiPct] = useState(28);
  const [backEndDtiPct, setBackEndDtiPct] = useState(36);

  const result = useMemo(
    () =>
      calculateAffordability({
        annualIncome,
        monthlyDebts,
        downPayment,
        annualRatePct,
        termYears: Number(termYears),
        propertyTaxRatePct,
        annualInsurance,
        monthlyHoa,
        frontEndDtiPct,
        backEndDtiPct,
      }),
    [
      annualIncome,
      monthlyDebts,
      downPayment,
      annualRatePct,
      termYears,
      propertyTaxRatePct,
      annualInsurance,
      monthlyHoa,
      frontEndDtiPct,
      backEndDtiPct,
    ],
  );

  const rows: [string, string][] = [
    ["Loan amount", usd(result.maxLoanAmount)],
    ["Down payment", usd(downPayment)],
    ["Principal & interest", usd(result.monthlyPrincipalAndInterest)],
    ["Property tax", usd(result.monthlyPropertyTax)],
    ["Homeowners insurance", usd(result.monthlyInsurance)],
    ...(result.monthlyHoa > 0
      ? ([["HOA dues", usd(result.monthlyHoa)]] as [string, string][])
      : []),
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Home price you can afford"
          headline={usd(result.maxHomePrice)}
          sub={`${usd(result.maxLoanAmount)} loan · ${usd(downPayment)} down`}
          rows={rows}
          footer={
            <>
              <p>
                Monthly housing budget: <strong>{usd(result.maxHousingBudget)}</strong>
              </p>
              <p className="mt-1">
                Front-end cap {usd(result.frontEndCap)} · back-end cap {usd(result.backEndCap)}
              </p>
              <p className="mt-1">
                Estimated total monthly cost at this price:{" "}
                <strong>{usd(result.monthlyTotalAtMax)}</strong>
              </p>
            </>
          }
        />
      }
    >
      <InputGroup legend="Income and debts">
        <NumberInput
          label="Annual income"
          value={annualIncome}
          onChange={setAnnualIncome}
          step={5_000}
          prefix="$"
        />
        <NumberInput
          label="Monthly debt payments"
          value={monthlyDebts}
          onChange={setMonthlyDebts}
          step={50}
          prefix="$"
          suffix="/mo"
          hint="Cars, student loans, credit cards and other minimum payments."
        />
      </InputGroup>

      <InputGroup legend="Down payment and loan">
        <NumberInput
          label="Down payment"
          value={downPayment}
          onChange={setDownPayment}
          step={5_000}
          prefix="$"
        />
        <NumberInput
          label="Interest rate"
          value={annualRatePct}
          onChange={setAnnualRatePct}
          step={0.125}
          suffix="%"
        />
        <SelectInput
          label="Loan term"
          value={termYears}
          onChange={setTermYears}
          options={[
            { value: "30", label: "30 years" },
            { value: "20", label: "20 years" },
            { value: "15", label: "15 years" },
            { value: "10", label: "10 years" },
          ]}
        />
      </InputGroup>

      <InputGroup legend="Taxes, insurance and DTI limits">
        <NumberInput
          label="Property tax rate"
          value={propertyTaxRatePct}
          onChange={setPropertyTaxRatePct}
          step={0.05}
          suffix="%/yr"
        />
        <NumberInput
          label="Homeowners insurance"
          value={annualInsurance}
          onChange={setAnnualInsurance}
          step={100}
          prefix="$"
          suffix="/yr"
        />
        <NumberInput
          label="HOA dues"
          value={monthlyHoa}
          onChange={setMonthlyHoa}
          step={10}
          prefix="$"
          suffix="/mo"
        />
        <NumberInput
          label="Front-end DTI limit"
          value={frontEndDtiPct}
          onChange={setFrontEndDtiPct}
          step={1}
          max={100}
          suffix="%"
          hint="Housing costs as a share of gross monthly income."
        />
        <NumberInput
          label="Back-end DTI limit"
          value={backEndDtiPct}
          onChange={setBackEndDtiPct}
          step={1}
          max={100}
          suffix="%"
          hint="All debts including housing, as a share of gross income."
        />
      </InputGroup>
    </CalculatorGrid>
  );
}
