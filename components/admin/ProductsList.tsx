"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { categorySeed } from "@/data/categories";
import { Empty, ErrorText, Loading, PageTitle, Pager, api, money, td, th, useAdmin } from "./ui";

type Row = { id: string; sku: string; slug: string; name: string; category: string; price: number; stock: number; bestseller: boolean; vegan: boolean; active: boolean; image: string };

export function ProductsList() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const qs = sp.toString();
  const { data, error, loading, reload } = useAdmin<{ products: Row[]; page: number; pages: number; total: number }>(`/api/admin/products?${qs}`);
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const catName = (slug: string) => categorySeed.find((c) => c.slug === slug)?.name ?? slug;

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(qs);
    if (v) next.set(k, v);
    else next.delete(k);
    if (k !== "page") next.delete("page");
    router.replace(`${pathname}?${next}`);
  };

  async function quick(id: string, body: Record<string, unknown>) {
    const r = await api(`/api/admin/products/${id}`, "PATCH", body);
    if (!r.ok) alert(r.data.error ?? "Failed");
    reload();
  }

  return (
    <>
      <PageTitle title="Products">
        <Link href="/admin/products/new" className="btn btn-pink min-h-10">Add product</Link>
      </PageTitle>
      <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); setParam("q", String(new FormData(e.currentTarget).get("q") ?? "")); }}>
        <input name="q" defaultValue={sp.get("q") ?? ""} placeholder="Name or SKU" className="field min-h-10 w-56 py-1.5" />
        <select aria-label="Category" value={sp.get("category") ?? ""} onChange={(e) => setParam("category", e.target.value)} className="field min-h-10 w-auto py-1.5">
          <option value="">All categories</option>
          {categorySeed.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select aria-label="Filter" value={sp.get("stock") ?? (sp.get("active") === "false" ? "hidden" : "")} onChange={(e) => { const v = e.target.value; const next = new URLSearchParams(qs); next.delete("stock"); next.delete("active"); next.delete("page"); if (v === "low") next.set("stock", "low"); if (v === "hidden") next.set("active", "false"); router.replace(`${pathname}?${next}`); }} className="field min-h-10 w-auto py-1.5">
          <option value="">All</option>
          <option value="low">Low stock (≤ 10)</option>
          <option value="hidden">Hidden</option>
        </select>
        <button className="btn btn-dark min-h-10">Search</button>
      </form>

      {loading ? <Loading /> : error ? <ErrorText error={error} /> : !data?.products.length ? <Empty>No products. Run <code>npm run seed</code> or add one.</Empty> : (
        <>
          <p className="mb-2 text-sm text-muted">{data.total} products</p>
          <div className="overflow-x-auto border border-line bg-white/60">
            <table className="w-full min-w-[820px] text-sm">
              <thead><tr className="border-b border-line"><th className={th}>Product</th><th className={th}>Category</th><th className={th}>Price</th><th className={th}>Stock</th><th className={th}>Flags</th><th className={th}>Visible</th></tr></thead>
              <tbody>
                {data.products.map((p) => (
                  <tr key={p.id} className="border-b border-line/60 hover:bg-surface">
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <span className="relative h-12 w-10 shrink-0 bg-rose">{p.image && <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />}</span>
                        <span><Link href={`/admin/products/${p.id}`} className="font-medium underline">{p.name}</Link><span className="block text-xs text-muted">{p.sku}</span></span>
                      </div>
                    </td>
                    <td className={td}>{catName(p.category)}</td>
                    <td className={td}>{money(p.price)}</td>
                    <td className={td}>
                      <form className="flex gap-1" onSubmit={(e) => { e.preventDefault(); const v = stockEdits[p.id]; if (v !== undefined) quick(p.id, { stock: v }).then(() => setStockEdits((cur) => Object.fromEntries(Object.entries(cur).filter(([k]) => k !== p.id)))); }}>
                        <label className="sr-only" htmlFor={`stock-${p.id}`}>Stock for {p.name}</label>
                        <input id={`stock-${p.id}`} type="number" min={0} value={stockEdits[p.id] ?? String(p.stock)} onChange={(e) => setStockEdits({ ...stockEdits, [p.id]: e.target.value })} className={`field min-h-9 w-20 py-1 ${p.stock <= 10 ? "border-danger" : ""}`} />
                        {stockEdits[p.id] !== undefined && <button className="px-2 text-xs underline">Save</button>}
                      </form>
                    </td>
                    <td className={td}>
                      <label className="mr-3 inline-flex items-center gap-1 text-xs"><input type="checkbox" checked={p.bestseller} onChange={(e) => quick(p.id, { bestseller: e.target.checked })} />Bestseller</label>
                      <label className="inline-flex items-center gap-1 text-xs"><input type="checkbox" checked={p.vegan} onChange={(e) => quick(p.id, { vegan: e.target.checked })} />Vegan</label>
                    </td>
                    <td className={td}><input type="checkbox" aria-label={`Visible: ${p.name}`} checked={p.active} onChange={(e) => quick(p.id, { active: e.target.checked })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={data.page} pages={data.pages} onPage={(pg) => setParam("page", String(pg))} />
        </>
      )}
    </>
  );
}
