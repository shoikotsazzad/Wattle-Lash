"use client";

import { useEffect, useState } from "react";
import type { Quote } from "@/lib/types";
import type { CartItem } from "./StoreProvider";

export const COUPON_KEY = "wl_coupon";

export function readCoupon() {
  try {
    return localStorage.getItem(COUPON_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveCoupon(code: string) {
  try {
    if (code) localStorage.setItem(COUPON_KEY, code);
    else localStorage.removeItem(COUPON_KEY);
  } catch {
    /* ignore */
  }
}

/** Server-priced quote for the current cart. `offline` = no DB configured (show local prices). */
export function useQuote(items: CartItem[], coupon: string) {
  const [state, setState] = useState<{ quote: Quote | null; offline: boolean; key: string }>({ quote: null, offline: false, key: "" });
  const key = JSON.stringify([items.map((i) => [i.sku, i.qty]), coupon]);

  useEffect(() => {
    if (!items.length) return;
    const ctrl = new AbortController();
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((i) => ({ sku: i.sku, qty: i.qty })), couponCode: coupon || undefined }),
      signal: ctrl.signal,
    })
      .then(async (res) => {
        if (res.status === 503) return setState({ quote: null, offline: true, key });
        const json = await res.json();
        setState({ quote: json.quote ?? null, offline: false, key });
      })
      .catch(() => {});
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const loading = items.length > 0 && state.key !== key;
  return { quote: items.length ? state.quote : null, offline: state.offline, loading };
}
