"use client";

import { Empty, ErrorText, Loading, PageTitle, td, th, useAdmin, when } from "@/components/admin/ui";

export default function SubscribersPage() {
  const { data, error, loading } = useAdmin<{ subscribers: { id: string; email: string; source?: string; createdAt?: string }[] }>("/api/admin/subscribers");
  return (
    <>
      <PageTitle title="Subscribers">
        <a href="/api/admin/subscribers?format=csv" className="btn btn-outline min-h-10">Export CSV</a>
      </PageTitle>
      {loading ? <Loading /> : error ? <ErrorText error={error} /> : !data?.subscribers.length ? <Empty>No subscribers yet.</Empty> : (
        <div className="overflow-x-auto border border-line bg-white/60">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line"><th className={th}>Email</th><th className={th}>Source</th><th className={th}>Joined</th></tr></thead>
            <tbody>
              {data.subscribers.map((s) => (
                <tr key={s.id} className="border-b border-line/60"><td className={td}>{s.email}</td><td className={td}>{s.source}</td><td className={td}>{when(s.createdAt)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
