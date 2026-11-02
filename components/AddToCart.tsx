"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, type CartItem } from "./StoreProvider";
import { ArrowIcon, MinusIcon, PlusIcon } from "./Icons";

export function AddToCart({ item, stock }: { item: Omit<CartItem, "qty">; stock: number }) {
  const cart = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const max = Math.max(1, Math.min(99, stock));
  const soldOut = stock <= 0;

  return (
    <div>
      {soldOut ? (
        <p className="eyebrow text-danger">Sold out</p>
      ) : stock <= 10 ? (
        <p className="text-sm text-muted">Only {stock} left</p>
      ) : (
        <p className="text-sm text-success">In stock</p>
      )}
      <div className="mt-4 flex flex-wrap items-stretch gap-3">
        <div className="flex items-center border border-ink">
          <button type="button" aria-label="Decrease quantity" className="grid h-12 w-11 place-items-center disabled:opacity-40" disabled={qty <= 1 || soldOut} onClick={() => setQty((q) => q - 1)}>
            <MinusIcon className="h-4 w-4" />
          </button>
          <span aria-live="polite" aria-label={`Quantity ${qty}`} className="w-8 text-center">{qty}</span>
          <button type="button" aria-label="Increase quantity" className="grid h-12 w-11 place-items-center disabled:opacity-40" disabled={qty >= max || soldOut} onClick={() => setQty((q) => q + 1)}>
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <button type="button" disabled={soldOut} className="btn btn-pink flex-1" onClick={() => cart.add(item, qty)}>
          Add to cart <ArrowIcon />
        </button>
      </div>
      <button
        type="button"
        disabled={soldOut}
        className="btn btn-dark mt-3 w-full"
        onClick={() => {
          cart.add(item, qty);
          router.push("/checkout");
        }}
      >
        Buy now
      </button>
    </div>
  );
}
