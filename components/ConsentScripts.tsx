"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Third-party tags for monetisation and analytics.
 *
 *  - **AdSense library** loads on every page as soon as a publisher ID is set.
 *    Google's crawler must find the AdSense code to verify the site and approve
 *    the account, so this tag is intentionally *not* gated behind consent. It
 *    only loads the library; no ad unit is rendered unless advertising is
 *    allowed (see AdSlot) and the CMP governs personalisation for EEA/UK/CH.
 *  - **GA4** loads only while analytics consent is allowed (opt-out: on by
 *    default, off the moment the visitor chooses "Essential only").
 *  - Both use next/script `afterInteractive`, which is non-blocking and never
 *    part of the critical rendering path. Nothing loads when the env var is
 *    unset.
 *
 * TODO(CMP): If you buy a Google-certified CMP, set NEXT_PUBLIC_CMP_ID, load
 * the CMP's script here, and have its callback call `applyCmpDecision(...)`
 * from lib/consent so AdSense and GA4 obey the visitor's choice. Do not bypass
 * or fake the consent signal.
 */
export default function ConsentScripts() {
  const consent = useConsent();

  return (
    <>
      {ADSENSE_CLIENT && (
        <Script
          id="adsbygoogle-lib"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        />
      )}

      {GA_ID && consent.analytics && (
        <>
          <Script
            id="ga4-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
    </>
  );
}
