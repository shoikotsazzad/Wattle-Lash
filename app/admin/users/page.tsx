"use client";

import { useState } from "react";
import { ErrorText, Loading, PageTitle, api, card, td, th, useAdmin, when } from "@/components/admin/ui";

type Admin = { id: string; name: string; email: string; createdAt?: string };

export default function AdminUsersPage() {
  const { data, error, loading, reload } = useAdmin<{ me: string; admins: Admin[] }>("/api/admin/users");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const r = await api<{ promoted?: boolean }>("/api/admin/users", "POST", Object.fromEntries(new FormData(form)));
    setErrors(r.data.errors ?? {});
    setMsg(r.ok ? (r.data.promoted ? "Existing account promoted to admin." : "Admin created. Share the password securely.") : r.data.error ?? "Failed.");
    if (r.ok) {
      form.reset();
      reload();
    }
  }

  return (
    <>
      <PageTitle title="Admin users" />
      {loading ? <Loading /> : error ? <ErrorText error={error} /> : (
        <div className="mb-8 overflow-x-auto border border-line bg-white/60">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line"><th className={th}>Name</th><th className={th}>Email</th><th className={th}>Since</th><th className={th}></th></tr></thead>
            <tbody>
              {data?.admins.map((a) => (
                <tr key={a.id} className="border-b border-line/60">
                  <td className={td}>{a.name}{a.id === data.me && <span className="ml-2 text-xs text-muted">(you)</span>}</td>
                  <td className={td}>{a.email}</td>
                  <td className={td}>{when(a.createdAt)}</td>
                  <td className={td}>
                    {a.id !== data.me && (
                      <button className="text-xs text-danger underline" onClick={() => confirm(`Remove admin access for ${a.email}?`) && api(`/api/admin/users/${a.id}`, "DELETE").then(reload)}>Remove access</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={add} className={`${card} max-w-xl space-y-3`}>
        <h2 className="eyebrow">Add an admin</h2>
        <p className="text-sm text-muted">If the email already has a customer account it is promoted (name and password are ignored).</p>
        <label className="block text-sm">Email<input name="email" type="email" required className="field mt-1 min-h-10 py-1.5" />{errors.email && <span className="text-xs text-danger">{errors.email}</span>}</label>
        <label className="block text-sm">Name<input name="name" className="field mt-1 min-h-10 py-1.5" />{errors.name && <span className="text-xs text-danger">{errors.name}</span>}</label>
        <label className="block text-sm">Starting password (10+ characters)<input name="password" type="password" autoComplete="new-password" className="field mt-1 min-h-10 py-1.5" />{errors.password && <span className="text-xs text-danger">{errors.password}</span>}</label>
        <button className="btn btn-pink min-h-10">Add admin</button>
        {msg && <p aria-live="polite" className="text-sm">{msg}</p>}
      </form>
    </>
  );
}
