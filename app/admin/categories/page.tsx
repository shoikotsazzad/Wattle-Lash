"use client";

import Image from "next/image";
import { useState } from "react";
import { Empty, ErrorText, Loading, PageTitle, api, card, useAdmin } from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Cat = { id: string; slug: string; name: string; description: string; image: string; order: number; count: number };

export default function CategoriesPage() {
  const { data, error, loading, reload } = useAdmin<{ categories: Cat[] }>("/api/admin/categories");
  const [editing, setEditing] = useState<Cat | null>(null);
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const r = await api(`/api/admin/categories/${editing.id}`, "PATCH", editing);
    setMsg(r.ok ? "Saved." : r.data.error ?? "Failed.");
    if (r.ok) {
      setEditing(null);
      reload();
    }
  }

  return (
    <>
      <PageTitle title="Categories" />
      <p className="-mt-3 mb-6 text-sm text-muted">URL slugs are fixed; edit names, descriptions, photos and order. {msg}</p>
      {loading ? <Loading /> : error ? <ErrorText error={error} /> : !data?.categories.length ? <Empty>No categories. Run <code>npm run seed</code>.</Empty> : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.categories.map((c) =>
            editing?.id === c.id ? (
              <li key={c.id} className={`${card} md:col-span-2 xl:col-span-3`}>
                <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm">Name<input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="field mt-1" /></label>
                    <label className="block text-sm">Description<textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="field mt-1" /></label>
                    <label className="block text-sm">Sort order<input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="field mt-1 w-28" /></label>
                  </div>
                  <div>
                    <p className="text-sm">Photo</p>
                    <div className="mt-1"><ImageUploader max={1} value={editing.image ? [editing.image] : []} onChange={(v) => setEditing({ ...editing, image: v[0] ?? "" })} /></div>
                    <div className="mt-6 flex gap-2">
                      <button className="btn btn-pink min-h-10">Save</button>
                      <button type="button" className="btn btn-outline min-h-10" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                </form>
              </li>
            ) : (
              <li key={c.id} className={`${card} flex gap-4`}>
                <span className="relative h-24 w-20 shrink-0 bg-rose">{c.image && <Image src={c.image} alt="" fill sizes="80px" className="object-cover" />}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted">/shop/{c.slug} · {c.count} products · #{c.order}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{c.description}</p>
                  <button className="mt-2 text-sm underline" onClick={() => setEditing(c)}>Edit</button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </>
  );
}
