/**
 * The single source of truth for every calculator on the site.
 *
 * The registry drives the homepage grid, the /calculators directory, the
 * category pages, breadcrumbs, "People also use" internal links and the
 * sitemap. Add a calculator here once and it appears everywhere.
 */

export type CategoryId = "mortgage" | "paycheck" | "loans" | "investing";

export interface Category {
  id: CategoryId;
  name: string;
  /** Directory page for the category. */
  href: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "mortgage",
    name: "Mortgage & home",
    href: "/mortgage-calculator",
    blurb: "Monthly payments, affordability, amortisation and refinancing.",
  },
  {
    id: "paycheck",
    name: "Paycheck & tax",
    href: "/salary-after-tax",
    blurb: "Take-home pay, hourly rates, self-employment and bonus withholding.",
  },
  {
    id: "loans",
    name: "Loans & debt",
    href: "/loans",
    blurb: "Auto loans, student loans, credit cards and debt payoff strategies.",
  },
  {
    id: "investing",
    name: "Saving & investing",
    href: "/saving-and-investing",
    blurb: "Compound growth, retirement accounts, inflation and returns.",
  },
];

export interface CalculatorMeta {
  /** URL path without a leading slash. */
  slug: string;
  /** Full title used for the H1 and the <title> tag. */
  title: string;
  /** Short label for navigation and cards. */
  navTitle: string;
  /** Unique meta description (kept under ~155 characters). */
  description: string;
  category: CategoryId;
  featured?: boolean;
  /** Set when the calculator renders government-published figures, so the UI can show a "last updated" date. */
  dataDriven?: boolean;
  /** Slug of the sibling used for the "people also use" block. */
  related: string[];
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
    navTitle: "Mortgage calculator",
    description:
      "Estimate your monthly mortgage payment including principal, interest, property tax, insurance, PMI and HOA, plus the total interest over the life of the loan.",
    category: "mortgage",
    featured: true,
    related: ["mortgage-affordability-calculator", "amortization-schedule", "refinance-break-even-calculator"],
  },
  {
    slug: "mortgage-affordability-calculator",
    title: "How Much House Can I Afford?",
    navTitle: "Home affordability",
    description:
      "Work out how much house you can afford from your income, debts and down payment using the 28/36 debt-to-income rule and lender limits.",
    category: "mortgage",
    featured: true,
    related: ["mortgage-calculator", "rent-vs-buy-calculator", "amortization-schedule"],
  },
  {
    slug: "amortization-schedule",
    title: "Amortization Schedule Calculator",
    navTitle: "Amortization schedule",
    description:
      "See a full month-by-month mortgage amortization schedule, add extra payments, and download the table as a CSV file.",
    category: "mortgage",
    related: ["mortgage-calculator", "refinance-break-even-calculator", "auto-loan-calculator"],
  },
  {
    slug: "refinance-break-even-calculator",
    title: "Refinance Break-Even Calculator",
    navTitle: "Refinance break-even",
    description:
      "Find out how long it takes for a mortgage refinance to pay for itself, and how much interest you save over the new loan term.",
    category: "mortgage",
    related: ["mortgage-calculator", "amortization-schedule", "rent-vs-buy-calculator"],
  },
  {
    slug: "rent-vs-buy-calculator",
    title: "Rent vs Buy Calculator",
    navTitle: "Rent vs buy",
    description:
      "Compare the true cost of renting and buying a home over any number of years, including closing costs, maintenance, taxes and appreciation.",
    category: "mortgage",
    related: ["mortgage-calculator", "mortgage-affordability-calculator", "compound-interest-calculator"],
  },
  {
    slug: "salary-after-tax",
    title: "Paycheck Calculator by State",
    navTitle: "Paycheck by state",
    description:
      "Calculate your take-home pay in all 50 states and Washington DC, including 2026 federal tax, Social Security, Medicare and state income tax.",
    category: "paycheck",
    featured: true,
    dataDriven: true,
    related: ["hourly-to-salary-calculator", "bonus-tax-calculator", "self-employment-tax-calculator"],
  },
  {
    slug: "hourly-to-salary-calculator",
    title: "Hourly to Salary Calculator",
    navTitle: "Hourly to salary",
    description:
      "Convert an hourly wage to an annual salary, weekly pay and monthly pay — or turn a salary back into an hourly rate, with overtime examples.",
    category: "paycheck",
    featured: true,
    related: ["salary-after-tax", "self-employment-tax-calculator", "bonus-tax-calculator"],
  },
  {
    slug: "self-employment-tax-calculator",
    title: "Self-Employment Tax Calculator",
    navTitle: "Self-employment tax",
    description:
      "Estimate self-employment tax (Social Security and Medicare) plus federal income tax and quarterly payments for freelancers and 1099 workers.",
    category: "paycheck",
    featured: true,
    dataDriven: true,
    related: ["salary-after-tax", "hourly-to-salary-calculator", "bonus-tax-calculator"],
  },
  {
    slug: "bonus-tax-calculator",
    title: "Bonus Tax Calculator",
    navTitle: "Bonus tax",
    description:
      "See how much of your bonus you keep using the IRS flat 22% supplemental wage method, and compare it with the aggregate method.",
    category: "paycheck",
    dataDriven: true,
    related: ["salary-after-tax", "hourly-to-salary-calculator", "self-employment-tax-calculator"],
  },
  {
    slug: "auto-loan-calculator",
    title: "Auto Loan Calculator",
    navTitle: "Auto loan",
    description:
      "Calculate your monthly car payment with sales tax, trade-in value, dealer fees, down payment and the total cost of the loan.",
    category: "loans",
    featured: true,
    related: ["amortization-schedule", "credit-card-payoff-calculator", "student-loan-payoff-calculator"],
  },
  {
    slug: "student-loan-payoff-calculator",
    title: "Student Loan Payoff Calculator",
    navTitle: "Student loan payoff",
    description:
      "Work out your monthly student loan payment, total interest and payoff date — and see how extra payments shorten the term.",
    category: "loans",
    related: ["debt-snowball-calculator", "credit-card-payoff-calculator", "auto-loan-calculator"],
  },
  {
    slug: "credit-card-payoff-calculator",
    title: "Credit Card Payoff Calculator",
    navTitle: "Credit card payoff",
    description:
      "Find out how long it takes to clear a credit card balance and how much interest you pay at your current or a fixed monthly payment.",
    category: "loans",
    related: ["debt-snowball-calculator", "student-loan-payoff-calculator", "auto-loan-calculator"],
  },
  {
    slug: "debt-snowball-calculator",
    title: "Debt Snowball vs Avalanche Calculator",
    navTitle: "Debt snowball vs avalanche",
    description:
      "Compare the debt snowball and debt avalanche payoff methods side by side and see which clears your balances faster for less interest.",
    category: "loans",
    featured: true,
    related: ["credit-card-payoff-calculator", "student-loan-payoff-calculator", "auto-loan-calculator"],
  },
  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    navTitle: "Compound interest",
    description:
      "See how savings and investments grow with compound interest, with optional monthly contributions and any compounding frequency.",
    category: "investing",
    featured: true,
    related: ["cagr-calculator", "401k-calculator", "investments-vs-inflation-calculator"],
  },
  {
    slug: "401k-calculator",
    title: "401(k) Growth Calculator",
    navTitle: "401(k) growth",
    description:
      "Project your 401(k) balance at retirement with employer matching, annual contribution increases and expected market returns.",
    category: "investing",
    featured: true,
    dataDriven: true,
    related: ["roth-vs-traditional-ira-calculator", "compound-interest-calculator", "cagr-calculator"],
  },
  {
    slug: "roth-vs-traditional-ira-calculator",
    title: "Roth vs Traditional IRA Calculator",
    navTitle: "Roth vs traditional IRA",
    description:
      "Compare a Roth IRA and a traditional IRA side by side to see which leaves you with more after-tax money at retirement.",
    category: "investing",
    dataDriven: true,
    related: ["401k-calculator", "compound-interest-calculator", "cagr-calculator"],
  },
  {
    slug: "investments-vs-inflation-calculator",
    title: "Inflation Calculator",
    navTitle: "Inflation",
    description:
      "See what inflation does to the buying power of your money over time, and how much your investments must earn just to keep pace.",
    category: "investing",
    related: ["compound-interest-calculator", "cagr-calculator", "roi-calculator"],
  },
  {
    slug: "cagr-calculator",
    title: "CAGR Calculator",
    navTitle: "CAGR",
    description:
      "Calculate the compound annual growth rate of an investment from its starting value, ending value and holding period.",
    category: "investing",
    related: ["roi-calculator", "compound-interest-calculator", "investments-vs-inflation-calculator"],
  },
  {
    slug: "roi-calculator",
    title: "ROI Calculator",
    navTitle: "ROI",
    description:
      "Calculate return on investment, annualised return and profit for any investment, including the effect of holding period.",
    category: "investing",
    related: ["cagr-calculator", "compound-interest-calculator", "investments-vs-inflation-calculator"],
  },
];

export const FEATURED_CALCULATORS = CALCULATORS.filter((c) => c.featured);

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function calculatorsByCategory(id: CategoryId): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.category === id);
}

export function getCategory(id: CategoryId): Category {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

/** Resolves the "related calculators" list, ignoring any unknown slugs. */
export function relatedCalculators(slug: string): CalculatorMeta[] {
  const meta = getCalculator(slug);
  if (!meta) return [];
  return meta.related
    .map((s) => getCalculator(s))
    .filter((c): c is CalculatorMeta => Boolean(c))
    .slice(0, 4);
}
