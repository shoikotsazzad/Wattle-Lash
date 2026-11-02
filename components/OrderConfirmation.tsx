"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PublicOrder } from "@/lib/orderView";
import { useCart } from "./StoreProvider";
import { OrderDetails, paymentLabel, statusLabel } from "./OrderDetails";
import { Button } from "./Button";
import { CheckIcon } from "./Icons";

export function OrderConfirmation({ orderNo }: { orderNo: string }) {
  const sp = useSearchParams();
  const key = sp.get("k") ?? "";
  const fresh = sp.get("fresh") === "1";
  const cart = useCart();
  const [state, setState] = useState<{ order?: PublicOrder; error?: string }>({});

  useEffect(() => {
    let stop = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderNo)}?k=${encodeURIComponent(key)}`, { cache: "no-store" });
        const json = await res.json();
        if (stop) return;
        if (!res.ok) return setState({ error: json.error ?? "Order not found." });
        setState({ order: json.order });
      } catch {
        if (!stop) setState({ error: "Network error." });
      }
    };
    load();
    return () => {
      stop = true;
    };
  }, [orderNo, key]);

  const paid = state.order?.paymentStatus === "paid" || state.order?.paymentStatus === "pending";
  const { clear, count } = cart;
  useEffect(() => {
    if (fresh && paid && count > 0) clear();
  }, [fresh, paid, count, clear]);

  if (state.error) {
    return (
      <div className="py-12 text-center">
        <p className="font-serif text-3xl">We couldn&apos;t open this order</p>
        <p className="mt-3 text-muted">{state.error} Use <a href="/track-order" className="underline">Track order</a> with your email instead.</p>
      </div>
    );
  }
  if (!state.order) return <p className="py-12 text-center text-muted">Loading your order…</p>;

  const o = state.order;
  const failed = o.paymentStatus === "failed" || o.paymentStatus === "unpaid";
  return (
    <div>
      <div className="text-center">
        {!failed && <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pink"><CheckIcon className="h-7 w-7" /></span>}
        <p className="eyebrow mt-5 text-muted">Order {o.orderNo}</p>
        <h1 className="display mt-3 text-[34px] md:text-[48px]">{failed ? "Payment not completed" : "Thank you"}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          {failed
            ? "Your order is saved but we haven't received payment. Please try checking out again, or contact us with your order number."
            : `We've got your order and will let you know when it ships. Keep your order number to track it with ${o.email}.`}
        </p>
        <p className="mt-4 text-sm">
          <span className="eyebrow mr-2 text-[11px]">{paymentLabel[o.paymentStatus]}</span>·
          <span className="eyebrow ml-2 text-[11px]">{statusLabel[o.status]}</span>
        </p>
        {failed && <Button href="/cart" className="mt-6">Back to cart</Button>}
      </div>
      <div className="mt-12">
        <OrderDetails order={o} />
      </div>
    </div>
  );
}
