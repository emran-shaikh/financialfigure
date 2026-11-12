"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { usd, usd2 } from "@/lib/format";
import { calculateMortgage } from "@/lib/mortgage";

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400_000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [annualRatePct, setAnnualRatePct] = useState(6.5);
  const [termYears, setTermYears] = useState("30");
  const [propertyTaxRatePct, setPropertyTaxRatePct] = useState(1.2);
  const [annualInsurance, setAnnualInsurance] = useState(1_800);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [pmiRatePct, setPmiRatePct] = useState(0.5);

  const downPayment = useMemo(
    () => (homePrice * Math.min(Math.max(downPaymentPct, 0), 100)) / 100,
    [homePrice, downPaymentPct],
  );

  const result = useMemo(
    () =>
      calculateMortgage({
        homePrice,
        downPayment,
        annualRatePct,
        termYears: Number(termYears),
        propertyTaxRatePct,
        annualInsurance,
        monthlyHoa,
        // PMI normally only applies below a 20% down payment.
        pmiRatePct: downPaymentPct < 20 ? pmiRatePct : 0,
      }),
    [
      homePrice,
      downPayment,
      annualRatePct,
      termYears,
      propertyTaxRatePct,
      annualInsurance,
      monthlyHoa,
      pmiRatePct,
      downPaymentPct,
    ],
  );

  const rows: [string, string][] = [
    ["Principal & interest", usd(result.monthlyPrincipalAndInterest)],
    ["Property tax", usd(result.monthlyPropertyTax)],
    ["Homeowners insurance", usd(result.monthlyInsurance)],
    ...(result.monthlyPmi > 0 ? ([["PMI", usd(result.monthlyPmi)]] as [string, string][]) : []),
    ...(result.monthlyHoa > 0 ? ([["HOA dues", usd(result.monthlyHoa)]] as [string, string][]) : []),
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Estimated monthly payment"
          headline={usd(result.monthlyTotal)}
          sub={`${usd(result.loanAmount)} loan over ${termYears} years at ${annualRatePct}%`}
          rows={rows}
          footer={
            <>
              <p>
                Total interest over the life of the loan: <strong>{usd(result.totalInterest)}</strong>
              </p>
              <p className="mt-1">
                Total of {result.months} payments: <strong>{usd(result.totalOfPayments)}</strong>
              </p>
            </>
          }
        />
      }
    >
      <InputGroup legend="Loan details">
        <NumberInput
          label="Home price"
          value={homePrice}
          onChange={setHomePrice}
          step={5_000}
          prefix="$"
        />
        <NumberInput
          label="Down payment"
          value={downPaymentPct}
          onChange={setDownPaymentPct}
          step={0.5}
          max={100}
          suffix="%"
          hint={`${usd(downPayment)} of the purchase price`}
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

      <InputGroup legend="Taxes, insurance and fees">
        <NumberInput
          label="Property tax rate"
          value={propertyTaxRatePct}
          onChange={setPropertyTaxRatePct}
          step={0.05}
          suffix="%/yr"
          hint="US average is about 1.0–1.2% of home value per year."
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
          label="PMI rate"
          value={pmiRatePct}
          onChange={setPmiRatePct}
          step={0.05}
          suffix="%/yr"
          hint="Applied only when the down payment is under 20%."
        />
      </InputGroup>
    </CalculatorGrid>
  );
}
