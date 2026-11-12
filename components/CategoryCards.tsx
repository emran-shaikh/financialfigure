import Link from "next/link";
import type { CalculatorMeta } from "@/lib/calculators";

/** Card grid of calculators, reused by the category pages. */
export default function CategoryCards({ items }: { items: CalculatorMeta[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 [&_li]:mt-0 [&_ul]:space-y-0">
      {items.map((c) => (
        <li key={c.slug} className="list-none">
          <Link
            href={`/${c.slug}`}
            className="block h-full rounded-lg border border-slate-200 bg-white p-4 !no-underline hover:border-teal-700 hover:shadow-sm"
          >
            <span className="font-semibold text-teal-900">{c.title}</span>
            <span className="mt-1 block text-sm text-slate-600">{c.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
