import type { Metadata } from "next";
import { getCalculator } from "./calculators";
import { absoluteUrl, SITE } from "./site";

const SOCIAL_IMAGE = {
  url: "/logo.png",
  width: 1776,
  height: 608,
  alt: `${SITE.name} logo`,
};

/**
 * Consistent metadata for calculator pages: unique title + description,
 * canonical URL, Open Graph and Twitter cards.
 */
export function calculatorMetadata(slug: string): Metadata {
  const meta = getCalculator(slug);
  if (!meta) throw new Error(`Unknown calculator slug: ${slug}`);
  const url = absoluteUrl(`/${meta.slug}`);

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${meta.slug}` },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      title: `${meta.title} | ${SITE.name}`,
      description: meta.description,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | ${SITE.name}`,
      description: meta.description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}

/** Metadata for any non-calculator page. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      title: `${title} | ${SITE.name}`,
      description,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
