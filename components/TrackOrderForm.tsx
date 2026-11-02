"use client";

import { useState } from "react";
import { formatAUD } from "@/lib/money";
import { paymentLabel, statusLabel } from "./OrderDetails";
import { ArrowIcon } from "./Icons";

type Result = { orderNo: string; createdAt?: string; status: string; paymentStatus?: string; trackingNo?: string; carrier?: string; itemCount: number; total: number; timeline: { at?: string; text?: string | null }[] };
const STEPS = ["new", "processing", "shipped", "delivered"];

export function TrackOrderForm() {
  const [res, setRes] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await r.json();
      if (!r.ok) {
        setRes(null);
        setError(json.error ?? "Not found.");
      } else setRes(json.order);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const step = res ? STEPS.indexOf(res.status) : -1;

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="orderNo" className="label">Order number</label>
          <input id="orderNo" name="orderNo" required placeholder="WL-261030-0001" className="field uppercase" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email used at checkout</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <button type="submit" disabled={busy} className="btn btn-pink w-full">{busy ? "Checking…" : "Track order"} <ArrowIcon /></button>
        {error && <p role="alert" className="text-danger">{error}</p>}
      </form>

      {res && (
        <div className="mt-10 border border-line bg-surface p-6" aria-live="polite">
          <p className="eyebrow text-muted">Order {res.orderNo}</p>
          <p className="mt-2 font-serif text-3xl">{statusLabel[res.status]}</p>
          <p className="mt-1 text-sm text-muted">{res.itemCount} item{res.itemCount === 1 ? "" : "s"} · {formatAUD(res.total)} · {paymentLabel[res.paymentStatus ?? "unpaid"]}</p>
          {res.status !== "cancelled" && (
            <ol className="mt-6 grid grid-cols-4 gap-1" aria-label="Progress">
              {STEPS.map((s, i) => (
                <li key={s} className="text-center text-[11px]">
                  <span className={`block h-1 ${i <= step ? "bg-mauve" : "bg-line"}`} />
                  <span className={`mt-2 block ${i <= step ? "" : "text-muted"}`}>{statusLabel[s]}</span>
                </li>
              ))}
            </ol>
          )}
          {res.trackingNo && <p className="mt-6 text-sm">Tracking: {res.carrier ? `${res.carrier} ` : ""}<strong className="font-medium">{res.trackingNo}</strong></p>}
        </div>
      )}
    </div>
  );
}
