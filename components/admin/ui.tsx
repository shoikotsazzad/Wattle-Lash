"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Shared admin helpers: data fetching, API calls, small UI pieces.

export async function api<T = Record<string, unknown>>(url: string, method = "GET", body?: unknown): Promise<{ ok: boolean; status: number; data: T & { error?: string; errors?: Record<string, string> } }> {
  const res = await fetch(url, {
    method,
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 || res.status === 403) {
    // Session expired or revoked: full reload to the login page drops all admin state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export function useAdmin<T>(url: string | null) {
  const [state, setState] = useState<{ data?: T; error?: string; loading: boolean; url?: string | null }>({ loading: true });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!url) return;
    let live = true;
    api<T>(url).then((r) => {
      if (!live) return;
      setState(r.ok ? { data: r.data, loading: false, url } : { error: r.data.error ?? "Failed to load.", loading: false, url });
    });
    return () => {
      live = false;
    };
  }, [url, tick]);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, loading: state.loading || state.url !== url, reload };
}

export const money = (c?: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format((c ?? 0) / 100);
export const when = (iso?: string) => (iso ? new Date(iso).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }) : "—");

const tones: Record<string, string> = {
  paid: "bg-[#dfeee2] text-success",
  delivered: "bg-[#dfeee2] text-success",
  shipped: "bg-[#e3e6f3] text-[#33407a]",
  processing: "bg-[#f6ead2] text-[#7a5a17]",
  pending: "bg-[#f6ead2] text-[#7a5a17]",
  new: "bg-pink/50 text-ink",
  unpaid: "bg-line text-ink",
  failed: "bg-[#f4dadd] text-danger",
  cancelled: "bg-[#f4dadd] text-danger",
  refunded: "bg-line text-muted",
  contacted: "bg-[#e3e6f3] text-[#33407a]",
  closed: "bg-line text-muted",
};

export function Badge({ value }: { value?: string }) {
  if (!value) return null;
  return <span className={`inline-block px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${tones[value] ?? "bg-line"}`}>{value}</span>;
}

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-serif text-4xl">{title}</h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center gap-3 text-sm">
      <button className="btn btn-outline min-h-9 px-3" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</button>
      <span>Page {page} of {pages}</span>
      <button className="btn btn-outline min-h-9 px-3" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}

export const th = "px-3 py-2.5 text-left text-[11px] font-medium tracking-[0.12em] text-muted uppercase";
export const td = "px-3 py-3 align-top";
export const card = "border border-line bg-white/60 p-5";

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-10 text-center text-muted">{children}</p>;
}

export function Loading() {
  return <p className="py-10 text-center text-muted">Loading…</p>;
}

export function ErrorText({ error }: { error?: string }) {
  return error ? <p className="py-6 text-danger">{error}</p> : null;
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="text-sm text-muted hover:text-ink">← {children}</Link>;
}
