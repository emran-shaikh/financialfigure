import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "What this site is, how the calculators are built, where the tax and finance data comes from, and what we deliberately do not claim.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE.name}`}
      updated="2026-11-12"
      crumbs={[{ href: "/about", label: "About" }]}
      intro={
        <p>
          {SITE.name} is a small, independent site that builds free finance calculators for people in
          the United States. It exists because most money questions — what will my payment be, what
          will I actually take home, how long until this debt is gone — can be answered with a formula
          you can see and check.
        </p>
      }
    >
      <h2>What we are trying to do</h2>
      <p>
        Every calculator on this site does three things. It gives you a number, it shows the formula
        that produced it, and it names the data behind it. If you cannot tell where a figure came from,
        the calculator has failed at its job, even if the arithmetic is right.
      </p>
      <p>
        The site is funded by advertising. That is the whole business model — there is no paid tier, no
        lead-generation form, and we do not sell your inputs. Calculations run in your browser, and the
        numbers you type are not sent to our servers.
      </p>

      <h2>How the calculators are built</h2>
      <p>
        Each calculator is a small, tested calculation module with a thin interface on top. That
        separation matters for accuracy: the maths can be tested automatically, and the interface
        cannot accidentally change the answer. The formulas are the standard published ones for each
        problem — the amortisation formula for loans, the IRS rate schedules for income tax, and the
        statutory FICA rates for payroll tax.
      </p>
      <p>
        Tax and rate data lives in dedicated data files, each of which carries the source it came from
        and the date it was last reviewed. When the IRS, the Social Security Administration or a state
        revenue department publishes new figures, only those files need to change.
      </p>

      <h2>What we do not claim</h2>
      <ul>
        <li>
          We do not claim that our content has been reviewed or approved by a CPA, an attorney or any
          financial professional.
        </li>
        <li>We do not claim any award, ranking or accreditation.</li>
        <li>
          We do not guarantee accuracy for your specific situation. The calculators model a defined set
          of inputs and ignore the rest — the{" "}
          <Link href="/methodology">methodology page</Link> lists what is left out.
        </li>
      </ul>

      <h2>Corrections</h2>
      <p>
        If you find an error, the fastest way to get it fixed is to email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the page and the number you believe is
        wrong. Data we cannot verify against a primary source is flagged for review rather than
        guessed at.
      </p>

      <h2>Read next</h2>
      <ul>
        <li>
          <Link href="/methodology">Methodology</Link> — sources, update schedule and assumptions.
        </li>
        <li>
          <Link href="/disclaimer">Disclaimer</Link> — the limits of what these estimates mean.
        </li>
        <li>
          <Link href="/calculators">All calculators</Link> — the full directory.
        </li>
      </ul>
    </PageShell>
  );
}
