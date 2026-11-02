"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatAUD } from "@/lib/money";
import { shipping } from "@/data/shipping";
import { Button } from "./Button";
import { CloseIcon, MinusIcon, PlusIcon } from "./Icons";
import { useCart } from "./StoreProvider";
import { readCoupon, saveCoupon, useQuote } from "./useQuote";

export function CartView() {
  const cart = useCart();
  const [coupon, setCoupon] = useState(readCoupon);
  const [code, setCode] = useState(coupon);
  const { quote, offline, loading } = useQuote(cart.items, coupon);

  if (!cart.items.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-3xl">Your cart is empty</p>
        <Button href="/shop" className="mt-8">Shop now</Button>
      </div>
    );
  }

  const lineError = (sku: string) => quote?.lines.find((l) => l.sku === sku)?.error;
  const subtotal = quote?.subtotal ?? cart.subtotal;
  const discount = quote?.discount ?? 0;
  const remaining = quote?.freeShippingRemaining ?? Math.max(0, shipping.freeThreshold - subtotal);
  const shippingFee = quote?.shippingFee ?? (remaining > 0 ? shipping.methods[0].price : 0);
  const total = quote?.total ?? subtotal + shippingFee;
  const progress = Math.min(100, Math.round(((shipping.freeThreshold - remaining) / shipping.freeThreshold) * 100));

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="mb-6 bg-surface p-4">
          <p className="text-sm">
            {remaining > 0 ? <>You&apos;re <strong className="font-medium">{formatAUD(remaining)}</strong> away from free shipping.</> : <>You&apos;ve unlocked <strong className="font-medium">free shipping</strong>.</>}
          </p>
          <div className="mt-3 h-1 bg-line" aria-hidden>
            <div className="h-1 bg-mauve transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {cart.items.map((i) => (
            <li key={i.sku} className="flex gap-4 py-5">
              <Link href={`/product/${i.slug}`} className="tint relative h-28 w-24 shrink-0 overflow-hidden bg-rose">
                <Image src={i.image} alt="" fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/product/${i.slug}`} className="hover:underline">{i.name}</Link>
                    {i.size && <p className="text-xs text-muted">{i.size}</p>}
                  </div>
                  <button type="button" onClick={() => cart.remove(i.sku)} aria-label={`Remove ${i.name}`} className="-mt-2 -mr-2 grid h-10 w-10 shrink-0 place-items-center text-muted hover:text-ink">
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <div className="flex items-center border border-line">
                    <button type="button" aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center" onClick={() => cart.setQty(i.sku, i.qty - 1)}><MinusIcon className="h-3.5 w-3.5" /></button>
                    <span className="w-7 text-center text-sm">{i.qty}</span>
                    <button type="button" aria-label="Increase quantity" className="grid h-10 w-10 place-items-center" onClick={() => cart.setQty(i.sku, i.qty + 1)}><PlusIcon className="h-3.5 w-3.5" /></button>
                  </div>
                  <p className="text-sm">{formatAUD(i.price * i.qty)}</p>
                </div>
                {lineError(i.sku) && <p className="mt-2 text-sm text-danger">{lineError(i.sku)}</p>}
              </div>
            </li>
          ))}
        </ul>
        <Link href="/shop" className="link-arrow mt-6 text-[11px]">Continue shopping</Link>
      </div>

      <aside className="h-fit bg-surface p-6">
        <h2 className="eyebrow">Order summary</h2>
        <form
          className="mt-5 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const v = code.trim().toUpperCase();
            setCoupon(v);
            saveCoupon(v);
          }}
        >
          <label htmlFor="coupon" className="sr-only">Discount code</label>
          <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="field min-h-11 uppercase" />
          <button type="submit" className="btn btn-outline min-h-11 px-4">Apply</button>
        </form>
        {coupon && quote?.couponError && <p className="mt-2 text-sm text-danger">{quote.couponError}</p>}
        {coupon && quote?.couponCode && (
          <p className="mt-2 text-sm text-success">
            Code {quote.couponCode} applied.{" "}
            <button type="button" className="underline" onClick={() => { setCoupon(""); setCode(""); saveCoupon(""); }}>Remove</button>
          </p>
        )}

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatAUD(subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd>−{formatAUD(discount)}</dd></div>}
          <div className="flex justify-between"><dt>Standard shipping</dt><dd>{shippingFee ? formatAUD(shippingFee) : "Free"}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base"><dt>Total</dt><dd className={loading ? "opacity-50" : ""}>{formatAUD(total)}</dd></div>
          <p className="text-xs text-muted">Includes GST of {formatAUD(quote?.gst ?? Math.round(total / 11))}</p>
        </dl>
        {offline && <p className="mt-4 text-xs text-muted">Store database not connected. Checkout is unavailable.</p>}
        <Button href="/checkout" className={`mt-6 w-full ${quote && !quote.ok ? "pointer-events-none opacity-50" : ""}`}>Checkout</Button>
        <p className="mt-3 text-center text-xs text-muted">Checkout in test mode · no payment taken</p>
      </aside>
    </div>
  );
}
