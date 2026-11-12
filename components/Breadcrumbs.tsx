import Link from "next/link";

export interface Crumb {
  href: string;
  label: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.href,
    })),
  };
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const all: Crumb[] = [{ href: "/", label: "Home" }, ...crumbs];

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500">
        {all.map((crumb, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${crumb.href}-${i}`} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-slate-700">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="underline-offset-2 hover:text-teal-800 hover:underline">
                  {crumb.label}
                </Link>
              )}
              {!last && (
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
