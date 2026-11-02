import Link from "next/link";
import { BreadcrumbJsonLd } from "./JsonLd";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {i === items.length - 1 ? <span aria-current="page">{it.name}</span> : <Link href={it.path} className="hover:text-ink">{it.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
