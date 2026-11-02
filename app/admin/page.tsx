"use client";

import Link from "next/link";
import { Badge, ErrorText, Loading, PageTitle, card, money, td, th, useAdmin, when } from "@/components/admin/ui";

type Stats = {
  revenue: Record<"today" | "week" | "month", { total: number; count: number }>;
  byStatus: Record<string, number>;
  toShip: number;
  lowStock: { id: string; sku: string; name: string; stock: number }[];
  recent: { id: string; orderNo: string; name?: string; total: number; status: string; paymentStatus?: string; createdAt?: string }[];
};

export default function AdminDashboard() {
  const { data, error, loading } = useAdmin<Stats>("/api/admin/stats");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorText error={error} />;

  const tiles = [
    { label: "Revenue · 24 hours", value: money(data.revenue.today.total), sub: `${data.revenue.today.count} paid orders` },
    { label: "Revenue · 7 days", value: money(data.revenue.week.total), sub: `${data.revenue.week.count} paid orders` },
    { label: "Revenue · 30 days", value: money(data.revenue.month.total), sub: `${data.revenue.month.count} paid orders` },
    { label: "To pack & ship", value: String(data.toShip), sub: "Paid, not yet shipped", href: "/admin/orders?payment=paid&status=new" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => {
          const body = (
            <>
              <p className="text-[11px] tracking-[0.12em] text-muted uppercase">{t.label}</p>
              <p className="mt-2 font-serif text-4xl">{t.value}</p>
              <p className="mt-1 text-xs text-muted">{t.sub}</p>
            </>
          );
          return t.href ? <Link key={t.label} href={t.href} className={`${card} block hover:border-ink`}>{body}</Link> : <div key={t.label} className={card}>{body}</div>;
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className={card}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="eyebrow">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm underline">All orders</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-line"><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Total</th><th className={th}>Payment</th><th className={th}>Status</th></tr></thead>
              <tbody>
                {data.recent.map((o) => (
                  <tr key={o.id} className="border-b border-line/60">
                    <td className={td}><Link href={`/admin/orders/${o.id}`} className="font-medium underline">{o.orderNo}</Link><div className="text-xs text-muted">{when(o.createdAt)}</div></td>
                    <td className={td}>{o.name}</td>
                    <td className={td}>{money(o.total)}</td>
                    <td className={td}><Badge value={o.paymentStatus} /></td>
                    <td className={td}><Badge value={o.status} /></td>
                  </tr>
                ))}
                {!data.recent.length && <tr><td colSpan={5} className="py-8 text-center text-muted">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className={card}>
            <h2 className="eyebrow mb-3">Orders by status</h2>
            <ul className="space-y-1.5 text-sm">
              {["new", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                <li key={s} className="flex justify-between"><Link href={`/admin/orders?status=${s}`} className="capitalize hover:underline">{s}</Link><span>{data.byStatus[s] ?? 0}</span></li>
              ))}
            </ul>
          </section>
          <section className={card}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="eyebrow">Low stock (≤ 10)</h2>
              <Link href="/admin/products?stock=low" className="text-sm underline">View</Link>
            </div>
            <ul className="space-y-1.5 text-sm">
              {data.lowStock.map((p) => (
                <li key={p.id} className="flex justify-between gap-3"><Link href={`/admin/products/${p.id}`} className="truncate hover:underline">{p.name}</Link><span className={p.stock === 0 ? "text-danger" : ""}>{p.stock}</span></li>
              ))}
              {!data.lowStock.length && <li className="text-muted">All good.</li>}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
