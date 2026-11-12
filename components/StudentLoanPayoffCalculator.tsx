"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { monthsToText, usd, usd2 } from "@/lib/format";
import { calculateStudentLoan } from "@/lib/studentLoan";

// No-op subscription used only to detect that we are rendering on the client.
const emptySubscribe = () => () => {};

export default function StudentLoanPayoffCalculator() {
  const [balance, setBalance] = useState(35_000);
  const [annualRatePct, setAnnualRatePct] = useState(6.5);
  const [termYears, setTermYears] = useState("10");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [extraMonthly, setExtraMonthly] = useState(100);

  // The payoff date depends on today's date, so only show it after mount to
  // avoid a server/client hydration mismatch. useSyncExternalStore returns
  // false on the server and true on the client without a setState-in-effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const result = useMemo(
    () =>
      calculateStudentLoan({
        balance,
        annualRatePct,
        termMonths: Number(termYears) * 12,
        monthlyPayment,
        extraMonthly,
      }),
    [balance, annualRatePct, termYears, monthlyPayment, extraMonthly],
  );

  const rows: [string, string][] = [
    ["Scheduled payment", usd2(result.scheduledPayment)],
    ["You pay each month", usd2(result.actualMonthlyPayment)],
    ["Months to payoff", result.capped ? "Never (payment too low)" : monthsToText(result.months)],
    ["Total interest", usd(result.totalInterest)],
    ["Interest saved by paying extra", usd(result.interestSaved)],
    ["Months saved", monthsToText(result.monthsSaved)],
  ];

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Estimated payoff"
          headline={result.capped ? "Not repaid" : monthsToText(result.months)}
          sub={`${
            result.capped ? "The payment does not cover monthly interest" : `${usd2(result.actualMonthlyPayment)} a month`
          }`}
          rows={rows}
          footer={
            result.neverPaysOff ? (
              <p>The payment is at or below the monthly interest, so the balance would never be repaid.</p>
            ) : (
              <p>
                Projected payoff date:{" "}
                <strong>{mounted && result.payoffDate ? result.payoffDate : "—"}</strong>
              </p>
            )
          }
        />
      }
    >
      <InputGroup legend="Loan details">
        <NumberInput label="Current balance" value={balance} onChange={setBalance} step={1_000} prefix="$" />
        <NumberInput
          label="Interest rate"
          value={annualRatePct}
          onChange={setAnnualRatePct}
          step={0.125}
          suffix="%"
          hint="Federal Direct Loans disbursed from July 2026 carry 6.52% for undergraduates."
        />
        <SelectInput
          label="Repayment term"
          value={termYears}
          onChange={setTermYears}
          options={[
            { value: "5", label: "5 years" },
            { value: "10", label: "10 years" },
            { value: "15", label: "15 years" },
            { value: "20", label: "20 years" },
            { value: "25", label: "25 years" },
          ]}
        />
        <NumberInput
          label="Your own monthly payment (optional)"
          value={monthlyPayment}
          onChange={setMonthlyPayment}
          step={25}
          prefix="$"
          hint="Leave at 0 to use the payment implied by the term."
        />
      </InputGroup>

      <InputGroup legend="Extra payment">
        <NumberInput
          label="Extra paid each month"
          value={extraMonthly}
          onChange={setExtraMonthly}
          step={25}
          prefix="$"
          hint="Every extra dollar goes straight to principal."
        />
      </InputGroup>
    </CalculatorGrid>
  );
}
