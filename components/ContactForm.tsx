"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { FieldErrors } from "@/lib/validate";
import { ArrowIcon } from "./Icons";

type State = { status: "idle" | "sending" | "done" | "error"; errors: FieldErrors; message?: string };

/** Validated on the server (/api/contact) and saved to MongoDB; shows up in Admin → Messages. */
export function ContactForm() {
  const page = usePathname();
  const [state, setState] = useState<State>({ status: "idle", errors: {} });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "sending", errors: {} });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, page }) });
      const json = await res.json();
      if (!res.ok) return setState({ status: "error", errors: json.errors ?? {}, message: json.error });
      form.reset();
      setState({ status: "done", errors: {} });
    } catch {
      setState({ status: "error", errors: {}, message: "Network error. Please email us instead." });
    }
  }

  const err = (k: string) => state.errors[k] && <p className="mt-1 text-sm text-danger">{state.errors[k]}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" required autoComplete="name" className="field border-0 border-b border-ink bg-transparent px-0" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field border-0 border-b border-ink bg-transparent px-0" />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="label">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" placeholder="04xx xxx xxx" autoComplete="tel" className="field border-0 border-b border-ink bg-transparent px-0" />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="orderNo" className="label">Order number (optional)</label>
          <input id="orderNo" name="orderNo" placeholder="WL-…" className="field border-0 border-b border-ink bg-transparent px-0 uppercase" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="label">Message</label>
        <textarea id="message" name="message" rows={4} required className="field border-0 border-b border-ink bg-transparent px-0" />
        {err("message")}
      </div>
      <button type="submit" disabled={state.status === "sending"} className="btn btn-pink w-full sm:w-auto">
        {state.status === "sending" ? "Sending…" : "Send message"} <ArrowIcon />
      </button>
      <p aria-live="polite" className="text-sm">
        {state.status === "done" && <span className="text-success">Thanks! We&apos;ll reply by email soon.</span>}
        {state.status === "error" && state.message && <span className="text-danger">{state.message}</span>}
      </p>
    </form>
  );
}
