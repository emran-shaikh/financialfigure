# Launch Checklist

Everything in the **Done in code** section is already implemented and verified
(lint, typecheck, 166 unit tests, 5 Playwright smoke tests and `npm run build`
all pass). Everything under **You must do manually** needs an account, a
credential or a business decision that only the site owner can supply.

---

## 1. Done in code (no action needed)

- [x] Next.js 16 App Router project, TypeScript, Tailwind CSS v4, fully static.
- [x] Shared layout: header nav (Mortgage, Paycheck, Loans, Saving & Investing),
      footer legal links, accessible mobile menu, skip-to-content link.
- [x] Teal/slate design, mobile-first, labelled inputs, keyboard navigable,
      visible focus states (WCAG AA contrast verified by Lighthouse = 100).
- [x] Homepage, `/calculators`, `/salary-after-tax` (51-state index), `/about`,
      `/contact`, `/privacy-policy`, `/terms`, `/disclaimer`, `/methodology`.
- [x] Privacy policy written in full, disclosing Google AdSense, cookies,
      analytics and how to opt out of personalised ads.
- [x] 19 calculators, each with a pure `lib/` module, unit tests, a client
      component and a 400+ word page with FAQ + FAQPage schema.
- [x] `app/sitemap.ts` (all calculators + 51 state pages) and `app/robots.ts`.
- [x] Schema: WebSite, BreadcrumbList, FAQPage, WebApplication.
- [x] Breadcrumb UI + "People also use" internal links on every calculator.
- [x] `<AdSlot>` with reserved min-height (zero CLS), max 3 slots/page.
- [x] AdSense + GA4 loaded **after consent only**, non-blocking, and rendered
      only when their env vars are set. Nothing loads if they are unset.
- [x] Consent banner for EEA/UK/Switzerland visitors + `applyCmpDecision()`
      integration point for a Google-certified CMP.
- [x] `public/ads.txt` placeholder, `public/favicon.svg`.
- [x] Playwright smoke tests (`e2e/smoke.spec.ts`) and a GitHub Actions
      workflow (`.github/workflows/ci.yml`) running lint, typecheck, test,
      build and e2e.

---

## 2. You must do manually

### 2.1 Business / accounts
- [ ] Buy the domain and decide the final **site name**.
- [ ] Create a **Google AdSense** account and get the publisher ID
      (`ca-pub-XXXXXXXXXXXXXXXX`).
- [ ] Create a **Google Search Console** property for the domain.
- [ ] Create a **Google Analytics 4** property and copy the measurement ID
      (`G-XXXXXXXXXX`) — or decide to use a privacy-friendly alternative and
      replace the GA4 block in `components/ConsentScripts.tsx`.
- [ ] Buy / configure a **Google-certified CMP** (required for EEA/UK/Swiss
      traffic). AdSense will not serve personalised ads in those regions without
      one. Keep the CMP **CMP ID** for step 2.3.
- [ ] Set up the deploy target (Vercel or Cloudflare Pages) and connect the repo.

### 2.2 Environment variables
Set these in your host's dashboard (and in `.env.local` for local testing).
`NEXT_PUBLIC_*` values are inlined into the client bundle, so they are **not**
secrets — never put a private key here.

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | Yes | `BizCal` | Header, footer, metadata, schema. |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://www.yourdomain.com` | Canonical origin, no trailing slash. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | `hello@yourdomain.com` | `/contact` + legal pages. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | For ads | `ca-pub-1234567890123456` | No value → **no ads render at all**. |
| `NEXT_PUBLIC_GA_ID` | Optional | `G-XXXXXXXXXX` | No value → no analytics loads. |
| `NEXT_PUBLIC_CMP_ID` | For EEA/UK/CH | CMP's ID | Set → built-in banner stands down, CMP controls consent. |

> Until `NEXT_PUBLIC_ADSENSE_CLIENT` is set the site renders **no ad code** and
> reserves no ad space (in production it renders nothing; in development it
> shows a labelled reserved box so layout stability is easy to eyeball).

### 2.3 Wire the CMP
1. Add the CMP's `<script>` tags to `components/ConsentScripts.tsx` (there is a
   `TODO(CMP)` marker).
2. In the CMP's consent callback, call `applyCmpDecision(advertising, analytics)`
   from `lib/consent` so AdSense and GA4 obey the visitor's choice.
3. Set `NEXT_PUBLIC_CMP_ID` so the fallback banner stands down.
4. Do **not** soften, fake or auto-accept the consent signal.

### 2.4 ads.txt
- [ ] Replace the placeholder in `public/ads.txt` with your real publisher line:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

(Use the numeric part of your `ca-pub-…` publisher ID.)

### 2.5 Verify the tax data
- [ ] Work through `DATA_REVIEW.md` and confirm each flagged figure against the
      cited official source before launch.

### 2.6 Search Console & launch
- [ ] Deploy to production with all env vars set.
- [ ] Submit `https://<domain>/sitemap.xml` in Search Console.
- [ ] Request indexing for the homepage and a few key calculators.
- [ ] In AdSense, add and verify the site, then enable Auto ads / ad units.
- [ ] Confirm `https://<domain>/ads.txt` loads and shows `Authorised`.
- [ ] Re-run Lighthouse on the live URL (mobile) and confirm 90+ on all four
      categories.

### 2.7 Ongoing (recurring)
- [ ] Re-verify sources in `DATA_REVIEW.md` each autumn when the IRS publishes
      the next inflation adjustments (see the yearly update guide in that file).
- [ ] Watch for AdSense policy emails (ads must never mimic content or buttons).
- [ ] Keep the privacy policy, terms and disclaimer current if you add tools.

---

## 3. Local commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest unit tests
npm run build        # production build
npm run start        # serve the production build
npx playwright install chromium   # once, for e2e
npm run test:e2e     # Playwright smoke tests (uses npm run start)
```
