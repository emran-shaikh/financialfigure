import { SITE, absoluteUrl } from "./site";

const ORGANIZATION_ID = `${SITE.url}/#organization`;

export const WEBSITE_ID = `${SITE.url}/#website`;

export type SchemaCrumb = { name: string; path: string };

function breadcrumbSchema(pageUrl: string, crumbs: SchemaCrumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
        width: 1776,
        height: 608,
      },
      email: SITE.email,
      knowsAbout: [
        "US Individual Income Taxation",
        "Mortgage Financing and Amortization",
        "Personal Finance and Debt Payoff",
        "Compound Interest and Retirement Accounts",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en-US",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

export function calculatorSchema({
  path,
  name,
  description,
  crumbs,
  faqs,
}: {
  path: string;
  name: string;
  description: string;
  crumbs: SchemaCrumb[];
  faqs?: { q: string; a: string }[];
}) {
  const url = absoluteUrl(path);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      inLanguage: "en-US",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORGANIZATION_ID },
      author: { "@id": ORGANIZATION_ID },
      reviewedBy: {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: `${SITE.name} Editorial Board`,
      },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      mainEntity: { "@id": `${url}#app` },
      dateModified: "2026-11-24",
      audience: {
        "@type": "Audience",
        audienceType: "US Taxpayers, Homebuyers, Borrowers, and Savers",
      },
      ...(faqs && faqs.length > 0 ? { hasPart: [{ "@id": `${url}#faq` }] } : {}),
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name,
      url,
      description,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      inLanguage: "en-US",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": ORGANIZATION_ID },
    },
    breadcrumbSchema(url, crumbs),
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": `${url}#webpage` },
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function hubSchema({
  path,
  name,
  description,
  crumbs,
  items,
}: {
  path: string;
  name: string;
  description: string;
  crumbs: SchemaCrumb[];
  items: { name: string; path: string }[];
}) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "en-US",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            url: absoluteUrl(item.path),
          })),
        },
      },
      breadcrumbSchema(url, crumbs),
    ],
  };
}
