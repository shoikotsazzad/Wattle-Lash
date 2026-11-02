import Image from "next/image";
import { formatAUD } from "@/lib/money";
import type { PublicOrder } from "@/lib/orderView";

const date = (iso?: string) => (iso ? new Date(iso).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }) : "");

export const statusLabel: Record<string, string> = {
  new: "Order received",
  processing: "Being packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
export const paymentLabel: Record<string, string> = {
  unpaid: "Awaiting payment",
  pending: "Payment processing",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
};

/** Items, totals (with GST line) and address. Used on confirmation + account pages. */
export function OrderDetails({ order }: { order: PublicOrder }) {
  const a = order.address;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {order.items.map((i) => (
            <li key={i.sku} className="flex gap-4 py-4 text-sm">
              {i.image && (
                <span className="tint relative h-20 w-16 shrink-0 overflow-hidden bg-rose">
                  <Image src={i.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
              )}
              <span className="flex-1">
                {i.name}
                <span className="block text-xs text-muted">{i.sku}{i.size ? ` · ${i.size}` : ""} · Qty {i.qty}</span>
              </span>
              <span>{formatAUD((i.price ?? 0) * (i.qty ?? 0))}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatAUD(order.subtotal)}</dd></div>
          {order.discount ? <div className="flex justify-between"><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt><dd>−{formatAUD(order.discount)}</dd></div> : null}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shippingFee ? formatAUD(order.shippingFee) : "Free"}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base"><dt>Total (AUD)</dt><dd>{formatAUD(order.total)}</dd></div>
          <div className="flex justify-between text-xs text-muted"><dt>Includes GST</dt><dd>{formatAUD(order.gst)}</dd></div>
        </dl>
      </div>
      <div className="space-y-6 text-sm">
        <div>
          <p className="eyebrow text-muted">Ship to</p>
          <p className="mt-2">
            {order.customer.name}<br />
            {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
            {a.suburb} {a.state} {a.postcode}<br />
            {order.customer.phone}
          </p>
        </div>
        {order.trackingNo && (
          <div>
            <p className="eyebrow text-muted">Tracking</p>
            <p className="mt-2">{order.carrier ? `${order.carrier}: ` : ""}{order.trackingNo}</p>
          </div>
        )}
        {order.timeline.length > 0 && (
          <div>
            <p className="eyebrow text-muted">History</p>
            <ol className="mt-2 space-y-1.5">
              {order.timeline.map((t, i) => (
                <li key={i}><span className="text-muted">{date(t.at)}</span> · {t.text}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
