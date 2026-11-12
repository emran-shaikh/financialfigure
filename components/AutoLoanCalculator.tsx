"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { usd, usd2 } from "@/lib/format";
import { calculateAutoLoan } from "@/lib/autoLoan";

export default function AutoLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(35_000);
  const [downPayment, setDownPayment] = useState(5_000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [salesTaxPct, setSalesTaxPct] = useState(6.5);
  const [fees, setFees] = useState(400);
  const [dealerFees, setDealerFees] = useState(500);
  const [annualRatePct, setAnnualRatePct] = useState(7.5);
  const [termMonths, setTermMonths] = useState("60");

  const result = useMemo(
    () =>
      calculateAutoLoan({
        vehiclePrice,
        downPayment,
        tradeInValue,
        salesTaxPct,
        fees,
        dealerFees,
        annualRatePct,
        termMonths: Number(termMonths),
      }),
    [vehiclePrice, downPayment, tradeInValue, salesTaxPct, fees, dealerFees, annualRatePct, termMonths],
  );

  const rows: [string, string][] = [
    ["Amount financed", usd(result.amountFinanced)],
    ["Sales tax", usd(result.salesTax)],
    ["Total interest", usd(result.totalInterest)],
    ["Total of loan payments", usd(result.totalLoanPayments)],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Estimated monthly payment"
          headline={usd2(result.monthlyPayment)}
          sub={`${usd(result.amountFinanced)} financed over ${termMonths} months at ${annualRatePct}%`}
          rows={rows}
          footer={
            <>
              <p>
                Total cost of the vehicle: <strong>{usd(result.totalCost)}</strong>
              </p>
              <p className="mt-1">
                Includes {usd(result.salesTax)} sales tax and {usd(fees + dealerFees)} in fees.
              </p>
            </>
          }
        />
      }
    >
      <InputGroup legend="Vehicle and price">
        <NumberInput label="Vehicle price" value={vehiclePrice} onChange={setVehiclePrice} step={500} prefix="$" />
        <NumberInput label="Down payment" value={downPayment} onChange={setDownPayment} step={500} prefix="$" />
        <NumberInput
          label="Trade-in value"
          value={tradeInValue}
          onChange={setTradeInValue}
          step={500}
          prefix="$"
          hint="Reduces both the amount financed and the taxable amount."
        />
        <NumberInput
          label="Sales tax rate"
          value={salesTaxPct}
          onChange={setSalesTaxPct}
          step={0.1}
          suffix="%"
          hint="Charged on the price after the trade-in."
        />
      </InputGroup>

      <InputGroup legend="Fees, rate and term">
        <NumberInput
          label="Title, registration & other fees"
          value={fees}
          onChange={setFees}
          step={50}
          prefix="$"
        />
        <NumberInput label="Dealer fees" value={dealerFees} onChange={setDealerFees} step={50} prefix="$" />
        <NumberInput
          label="Interest rate (APR)"
          value={annualRatePct}
          onChange={setAnnualRatePct}
          step={0.1}
          suffix="%"
        />
        <SelectInput
          label="Loan term"
          value={termMonths}
          onChange={setTermMonths}
          options={[
            { value: "24", label: "24 months" },
            { value: "36", label: "36 months" },
            { value: "48", label: "48 months" },
            { value: "60", label: "60 months" },
            { value: "72", label: "72 months" },
            { value: "84", label: "84 months" },
          ]}
        />
      </InputGroup>
    </CalculatorGrid>
  );
}
