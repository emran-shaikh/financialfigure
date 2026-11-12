"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/lib/consent";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

interface AdSlotProps {
  /** The AdSense ad unit slot id (data-ad-slot). */
  slotId?: string;
  /** Reserved height in pixels. Keeps Cumulative Layout Shift at zero. */
  minHeight?: number;
  /** AdSense format attribute. */
  format?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A layout-stable advertising slot.
 *
 * Rules enforced here:
 *  - Nothing renders at all when NEXT_PUBLIC_ADSENSE_CLIENT is unset.
 *  - Ad units render by default (opt-out model) so ads serve on first visit and
 *    Google can verify the site; choosing "Essential only" sets
 *    `advertising: false`, which removes every ad unit.
 *  - Space is reserved with min-height before the ad loads, so the ad can never
 *    push content down (protects CLS and the Lighthouse score).
 */
export default function AdSlot({ slotId, minHeight = 280, format = "auto", className = "" }: AdSlotProps) {
  const consent = useConsent();
  const pushed = useRef(false);

  const allowed = Boolean(CLIENT_ID) && consent.advertising;

  useEffect(() => {
    if (!allowed || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense throws if the script has not loaded yet; it retries on the next render. */
    }
  }, [allowed]);

  if (!CLIENT_ID) {
    // In development show the reserved space so layout stability is easy to eyeball.
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          className={`ad-slot my-8 ${className}`}
          style={{ minHeight }}
          aria-hidden="true"
          data-ad-slot={slotId}
        >
          Reserved ad space — {minHeight}px (no publisher ID configured)
        </div>
      );
    }
    return null;
  }

  if (!allowed) return null;

  return (
    <div className={`my-8 ${className}`} style={{ minHeight }} data-ad-slot={slotId}>
      <span className="sr-only">Advertisement</span>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight }}
        data-ad-client={CLIENT_ID}
        {...(slotId ? { "data-ad-slot": slotId } : {})}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
