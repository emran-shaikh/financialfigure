import type { NextConfig } from "next";

/**
 * Content Security Policy, delivered in **report-only** mode.
 *
 * It already lists every origin AdSense and GA4 need, so it can be promoted to
 * an enforcing `Content-Security-Policy` once the browser console shows no
 * violations in production. Report-only means it can never break ads.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://adservice.google.com https://securepubads.g.doubleclick.net https://fundingchoicesmessages.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://*.doubleclick.net https://*.google.com",
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://fundingchoicesmessages.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Calculator pages are statically generated; keep the output compact.
  compress: true,

  async headers() {
    return [
      {
        // Applied to every route, including static assets.
        source: "/:path*",
        headers: [
          // Stop MIME sniffing (blocks content-type confusion attacks).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak full URLs (and query strings) to third parties.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // No other origin may frame the site (clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Turn off browser features the site never uses.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // Force HTTPS for two years. Safe because Vercel/DNS already enforce TLS.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // See CSP note above — report-only until verified clean in production.
          { key: "Content-Security-Policy-Report-Only", value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
