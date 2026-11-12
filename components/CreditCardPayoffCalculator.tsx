"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { monthsToText, usd, usd2 } from "@/lib/format";
import { calculateCreditCard } from "@/lib/creditCard";

export default function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState(6_000);
  const [aprPct, setAprPct] = useState(22.5);
  const [mode, setMode] = useState("payment");
  const [monthlyPayment, setMonthlyPayment] = useState(250);
  const [targetMonths, setTargetMonths] = useState(24);

  const result = useMemo(
    () =>
      calculateCreditCard({
        balance,
        aprPct,
        monthlyPayment: mode === "payment" ? monthlyPayment : 0,
        targetMonths: mode === "target" ? targetMonths : 0,
      }),
    [balance, aprPct, mode, monthlyPayment, targetMonths],
  );

  const rows: [string, string][] = [
    ["Monthly payment", usd2(result.payment)],
    ["Months to payoff", result.capped ? "Never (payment too low)" : monthsToText(result.months)],
    ["Total interest", usd(result.totalInterest)],
    ["Total paid", usd(result.totalPaid)],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow={result.fromTarget ? "Monthly payment to hit your target" : "Time to pay off"}
          headline={result.fromTarget ? usd2(result.payment) : result.capped ? "Not repaid" : monthsToText(result.months)}
          sub={
            result.capped
              ? "The payment is at or below the monthly interest"
              : `${usd(result.totalInterest)} of interest on a ${usd(balance)} balance`
          }
          rows={rows}
          footer={
            result.minimumPaymentWarning ? (
              <p>
                Warning: a payment this low does not even cover the monthly interest, so the balance would keep
                growing.
              </p>
            ) : (
              <p>
                Clearing this balance in {result.fromTarget ? monthsToText(result.months) : monthsToText(result.months)}{" "}
                means paying {usd(result.totalInterest)} in interest.
              </p>
            )
          }
        />
      }
    >
      <InputGroup legend="Balance and rate">
        <NumberInput label="Current balance" value={balance} onChange={setBalance} step={500} prefix="$" />
        <NumberInput
          label="Purchase APR"
          value={aprPct}
          onChange={setAprPct}
          step={0.25}
          suffix="%"
          hint="The Fed's G.19 release puts the average card APR near 21–22%."
        />
      </InputGroup>

      <InputGroup legend="How you want to pay it off">
        <SelectInput
          label="Payoff goal"
          value={mode}
          onChange={setMode}
          options={[
            { value: "payment", label: "Fix my monthly payment" },
            { value: "target", label: "Clear it in a set time" },
          ]}
        />
        {mode === "payment" ? (
          <NumberInput
            label="Monthly payment"
            value={monthlyPayment}
            onChange={setMonthlyPayment}
            step={25}
            prefix="$"
          />
        ) : (
          <NumberInput
            label="Months to clear"
            value={targetMonths}
            onChange={setTargetMonths}
            step={1}
            suffix="mo"
          />
        )}
      </InputGroup>
    </CalculatorGrid>
  );
}
