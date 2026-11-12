export interface FaqItem {
  q: string;
  a: string;
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Visible FAQ block. Pair it with `faqJsonLd` on the page so the structured
 * data always matches what users can actually see.
 */
export default function FaqSection({ faqs, heading = "Frequently asked questions" }: { faqs: FaqItem[]; heading?: string }) {
  return (
    <section className="mt-12 max-w-prose">
      <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
      <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
        {faqs.map((f) => (
          <div key={f.q} className="py-4">
            <dt className="font-medium text-slate-900">{f.q}</dt>
            <dd className="mt-1 text-slate-600">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
