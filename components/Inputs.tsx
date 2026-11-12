"use client";

import { useId, type ReactNode } from "react";
import { parseNumber } from "@/lib/format";

const baseInput =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-teal-700";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Text shown after the input, e.g. "%" or "years". */
  suffix?: string;
  /** Text shown before the input, e.g. "$". */
  prefix?: string;
  step?: number;
  min?: number;
  max?: number;
  /** Helper text below the input (also used for validation messages). */
  hint?: string;
  /** Marks the field as invalid and announces the message to screen readers. */
  error?: string;
}

/**
 * Accessible numeric input: always paired with a <label>, keyboard friendly and
 * tolerant of empty or malformed values (which become 0 rather than NaN).
 */
export function NumberInput({
  label,
  value,
  onChange,
  suffix,
  prefix,
  step = 1,
  min = 0,
  max,
  hint,
  error,
}: NumberInputProps) {
  const id = useId();
  const describedBy = hint || error ? `${id}-desc` : undefined;

  return (
    <div className="block text-sm font-medium text-slate-700">
      <label htmlFor={id}>{label}</label>
      <div className="relative mt-1">
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          min={min}
          max={max}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(parseNumber(e.target.value))}
          className={`${baseInput} ${prefix ? "pl-7" : ""} ${suffix ? "pr-14" : ""} ${
            error ? "border-rose-500" : ""
          }`}
        />
        {suffix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {suffix}
          </span>
        )}
      </div>
      {(error || hint) && (
        <p id={describedBy} className={`mt-1 text-xs ${error ? "text-rose-700" : "text-slate-500"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}

export function SelectInput({ label, value, onChange, options, hint }: SelectInputProps) {
  const id = useId();
  return (
    <div className="block text-sm font-medium text-slate-700">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        aria-describedby={hint ? `${id}-desc` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={baseInput}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={`${id}-desc`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Groups related inputs with a visible, semantic fieldset and legend. */
export function InputGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-2 text-sm font-semibold text-slate-900 sm:col-span-2">{legend}</legend>
      {children}
    </fieldset>
  );
}
