"use client";

import Link from "next/link";
import { useState } from "react";
import { Empty, ErrorText, Loading, PageTitle, money, td, th, useAdmin, when } from "@/components/admin/ui";

type Row = { email: string; name: string; phone: string; state: string; orders: number; spent: number; last?: string; hasAccount: boolean };

export default function CustomersPage() {
  const [q, setQ] = useState("");
  const { data, error, loading } = useAdmin<{ customers: Row[]; registered: number }>(`/api/admin/customers?q=${encodeURIComponent(q)}`);
  return (
    <>
      <PageTitle title="Customers" />
      <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); setQ(String(new FormData(e.currentTarget).get("q") ?? "")); }}>
        <input name="q" placeholder="Name or email" className="field min-h-10 w-64 py-1.5" />
        <button className="btn btn-dark min-h-10">Search</button>
      </form>
      {loading ? <Loading /> : error ? <ErrorText error={error} /> : !data?.customers.length ? <Empty>No customers yet.</Empty> : (
        <>
          <p className="mb-2 text-sm text-muted">{data.customers.length} customers with orders · {data.registered} registered accounts</p>
          <div className="overflow-x-auto border border-line bg-white/60">
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr className="border-b border-line"><th className={th}>Customer</th><th className={th}>Phone</th><th className={th}>State</th><th className={th}>Orders</th><th className={th}>Paid total</th><th className={th}>Last order</th></tr></thead>
              <tbody>
                {data.customers.map((c) => (
                  <tr key={c.email} className="border-b border-line/60">
                    <td className={td}>{c.name}{c.hasAccount && <span className="ml-2 text-[10px] tracking-wide text-mauve uppercase">Account</span>}<div className="text-xs text-muted">{c.email}</div></td>
                    <td className={td}>{c.phone}</td>
                    <td className={td}>{c.state}</td>
                    <td className={td}><Link href={`/admin/orders?q=${encodeURIComponent(c.email)}`} className="underline">{c.orders}</Link></td>
                    <td className={td}>{money(c.spent)}</td>
                    <td className={td}>{when(c.last)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
