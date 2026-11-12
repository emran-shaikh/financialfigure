import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { CALCULATORS, CATEGORIES } from "@/lib/calculators";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "All Calculators",
  description:
    "The full directory of free US finance calculators: mortgage and home, paycheck and tax, loans and debt, and saving and investing.",
  path: "/calculators",
});

export default function CalculatorsDirectory() {
  return (
    <PageShell
      title="All calculators"
      crumbs={[{ href: "/calculators", label: "All calculators" }]}
      intro={
        <p>
          {CALCULATORS.length} free calculators covering the money decisions most US households face.
          Everything runs in your browser, with the formula and data sources printed on each page.
        </p>
      }
    >
      {CATEGORIES.map((category) => {
        const items = CALCULATORS.filter((c) => c.category === category.id);
        return (
          <section key={category.id}>
            <h2 id={category.id}>
              <Link href={category.href}>{category.name}</Link>
            </h2>
            <p>{category.blurb}</p>
            <ul>
              {items.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`}>{c.title}</Link> — {c.description}
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <h2>Also on this site</h2>
      <ul>
        <li>
          <Link href="/salary-after-tax">Paycheck calculator by state</Link> — a dedicated page for
          each of the 50 states and the District of Columbia.
        </li>
        <li>
          <Link href="/methodology">Methodology</Link> — every data source, update schedule and
          assumption.
        </li>
      </ul>
    </PageShell>
  );
}
