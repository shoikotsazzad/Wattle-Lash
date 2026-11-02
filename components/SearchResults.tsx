"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ProductCardData } from "@/lib/catalog";
import { ShopBrowser } from "./ShopBrowser";
import { SearchIcon } from "./Icons";

export function SearchResults({ products }: { products: ProductCardData[] }) {
  const q = useSearchParams().get("q")?.trim() ?? "";
  const router = useRouter();
  return (
    <>
      <p className="eyebrow text-muted">Search</p>
      <form
        role="search"
        className="mt-3 flex items-center gap-3 border-b border-ink pb-2"
        onSubmit={(e) => {
          e.preventDefault();
          const v = String(new FormData(e.currentTarget).get("q") ?? "").trim();
          router.replace(v ? `/search?q=${encodeURIComponent(v)}` : "/search");
        }}
      >
        <label htmlFor="q" className="sr-only">Search products</label>
        <input key={q} id="q" name="q" type="search" autoFocus={!q} defaultValue={q} placeholder="Search products" className="min-h-12 w-full bg-transparent font-serif text-3xl focus:outline-none md:text-4xl" />
        <button type="submit" aria-label="Search" className="grid h-11 w-11 place-items-center"><SearchIcon /></button>
      </form>
      <div className="mt-8">
        {q ? <ShopBrowser key={q} products={products} initialQuery={q} /> : <p className="text-muted">Type a product name, SKU or category.</p>}
      </div>
    </>
  );
}
