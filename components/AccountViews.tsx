"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatAUD } from "@/lib/money";
import { AU_STATES } from "@/data/shipping";
import type { PublicOrder } from "@/lib/orderView";
import type { FieldErrors } from "@/lib/validate";
import { OrderDetails, paymentLabel, statusLabel } from "./OrderDetails";

type OrderRow = { orderNo: string; createdAt?: string; total: number; status: string; paymentStatus?: string; itemCount: number };

function useJson<T>(url: string) {
  const [state, setState] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true });
  useEffect(() => {
    fetch(url, { cache: "no-store" })
      .then(async (r) => {
        const j = await r.json();
        setState(r.ok ? { data: j, loading: false } : { error: j.error ?? "Something went wrong.", loading: false });
      })
      .catch(() => setState({ error: "Network error.", loading: false }));
  }, [url]);
  return state;
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="link-arrow text-[11px]"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.replace("/");
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}

export function AccountHome() {
  const me = useJson<{ user: { name: string; email: string } | null }>("/api/auth/me");
  const orders = useJson<{ orders: OrderRow[] }>("/api/account/orders");
  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4">
        <p className="font-serif text-2xl">{me.data?.user ? `Hi, ${me.data.user.name.split(" ")[0]}` : " "}</p>
        <p className="text-sm text-muted">{me.data?.user?.email}</p>
        <nav className="flex flex-col items-start gap-3 pt-2">
          <Link href="/account/addresses" className="link-arrow text-[11px]">Saved addresses</Link>
          <LogoutButton />
        </nav>
      </aside>
      <div>
        <h2 className="eyebrow">Your orders</h2>
        {orders.loading ? (
          <p className="mt-6 text-muted">Loading…</p>
        ) : orders.error ? (
          <p className="mt-6 text-danger">{orders.error}</p>
        ) : !orders.data?.orders.length ? (
          <p className="mt-6 text-muted">No orders yet. <Link href="/shop" className="underline">Start shopping</Link></p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {orders.data.orders.map((o) => (
              <li key={o.orderNo}>
                <Link href={`/account/orders/${o.orderNo}`} className="flex flex-wrap items-center justify-between gap-2 py-4 hover:bg-surface sm:px-2">
                  <span>
                    <span className="font-medium">{o.orderNo}</span>
                    <span className="block text-xs text-muted">{o.createdAt && new Date(o.createdAt).toLocaleDateString("en-AU", { dateStyle: "medium" })} · {o.itemCount} item{o.itemCount === 1 ? "" : "s"}</span>
                  </span>
                  <span className="text-right text-sm">
                    {formatAUD(o.total)}
                    <span className="block text-xs text-muted">{statusLabel[o.status]} · {paymentLabel[o.paymentStatus ?? "unpaid"]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function AccountOrder({ orderNo }: { orderNo: string }) {
  const res = useJson<{ order: PublicOrder }>(`/api/account/orders/${encodeURIComponent(orderNo)}`);
  if (res.loading) return <p className="text-muted">Loading…</p>;
  if (res.error || !res.data) return <p className="text-danger">{res.error}</p>;
  const o = res.data.order;
  return (
    <>
      <p className="mb-8 text-sm">
        <span className="eyebrow text-[11px]">{statusLabel[o.status]}</span> · <span className="eyebrow text-[11px]">{paymentLabel[o.paymentStatus]}</span>
      </p>
      <OrderDetails order={o} />
    </>
  );
}

type Addr = { label: string; name: string; phone: string; line1: string; line2?: string; suburb: string; state: string; postcode: string };
const blank: Addr = { label: "", name: "", phone: "", line1: "", line2: "", suburb: "", state: "", postcode: "" };

export function AddressBook() {
  const res = useJson<{ addresses: Addr[] }>("/api/account/addresses");
  const [edited, setEdited] = useState<Addr[] | null>(null);
  const list = edited ?? res.data?.addresses ?? [];
  const [errors, setErrors] = useState<FieldErrors>({});
  const [msg, setMsg] = useState("");

  const update = (i: number, k: keyof Addr, v: string) => setEdited(list.map((a, j) => (j === i ? { ...a, [k]: v } : a)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const r = await fetch("/api/account/addresses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ addresses: list }) });
    const j = await r.json();
    setErrors(j.errors ?? {});
    setMsg(r.ok ? "Saved." : j.error);
  }

  if (res.loading) return <p className="text-muted">Loading…</p>;
  if (res.error) return <p className="text-danger">{res.error}</p>;

  const f = (i: number, k: keyof Addr, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`${i}-${k}`} className="label">{label}</label>
      <input id={`${i}-${k}`} value={list[i][k] ?? ""} onChange={(e) => update(i, k, e.target.value)} className="field" {...extra} />
      {errors[`${i}.${k}`] && <p className="mt-1 text-sm text-danger">{errors[`${i}.${k}`]}</p>}
    </div>
  );

  return (
    <form onSubmit={save} className="space-y-8">
      {list.map((_, i) => (
        <fieldset key={i} className="border border-line p-5">
          <div className="flex items-center justify-between">
            <legend className="eyebrow">Address {i + 1}</legend>
            <button type="button" className="text-sm text-muted underline" onClick={() => setEdited(list.filter((__, j) => j !== i))}>Remove</button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {f(i, "label", "Label (e.g. Home)")}
            {f(i, "name", "Full name", { autoComplete: "name" })}
            <div className="sm:col-span-2">{f(i, "line1", "Street address", { autoComplete: "address-line1" })}</div>
            {f(i, "line2", "Apartment, unit (optional)")}
            {f(i, "suburb", "Suburb")}
            <div>
              <label htmlFor={`${i}-state`} className="label">State</label>
              <select id={`${i}-state`} value={list[i].state} onChange={(e) => update(i, "state", e.target.value)} className="field">
                <option value="">—</option>
                {AU_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors[`${i}.state`] && <p className="mt-1 text-sm text-danger">{errors[`${i}.state`]}</p>}
            </div>
            {f(i, "postcode", "Postcode", { inputMode: "numeric", maxLength: 4 })}
            {f(i, "phone", "Phone", { type: "tel", placeholder: "04xx xxx xxx" })}
          </div>
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        {list.length < 5 && <button type="button" className="btn btn-outline" onClick={() => setEdited([...list, { ...blank }])}>Add address</button>}
        <button type="submit" className="btn btn-pink">Save addresses</button>
        {msg && <p aria-live="polite" className="text-sm">{msg}</p>}
      </div>
    </form>
  );
}
