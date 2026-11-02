"use client";

import { useState } from "react";
import { Badge, BackLink, ErrorText, Loading, api, card, money, useAdmin, when } from "./ui";

type Item = { sku: string; name: string; size?: string; price: number; qty: number };
type Order = {
  id: string;
  orderNo: string;
  createdAt: string;
  email: string;
  customer: { name: string; phone: string };
  address: { line1: string; line2?: string; suburb: string; state: string; postcode: string };
  items: Item[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  gst: number;
  note?: string;
  payment: { status: string; method?: string; paidAt?: string };
  status: string;
  trackingNo?: string;
  carrier?: string;
  timeline: { at: string; text: string }[];
};

export function OrderEditor({ id }: { id: string }) {
  const { data, error, loading, reload } = useAdmin<{ order: Order }>(`/api/admin/orders/${id}`);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorText error={error} />;
  const o = data.order;

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setMsg("");
    const r = await api(`/api/admin/orders/${id}`, "PATCH", body);
    setBusy(false);
    setMsg(r.ok ? "Saved." : r.data.error ?? "Failed.");
    if (r.ok) reload();
  }


  return (
    <>
      <BackLink href="/admin/orders">Orders</BackLink>
      <div className="mt-3 mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-4xl">{o.orderNo}</h1>
        <Badge value={o.payment.status} />
        <Badge value={o.status} />
      </div>
      <p className="-mt-4 mb-6 text-sm text-muted">Placed {when(o.createdAt)}</p>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className={card}>
            <h2 className="eyebrow mb-3">Items</h2>
            <table className="w-full text-sm">
              <tbody>
                {o.items.map((i) => (
                  <tr key={i.sku} className="border-b border-line/60">
                    <td className="py-2">{i.name}<div className="text-xs text-muted">{i.sku}{i.size ? ` · ${i.size}` : ""}</div></td>
                    <td className="py-2 text-right">{i.qty} × {money(i.price)}</td>
                    <td className="py-2 text-right">{money(i.price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-3 ml-auto max-w-xs space-y-1 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(o.subtotal)}</dd></div>
              {o.discount > 0 && <div className="flex justify-between"><dt>Discount {o.couponCode}</dt><dd>−{money(o.discount)}</dd></div>}
              <div className="flex justify-between"><dt>Shipping</dt><dd>{money(o.shippingFee)}</dd></div>
              <div className="flex justify-between border-t border-line pt-1 font-medium"><dt>Total</dt><dd>{money(o.total)}</dd></div>
              <div className="flex justify-between text-xs text-muted"><dt>incl. GST</dt><dd>{money(o.gst)}</dd></div>
            </dl>
          </section>

          <section className={card}>
            <h2 className="eyebrow mb-3">Timeline</h2>
            <ol className="space-y-1.5 text-sm">
              {o.timeline.map((t, i) => <li key={i}><span className="text-muted">{when(t.at)}</span> · {t.text}</li>)}
            </ol>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const f = e.currentTarget;
                const note = String(new FormData(f).get("note") ?? "");
                if (note.trim()) patch({ note }).then(() => f.reset());
              }}
            >
              <input name="note" placeholder="Add an internal note" className="field min-h-10 py-1.5" />
              <button className="btn btn-outline min-h-10" disabled={busy}>Add</button>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          <section className={card}>
            <h2 className="eyebrow mb-3">Fulfilment</h2>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                patch({ status: fd.get("status"), carrier: fd.get("carrier"), trackingNo: fd.get("trackingNo") });
              }}
            >
              <label className="block text-sm">Status
                <select name="status" defaultValue={o.status} className="field mt-1 min-h-10 py-1.5">
                  {["new", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="block text-sm">Carrier
                <input name="carrier" defaultValue={o.carrier ?? ""} placeholder="Australia Post" className="field mt-1 min-h-10 py-1.5" />
              </label>
              <label className="block text-sm">Tracking number
                <input name="trackingNo" defaultValue={o.trackingNo ?? ""} className="field mt-1 min-h-10 py-1.5" />
              </label>
              <button className="btn btn-pink w-full" disabled={busy}>Save</button>
            </form>
            {msg && <p aria-live="polite" className="mt-3 text-sm">{msg}</p>}
          </section>

          <section className={card}>
            <h2 className="eyebrow mb-3">Payment</h2>
            <p className="text-sm">Status: <Badge value={o.payment.status} /></p>
            {o.payment.method && <p className="mt-1 text-sm">Method: {o.payment.method}</p>}
            {o.payment.paidAt && <p className="mt-1 text-sm">Paid: {when(o.payment.paidAt)}</p>}
            {o.payment.status !== "paid" && (
              <button
                className="btn btn-outline mt-4 w-full min-h-10"
                disabled={busy}
                onClick={() => confirm("Mark this order as paid? Stock will be deducted. Only do this if you've confirmed payment some other way.") && patch({ markPaid: true })}
              >
                Mark as paid
              </button>
            )}
            <p className="mt-3 text-xs text-muted">Demo payments: no money moves. Set the payment status to refunded manually.</p>
          </section>

          <section className={card}>
            <h2 className="eyebrow mb-3">Customer</h2>
            <p className="text-sm">{o.customer.name}<br /><a href={`mailto:${o.email}`} className="underline">{o.email}</a><br /><a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a></p>
            <p className="mt-3 text-sm">{o.address.line1}{o.address.line2 ? `, ${o.address.line2}` : ""}<br />{o.address.suburb} {o.address.state} {o.address.postcode}</p>
            {o.note && <p className="mt-3 border-t border-line pt-3 text-sm"><span className="text-muted">Customer note:</span> {o.note}</p>}
          </section>
        </div>
      </div>
    </>
  );
}
