"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FieldErrors } from "@/lib/validate";
import { ArrowIcon } from "./Icons";

/** Login / register form. `admin` mode only allows admin accounts through. */
export function AuthForm({ mode, admin = false }: { mode: "login" | "register"; admin?: boolean }) {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const fallback = admin ? "/admin" : "/account";
  // Only same-site relative paths.
  const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage("");
    try {
      const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors ?? {});
        setMessage(json.error ?? "Something went wrong.");
        return;
      }
      if (admin && json.user?.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST" });
        setMessage("This account doesn't have admin access.");
        return;
      }
      router.replace(dest);
      router.refresh();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-danger">{errors[k]}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {mode === "register" && (
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" autoComplete="name" required className="field" />
          {err("name")}
        </div>
      )}
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" />
        {err("email")}
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} className="field" />
        {err("password")}
      </div>
      {message && <p role="alert" className="text-sm text-danger">{message}</p>}
      <button type="submit" disabled={busy} className="btn btn-pink w-full">
        {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"} <ArrowIcon />
      </button>
      {!admin && (
        <p className="text-center text-sm text-muted">
          {mode === "login" ? (
            <>New here? <Link href={`/account/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-ink underline">Create an account</Link></>
          ) : (
            <>Already have an account? <Link href="/account/login" className="text-ink underline">Log in</Link></>
          )}
        </p>
      )}
    </form>
  );
}
