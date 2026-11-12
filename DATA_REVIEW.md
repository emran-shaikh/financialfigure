# DATA_REVIEW.md

Every number that powers a result on this site is listed below with its source.
**Nothing in this file has been changed in code** — where a figure is flagged,
it is recorded here for the owner to verify, exactly as instructed. The tax
engine numbers are only edited when an authoritative source or a failing test
proves a bug.

Legend: **Verify** = please confirm against the cited source before launch.

---

## 1. Federal income tax — tax year 2026

File: `lib/tax/federal2026.ts`
Source: IRS Rev. Proc. 2025-32 / News Release IR-2025-103 (published 2025-10-09),
<https://www.irs.gov/pub/irs-drop/rp-25-32.pdf>. Last reviewed: 2026-11-12.

| Figure | Value used | Status |
| --- | --- | --- |
| Standard deduction, single | $16,100 | Verify |
| Standard deduction, married filing jointly | $32,200 | Verify |
| Standard deduction, head of household | $24,150 | Verify |
| Single brackets top (10/12/22/24/32/35%) | 12,400 / 50,400 / 105,700 / 201,775 / 256,225 / 640,600 | Verify |
| Married brackets top | 24,800 / 100,800 / 211,400 / 403,550 / 512,450 / 768,700 | Verify |
| Head-of-household brackets top | 17,700 / 67,450 / 105,700 / 201,750 / 256,200 / 640,600 | Verify |

## 2. FICA / payroll — tax year 2026

File: `lib/tax/federal2026.ts` (`PAYROLL_2026`)
Sources: SSA 2026 COLA Fact Sheet (contribution & benefit base),
<https://www.ssa.gov/oact/cola/cbb.html>; IRS Topic No. 751 (withholding rates).

| Figure | Value used | Status |
| --- | --- | --- |
| Social Security employee rate (OASDI) | 6.2% | Verify |
| Social Security wage base | $184,500 | Verify |
| Medicare employee rate (HI) | 1.45% | Verify |
| Additional Medicare Tax rate | 0.9% | Verify |
| Additional Medicare thresholds (single/HOH, married) | $200,000 / $250,000 | Verify |
| Total SECA self-employment rate | 15.3% (12.4 + 2.9) | Verify |
| Net-earnings factor (IRC §1402(a)(12)) | 92.35% | Verify |
| Deductible employer-equivalent SECA share | 50% | Verify |

## 3. Retirement contribution limits — tax year 2026

File: `lib/data/retirement2026.ts`
Source: IRS Notice 2025-67 <https://www.irs.gov/pub/irs-drop/n-25-67.pdf> and
News Release IR-2025-111 (2025-11-13). Last reviewed: 2026-11-12.

| Figure | Value used | Status |
| --- | --- | --- |
| 401(k) elective deferral | $24,500 | Verify |
| Catch-up, age 50+ | $8,000 | Verify |
| Higher catch-up, ages 60–63 (SECURE 2.0) | $11,250 | Verify |
| Deferral + standard catch-up (age 50+) | $32,500 | Verify |
| IRA contribution limit | $7,500 | Verify |
| IRA catch-up, age 50+ | $1,100 | Verify |

## 4. State income tax — flagged figures

File: `lib/tax/states2026.ts`
Source of the underlying table: Tax Foundation, "State Individual Income Tax
Rates and Brackets for 2026" (provided data).

Five jurisdictions are marked `approx: true` in the source, meaning their 2026
inflation-adjusted brackets/deductions had **not** been finalised when the table
was compiled. These are the figures to re-verify first:

| State | Line | What is approximate | Status |
| --- | --- | --- | --- |
| Arkansas | ~line 95 | Brackets (2% / 3.9% above $4,600) and 2026 deduction ($2,470 / $4,940) | Verify |
| California | ~line 129 | Full 9-bracket schedule (1%…13.3%) and standard deduction ($5,540 / $11,080) | Verify |
| Idaho | ~line 267 | Flat 5.3% from $0 and standard deduction ($16,100 / $32,200) | Verify |
| Massachusetts | ~line 392 | 5% / 9% (millionaire surtax) and personal exemption ($4,400 / $8,800) | Verify |
| Vermont | ~line 746 | 4-bracket schedule (3.35%…8.75%) and standard deduction ($7,650 / $15,300) | Verify |

Additional state notes recorded in the source file header:
- The source table publishes **single** and **married** brackets only;
  **head-of-household is not fabricated** — the engine falls back to `single`.
  Where a deduction is supplied, `deduction.head` defaults to the single amount.
- Personal exemptions structured as **tax credits** (annotated "$X credit" in the
  source) are **not** deducted; they are represented as 0.
- Where a statutory 0% first bracket applies above a non-zero threshold, a
  leading `[0, 0]` bracket is inserted so the first threshold is 0.
- New Hampshire: wage income is not taxed (the state's former interest/dividends
  tax was repealed); see the note at ~line 505.

## 5. State payroll add-ons

File: `lib/tax/states2026.ts`

| State | Program | Rate used | Line | Status |
| --- | --- | --- | --- | --- |
| Massachusetts | Paid Family and Medical Leave (employee share) | 0.46% | ~line 399 | Verify |
| Washington | WA Cares (long-term care, employee withholding) | 0.58% | ~line 777 | Verify |

These are the only two jurisdictions in the file that add a state payroll
withholding on top of federal FICA, so confirm both rates and that no other
state's new program is missing.

## 6. Benchmark rates used in page content (not in the tax engine)

These appear in calculator copy/FAQ as benchmarks only — the calculator always
lets the user enter their own rate. Confirm the figures and dates.

| Used for | Figure | Source |
| --- | --- | --- |
| Credit card average APR | 21.19% (all accounts) / 22.36% (accounts assessed interest) | Federal Reserve **G.19** Consumer Credit, August 2026 data (released 2026-10-07), <https://www.federalreserve.gov/releases/g19/current/>. See `app/credit-card-payoff-calculator/page.tsx`. |
| Auto loan average APR | 7.54% (60-month, new car) / 7.17% (72-month) | Federal Reserve **G.19**, same release. See `app/auto-loan-calculator/page.tsx`. |
| Federal student loan rates | 6.52% undergraduate, 8.07% graduate unsubsidized, 9.07% Direct PLUS | **studentaid.gov**, loans first disbursed 2026-07-01 to 2027-06-30, <https://studentaid.gov/understand-aid/types/loans/interest-rates>. See `app/student-loan-payoff-calculator/page.tsx`. |
| Mortgage DTI framework (28/36 and up to 50% cap) | 36% / up to 50% | Fannie Mae Selling Guide **B3-6-02** (DTI ratios), <https://selling-guide.fanniemae.com/sel/b3-6-02/debt-to-income-ratios/>; FHA Handbook 4000.1. See `lib/affordability.ts`. |
| Bonus / supplemental withholding | 22% flat (37% on amounts over $1,000,000) | IRS **Publication 15** (Circular E), section 7 "Supplemental Wages". See `lib/bonus.ts`. |

## 7. Model assumptions (documented, not "data")

- Amortisation uses the standard formula `M = P·r / (1 − (1+r)^−n)`; the engine
  is unit-tested against hand-computed values.
- `lib/rentVsBuy.ts` uses a deliberately simplified net-cost model (its
  assumptions are listed at the top of the file and on `/methodology`).
- `lib/debtPayoff.ts` simulates snowball vs avalanche with a 600-month cap;
  `lib/studentLoan.ts` caps at 720 months; `lib/creditCard.ts` at 1,200 months.

---

## 8. Yearly update guide (when new figures publish)

Do these once a year, in this order. Each new figure needs a source comment and
an updated **"Last reviewed"** date at the top of the file.

1. **October — IRS inflation adjustments** (next: Rev. Proc. for tax year 2027,
   usually early-to-mid October). Update `lib/tax/federal2026.ts`:
   - bracket thresholds and standard deductions (§1),
   - then rename the file/consts to the new tax year once you add it
     (e.g. `federal2027.ts`) and point the engine at it.
2. **October — SSA COLA fact sheet** (Social Security contribution & benefit
   base). Update the wage base in `lib/tax/federal2026.ts` (§2).
3. **November — IRS retirement plan limits** (Notice + news release). Update
   `lib/data/retirement2026.ts` (§3).
4. **Late summer → autumn — state revenue departments.** Re-verify every entry
   in `lib/tax/states2026.ts`, starting with the five `approx: true` states in
   §4 and the two payroll add-ons in §5. Remove `approx: true` for any state
   you can now confirm against the state's own published schedule.
5. **Ongoing — Federal Reserve G.19** (monthly) and **studentaid.gov** (annual,
   each July) for the benchmark rates in §6.
6. **After updating**, run `npm run test` and `npm run build`. Any test that
   fails is either a real bug (fix it) or an outdated expectation (update the
   test with the new source citation in the commit message).

Current review date for all tax data in this project: **2026-11-12**.
