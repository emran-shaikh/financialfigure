"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { CalculatorGrid, DataTable, ResultPanel } from "@/components/ResultPanel";
import { AMORTIZATION_CSV_FILENAME, amortizationToCsv } from "@/lib/amortizationCsv";
import { monthsToText, usd } from "@/lib/format";
import { amortization } from "@/lib/mortgage";

interface YearRow {
  year: number;
  principal: number;
  interest: number;
  extra: number;
  balance: number;
}

export default function AmortizationSchedule() {
  const [loanAmount, setLoanAmount] = useState(320_000);
  const [annualRatePct, setAnnualRatePct] = useState(6.5);
  const [termYears, setTermYears] = useState("30");
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [extraYearly, setExtraYearly] = useState(0);

  const result = useMemo(
    () =>
      amortization({
        principal: loanAmount,
        annualRatePct,
        months: Math.round(Number(termYears) * 12),
        extraMonthly,
        extraYearly,
      }),
    [loanAmount, annualRatePct, termYears, extraMonthly, extraYearly],
  );

  const yearly = useMemo<YearRow[]>(() => {
    const years: YearRow[] = [];
    for (const row of result.rows) {
      const index = Math.ceil(row.month / 12) - 1;
      if (!years[index]) {
        years[index] = { year: index + 1, principal: 0, interest: 0, extra: 0, balance: 0 };
      }
      const entry = years[index];
      entry.principal += row.principal;
      entry.interest += row.interest;
      entry.extra += row.extra;
      entry.balance = row.balance;
    }
    return years;
  }, [result.rows]);

  const downloadCsv = () => {
    const csv = amortizationToCsv(result.rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = AMORTIZATION_CSV_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasExtras = extraMonthly > 0 || extraYearly > 0;

  return (
    <CalculatorGrid
      results={
        <ResultPanel
          eyebrow="Monthly payment"
          headline={usd(result.monthlyPayment)}
          sub={`${usd(loanAmount)} over ${termYears} years at ${annualRatePct}%`}
          rows={[
            ["Total interest", usd(result.totalInterest)],
            ["Total paid", usd(result.totalPaid)],
            ["Payoff time", monthsToText(result.monthsWithExtras)],
            ...(hasExtras
              ? ([
                  ["Months saved", `${result.monthsSaved}`],
                  ["Interest saved", usd(result.interestSaved)],
                ] as [string, string][])
              : []),
          ]}
          footer={
            <button
              type="button"
              onClick={downloadCsv}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50"
            >
              Download CSV
            </button>
          }
        />
      }
    >
      <InputGroup legend="Loan details">
        <NumberInput
          label="Loan amount"
          value={loanAmount}
          onChange={setLoanAmount}
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

      <InputGroup legend="Extra payments">
        <NumberInput
          label="Extra monthly payment"
          value={extraMonthly}
          onChange={setExtraMonthly}
          step={25}
          prefix="$"
          suffix="/mo"
        />
        <NumberInput
          label="Extra yearly payment"
          value={extraYearly}
          onChange={setExtraYearly}
          step={100}
          prefix="$"
          suffix="/yr"
          hint="Applied once a year, in month 12, 24, 36…"
        />
      </InputGroup>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Year-by-year summary</h2>
        <DataTable
          caption="Amounts shown are the totals paid within each loan year."
          headers={["Year", "Principal", "Interest", "Extra", "Balance"]}
          rows={yearly.map((y) => [
            y.year,
            usd(y.principal),
            usd(y.interest),
            usd(y.extra),
            usd(y.balance),
          ])}
        />
      </div>
    </CalculatorGrid>
  );
}
