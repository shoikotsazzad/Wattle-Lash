"use client";

import Link from "next/link";
import { createContext, use, useEffect, useState, useSyncExternalStore } from "react";
import { CloseIcon } from "./Icons";

// The cart lives in localStorage (guest-friendly, survives refresh).
// Prices here are for display only; the server re-prices everything at checkout.

export type CartItem = { sku: string; slug: string; name: string; size: string; price: number; image: string; qty: number };

function createStore<T>(key: string, fallback: T) {
  let raw: string | null | undefined;
  let cache: T = fallback;
  const listeners = new Set<() => void>();
  const read = () => {
    try {
      const r = localStorage.getItem(key);
      if (r !== raw) {
        raw = r;
        cache = r ? (JSON.parse(r) as T) : fallback;
      }
    } catch {
      /* private mode or bad JSON: keep last value */
    }
    return cache;
  };
  const write = (v: T) => {
    cache = v;
    try {
      raw = JSON.stringify(v);
      localStorage.setItem(key, raw);
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => e.key === key && l();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  };
  return { read, write, subscribe, server: () => fallback };
}

const EMPTY_CART: CartItem[] = [];
const cartStore = createStore("wl_cart", EMPTY_CART);

type Toast = { name: string; id: number } | null;
const ToastCtx = createContext<(t: Toast) => void>(() => {});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <ToastCtx value={setToast}>
      {children}
      {toast && (
        <div role="status" className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 lg:bottom-4 flex items-center justify-between gap-4 bg-espresso px-5 py-4 text-cream sm:left-auto sm:w-96">
          <p className="text-sm">
            Added <span className="font-medium">{toast.name}</span>
          </p>
          <div className="flex items-center gap-3">
            <Link href="/cart" onClick={() => setToast(null)} className="eyebrow whitespace-nowrap text-pink underline underline-offset-4">
              View cart
            </Link>
            <button type="button" aria-label="Dismiss" onClick={() => setToast(null)} className="grid h-8 w-8 place-items-center">
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </ToastCtx>
  );
}

export function useCart() {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.read, cartStore.server);
  const showToast = use(ToastCtx);
  const set = (next: CartItem[]) => cartStore.write(next);
  return {
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
    add(item: Omit<CartItem, "qty">, qty = 1) {
      const cur = cartStore.read();
      const found = cur.find((i) => i.sku === item.sku);
      set(found ? cur.map((i) => (i.sku === item.sku ? { ...i, ...item, qty: Math.min(99, i.qty + qty) } : i)) : [...cur, { ...item, qty }]);
      showToast({ name: item.name, id: Date.now() });
    },
    setQty(sku: string, qty: number) {
      const cur = cartStore.read();
      set(qty <= 0 ? cur.filter((i) => i.sku !== sku) : cur.map((i) => (i.sku === sku ? { ...i, qty: Math.min(99, qty) } : i)));
    },
    remove(sku: string) {
      set(cartStore.read().filter((i) => i.sku !== sku));
    },
    clear() {
      set([]);
    },
  };
}
