"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useConsent } from "@/lib/consent";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = "zf2xtoowy8";

type ClarityConsent = "granted" | "denied";

declare global {
  interface Window {
    clarity?: {
      (
        event: "consentv2",
        consent: { ad_Storage: ClarityConsent; analytics_Storage: ClarityConsent },
      ): void;
      (event: "consent", granted: boolean): void;
    };
  }
}

/**
 * Third-party tags for monetisation and analytics.
 *
 *  - **AdSense library** loads on every page as soon as a publisher ID is set.
 *    Google's crawler must find the AdSense code to verify the site and approve
 *    the account, so this tag is intentionally *not* gated behind consent. It
 *    only loads the library; no ad unit is rendered unless advertising is
 *    allowed (see AdSlot) and the CMP governs personalisation for EEA/UK/CH.
 *  - **GA4 and Clarity** load only while analytics consent is allowed. Clarity
 *    receives the current consent signal before its tag is inserted, and is
 *    disabled if the visitor later chooses "Essential only".
 *  - These tags load after interaction and never block the critical rendering
 *    path. AdSense and GA4 are omitted when their environment variables are unset.
 *
 * TODO(CMP): If you buy a Google-certified CMP, set NEXT_PUBLIC_CMP_ID, load
 * the CMP's script here, and have its callback call `applyCmpDecision(...)`
 * from lib/consent so AdSense, GA4 and Clarity obey the visitor's choice. Do
 * not bypass or fake the consent signal.
 */
export default function ConsentScripts() {
  const consent = useConsent();

  useEffect(() => {
    if (typeof window.clarity !== "function") return;

    if (!consent.analytics) {
      window.clarity("consent", false);
      return;
    }

    window.clarity("consentv2", {
      ad_Storage: consent.advertising ? "granted" : "denied",
      analytics_Storage: "granted",
    });
  }, [consent.advertising, consent.analytics]);

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

      {consent.analytics && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        c[a]('consentv2',{ad_Storage:'${consent.advertising ? "granted" : "denied"}',analytics_Storage:'granted'});
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>
      )}
    </>
  );
}
