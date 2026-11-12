"use client";

import { useMemo, useState } from "react";
import { InputGroup, NumberInput, SelectInput } from "@/components/Inputs";
import { DataTable, ResultPanel } from "@/components/ResultPanel";
import { monthsToText, usd, usd2 } from "@/lib/format";
import { calculateDebtPayoff, type Debt, type DebtStrategy, type StrategyResult } from "@/lib/debtPayoff";

const inputCls =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-teal-700";

const payoffOrder = (result: StrategyResult): string =>
  result.order.length === 0
    ? "—"
    : result.order.map((s) => `${s.name} (mo ${s.month})`).join(" → ");

export default function DebtSnowballCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { name: "Credit card", balance: 4_000, ratePct: 21.5, minPayment: 100 },
    { name: "Car loan", balance: 9_000, ratePct: 7.5, minPayment: 250 },
    { name: "Student loan", balance: 15_000, ratePct: 6.5, minPayment: 180 },
  ]);
  const [extraMonthly, setExtraMonthly] = useState(150);
  const [strategy, setStrategy] = useState<DebtStrategy>("snowball");

  const result = useMemo(
    () => calculateDebtPayoff({ debts, extraMonthly, strategy }),
    [debts, extraMonthly, strategy],
  );

  const updateDebt = (index: number, patch: Partial<Debt>) =>
    setDebts((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  const addDebt = () =>
    setDebts((prev) => [
      ...prev,
      { name: `Debt ${prev.length + 1}`, balance: 1_000, ratePct: 10, minPayment: 50 },
    ]);
  const removeDebt = (index: number) => setDebts((prev) => prev.filter((_, i) => i !== index));

  const summary = (label: string, r: StrategyResult) => (
    <ResultPanel
      eyebrow={label}
      headline={r.capped ? "Not debt-free" : monthsToText(r.months)}
      sub={r.capped ? "Minimum payments do not cover the interest" : `${usd(r.totalInterest)} in interest`}
      rows={[
        ["Total paid", usd(r.totalPaid)],
        ["Debts cleared", `${r.order.length} of ${debts.length}`],
      ]}
      footer={<p>Payoff order: {payoffOrder(r)}</p>}
    />
  );

  const cheaper =
    result.avalanche.capped || result.snowball.capped
      ? null
      : result.avalanche.totalInterest <= result.snowball.totalInterest
        ? "avalanche"
        : "snowball";

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid content-start gap-6">
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-semibold text-slate-900">Your debts</legend>
          {debts.map((debt, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto] sm:items-end"
            >
              <label className="block text-xs font-medium text-slate-700">
                Name
                <input
                  className={inputCls}
                  value={debt.name}
                  onChange={(e) => updateDebt(index, { name: e.target.value })}
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Balance ($)
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={100}
                  className={inputCls}
                  value={debt.balance}
                  onChange={(e) => updateDebt(index, { balance: Number(e.target.value) || 0 })}
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Rate (%/yr)
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.25}
                  className={inputCls}
                  value={debt.ratePct}
                  onChange={(e) => updateDebt(index, { ratePct: Number(e.target.value) || 0 })}
                />
              </label>
              <label className="block text-xs font-medium text-slate-700">
                Min payment ($)
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={10}
                  className={inputCls}
                  value={debt.minPayment}
                  onChange={(e) => updateDebt(index, { minPayment: Number(e.target.value) || 0 })}
                />
              </label>
              <button
                type="button"
                onClick={() => removeDebt(index)}
                aria-label={`Remove ${debt.name || "debt"}`}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-rose-400 hover:text-rose-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDebt}
            className="justify-self-start rounded-md border border-teal-700 px-3 py-2 text-sm font-medium text-teal-800 hover:bg-teal-50"
          >
            Add a debt
          </button>
        </fieldset>

        <InputGroup legend="Extra payment and strategy">
          <NumberInput
            label="Extra paid each month"
            value={extraMonthly}
            onChange={setExtraMonthly}
            step={25}
            prefix="$"
            hint="Added on top of the sum of your minimum payments."
          />
          <SelectInput
            label="Preferred strategy"
            value={strategy}
            onChange={(value) => setStrategy(value as DebtStrategy)}
            options={[
              { value: "snowball", label: "Snowball — smallest balance first" },
              { value: "avalanche", label: "Avalanche — highest rate first" },
            ]}
            hint="Both strategies are compared below; this just marks your preference."
          />
        </InputGroup>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-900">Side-by-side comparison</p>
          <DataTable
            caption="Every strategy pays the same monthly budget; only the target order changes."
            headers={["", "Snowball", "Avalanche"]}
            rows={[
              [
                "Months to debt-free",
                result.snowball.capped ? "Not debt-free" : String(result.snowball.months),
                result.avalanche.capped ? "Not debt-free" : String(result.avalanche.months),
              ],
              ["Total interest", usd(result.snowball.totalInterest), usd(result.avalanche.totalInterest)],
              ["Total paid", usd(result.snowball.totalPaid), usd(result.avalanche.totalPaid)],
              ["Payoff order", payoffOrder(result.snowball), payoffOrder(result.avalanche)],
            ]}
          />
          {cheaper && (
            <p className="mt-3 text-sm text-slate-600">
              With these numbers the <strong>{cheaper}</strong> method costs less in interest. The difference is{" "}
              <strong>{usd(Math.abs(result.avalanche.totalInterest - result.snowball.totalInterest))}</strong>.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm text-slate-600">
          Total minimums {usd(result.totalMinimum)} + {usd(extraMonthly)} extra ={" "}
          <strong>{usd(result.monthlyBudget)}</strong> per month.
        </p>
        {summary("Debt snowball", result.snowball)}
        {summary("Debt avalanche", result.avalanche)}
      </div>
    </section>
  );
}
