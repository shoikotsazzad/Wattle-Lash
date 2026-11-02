"use client";

import { Badge, Empty, ErrorText, Loading, PageTitle, api, card, useAdmin, when } from "@/components/admin/ui";

type Msg = { id: string; name: string; email: string; phone?: string; orderNo?: string; message: string; page?: string; status: string; createdAt?: string };

export default function MessagesPage() {
  const { data, error, loading, reload } = useAdmin<{ messages: Msg[] }>("/api/admin/messages");
  return (
    <>
      <PageTitle title="Messages" />
      {loading ? <Loading /> : error ? <ErrorText error={error} /> : !data?.messages.length ? <Empty>No messages yet.</Empty> : (
        <ul className="space-y-4">
          {data.messages.map((m) => (
            <li key={m.id} className={card}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{m.name} <Badge value={m.status} /></p>
                  <p className="text-sm text-muted">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Wattle & Lash")}`} className="underline">{m.email}</a>
                    {m.phone && <> · {m.phone}</>}
                    {m.orderNo && <> · Order {m.orderNo}</>} · {when(m.createdAt)}
                  </p>
                </div>
                <select aria-label="Status" value={m.status} onChange={(e) => api(`/api/admin/messages/${m.id}`, "PATCH", { status: e.target.value }).then(reload)} className="field min-h-9 w-auto py-1">
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="closed">closed</option>
                </select>
              </div>
              <p className="mt-3 text-sm whitespace-pre-line">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
