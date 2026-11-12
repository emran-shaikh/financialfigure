import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CategoryCards from "@/components/CategoryCards";
import { calculatorsByCategory } from "@/lib/calculators";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Saving & Investing Calculators",
  description:
    "Free investing calculators for US savers: compound interest, 401(k) growth with employer match, Roth vs traditional IRA, inflation, CAGR and ROI.",
  path: "/saving-and-investing",
});

export default function SavingAndInvestingPage() {
  return (
    <PageShell
      title="Saving & investing calculators"
      crumbs={[{ href: "/saving-and-investing", label: "Saving & investing" }]}
      intro={
        <p>
          Small, consistent contributions plus time are the two levers that matter most. These
          calculators let you change the inputs and watch what compounding does over decades — and
          compare the retirement accounts the IRS offers US savers.
        </p>
      }
    >
      <CategoryCards items={calculatorsByCategory("investing")} />

      <h2>Why compounding is the whole story</h2>
      <p>
        Compound interest is interest that earns interest. A balance grows by the return rate each
        period, and the next period&apos;s return is calculated on the larger balance. The effect is
        modest over five years and enormous over thirty, which is why the{" "}
        <Link href="/compound-interest-calculator">compound interest calculator</Link> and the{" "}
        <Link href="/401k-calculator">401(k) growth calculator</Link> put the contribution schedule
        front and centre: the earlier the money goes in, the longer it compounds.
      </p>

      <h2>Tax-advantaged accounts</h2>
      <p>
        A traditional 401(k) or IRA is funded with pre-tax dollars and taxed on withdrawal. A Roth
        account is funded with after-tax dollars and comes out tax-free. The{" "}
        <Link href="/roth-vs-traditional-ira-calculator">Roth vs traditional IRA calculator</Link>{" "}
        compares the two on the same assumptions so you can see which leaves more after-tax money in
        retirement.
      </p>

      <h2>Measuring a return</h2>
      <p>
        Total return over several years is misleading on its own: a 50% gain over ten years is much
        weaker than the same gain over three. The{" "}
        <Link href="/cagr-calculator">CAGR calculator</Link> converts a total gain into an equivalent
        annual rate, and the <Link href="/roi-calculator">ROI calculator</Link> puts that gain next to
        your cost basis. To see how much of a return inflation quietly takes, use the{" "}
        <Link href="/investments-vs-inflation-calculator">inflation calculator</Link>.
      </p>

      <p className="text-sm text-slate-500">
        These tools are educational estimates. Investment returns are not guaranteed.
      </p>
    </PageShell>
  );
}
