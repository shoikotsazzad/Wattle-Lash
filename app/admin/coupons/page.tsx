"use client";

import { useState } from "react";
import { Badge, Empty, ErrorText, Loading, PageTitle, api, card, money, td, th, useAdmin } from "@/components/admin/ui";

type Coupon = { id: string; code: string; type: "percent" | "fixed"; value: number; minSubtotal: number; maxUses: number; uses: number; expiresAt?: string; active: boolean };

export default function CouponsPage() {
  const { data, error, loading, reload } = useAdmin<{ coupons: Coupon[] }>("/api/admin/coupons");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const r = await api("/api/admin/coupons", "POST", Object.fromEntries(new FormData(form)));
    setErrors(r.data.errors ?? {});
    setMsg(r.ok ? "Code created." : r.data.error ?? "Failed.");
    if (r.ok) {
      form.reset();
      reload();
    }
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-danger">{errors[k]}</p>;

  return (
    <>
      <PageTitle title="Discount codes" />
      <form onSubmit={create} className={`${card} mb-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-7 xl:items-end`}>
        <label className="text-sm">Code<input name="code" required placeholder="WELCOME10" className="field mt-1 min-h-10 py-1.5 uppercase" />{err("code")}</label>
        <label className="text-sm">Type
          <select name="type" className="field mt-1 min-h-10 py-1.5"><option value="percent">% off</option><option value="fixed">$ off</option></select>
        </label>
        <label className="text-sm">Value<input name="value" inputMode="decimal" required placeholder="10" className="field mt-1 min-h-10 py-1.5" />{err("value")}</label>
        <label className="text-sm">Min spend $<input name="minSubtotal" inputMode="decimal" placeholder="0" className="field mt-1 min-h-10 py-1.5" /></label>
        <label className="text-sm">Max uses<input name="maxUses" type="number" min={0} placeholder="0 = unlimited" className="field mt-1 min-h-10 py-1.5" /></label>
        <label className="text-sm">Expires<input name="expiresAt" type="date" className="field mt-1 min-h-10 py-1.5" />{err("expiresAt")}</label>
        <button className="btn btn-pink min-h-10">Create</button>
        {msg && <p className="text-sm sm:col-span-3 xl:col-span-7">{msg}</p>}
      </form>

      {loading ? <Loading /> : error ? <ErrorText error={error} /> : !data?.coupons.length ? <Empty>No codes yet.</Empty> : (
        <div className="overflow-x-auto border border-line bg-white/60">
          <table className="w-full min-w-[700px] text-sm">
            <thead><tr className="border-b border-line"><th className={th}>Code</th><th className={th}>Discount</th><th className={th}>Min spend</th><th className={th}>Used</th><th className={th}>Expires</th><th className={th}>Active</th><th className={th}></th></tr></thead>
            <tbody>
              {data.coupons.map((c) => (
                <tr key={c.id} className="border-b border-line/60">
                  <td className={`${td} font-medium`}>{c.code}</td>
                  <td className={td}>{c.type === "percent" ? `${c.value}%` : money(c.value)}</td>
                  <td className={td}>{c.minSubtotal ? money(c.minSubtotal) : "—"}</td>
                  <td className={td}>{c.uses}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                  <td className={td}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-AU") : "—"}</td>
                  <td className={td}>
                    <button onClick={() => api(`/api/admin/coupons/${c.id}`, "PATCH", { active: !c.active }).then(reload)}><Badge value={c.active ? "paid" : "closed"} /><span className="sr-only">Toggle</span></button>
                  </td>
                  <td className={td}><button className="text-xs text-danger underline" onClick={() => confirm(`Delete ${c.code}?`) && api(`/api/admin/coupons/${c.id}`, "DELETE").then(reload)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
