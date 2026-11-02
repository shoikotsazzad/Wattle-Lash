"use client";

import { useState } from "react";
import { ArrowIcon } from "./Icons";

export function NewsletterForm() {
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; msg?: string }>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "home" }) });
      const json = await res.json();
      if (!res.ok) return setState({ status: "error", msg: json.error ?? "Something went wrong." });
      form.reset();
      setState({ status: "done" });
    } catch {
      setState({ status: "error", msg: "Network error. Please try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder="Your email address" className="min-h-12 flex-1 border border-cream/30 bg-transparent px-4 text-cream placeholder:text-cream/50 focus:border-pink focus:outline-none" />
      <button type="submit" disabled={state.status === "sending"} className="btn btn-pink">
        {state.status === "sending" ? "Joining…" : "Join"} <ArrowIcon />
      </button>
      </div>
      <p aria-live="polite" className="mt-3 text-sm">
        {state.status === "done" && <span className="text-pink">You&apos;re on the list.</span>}
        {state.status === "error" && <span className="text-pink">{state.msg}</span>}
      </p>
    </form>
  );
}
