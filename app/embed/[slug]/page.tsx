import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CALCULATORS, getCalculator } from "@/lib/calculators";
import { CALCULATOR_COMPONENTS } from "@/components/calculatorRegistry";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCalculator(slug);
  if (!meta) return {};

  return {
    title: `${meta.title} — Embeddable Widget`,
    description: meta.description,
    robots: { index: false, follow: true },
    alternates: { canonical: absoluteUrl(`/${meta.slug}`) },
  };
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getCalculator(slug);
  if (!meta) notFound();

  const Component = CALCULATOR_COMPONENTS[slug];
  if (!Component) notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h1 className="text-xl font-semibold text-slate-900">{meta.title}</h1>
          <span className="text-xs font-medium text-slate-400">{SITE.name}</span>
        </div>
        <div className="mt-6">
          <Component />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>Free educational estimate · 2026 data</span>
          <a
            href={absoluteUrl(`/${meta.slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-800 hover:underline"
          >
            Powered by {SITE.name} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
