import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Report a data error, suggest a calculator or send general feedback using the contact form.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell
      title="Contact us"
      crumbs={[{ href: "/contact", label: "Contact" }]}
      intro={
        <p>
          Found a number that looks wrong, or a calculator you would like us to build? Send us a
          message with the form below. We read every one.
        </p>
      }
    >
      <ContactForm />

      <h2>Reporting a data error</h2>
      <p>
        If a tax bracket, rate or threshold looks incorrect, please include the page URL and, if you
        have it, a link to the official source that contradicts it. Tax data is reviewed against the
        IRS, the Social Security Administration and state revenue departments, and every data file
        records the date it was last checked.
      </p>

      <h2>Privacy requests</h2>
      <p>
        For questions about what the site collects — and how to opt out of personalised advertising —
        see the <a href="/privacy-policy">privacy policy</a>.
      </p>
    </PageShell>
  );
}
