# BizCal

Free, fast US finance calculators — mortgages, paycheck/take-home pay in all 51
states, loans, debt payoff and investing. Built to rank for long-tail US finance
calculator queries and to run as a static, ad-supported site.

The site is a **static-first Next.js application**: calculation logic lives in
pure, tested modules under `lib/`, and the UI is a thin React layer on top. Data
(tax brackets, contribution limits) is kept separate from UI so that UK, Canada
and Australia versions can be added later by swapping data files.

## Stack

- **Next.js 16** (App Router, Turbopack) with React 19 and TypeScript (strict)
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Vitest** for unit tests, **Playwright** for end-to-end smoke tests
- **ESLint 9** (flat config, `eslint-config-next`) and **Prettier**
- Static generation (`generateStaticParams`) — deployable to Vercel or Cloudflare Pages

## Requirements

- Node.js 20 or newer
- npm (the repo ships a `package-lock.json`)

## Setup

```bash
npm install
cp .env.example .env.local   # then edit as needed (all variables are optional in dev)
npm run dev                  # http://localhost:3000
```

### Environment variables

Everything is optional for local development; the site runs with sensible
defaults and simply renders no ads or analytics when keys are absent.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_NAME` | Display name used in the header, footer and schema. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, no trailing slash. Used for canonicals, OG tags and the sitemap. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact address shown on `/contact` and legal pages. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID (`ca-pub-...`). No ads render when unset. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-...`). No analytics loads when unset. |
| `NEXT_PUBLIC_CMP_ID` | Google-certified consent management platform ID. See `CHECKLIST.md`. |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server. |
| `npm run build` | Production build (type-checks as part of the build). |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint over the whole repo. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run format` / `npm run format:check` | Prettier write / check. |
| `npm run test` | Run the Vitest unit tests once. |
| `npm run test:watch` | Vitest in watch mode. |
| `npm run test:e2e` | Playwright smoke tests (requires a running build; see below). |

## Project structure

```
app/                 App Router pages (one directory per route)
  calculators/       Full calculator directory
  salary-after-tax/  Index + [state] dynamic route (51 static pages)
components/          Shared UI (layout, inputs, result panels, ad slots)
lib/                 Pure, tested calculation modules
  tax/               2026 federal + state tax data and the paycheck engine
  calculators.ts     Registry that drives nav, directories, sitemap and links
```

`lib/calculators.ts` is the single source of truth for every calculator: adding
an entry makes it appear in the homepage grid, the directory, the sitemap,
breadcrumbs and "People also use" links.

## Testing

Unit tests live next to the modules they cover (`lib/**/*.test.ts`):

```bash
npm run test
```

End-to-end smoke tests live in `e2e/` and use Playwright. They start the app
automatically:

```bash
npx playwright install --with-deps   # first run only
npm run test:e2e
```

## Data and accuracy

Every data file carries a header comment naming its official source and a
`Last reviewed` date. Figures come from the IRS, the Social Security
Administration and state revenue departments; nothing is invented. Where a
figure could not be verified it is flagged in `DATA_REVIEW.md` rather than
guessed. See `/methodology` on the site for the update schedule and limitations.

All results are estimates, not financial or tax advice.

## Deploy

The site is fully static and can be deployed anywhere that runs Next.js.

**Vercel**

1. Import the repository and set the environment variables above.
2. Build command `npm run build`, output handled automatically.

**Cloudflare Pages**

- Framework preset: Next.js. Build command `npm run build`.
- Set the same environment variables in the Pages dashboard.

After deploying, set `NEXT_PUBLIC_SITE_URL` to the real domain so canonical URLs
and the sitemap are correct, then submit `/sitemap.xml` in Google Search Console.

See `CHECKLIST.md` for the manual launch steps and `DATA_REVIEW.md` for the
figures to verify and the yearly tax-data update guide.
