/**
 * US state individual income tax data — tax year 2026 (51 jurisdictions: 50 states + DC).
 *
 * SOURCES (all retrieved while authoring this file):
 *  - Tax Foundation, "State Individual Income Tax Rates and Brackets, 2026"
 *    (published 2026-02-17; data as of 2026-01-01). This is the primary source for every entry below.
 *    https://taxfoundation.org/data/all/state/state-income-tax-rates-2026/
 *  - Federation of Tax Administrators, "Individual Income Tax Rates and Brackets" table
 *    https://taxadmin.org/individual-income-tax-rates-and-brackets-table/
 *  - Georgia Department of Revenue, "Important Tax Updates" — 2026 flat rate 4.99%, standard deduction $15,000 / $30,000.
 *    https://dor.georgia.gov/taxes/important-tax-updates
 *  - Oklahoma Tax Commission, "Pay Taxes" — 2026 rate schedule (single & married).
 *    https://oklahoma.gov/tax/individuals/pay-taxes.html
 *
 * CONVENTIONS / KNOWN LIMITATIONS:
 *  - `single` / `married` are arrays of [threshold, ratePercent]; the first entry's threshold must be 0.
 *  - `head` (head-of-household) bracket arrays are OMITTED for every jurisdiction. The cited source table
 *    reports single and married-filing-jointly brackets only; head-of-household brackets were NOT fabricated.
 *    The calculation engine is expected to fall back to `single` for head-of-household filers.
 *  - `deduction.head` therefore defaults to the single-filer amount wherever a deduction is supplied.
 *  - `deduction` uses the state standard deduction where the state has one; where the state instead provides a
 *    dollar personal exemption, that exemption amount is used. Personal exemptions structured as tax CREDITS
 *    (the source table annotates them as "$X credit") are NOT deducted and are represented as 0.
 *  - Where the source table's first listed rate applies above a non-zero threshold (a statutory 0% first
 *    bracket), a leading `[0, 0]` bracket is inserted so the first threshold is 0.
 *  - `approx: true` marks jurisdictions whose 2026 inflation-adjusted brackets/deductions were not yet
 *    published at source time, so the values reflect the prior (2025) published amounts. See notes in file.
 *  - Local/city/county income taxes are excluded (see per-state `note` where significant).
 *
 * Tax year: 2026
 * Last reviewed: 2026-11-12
 */

/** A marginal state bracket: income at or above `threshold` (and below the next bracket's threshold) is taxed at `ratePercent`. */
export type StateBracket = [threshold: number, ratePercent: number];

export interface StateDef {
  /** URL slug used in /salary-after-tax/[state]. Lowercase kebab-case, e.g. "new-york", "district-of-columbia", "texas". */
  slug: string;
  /** Full display name, e.g. "New York", "District of Columbia". */
  name: string;
  /** true when the state levies NO tax on wage income. */
  none?: boolean;
  /** Single-filer brackets, ascending by threshold, first threshold must be 0. */
  single?: StateBracket[];
  /** Married-filing-jointly brackets. Omit when they are identical to `single` (flat states). */
  married?: StateBracket[];
  /** Head-of-household brackets. Omit when identical to `single`. */
  head?: StateBracket[];
  /** Standard deduction / exemption amounts by filing status. Omit when the state has none (use 0). */
  deduction?: { single: number; married: number; head: number };
  /** A flat employee-side state payroll tax that is NOT income tax (e.g. a paid-leave premium). Only include if you can cite it. */
  payroll?: { label: string; rate: number };
  /** true when the figures are best-effort and must be verified before launch. */
  approx?: boolean;
  /** Short human-readable note about local taxes or special rules, shown in the UI. Optional. */
  note?: string;
}

export const STATES_2026: StateDef[] = [
  // Source: Tax Foundation 2026 table (Alabama notes c, uu: standard deduction phases down with AGI).
  {
    slug: "alabama",
    name: "Alabama",
    single: [
      [0, 2],
      [500, 4],
      [3000, 5],
    ],
    married: [
      [0, 2],
      [1000, 4],
      [6000, 5],
    ],
    deduction: { single: 3000, married: 8500, head: 3000 },
    note: "Standard deduction is reduced for higher-AGI filers. No local wage tax (some localities levy occupational taxes).",
  },

  // Source: Tax Foundation 2026 table (no individual income tax).
  {
    slug: "alaska",
    name: "Alaska",
    none: true,
  },

  // Source: Tax Foundation 2026 table (flat 2.5%; conforms to pre-OBBBA federal standard deduction, note vv).
  {
    slug: "arizona",
    name: "Arizona",
    single: [[0, 2.5]],
    deduction: { single: 8350, married: 16700, head: 8350 },
  },

  // Source: Tax Foundation 2026 table (approx: note j — 2026 inflation-adjusted bracket widths not published; 2025 widths shown).
  {
    slug: "arkansas",
    name: "Arkansas",
    single: [
      [0, 2],
      [4600, 3.9],
    ],
    deduction: { single: 2470, married: 4940, head: 2470 },
    approx: true,
    note: "Top rate 3.9%. Personal exemptions are credits. Bracket widths are 2025 figures (2026 not yet published at source time).",
  },

  // Source: Tax Foundation 2026 table (approx: note j/n — 2026 inflation-adjusted brackets not published; 2025 widths shown).
  // Mental-health services tax (1% over $1M) is included in the 13.3% top rate. Excludes SDI payroll tax.
  {
    slug: "california",
    name: "California",
    single: [
      [0, 1],
      [11079, 2],
      [26264, 4],
      [41452, 6],
      [57542, 8],
      [72724, 9.3],
      [371479, 10.3],
      [445771, 11.3],
      [742953, 12.3],
      [1000000, 13.3],
    ],
    married: [
      [0, 1],
      [22158, 2],
      [52528, 4],
      [82904, 6],
      [115084, 8],
      [145448, 9.3],
      [742958, 10.3],
      [891542, 11.3],
      [1000000, 12.3],
      [1485906, 13.3],
    ],
    deduction: { single: 5540, married: 11080, head: 5540 },
    approx: true,
    note: "Includes the 1% mental-health surtax above $1M. Excludes the State Disability Insurance payroll tax (~1.2-1.3%). Bracket widths are 2025 figures.",
  },

  // Source: Tax Foundation 2026 table (flat 4.4%).
  {
    slug: "colorado",
    name: "Colorado",
    single: [[0, 4.4]],
    deduction: { single: 16100, married: 32200, head: 16100 },
    note: "Some jurisdictions levy local payroll/occupational taxes.",
  },

  // Source: Tax Foundation 2026 table (personal exemption used as the deduction; phased out at higher AGI).
  {
    slug: "connecticut",
    name: "Connecticut",
    single: [
      [0, 2],
      [10000, 4.5],
      [50000, 5.5],
      [100000, 6],
      [200000, 6.5],
      [250000, 6.9],
      [500000, 6.99],
    ],
    married: [
      [0, 2],
      [20000, 4.5],
      [100000, 5.5],
      [200000, 6],
      [400000, 6.5],
      [500000, 6.9],
      [1000000, 6.99],
    ],
    deduction: { single: 15000, married: 24000, head: 15000 },
    note: "Tax-benefit recapture can make high earners pay the top rate on more income. Personal exemption phases out at higher AGI.",
  },

  // Source: Tax Foundation 2026 table (0% first bracket inserted to satisfy first-threshold=0 rule).
  {
    slug: "delaware",
    name: "Delaware",
    single: [
      [0, 0],
      [2000, 2.2],
      [5000, 3.9],
      [10000, 4.8],
      [20000, 5.2],
      [25000, 5.55],
      [60000, 6.6],
    ],
    deduction: { single: 3250, married: 6500, head: 3250 },
  },

  // Source: Tax Foundation 2026 table (DC uses the same brackets for all filing statuses).
  {
    slug: "district-of-columbia",
    name: "District of Columbia",
    single: [
      [0, 4],
      [10000, 6],
      [40000, 6.5],
      [60000, 8.5],
      [250000, 9.25],
      [500000, 9.75],
      [1000000, 10.75],
    ],
    deduction: { single: 16100, married: 32200, head: 16100 },
    note: "District of Columbia levies income tax (slugs as district-of-columbia). Brackets are the same for all filing statuses.",
  },

  // Source: Tax Foundation 2026 table (no individual income tax).
  {
    slug: "florida",
    name: "Florida",
    none: true,
  },

  // Source: Georgia Dept. of Revenue 2026 update (HB 463): flat 4.99%, std deduction $15,000 / $30,000
  // https://dor.georgia.gov/taxes/important-tax-updates
  {
    slug: "georgia",
    name: "Georgia",
    single: [[0, 4.99]],
    deduction: { single: 15000, married: 30000, head: 15000 },
    note: "Flat 4.99% for 2026 (accelerated by HB 463). Further rate cuts are conditional.",
  },

  // Source: Tax Foundation 2026 table (12 brackets; personal exemption also shown separately).
  {
    slug: "hawaii",
    name: "Hawaii",
    single: [
      [0, 1.4],
      [9600, 3.2],
      [14400, 5.5],
      [19200, 6.4],
      [24000, 6.8],
      [36000, 7.2],
      [48000, 7.6],
      [125000, 7.9],
      [175000, 8.25],
      [225000, 9],
      [275000, 10],
      [325000, 11],
    ],
    married: [
      [0, 1.4],
      [19200, 3.2],
      [28800, 5.5],
      [38400, 6.4],
      [48000, 6.8],
      [72000, 7.2],
      [96000, 7.6],
      [250000, 7.9],
      [350000, 8.25],
      [450000, 9],
      [550000, 10],
      [650000, 11],
    ],
    deduction: { single: 4400, married: 8800, head: 4400 },
    note: "Hawaii levies an additional county surcharge; 12 brackets. Source lists a separate personal exemption ($1,144/$2,288) not modeled here.",
  },

  // Source: Tax Foundation 2026 table (approx: note j — 2026 inflation-adjusted brackets not published; 2025 widths shown).
  {
    slug: "idaho",
    name: "Idaho",
    single: [
      [0, 0],
      [4811, 5.3],
    ],
    married: [
      [0, 0],
      [9622, 5.3],
    ],
    deduction: { single: 16100, married: 32200, head: 16100 },
    approx: true,
    note: "Effectively flat 5.3% above a small 0%-rate first bracket. Bracket thresholds are 2025 figures (2026 not yet published at source time).",
  },

  // Source: Tax Foundation 2026 table (flat 4.95%).
  {
    slug: "illinois",
    name: "Illinois",
    single: [[0, 4.95]],
    deduction: { single: 2925, married: 5850, head: 2925 },
    note: "No standard deduction; a per-person exemption ($2,925) is modeled as the deduction.",
  },

  // Source: Tax Foundation 2026 table (flat 2.95%).
  {
    slug: "indiana",
    name: "Indiana",
    single: [[0, 2.95]],
    deduction: { single: 1000, married: 2000, head: 1000 },
    note: "County income taxes apply statewide (average ~0.35% of AGI). Personal exemption modeled as the deduction.",
  },

  // Source: Tax Foundation 2026 table (flat 3.8%).
  {
    slug: "iowa",
    name: "Iowa",
    single: [[0, 3.8]],
    deduction: { single: 16100, married: 32200, head: 16100 },
    note: "Iowa moved to a flat 3.8% for 2026. Some local (school) surtaxes exist.",
  },

  // Source: Tax Foundation 2026 table.
  {
    slug: "kansas",
    name: "Kansas",
    single: [
      [0, 5.2],
      [23000, 5.58],
    ],
    married: [
      [0, 5.2],
      [46000, 5.58],
    ],
    deduction: { single: 3605, married: 8240, head: 3605 },
  },

  // Source: Tax Foundation 2026 table (flat 3.5%; std deduction is NOT doubled for MFJ, note z).
  {
    slug: "kentucky",
    name: "Kentucky",
    single: [[0, 3.5]],
    deduction: { single: 3360, married: 3360, head: 3360 },
    note: "Flat 3.5%. Local occupational taxes apply in many jurisdictions (average ~0.93% of AGI).",
  },

  // Source: Tax Foundation 2026 table (flat 3.0%).
  {
    slug: "louisiana",
    name: "Louisiana",
    single: [[0, 3.0]],
    deduction: { single: 12875, married: 25750, head: 12875 },
    note: "Louisiana moved to a flat 3.0% for 2026.",
  },

  // Source: Tax Foundation 2026 table (personal exemption used as the deduction; phases out).
  {
    slug: "maine",
    name: "Maine",
    single: [
      [0, 5.8],
      [27399, 6.75],
      [64849, 7.15],
    ],
    married: [
      [0, 5.8],
      [54849, 6.75],
      [129749, 7.15],
    ],
    deduction: { single: 8350, married: 16700, head: 8350 },
    note: "Standard deduction and personal exemption phase out at higher income.",
  },

  // Source: Tax Foundation 2026 table.
  {
    slug: "maryland",
    name: "Maryland",
    single: [
      [0, 2],
      [1000, 3],
      [2000, 4],
      [3000, 4.75],
      [100000, 5],
      [125000, 5.25],
      [150000, 5.5],
      [250000, 5.75],
      [500000, 6.25],
      [1000000, 6.5],
    ],
    married: [
      [0, 2],
      [1000, 3],
      [2000, 4],
      [3000, 4.75],
      [150000, 5],
      [175000, 5.25],
      [225000, 5.5],
      [300000, 5.75],
      [600000, 6.25],
      [1200000, 6.5],
    ],
    deduction: { single: 3350, married: 6700, head: 3350 },
    note: "County income taxes apply statewide (average ~2.4% of AGI). Additional 2% capital-gains surtax above $350k AGI is excluded.",
  },

  // Source: Tax Foundation 2026 table (approx: note j — 2026 bracket threshold not published; 2025 value shown).
  // 4% surtax on income over ~$1.08M produces the 9% top bracket. Paid Family & Medical Leave payroll tax cited (note rr).
  {
    slug: "massachusetts",
    name: "Massachusetts",
    single: [
      [0, 5],
      [1083150, 9],
    ],
    deduction: { single: 4400, married: 8800, head: 4400 },
    payroll: { label: "Paid Family and Medical Leave (employee share)", rate: 0.46 },
    approx: true,
    note: "5% flat plus a 4% surtax above ~$1.08M (threshold is a 2025 figure). No standard deduction; personal exemption modeled.",
  },

  // Source: Tax Foundation 2026 table (flat 4.25%; personal exemption modeled as the deduction).
  {
    slug: "michigan",
    name: "Michigan",
    single: [[0, 4.25]],
    deduction: { single: 5900, married: 11800, head: 5900 },
    note: "City income taxes exist in ~24 cities (average ~0.16% of AGI).",
  },

  // Source: Tax Foundation 2026 table.
  {
    slug: "minnesota",
    name: "Minnesota",
    single: [
      [0, 5.35],
      [33310, 6.8],
      [109430, 7.85],
      [203150, 9.85],
    ],
    married: [
      [0, 5.35],
      [48700, 6.8],
      [193480, 7.85],
      [337930, 9.85],
    ],
    deduction: { single: 15300, married: 30600, head: 15300 },
    note: "Standard deduction phases down at higher income. A separate 1% surtax on net investment income over $1M is excluded.",
  },

  // Source: Tax Foundation 2026 table (0% first bracket inserted to satisfy first-threshold=0 rule).
  {
    slug: "mississippi",
    name: "Mississippi",
    single: [
      [0, 0],
      [10000, 4],
    ],
    deduction: { single: 2300, married: 4600, head: 2300 },
    note: "Flat 4% above a $10,000 0%-rate exemption.",
  },

  // Source: Tax Foundation 2026 table (0% first bracket inserted; top rate 4.7%).
  {
    slug: "missouri",
    name: "Missouri",
    single: [
      [0, 0],
      [1348, 2],
      [2696, 2.5],
      [4044, 3],
      [5392, 3.5],
      [6740, 4],
      [8088, 4.5],
      [9436, 4.7],
    ],
    deduction: { single: 16100, married: 32200, head: 16100 },
    note: "Brackets reset toward 0% each year as the top rate phases down. Local income taxes exist in some cities (~0.18%).",
  },

  // Source: Tax Foundation 2026 table.
  {
    slug: "montana",
    name: "Montana",
    single: [
      [0, 4.7],
      [47500, 5.65],
    ],
    married: [
      [0, 4.7],
      [95000, 5.65],
    ],
    deduction: { single: 16100, married: 32200, head: 16100 },
  },

  // Source: Tax Foundation 2026 table (personal exemption modeled as credit; std deduction used).
  {
    slug: "nebraska",
    name: "Nebraska",
    single: [
      [0, 2.46],
      [4130, 3.51],
      [24760, 4.55],
    ],
    married: [
      [0, 2.46],
      [8250, 3.51],
      [49530, 4.55],
    ],
    deduction: { single: 8850, married: 17700, head: 8850 },
  },

  // Source: Tax Foundation 2026 table (no individual income tax).
  {
    slug: "nevada",
    name: "Nevada",
    none: true,
  },

  // Source: Tax Foundation 2026 table — no tax on wage income; interest & dividends tax repealed as of 2025.
  {
    slug: "new-hampshire",
    name: "New Hampshire",
    none: true,
    note: "No tax on wages. The interest & dividends tax was repealed effective 2025.",
  },

  // Source: Tax Foundation 2026 table (personal exemption modeled as the deduction).
  {
    slug: "new-jersey",
    name: "New Jersey",
    single: [
      [0, 1.4],
      [20000, 1.75],
      [35000, 3.5],
      [40000, 5.525],
      [75000, 6.37],
      [500000, 8.97],
      [1000000, 10.75],
    ],
    married: [
      [0, 1.4],
      [20000, 1.75],
      [50000, 2.45],
      [70000, 3.5],
      [80000, 5.525],
      [150000, 6.37],
      [500000, 8.97],
      [1000000, 10.75],
    ],
    deduction: { single: 1000, married: 2000, head: 1000 },
    note: "Personal exemption modeled as the deduction. Additional exemptions/deductions for age and dependents are not modeled.",
  },

  // Source: Tax Foundation 2026 table (personal exemption is a deduction for dependents, note jj).
  {
    slug: "new-mexico",
    name: "New Mexico",
    single: [
      [0, 1.5],
      [5500, 3.2],
      [16500, 4.3],
      [33500, 4.7],
      [66500, 4.9],
      [210000, 5.9],
    ],
    married: [
      [0, 1.5],
      [8000, 3.2],
      [25000, 4.3],
      [50000, 4.7],
      [100000, 4.9],
      [315000, 5.9],
    ],
    deduction: { single: 16100, married: 32200, head: 16100 },
    note: "Dependent deduction ($4,000 per dependent) is not modeled.",
  },

  // Source: Tax Foundation 2026 table (tax-benefit recapture applies, note i).
  {
    slug: "new-york",
    name: "New York",
    single: [
      [0, 3.9],
      [8500, 4.4],
      [11700, 5.15],
      [13900, 5.4],
      [80650, 5.9],
      [215400, 6.85],
      [1077550, 9.65],
      [5000000, 10.3],
      [25000000, 10.9],
    ],
    married: [
      [0, 3.9],
      [17150, 4.4],
      [23600, 5.15],
      [27900, 5.4],
      [161550, 5.9],
      [323200, 6.85],
      [2155350, 9.65],
      [5000000, 10.3],
      [25000000, 10.9],
    ],
    deduction: { single: 8000, married: 16050, head: 8000 },
    note: "Excludes NYC (approx 3.0-3.9%) and Yonkers (approx 1.6% of AGI) local income taxes. Tax-benefit recapture applies at high income.",
  },

  // Source: Tax Foundation 2026 table (flat 3.99%).
  {
    slug: "north-carolina",
    name: "North Carolina",
    single: [[0, 3.99]],
    deduction: { single: 12750, married: 25500, head: 12750 },
  },

  // Source: Tax Foundation 2026 table (0% first bracket inserted; two-bracket structure).
  {
    slug: "north-dakota",
    name: "North Dakota",
    single: [
      [0, 0],
      [48475, 1.95],
      [244825, 2.5],
    ],
    married: [
      [0, 0],
      [80975, 1.95],
      [298075, 2.5],
    ],
    deduction: { single: 16100, married: 32200, head: 16100 },
    note: "0% on the first ~$48,475 (single) of taxable income, then 1.95% / 2.5%.",
  },

  // Source: Tax Foundation 2026 table (0% first bracket inserted; flat 2.75% above $26,050).
  {
    slug: "ohio",
    name: "Ohio",
    single: [
      [0, 0],
      [26050, 2.75],
    ],
    deduction: { single: 2400, married: 4800, head: 2400 },
    note: "0% on the first $26,050 of income, then flat 2.75%. Municipal income taxes apply statewide (average ~1.2% of AGI).",
  },

  // Source: Tax Foundation 2026 table; Oklahoma Tax Commission "Pay Taxes" (2026 schedule), confirmed by the
  // Federation of Tax Administrators table at https://taxadmin.org/individual-income-tax-rates-and-brackets-table/.
  // https://oklahoma.gov/tax/individuals/pay-taxes.html
  {
    slug: "oklahoma",
    name: "Oklahoma",
    single: [
      [0, 0],
      [3750, 2.5],
      [4900, 3.5],
      [7200, 4.5],
    ],
    married: [
      [0, 0],
      [7500, 2.5],
      [9800, 3.5],
      [14400, 4.5],
    ],
    deduction: { single: 6350, married: 12700, head: 6350 },
    note: "Restructured for 2026 into a 0% first bracket then 2.5% / 3.5% / 4.5%.",
  },

  // Source: Tax Foundation 2026 table.
  {
    slug: "oregon",
    name: "Oregon",
    single: [
      [0, 4.75],
      [4550, 6.75],
      [11400, 8.75],
      [125000, 9.9],
    ],
    married: [
      [0, 4.75],
      [9100, 6.75],
      [22800, 8.75],
      [250000, 9.9],
    ],
    deduction: { single: 2910, married: 5820, head: 2910 },
    note: "Top bracket is not fully indexed. Some jurisdictions levy local payroll taxes (~0.18%).",
  },

  // Source: Tax Foundation 2026 table (flat 3.07%; no standard deduction and no personal exemption).
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    single: [[0, 3.07]],
    deduction: { single: 0, married: 0, head: 0 },
    note: "Local Earned Income Tax applies in nearly every municipality (average ~1.0% of AGI). No standard deduction.",
  },

  // Source: Tax Foundation 2026 table (personal exemption used as the deduction; phases out, note ff).
  {
    slug: "rhode-island",
    name: "Rhode Island",
    single: [
      [0, 3.75],
      [82050, 4.75],
      [186450, 5.99],
    ],
    deduction: { single: 11200, married: 22400, head: 11200 },
    note: "Standard deduction, personal exemption and dependency exemption all phase out between ~$261k and ~$290.8k of modified federal AGI.",
  },

  // Source: Tax Foundation 2026 table (0% first bracket inserted; top rate reverts mid-2026, note qq).
  {
    slug: "south-carolina",
    name: "South Carolina",
    single: [
      [0, 0],
      [3640, 3],
      [18230, 6],
    ],
    deduction: { single: 8350, married: 16700, head: 8350 },
    note: "Top marginal rate is scheduled to revert to 6.2% on July 1, 2026 (6.0% shown for Jan 1, 2026).",
  },

  // Source: Tax Foundation 2026 table (no individual income tax).
  {
    slug: "south-dakota",
    name: "South Dakota",
    none: true,
  },

  // Source: Tax Foundation 2026 table (no tax on wage income).
  {
    slug: "tennessee",
    name: "Tennessee",
    none: true,
    note: "No tax on wages (the Hall income tax on interest & dividends was fully repealed in 2021).",
  },

  // Source: Tax Foundation 2026 table (no individual income tax).
  {
    slug: "texas",
    name: "Texas",
    none: true,
  },

  // Source: Tax Foundation 2026 table (flat 4.5%).
  {
    slug: "utah",
    name: "Utah",
    single: [[0, 4.5]],
    deduction: { single: 0, married: 0, head: 0 },
    note: "Flat 4.5%; the standard deduction operates as a nonrefundable credit (modeled as 0 here).",
  },

  // Source: Tax Foundation 2026 table (approx: notes j/n — 2026 inflation-adjusted figures not published; 2025 values shown).
  {
    slug: "vermont",
    name: "Vermont",
    single: [
      [0, 3.35],
      [49400, 6.6],
      [119700, 7.6],
      [249700, 8.75],
    ],
    married: [
      [0, 3.35],
      [82500, 6.6],
      [199450, 7.6],
      [304000, 8.75],
    ],
    deduction: { single: 7650, married: 15300, head: 7650 },
    approx: true,
    note: "Brackets and deductions are 2025 figures (2026 not yet published at source time). High earners pay the greater of state tax or 3% of federal AGI.",
  },

  // Source: Tax Foundation 2026 table.
  {
    slug: "virginia",
    name: "Virginia",
    single: [
      [0, 2],
      [3000, 3],
      [5000, 5],
      [17000, 5.75],
    ],
    deduction: { single: 8750, married: 17500, head: 8750 },
  },

  // Source: Tax Foundation 2026 table — no tax on wage income; 7% excise tax on long-term capital gains only.
  // WA Cares payroll tax cited (note ss).
  {
    slug: "washington",
    name: "Washington",
    none: true,
    payroll: { label: "WA Cares (long-term care, employee withholding)", rate: 0.58 },
    note: "No tax on wages. A 7% excise tax applies to long-term capital gains above a threshold (not income tax).",
  },

  // Source: Tax Foundation 2026 table (personal exemption modeled as the deduction).
  {
    slug: "west-virginia",
    name: "West Virginia",
    single: [
      [0, 2.22],
      [10000, 2.96],
      [25000, 3.33],
      [40000, 4.44],
      [60000, 4.82],
    ],
    deduction: { single: 2000, married: 4000, head: 2000 },
    note: "Personal exemption modeled as the deduction.",
  },

  // Source: Tax Foundation 2026 table (standard deduction phases out at higher income, note ii).
  {
    slug: "wisconsin",
    name: "Wisconsin",
    single: [
      [0, 3.5],
      [15110, 4.4],
      [51950, 5.3],
      [332720, 7.65],
    ],
    married: [
      [0, 3.5],
      [20150, 4.4],
      [69260, 5.3],
      [443630, 7.65],
    ],
    deduction: { single: 13960, married: 25840, head: 13960 },
    note: "Standard deduction phases out to zero at higher income.",
  },

  // Source: Tax Foundation 2026 table (no individual income tax).
  {
    slug: "wyoming",
    name: "Wyoming",
    none: true,
  },
];

/** Look up a state/jurisdiction definition by its URL slug (e.g. "new-york", "district-of-columbia"). */
export function getState(slug: string): StateDef | undefined {
  return STATES_2026.find((s) => s.slug === slug);
}
