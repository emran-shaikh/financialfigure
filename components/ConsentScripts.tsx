"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useConsent } from "@/lib/consent";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const GTM_ID = "GTM-PV6KPS2M";
const CLARITY_ID = "zf2xtoowy8";

type ClarityConsent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
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
 *  - **Google Tag Manager, Clarity and Ahrefs** load only while analytics
 *    consent is allowed. GTM receives Google Consent Mode defaults before it
 *    loads; Clarity receives its consent signal before its tag is inserted.
 *  - These tags load after interaction and never block the critical rendering
 *    path. AdSense is omitted when its environment variable is unset.
 *
 * TODO(CMP): If you buy a Google-certified CMP, set NEXT_PUBLIC_CMP_ID, load
 * the CMP's script here, and have its callback call `applyCmpDecision(...)`
 * from lib/consent so AdSense, GTM, Clarity and Ahrefs obey the visitor's
 * choice. Do not bypass or fake the consent signal.
 */
export default function ConsentScripts() {
  const consent = useConsent();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: consent.advertising ? "granted" : "denied",
        analytics_storage: consent.analytics ? "granted" : "denied",
        ad_user_data: consent.advertising ? "granted" : "denied",
        ad_personalization: consent.advertising ? "granted" : "denied",
      });
    }

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

      {consent.analytics && (
        <Script
          id="ahrefs-analytics"
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="IobViihp3gA/O6OGm1Pt7A"
          strategy="afterInteractive"
        />
      )}

      {consent.analytics && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: '${consent.advertising ? "granted" : "denied"}',
  analytics_storage: 'granted',
  ad_user_data: '${consent.advertising ? "granted" : "denied"}',
  ad_personalization: '${consent.advertising ? "granted" : "denied"}'
});
gtag('js', new Date());
window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
(function(w,d,s,l,i){var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
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
