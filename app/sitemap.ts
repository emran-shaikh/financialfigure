import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators";
import { STATES_2026 } from "@/lib/tax/states2026";
import { absoluteUrl } from "@/lib/site";

/**
 * Sitemap for every indexable route: the core pages, every calculator and every
 * state paycheck page. Legal pages are included but given a low priority.
 *
 * `lastModified` uses a single reviewed date rather than the build time so the
 * file stays stable between deploys (search engines dislike noisy lastmod).
 */
const LAST_UPDATED = new Date("2026-11-12");

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const CORE_PAGES: Entry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/calculators", priority: 0.9, changeFrequency: "weekly" },
  { path: "/salary-after-tax", priority: 0.9, changeFrequency: "weekly" },
  { path: "/loans", priority: 0.7, changeFrequency: "monthly" },
  { path: "/saving-and-investing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/methodology", priority: 0.5, changeFrequency: "yearly" },
  { path: "/about", priority: 0.4, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorPages: Entry[] = CALCULATORS.map((c) => ({
    path: `/${c.slug}`,
    priority: c.featured ? 0.9 : 0.8,
    changeFrequency: "monthly",
  }));

  const statePages: Entry[] = STATES_2026.map((s) => ({
    path: `/salary-after-tax/${s.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  // Deduplicate by path (e.g. /salary-after-tax is both a core page and a
  // calculator slug) while keeping the first occurrence.
  const seen = new Set<string>();
  const entries: Entry[] = [];
  for (const entry of [...CORE_PAGES, ...calculatorPages, ...statePages]) {
    if (seen.has(entry.path)) continue;
    seen.add(entry.path);
    entries.push(entry);
  }

  return entries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: LAST_UPDATED,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
