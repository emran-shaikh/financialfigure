"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput } from "@/components/Inputs";
import { CalculatorGrid, ResultPanel } from "@/components/ResultPanel";
import { monthsToText, usd, usd2 } from "@/lib/format";
import { calculateRefinance } from "@/lib/refinance";

export default function RefinanceBreakEvenCalculator() {
  const [currentBalance, setCurrentBalance] = useState(300_000);
  const [currentRatePct, setCurrentRatePct] = useState(7);
  const [remainingMonths, setRemainingMonths] = useState(300);
  const [newRatePct, setNewRatePct] = useState(5.5);
  const [newTermMonths, setNewTermMonths] = useState(360);
  const [closingCosts, setClosingCosts] = useState(6_000);

  const result = useMemo(
    () =>
      calculateRefinance({
        currentBalance,
        currentRatePct,
        remainingMonths,
        newRatePct,
        newTermMonths,
        closingCosts,
      }),
    [currentBalance, currentRatePct, remainingMonths, newRatePct, newTermMonths, closingCosts],
  );

  const saving = result.monthlySavings;
  const hasSaving = saving > 0;

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow={hasSaving ? "Monthly saving" : "Monthly change"}
          headline={usd2(saving)}
          sub={`Balance ${usd(currentBalance)} refinanced at ${newRatePct}%`}
          rows={[
            ["Current payment", usd2(result.currentMonthlyPayment)],
            ["New payment", usd2(result.newMonthlyPayment)],
            [
              "Break-even",
              result.breakEvenMonths === null ? "Never" : monthsToText(result.breakEvenMonths),
            ],
            ["Interest, current loan", usd(result.lifetimeInterestCurrent)],
            ["Interest, new loan", usd(result.lifetimeInterestNew)],
            ["Interest saved", usd(result.lifetimeInterestSavings)],
          ]}
          footer={
            hasSaving ? (
              <p>
                {result.paysOffWithinTerm
                  ? `Break-even of ${result.breakEvenMonths} months falls within the new ${newTermMonths}-month term, so the refinance pays for itself.`
                  : `Break-even is longer than the new ${newTermMonths}-month term, so the closing costs are not recovered before payoff.`}
              </p>
            ) : (
              <p>The new payment is not lower than the current one, so this refinance never breaks even.</p>
            )
          }
        />
      }
    >
      <InputGroup legend="Current loan">
        <NumberInput
          label="Current balance"
          value={currentBalance}
          onChange={setCurrentBalance}
          step={5_000}
          prefix="$"
        />
        <NumberInput
          label="Current rate"
          value={currentRatePct}
          onChange={setCurrentRatePct}
          step={0.125}
          suffix="%"
        />
        <NumberInput
          label="Months remaining"
          value={remainingMonths}
          onChange={setRemainingMonths}
          step={12}
          suffix="mo"
        />
      </InputGroup>

      <InputGroup legend="New loan">
        <NumberInput
          label="New rate"
          value={newRatePct}
          onChange={setNewRatePct}
          step={0.125}
          suffix="%"
        />
        <NumberInput
          label="New term"
          value={newTermMonths}
          onChange={setNewTermMonths}
          step={12}
          suffix="mo"
        />
        <NumberInput
          label="Closing costs"
          value={closingCosts}
          onChange={setClosingCosts}
          step={250}
          prefix="$"
          hint="Fees, points and title charges paid up front."
        />
      </InputGroup>
    </CalculatorGrid>
  );
}
