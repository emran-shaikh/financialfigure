"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { usd } from "@/lib/format";
import { calculateRentVsBuy } from "@/lib/rentVsBuy";

export default function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState(400_000);
  const [downPayment, setDownPayment] = useState(80_000);
  const [ratePct, setRatePct] = useState(6.5);
  const [termYears, setTermYears] = useState("30");
  const [monthlyRent, setMonthlyRent] = useState(2_000);
  const [rentGrowthPct, setRentGrowthPct] = useState(3);
  const [appreciationPct, setAppreciationPct] = useState(3);
  const [propertyTaxRatePct, setPropertyTaxRatePct] = useState(1.2);
  const [maintenancePct, setMaintenancePct] = useState(1);
  const [annualInsurance, setAnnualInsurance] = useState(1_800);
  const [yearsToStay, setYearsToStay] = useState(7);
  const [purchaseClosingCostPct, setPurchaseClosingCostPct] = useState(2);
  const [sellingCostPct, setSellingCostPct] = useState(6);

  const result = useMemo(
    () =>
      calculateRentVsBuy({
        homePrice,
        downPayment,
        ratePct,
        termYears: Number(termYears),
        monthlyRent,
        rentGrowthPct,
        appreciationPct,
        propertyTaxRatePct,
        maintenancePct,
        annualInsurance,
        yearsToStay,
        purchaseClosingCostPct,
        sellingCostPct,
      }),
    [
      homePrice,
      downPayment,
      ratePct,
      termYears,
      monthlyRent,
      rentGrowthPct,
      appreciationPct,
      propertyTaxRatePct,
      maintenancePct,
      annualInsurance,
      yearsToStay,
      purchaseClosingCostPct,
      sellingCostPct,
    ],
  );

  const cheaper = result.cheaperOption === "buy" ? "Buying" : "Renting";
  const even = Math.abs(result.difference) < 1;

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow={even ? "Buying and renting cost about the same" : `${cheaper} is cheaper by`}
          headline={usd(Math.abs(result.difference))}
          sub={`Over ${result.yearsToStay} year${result.yearsToStay === 1 ? "" : "s"}`}
          rows={[
            ["Net cost of buying", usd(result.totalBuyingCost)],
            ["Cost of renting", usd(result.totalRentingCost)],
            ["Up-front costs (buying)", usd(result.totalUpfrontCosts)],
            ["Interest paid", usd(result.totalInterestPaid)],
            ["Home value at sale", usd(result.homeValueAtSale)],
            ["Sale proceeds", usd(result.saleProceeds)],
            ["Remaining loan balance", usd(result.remainingLoanBalance)],
          ]}
          footer={
            <p>
              A simplified model: taxes, insurance and maintenance are held flat, and taxes on gains
              and the opportunity cost of the down payment are not included.
            </p>
          }
        />
      }
    >
      <InputGroup legend="Home and loan">
        <NumberInput
          label="Home price"
          value={homePrice}
          onChange={setHomePrice}
          step={5_000}
          prefix="$"
        />
        <NumberInput
          label="Down payment"
          value={downPayment}
          onChange={setDownPayment}
          step={5_000}
          prefix="$"
        />
        <NumberInput
          label="Interest rate"
          value={ratePct}
          onChange={setRatePct}
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

      <InputGroup legend="Renting">
        <NumberInput
          label="Monthly rent"
          value={monthlyRent}
          onChange={setMonthlyRent}
          step={50}
          prefix="$"
          suffix="/mo"
        />
        <NumberInput
          label="Rent increase"
          value={rentGrowthPct}
          onChange={setRentGrowthPct}
          step={0.5}
          suffix="%/yr"
        />
        <NumberInput
          label="Years you'll stay"
          value={yearsToStay}
          onChange={setYearsToStay}
          step={1}
          suffix="yrs"
        />
      </InputGroup>

      <InputGroup legend="Owning costs and growth">
        <NumberInput
          label="Home appreciation"
          value={appreciationPct}
          onChange={setAppreciationPct}
          step={0.5}
          suffix="%/yr"
        />
        <NumberInput
          label="Property tax rate"
          value={propertyTaxRatePct}
          onChange={setPropertyTaxRatePct}
          step={0.05}
          suffix="%/yr"
        />
        <NumberInput
          label="Maintenance"
          value={maintenancePct}
          onChange={setMaintenancePct}
          step={0.1}
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
          label="Buying closing costs"
          value={purchaseClosingCostPct}
          onChange={setPurchaseClosingCostPct}
          step={0.5}
          suffix="%"
        />
        <NumberInput
          label="Selling costs"
          value={sellingCostPct}
          onChange={setSellingCostPct}
          step={0.5}
          suffix="%"
        />
      </InputGroup>
    </CalculatorGrid>
  );
}
