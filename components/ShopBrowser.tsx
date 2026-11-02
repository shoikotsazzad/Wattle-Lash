"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ProductCardData } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";
import { CloseIcon, SearchIcon } from "./Icons";

type Cat = { slug: string; name: string; count: number };
type Sort = "featured" | "new" | "price-asc" | "price-desc" | "name";

const PRICE_BANDS = [
  { id: "all", label: "Any price", test: () => true },
  { id: "u20", label: "Under $20", test: (c: number) => c < 2000 },
  { id: "20-50", label: "$20 – $50", test: (c: number) => c >= 2000 && c <= 5000 },
  { id: "o50", label: "Over $50", test: (c: number) => c > 5000 },
] as const;

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
];

const PAGE = 24;

/** Left sidebar on desktop, bottom sheet on phones and tablets. Client-side (catalogue is under 500 items). */
export function ShopBrowser({ products, categories, activeCategory, initialQuery = "" }: { products: ProductCardData[]; categories?: Cat[]; activeCategory?: string; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>("featured");
  const [band, setBand] = useState<(typeof PRICE_BANDS)[number]["id"]>("all");
  const [vegan, setVegan] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const list = useMemo(() => {
    const test = PRICE_BANDS.find((b) => b.id === band)!.test;
    const term = q.trim().toLowerCase();
    const out = products.filter(
      (p) => test(p.price) && (!vegan || p.vegan) && (!inStock || p.stock > 0) && (!term || `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(term)),
    );
    const by: Record<Sort, (a: ProductCardData, b: ProductCardData) => number> = {
      featured: (a, b) => Number(b.bestseller) - Number(a.bestseller),
      new: (a, b) => b.createdAt.localeCompare(a.createdAt),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...out].sort(by[sort]);
  }, [products, band, vegan, inStock, sort, q]);

  const reset = () => setShown(PAGE);
  const active = (band !== "all" ? 1 : 0) + (vegan ? 1 : 0) + (inStock ? 1 : 0);
  const clear = () => {
    setBand("all");
    setVegan(false);
    setInStock(false);
    reset();
  };
  const heading = "text-[11px] font-medium tracking-[0.2em] uppercase text-muted";
  const countLabel = `${list.length} product${list.length === 1 ? "" : "s"}`;

  // The search box lives on this panel only when the page has no search form of its own.
  const search = (id: string) => categories && (
    <div className="relative">
      <label htmlFor={id} className="sr-only">Search this collection</label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-muted" />
      <input id={id} type="search" value={q} onChange={(e) => { setQ(e.target.value); reset(); }} placeholder="Search" className="min-h-11 w-full border-b border-ink/40 bg-transparent pl-6 text-sm focus:border-ink focus:outline-none" />
    </div>
  );

  const panel = (key: string) => (
    <div className="space-y-7 text-sm">
      <div>
        <label htmlFor={`${key}-sort`} className={heading}>Sort by</label>
        <select id={`${key}-sort`} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="mt-2 min-h-10 w-full border-b border-ink/40 bg-transparent focus:border-ink focus:outline-none">
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {categories && (
        <nav aria-label="Categories">
          <p className={heading}>Categories</p>
          <ul className="mt-2">
            {[{ slug: "", name: "All" }, ...categories].map((c) => {
              const on = (activeCategory ?? "") === c.slug;
              return (
                <li key={c.slug || "all"}>
                  <Link href={c.slug ? `/shop/${c.slug}` : "/shop"} onClick={() => setSheet(false)} aria-current={on ? "page" : undefined} className={`flex min-h-9 items-center transition hover:text-ink ${on ? "font-medium text-ink underline underline-offset-4" : "text-muted"}`}>
                    {c.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <fieldset>
        <legend className={heading}>Price</legend>
        <div className="mt-2">
          {PRICE_BANDS.map((b) => (
            <label key={b.id} className="flex min-h-9 items-center gap-2.5">
              <input type="radio" name={`${key}-price`} checked={band === b.id} onChange={() => { setBand(b.id); reset(); }} className="h-3.5 w-3.5 accent-[#2a1e1e]" />
              {b.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={heading}>Show only</legend>
        <div className="mt-2">
          <label className="flex min-h-9 items-center gap-2.5">
            <input type="checkbox" checked={vegan} onChange={(e) => { setVegan(e.target.checked); reset(); }} className="h-3.5 w-3.5 accent-[#2a1e1e]" />
            Vegan
          </label>
          <label className="flex min-h-9 items-center gap-2.5">
            <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); reset(); }} className="h-3.5 w-3.5 accent-[#2a1e1e]" />
            In stock
          </label>
        </div>
      </fieldset>

      {active > 0 && <button type="button" onClick={clear} className="text-xs underline underline-offset-4">Clear filters</button>}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
        {search("shop-search")}
        <div className={categories ? "mt-6" : ""}>{panel("side")}</div>
      </aside>

      <div>
        {/* Phones and tablets: search + filter button */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex-1">{search("shop-search-m")}</div>
          <button type="button" onClick={() => setSheet(true)} className="eyebrow min-h-11 shrink-0 border border-ink px-4 text-[11px]">
            Filter{active > 0 ? ` (${active})` : ""}
          </button>
        </div>

        <p aria-live="polite" className="mt-4 text-sm text-muted lg:mt-0">{countLabel}</p>

        {list.length ? (
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-10">
            {list.slice(0, shown).map((p, i) => (
              <li key={p.sku}><ProductCard p={p} priority={i < 3} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 30vw, 50vw" /></li>
            ))}
          </ul>
        ) : (
          <p className="py-16 text-center text-muted">No products match these filters.</p>
        )}

        {shown < list.length && (
          <div className="mt-12 text-center">
            <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn btn-outline">
              Load more ({list.length - shown})
            </button>
          </div>
        )}
      </div>

      {/* Filter sheet */}
      {sheet && (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/40 lg:hidden" onClick={() => setSheet(false)}>
          <div role="dialog" aria-modal="true" aria-label="Filter and sort" onClick={(e) => e.stopPropagation()} className="flex max-h-[85dvh] w-full flex-col bg-blush">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="eyebrow text-[11px]">Filter &amp; sort</p>
              <button type="button" aria-label="Close filters" onClick={() => setSheet(false)} className="-mr-2 grid h-11 w-11 place-items-center"><CloseIcon /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{panel("sheet")}</div>
            <div className="border-t border-line px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => setSheet(false)} className="btn btn-pink w-full">Show {countLabel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
