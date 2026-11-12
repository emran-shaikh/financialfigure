import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { pageMetadata } from "@/lib/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How this site handles data: cookies, Google AdSense advertising, analytics, your choices and how to opt out of personalised advertising.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      title="Privacy policy"
      updated="2026-11-12"
      crumbs={[{ href: "/privacy-policy", label: "Privacy Policy" }]}
      intro={
        <p>
          This policy explains what {SITE.name} collects, why, and how you can control it. It covers
          cookies, advertising and analytics, and it applies to every page on {SITE.url}.
        </p>
      }
    >
      <h2>The short version</h2>
      <ul>
        <li>
          The numbers you type into a calculator stay in your browser. They are never sent to us and we
          do not store them.
        </li>
        <li>We do not ask you to create an account and we do not collect your name or email address.</li>
        <li>
          We show advertising through Google AdSense to fund the site. Advertising and analytics
          cookies load only after you consent where consent is required.
        </li>
      </ul>

      <h2>Information we collect</h2>
      <p>
        <strong>Calculator inputs.</strong> Calculator results are computed in your browser using
        JavaScript. Inputs such as your salary, home price or debt balances are not transmitted to our
        servers and are not saved between visits.
      </p>
      <p>
        <strong>Server logs.</strong> Our hosting provider records standard technical information when
        a page is requested — IP address, browser type, referring page and time of request. This is
        used for security and to keep the site running.
      </p>
      <p>
        <strong>Email.</strong> If you contact us, we receive whatever you choose to send, including
        your email address, and we keep it only as long as needed to answer you.
      </p>

      <h2>Cookies</h2>
      <p>
        A cookie is a small file a website stores in your browser. This site uses cookies for two
        purposes: advertising and analytics. We also store a small entry in your browser&apos;s local
        storage to remember your consent choice so we do not ask every time you visit.
      </p>

      <h2>Advertising — Google AdSense</h2>
      <p>
        This site is supported by advertising delivered through Google AdSense. Google and its partners
        may use cookies and similar technologies to serve ads based on your prior visits to this and
        other websites. Google&apos;s use of advertising cookies lets it and its partners serve ads
        based on your visits to this site and other sites on the internet.
      </p>
      <p>
        Where required, advertising cookies are not set until you give consent. For visitors in the
        European Economic Area, the United Kingdom and Switzerland, we use a Google-certified consent
        management platform to collect your choices before any advertising cookie is set.
      </p>
      <p>You can control or opt out of personalised advertising at any time:</p>
      <ul>
        <li>
          Google Ads Settings — <a href="https://adssettings.google.com" rel="nofollow noopener noreferrer" target="_blank">adssettings.google.com</a>{" "}
          lets you turn off personalised ads from Google.
        </li>
        <li>
          <a href="https://optout.aboutads.info" rel="nofollow noopener noreferrer" target="_blank">optout.aboutads.info</a>{" "}
          (Digital Advertising Alliance) and{" "}
          <a href="https://optout.networkadvertising.org" rel="nofollow noopener noreferrer" target="_blank">optout.networkadvertising.org</a>{" "}
          (Network Advertising Initiative) let you opt out of interest-based advertising from
          participating companies.
        </li>
        <li>
          Your browser settings let you block or delete cookies. Blocking cookies may affect how ads
          and analytics behave, but the calculators will keep working.
        </li>
        <li>
          For information about how Google uses data from sites that use its services, see{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="nofollow noopener noreferrer" target="_blank">
            policies.google.com/technologies/partner-sites
          </a>
          .
        </li>
      </ul>

      <h2>Analytics</h2>
      <p>
        We measure aggregate traffic — which pages are visited and roughly where visitors come from —
        to work out which calculators are useful. If analytics is enabled it loads only after you
        consent, and it is configured not to store full IP addresses. Aggregate reports do not identify
        you personally.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell your personal information.</li>
        <li>We do not use your calculator inputs to build a profile of you.</li>
        <li>We do not show pop-ups that block content or auto-playing media.</li>
        <li>We do not target advertising to children.</li>
      </ul>

      <h2>Your choices and rights</h2>
      <p>
        You can withdraw advertising consent at any time using the cookie preferences control in the
        consent banner, or by clearing this site&apos;s cookies and local storage in your browser.
        Depending on where you live — for example under the GDPR in the EEA and UK, or the CCPA/CPRA in
        California — you may have the right to access, correct, delete or restrict the processing of
        your personal information, and to opt out of the sale or sharing of personal information. We do
        not sell personal information. To make a request, email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
      <p>
        We honour Global Privacy Control (GPC) signals where required by law. If your browser sends a
        GPC signal, we treat it as a request to limit the use of your data for advertising.
      </p>

      <h2>Children</h2>
      <p>
        This site is intended for adults managing their own finances. It is not directed at children
        under 13 and we do not knowingly collect information from them.
      </p>

      <h2>Data retention</h2>
      <p>
        Server logs are kept for a short period for security purposes. Email correspondence is kept
        until the question is resolved. Consent choices are stored in your browser until you clear
        them.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If this policy changes materially we will update the date at the top of this page. Continued
        use of the site after an update means you accept the revised policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy, or requests relating to your data, can be sent to{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. See also our{" "}
        <Link href="/terms">terms of use</Link> and <Link href="/disclaimer">disclaimer</Link>.
      </p>
    </PageShell>
  );
}
