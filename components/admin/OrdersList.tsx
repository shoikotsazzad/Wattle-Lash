"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge, Empty, ErrorText, Loading, PageTitle, Pager, money, td, th, useAdmin, when } from "./ui";

type Row = { id: string; orderNo: string; createdAt?: string; name?: string; email: string; state?: string; itemCount: number; total: number; status: string; paymentStatus?: string };

export function OrdersList() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const qs = sp.toString();
  const { data, error, loading } = useAdmin<{ orders: Row[]; page: number; pages: number; total: number }>(`/api/admin/orders?${qs}`);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(qs);
    if (v) next.set(k, v);
    else next.delete(k);
    if (k !== "page") next.delete("page");
    router.replace(`${pathname}?${next}`);
  };
  const exportQs = new URLSearchParams(qs);
  exportQs.delete("page");

  return (
    <>
      <PageTitle title="Orders">
        <a href={`/api/admin/orders/export?${exportQs}`} className="btn btn-outline min-h-10">Export CSV</a>
      </PageTitle>

      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", String(new FormData(e.currentTarget).get("q") ?? ""));
        }}
      >
        <input name="q" defaultValue={sp.get("q") ?? ""} placeholder="Order no, email, name, phone" className="field min-h-10 w-64 py-1.5" />
        <select aria-label="Status" value={sp.get("status") ?? ""} onChange={(e) => setParam("status", e.target.value)} className="field min-h-10 w-auto py-1.5">
          <option value="">All statuses</option>
          {["new", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select aria-label="Payment" value={sp.get("payment") ?? ""} onChange={(e) => setParam("payment", e.target.value)} className="field min-h-10 w-auto py-1.5">
          <option value="">All payments</option>
          {["paid", "unpaid", "pending", "failed", "refunded"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="flex items-center gap-1 text-sm">From <input type="date" value={sp.get("from") ?? ""} onChange={(e) => setParam("from", e.target.value)} className="field min-h-10 w-auto py-1.5" /></label>
        <label className="flex items-center gap-1 text-sm">To <input type="date" value={sp.get("to") ?? ""} onChange={(e) => setParam("to", e.target.value)} className="field min-h-10 w-auto py-1.5" /></label>
        <button type="submit" className="btn btn-dark min-h-10">Search</button>
        {qs && <button type="button" className="text-sm underline" onClick={() => router.replace(pathname)}>Clear</button>}
      </form>

      {loading ? <Loading /> : error ? <ErrorText error={error} /> : !data?.orders.length ? <Empty>No orders match.</Empty> : (
        <>
          <p className="mb-2 text-sm text-muted">{data.total} order{data.total === 1 ? "" : "s"}</p>
          <div className="overflow-x-auto border border-line bg-white/60">
            <table className="w-full min-w-[760px] text-sm">
              <thead><tr className="border-b border-line"><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>State</th><th className={th}>Items</th><th className={th}>Total</th><th className={th}>Payment</th><th className={th}>Status</th></tr></thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.id} className="border-b border-line/60 hover:bg-surface">
                    <td className={td}><Link href={`/admin/orders/${o.id}`} className="font-medium underline">{o.orderNo}</Link><div className="text-xs text-muted">{when(o.createdAt)}</div></td>
                    <td className={td}>{o.name}<div className="text-xs text-muted">{o.email}</div></td>
                    <td className={td}>{o.state}</td>
                    <td className={td}>{o.itemCount}</td>
                    <td className={td}>{money(o.total)}</td>
                    <td className={td}><Badge value={o.paymentStatus} /></td>
                    <td className={td}><Badge value={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={data.page} pages={data.pages} onPage={(p) => setParam("page", String(p))} />
        </>
      )}
    </>
  );
}
