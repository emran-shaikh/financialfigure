"use client";

import { useState } from "react";

type Operator = "+" | "−" | "×" | "÷";

function calculate(left: number, right: number, operator: Operator) {
  switch (operator) {
    case "+":
      return left + right;
    case "−":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      return right === 0 ? null : left / right;
  }
}

function formatResult(value: number) {
  return String(Number(value.toPrecision(12)));
}

export default function QuickCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopDismissed, setDesktopDismissed] = useState(false);
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setDisplay("0");
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(false);
    setError("");
  }

  function enterDigit(digit: string) {
    setError("");
    if (waitingForOperand || error) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }
    setDisplay((current) =>
      current === "0" ? digit : current.length < 16 ? current + digit : current,
    );
  }

  function enterDecimal() {
    setError("");
    if (waitingForOperand || error) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay((current) => `${current}.`);
    }
  }

  function chooseOperator(operator: Operator) {
    setError("");
    const currentValue = Number(display);
    if (pendingOperator && storedValue !== null && !waitingForOperand) {
      const result = calculate(storedValue, currentValue, pendingOperator);
      if (result === null || !Number.isFinite(result)) {
        setError("Cannot divide by zero");
        setDisplay("0");
        setStoredValue(null);
        setPendingOperator(null);
        setWaitingForOperand(true);
        return;
      }
      const formatted = formatResult(result);
      setDisplay(formatted);
      setStoredValue(Number(formatted));
    } else {
      setStoredValue(currentValue);
    }
    setPendingOperator(operator);
    setWaitingForOperand(true);
  }

  function equals() {
    if (!pendingOperator || storedValue === null || waitingForOperand) return;
    const result = calculate(storedValue, Number(display), pendingOperator);
    if (result === null || !Number.isFinite(result)) {
      setError("Cannot divide by zero");
      setDisplay("0");
      setStoredValue(null);
      setPendingOperator(null);
      setWaitingForOperand(true);
      return;
    }
    setDisplay(formatResult(result));
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(true);
  }

  function toggleSign() {
    if (display !== "0")
      setDisplay((current) => (current.startsWith("-") ? current.slice(1) : `-${current}`));
  }

  function percentage() {
    setDisplay(formatResult(Number(display) / 100));
    setWaitingForOperand(true);
    setError("");
  }

  function backspace() {
    if (waitingForOperand || error) return;
    setDisplay((current) =>
      current.length <= 1 || (current.length === 2 && current.startsWith("-"))
        ? "0"
        : current.slice(0, -1),
    );
  }

  const buttonClass =
    "flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-medium text-slate-800 transition hover:bg-slate-100 active:bg-slate-200";

  return (
    <>
      <aside
        aria-label="Quick calculator"
        className={`${isOpen ? "" : desktopDismissed ? "hidden" : "hidden xl:block"} fixed inset-x-4 bottom-52 z-40 max-h-[calc(100dvh-14rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xl xl:inset-x-auto xl:top-1/2 xl:right-4 xl:bottom-auto xl:w-60 xl:-translate-y-1/2`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Quick calculator</h2>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setDesktopDismissed(true);
            }}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
            aria-label="Close quick calculator"
          >
            Close
          </button>
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mb-3 flex min-h-16 flex-col items-end justify-center overflow-hidden rounded-lg bg-slate-900 px-3 py-2 text-right text-white"
        >
          <span className="text-xs text-slate-300">
            {pendingOperator ? `${storedValue} ${pendingOperator}` : "\u00a0"}
          </span>
          <output
            aria-label="Calculator display"
            className="max-w-full truncate text-2xl tabular-nums"
          >
            {error || display}
          </output>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button type="button" className={buttonClass} onClick={reset} aria-label="Clear">
            C
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={toggleSign}
            aria-label="Change sign"
          >
            ±
          </button>
          <button type="button" className={buttonClass} onClick={percentage} aria-label="Percent">
            %
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => chooseOperator("÷")}
            aria-label="Divide"
          >
            ÷
          </button>
          {["7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              className={buttonClass}
              onClick={() => enterDigit(digit)}
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            className={buttonClass}
            onClick={() => chooseOperator("×")}
            aria-label="Multiply"
          >
            ×
          </button>
          {["4", "5", "6"].map((digit) => (
            <button
              key={digit}
              type="button"
              className={buttonClass}
              onClick={() => enterDigit(digit)}
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            className={buttonClass}
            onClick={() => chooseOperator("−")}
            aria-label="Subtract"
          >
            −
          </button>
          {["1", "2", "3"].map((digit) => (
            <button
              key={digit}
              type="button"
              className={buttonClass}
              onClick={() => enterDigit(digit)}
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            className={buttonClass}
            onClick={() => chooseOperator("+")}
            aria-label="Add"
          >
            +
          </button>
          <button
            type="button"
            className={`${buttonClass} col-span-2`}
            onClick={() => enterDigit("0")}
          >
            0
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={enterDecimal}
            aria-label="Decimal point"
          >
            .
          </button>
          <button
            type="button"
            className={`${buttonClass} bg-teal-800 text-white hover:bg-teal-900`}
            onClick={equals}
            aria-label="Equals"
          >
            =
          </button>
          <button
            type="button"
            className={`${buttonClass} col-span-4 text-sm`}
            onClick={backspace}
            aria-label="Delete last digit"
          >
            ⌫
          </button>
        </div>
      </aside>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setDesktopDismissed(false);
        }}
        className={`${isOpen ? "hidden" : desktopDismissed ? "" : "xl:hidden"} fixed right-4 bottom-52 z-40 rounded-full bg-teal-800 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-teal-900 xl:top-1/2 xl:bottom-auto xl:-translate-y-1/2 xl:rounded-l-lg xl:rounded-r-none`}
        aria-label="Open quick calculator"
      >
        Calculator
      </button>
    </>
  );
}
