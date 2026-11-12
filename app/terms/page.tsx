import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that govern your use of this site, including acceptable use, intellectual property, disclaimers and limitation of liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of use"
      updated="2026-11-12"
      crumbs={[{ href: "/terms", label: "Terms of Use" }]}
      intro={
        <p>
          By using {SITE.name} you agree to these terms. If you do not agree with them, please do not
          use the site.
        </p>
      }
    >
      <h2>1. What this site is</h2>
      <p>
        {SITE.name} provides free, educational financial calculators and explanatory content. It is an
        information service, not a financial adviser, broker, lender, tax preparer or law firm.
      </p>

      <h2>2. No advice</h2>
      <p>
        Nothing on this site is financial, investment, tax, legal or accounting advice, and nothing
        here creates a professional relationship of any kind. Results are estimates produced from the
        inputs you provide and the assumptions documented on the{" "}
        <Link href="/methodology">methodology page</Link>. Always confirm important decisions with a
        qualified professional and with the original source of any rule or rate.
      </p>

      <h2>3. Accuracy and availability</h2>
      <p>
        We work to keep the data accurate and current, but tax law, interest rates and product terms
        change frequently, and errors are possible. The site is provided &quot;as is&quot; and
        &quot;as available&quot;, without warranties of any kind, express or implied, including
        merchantability, fitness for a particular purpose and non-infringement. We do not warrant that
        the site will be uninterrupted, timely, secure or error-free.
      </p>

      <h2>4. Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt, overload or gain unauthorised access to the site.</li>
        <li>Do not scrape the site at a volume that degrades service for others.</li>
        <li>Do not use the site for anything unlawful, or to misrepresent its output as professional advice.</li>
        <li>Do not remove or obscure advertising or attribution.</li>
      </ul>

      <h2>5. Intellectual property</h2>
      <p>
        The site&apos;s design, text, calculator implementations and code are owned by {SITE.name} and
        protected by copyright. You may use the calculators for personal, non-commercial purposes and
        may quote short excerpts of our content with a link back to the source page. Republishing
        substantial portions, or rehosting the calculators, requires written permission.
      </p>

      <h2>6. Third-party services</h2>
      <p>
        The site displays advertising served by Google AdSense and may use third-party analytics.
        Those providers have their own terms and privacy policies, which we do not control. See the{" "}
        <Link href="/privacy-policy">privacy policy</Link> for details and for how to opt out of
        personalised advertising.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {SITE.name} and its operators are not liable for any
        indirect, incidental, special, consequential or punitive damages, or for any loss of profits,
        savings, data or goodwill, arising from your use of the site or from reliance on any result it
        produces — including any financial decision you make.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update these terms from time to time. The date at the top of this page shows the current
        version.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these terms can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </PageShell>
  );
}
