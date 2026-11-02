"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categoryList } from "@/data/categories";
import { BackLink, ErrorText, Loading, api, card, useAdmin } from "./ui";
import { ImageUploader } from "./ImageUploader";

type P = { id?: string; sku: string; slug: string; name: string; category: string; description: string; size: string; price: number; compareAtPrice?: number; stock: number; bestseller: boolean; vegan: boolean; active: boolean; images: string[] };

const blank: P = { sku: "", slug: "", name: "", category: "", description: "", size: "", price: 0, stock: 0, bestseller: false, vegan: false, active: true, images: [] };

export function ProductEditor({ id }: { id?: string }) {
  const res = useAdmin<{ product: P }>(id ? `/api/admin/products/${id}` : null);
  if (id && res.loading) return <Loading />;
  if (id && (res.error || !res.data)) return <ErrorText error={res.error} />;
  return <Form key={id ?? "new"} initial={res.data?.product ?? blank} id={id} />;
}

function Form({ initial, id }: { initial: P; id?: string }) {
  const router = useRouter();
  const [p, setP] = useState(initial);
  const [price, setPrice] = useState(initial.price ? (initial.price / 100).toFixed(2) : "");
  const [compare, setCompare] = useState(initial.compareAtPrice ? (initial.compareAtPrice / 100).toFixed(2) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof P>(k: K, v: P[K]) => setP({ ...p, [k]: v });
  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-danger">{errors[k]}</p>;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const body = { ...p, price, compareAtPrice: compare, id: undefined };
    const r = id ? await api(`/api/admin/products/${id}`, "PATCH", body) : await api<{ id: string }>("/api/admin/products", "POST", body);
    setBusy(false);
    setErrors(r.data.errors ?? {});
    if (!r.ok) return setMsg(r.data.error ?? "Failed.");
    if (!id) router.replace(`/admin/products/${(r.data as { id: string }).id}`);
    else setMsg("Saved. The store updates within a few seconds.");
  }

  async function remove() {
    if (!id || !confirm(`Delete ${p.name}? Past orders keep their copy. Consider hiding it instead.`)) return;
    const r = await api(`/api/admin/products/${id}`, "DELETE");
    if (r.ok) router.replace("/admin/products");
  }

  return (
    <>
      <BackLink href="/admin/products">Products</BackLink>
      <h1 className="mt-3 mb-6 font-serif text-4xl">{id ? p.name || "Edit product" : "New product"}</h1>
      <form onSubmit={save} noValidate className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className={`${card} grid gap-4 sm:grid-cols-2`}>
            <div className="sm:col-span-2">
              <label htmlFor="name" className="label">Name</label>
              <input id="name" value={p.name} onChange={(e) => set("name", e.target.value)} className="field" />
              {err("name")}
            </div>
            <div>
              <label htmlFor="sku" className="label">SKU</label>
              <input id="sku" value={p.sku} onChange={(e) => set("sku", e.target.value.toUpperCase())} placeholder="WL-STR-016" className="field" />
              {err("sku")}
            </div>
            <div>
              <label htmlFor="slug" className="label">URL slug</label>
              <input id="slug" value={p.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" className="field" />
              {err("slug")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="label">Description</label>
              <textarea id="description" rows={5} value={p.description} onChange={(e) => set("description", e.target.value)} className="field" />
              <p className="mt-1 text-xs text-muted">Cosmetic wording only. No therapeutic claims (e.g. &ldquo;grows&rdquo;, &ldquo;treats&rdquo;).</p>
            </div>
            <div>
              <label htmlFor="size" className="label">Size</label>
              <input id="size" value={p.size} onChange={(e) => set("size", e.target.value)} placeholder="5mL" className="field" />
            </div>
            <div>
              <label htmlFor="category" className="label">Category</label>
              <select id="category" value={p.category} onChange={(e) => set("category", e.target.value)} className="field">
                <option value="">Choose…</option>
                {categoryList.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              {err("category")}
            </div>
          </section>

          <section className={card}>
            <h2 className="eyebrow mb-3">Photos</h2>
            <ImageUploader value={p.images} onChange={(v) => set("images", v)} />
          </section>
        </div>

        <div className="space-y-6">
          <section className={`${card} space-y-4`}>
            <div>
              <label htmlFor="price" className="label">Price (AUD incl. GST)</label>
              <input id="price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="field" />
              {err("price")}
            </div>
            <div>
              <label htmlFor="compare" className="label">Compare-at price (optional)</label>
              <input id="compare" inputMode="decimal" value={compare} onChange={(e) => setCompare(e.target.value)} placeholder="Shows as struck-through" className="field" />
              {err("compareAtPrice")}
            </div>
            <div>
              <label htmlFor="stock" className="label">Stock</label>
              <input id="stock" type="number" min={0} value={p.stock} onChange={(e) => set("stock", Number(e.target.value))} className="field" />
              {err("stock")}
            </div>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={p.active} onChange={(e) => set("active", e.target.checked)} /> Visible in store</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={p.bestseller} onChange={(e) => set("bestseller", e.target.checked)} /> Bestseller</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={p.vegan} onChange={(e) => set("vegan", e.target.checked)} /> Vegan</label>
            </div>
          </section>
          <button className="btn btn-pink w-full" disabled={busy}>{busy ? "Saving…" : id ? "Save changes" : "Create product"}</button>
          {msg && <p aria-live="polite" className="text-sm">{msg}</p>}
          {id && (
            <div className="flex justify-between text-sm">
              <a href={`/product/${p.slug}`} target="_blank" rel="noopener" className="underline">View in store ↗</a>
              <button type="button" onClick={remove} className="text-danger underline">Delete</button>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
