import type { ReactNode } from "react";

/**
 * The highlighted result panel shown next to (or under) a calculator.
 * `aria-live="polite"` means screen readers announce new results as the user
 * changes inputs, without stealing focus.
 */
export function ResultPanel({
  eyebrow,
  headline,
  sub,
  rows,
  footer,
  children,
}: {
  eyebrow: string;
  headline: string;
  sub?: string;
  rows?: [string, string][];
  footer?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <aside aria-live="polite" className="rounded-lg bg-teal-900 p-6 text-white">
      <p className="text-sm text-teal-100">{eyebrow}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums break-words sm:text-4xl">{headline}</p>
      {sub && <p className="mt-1 text-sm text-teal-100">{sub}</p>}

      {rows && rows.length > 0 && (
        <dl className="mt-5 space-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-teal-100">{label}</dt>
              <dd className="tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {children}

      {footer && <div className="mt-4 text-xs text-teal-100">{footer}</div>}
    </aside>
  );
}

/** Two-column calculator layout: inputs on the left, sticky results on the right. */
export function CalculatorGrid({ children, results }: { children: ReactNode; results: ReactNode }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid content-start gap-6">{children}</div>
      <div className="lg:sticky lg:top-24 lg:self-start">{results}</div>
    </section>
  );
}

/** A results table used by schedule-style calculators. */
export function DataTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm tabular-nums">
        {caption && <caption className="mb-2 text-left text-sm text-slate-600">{caption}</caption>}
        <thead className="bg-slate-100">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="p-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-100">
              {row.map((cell, j) => (
                <td key={j} className="p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
