/**
 * Central site configuration.
 *
 * Values are read from environment variables so the same code can power the US
 * site and (later) the UK / CA / AU sites without editing components. See
 * CHECKLIST.md for the variables you must set before launch.
 */

const env = process.env;

export const SITE = {
  /** Display name used in the header, footer, metadata and schema. */
  name: env.NEXT_PUBLIC_SITE_NAME || "Financial Figure",
  /** Canonical origin, no trailing slash. Override with NEXT_PUBLIC_SITE_URL. */
  url: (env.NEXT_PUBLIC_SITE_URL || "https://financialfigure.com").replace(/\/$/, ""),
  /**
   * Public contact address shown on the legal pages. The /contact page uses a
   * form as the primary channel; this address is the formal postal/electronic
   * contact point required by the privacy policy and terms.
   */
  email: env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@financialfigure.com",
  /** Short one-line description reused in metadata and the footer. */
  tagline: "Free US finance calculators for mortgages, paychecks, loans and investing",
  description:
    "Free, fast and private US finance calculators. Work out your mortgage payment, take-home pay in any state, loan payoff and investment growth — with the formula and assumptions explained.",
  locale: "en_US",
} as const;

export const DISCLAIMER_SHORT =
  "Estimates only — not financial, tax or legal advice. Results depend on assumptions you should confirm with a qualified professional.";

/** Top-level navigation shown in the header and the mobile menu. */
export const NAV_LINKS = [
  { href: "/mortgage-calculator", label: "Mortgage" },
  { href: "/salary-after-tax", label: "Paycheck" },
  { href: "/loans", label: "Loans" },
  { href: "/saving-and-investing", label: "Saving & Investing" },
] as const;

export const FOOTER_LEGAL_LINKS = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

/** Absolute URL helper — always use this for canonicals, OG tags and sitemap entries. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean === "/" ? "" : clean}`;
}
