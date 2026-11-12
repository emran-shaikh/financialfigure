import Link from "next/link";
import { CALCULATORS, CATEGORIES } from "@/lib/calculators";
import { FOOTER_LEGAL_LINKS, SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-base font-semibold text-teal-900">{SITE.name}</p>
          <p className="mt-2 text-sm text-slate-600">{SITE.tagline}.</p>
          <p className="mt-3 text-sm text-slate-600">
            <a className="underline underline-offset-2 hover:text-teal-800" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
        </div>

        <nav aria-label="Calculators">
          <h2 className="text-sm font-semibold text-slate-900">Popular calculators</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CALCULATORS.filter((c) => c.featured)
              .slice(0, 6)
              .map((c) => (
                <li key={c.slug}>
                  <Link className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline" href={`/${c.slug}`}>
                    {c.navTitle}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <nav aria-label="Categories">
          <h2 className="text-sm font-semibold text-slate-900">Categories</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline" href={c.href}>
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline" href="/calculators">
                All calculators
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal and company">
          <h2 className="text-sm font-semibold text-slate-900">Site</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link className="text-slate-600 underline-offset-2 hover:text-teal-800 hover:underline" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
          <p>
            {SITE.name} provides free educational calculators. Results are estimates only and are not
            financial, tax, legal or investment advice.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
