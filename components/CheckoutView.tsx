"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatAUD } from "@/lib/money";
import { AU_STATES } from "@/data/shipping";
import { demoPayment } from "@/data/payment";
import type { FieldErrors } from "@/lib/validate";
import { useCart } from "./StoreProvider";
import { readCoupon, useQuote } from "./useQuote";
import { ArrowIcon, LockIcon } from "./Icons";
import { Button } from "./Button";

type Address = { name: string; phone: string; line1: string; line2?: string; suburb: string; state: string; postcode: string };
type Pay = { orderNo: string; accessKey: string; total: number };

const empty: Address = { name: "", phone: "", line1: "", line2: "", suburb: "", state: "", postcode: "" };

export function CheckoutView() {
  const cart = useCart();
  const [coupon] = useState(readCoupon);
  const { quote, offline } = useQuote(cart.items, coupon);
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState<Address>(empty);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<(Address & { label?: string; _id: string })[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [pay, setPay] = useState<Pay | null>(null);

  // Logged-in customers: prefill email and saved addresses.
  useEffect(() => {
    fetch("/api/account/addresses")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j?.user) return;
        setEmail((e) => e || j.user.email);
        setSaved(j.addresses ?? []);
        if (j.addresses?.[0]) setAddr((a) => (a.line1 ? a : { ...empty, ...j.addresses[0] }));
      })
      .catch(() => {});
  }, []);

  if (!cart.items.length && !pay) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-3xl">Your cart is empty</p>
        <Button href="/shop" className="mt-8">Shop now</Button>
      </div>
    );
  }

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setAddr({ ...addr, [k]: e.target.value });
  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-danger">{errors[k]}</p>;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, address: addr, note, couponCode: coupon || undefined, shippingMethod: "standard", items: cart.items.map((i) => ({ sku: i.sku, qty: i.qty })) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors ?? {});
        setMessage(json.error ?? "Something went wrong.");
        return;
      }
      setPay({ orderNo: json.orderNo, accessKey: json.accessKey, total: json.total });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const summary = (
    <aside className="h-fit bg-surface p-6 lg:sticky lg:top-28">
      <h2 className="eyebrow">Your order</h2>
      <ul className="mt-5 space-y-4">
        {cart.items.map((i) => (
          <li key={i.sku} className="flex gap-3 text-sm">
            <span className="tint relative h-16 w-14 shrink-0 overflow-hidden bg-rose">
              <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />
              <span className="absolute top-0 right-0 z-10 grid h-5 min-w-5 place-items-center bg-espresso px-1 text-[10px] text-cream">{i.qty}</span>
            </span>
            <span className="flex-1">{i.name}{quote?.lines.find((l) => l.sku === i.sku)?.error && <span className="block text-danger">{quote.lines.find((l) => l.sku === i.sku)?.error}</span>}</span>
            <span>{formatAUD((quote?.lines.find((l) => l.sku === i.sku)?.price ?? i.price) * i.qty)}</span>
          </li>
        ))}
      </ul>
      {quote && (
        <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatAUD(quote.subtotal)}</dd></div>
          {quote.discount > 0 && <div className="flex justify-between text-success"><dt>Discount ({quote.couponCode})</dt><dd>−{formatAUD(quote.discount)}</dd></div>}
          <div className="flex justify-between"><dt>Standard shipping</dt><dd>{quote.shippingFee ? formatAUD(quote.shippingFee) : "Free"}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base"><dt>Total</dt><dd>{formatAUD(quote.total)}</dd></div>
          <p className="text-xs text-muted">Includes GST of {formatAUD(quote.gst)}</p>
        </dl>
      )}
      {coupon && quote?.couponError && <p className="mt-3 text-sm text-danger">Code {coupon}: {quote.couponError} <Link href="/cart" className="underline">Edit in cart</Link></p>}
    </aside>
  );

  if (pay) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="eyebrow text-muted">Step 2 of 2</p>
          <h2 className="mt-2 font-serif text-3xl">Payment</h2>
          <p className="mt-2 text-sm text-muted">Order {pay.orderNo} · {formatAUD(pay.total)} incl. GST</p>
          <DemoPayForm pay={pay} onPaid={() => cart.clear()} />
        </div>
        {summary}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-10">
        <fieldset>
          <legend className="eyebrow text-muted">Step 1 of 2 · Contact</legend>
          <div className="mt-4">
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
            {err("email")}
            <p className="mt-2 text-xs text-muted">
              For your order confirmation and tracking. <Link href="/account/login?next=/checkout" className="underline">Log in</Link> to use saved addresses.
            </p>
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow text-muted">Delivery address</legend>
          {saved.length > 1 && (
            <div className="mt-4">
              <label htmlFor="saved" className="label">Saved addresses</label>
              <select id="saved" className="field" onChange={(e) => { const s = saved.find((a) => a._id === e.target.value); if (s) setAddr({ ...empty, ...s }); }}>
                {saved.map((a) => <option key={a._id} value={a._id}>{a.label}: {a.line1}, {a.suburb}</option>)}
              </select>
            </div>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="label">Full name</label>
              <input id="name" autoComplete="name" value={addr.name} onChange={set("name")} className="field" />
              {err("name")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="line1" className="label">Street address</label>
              <input id="line1" autoComplete="address-line1" value={addr.line1} onChange={set("line1")} className="field" />
              {err("line1")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="line2" className="label">Apartment, unit (optional)</label>
              <input id="line2" autoComplete="address-line2" value={addr.line2 ?? ""} onChange={set("line2")} className="field" />
            </div>
            <div>
              <label htmlFor="suburb" className="label">Suburb</label>
              <input id="suburb" autoComplete="address-level2" value={addr.suburb} onChange={set("suburb")} className="field" />
              {err("suburb")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="label">State</label>
                <select id="state" autoComplete="address-level1" value={addr.state} onChange={set("state")} className="field">
                  <option value="">—</option>
                  {AU_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
                {err("state")}
              </div>
              <div>
                <label htmlFor="postcode" className="label">Postcode</label>
                <input id="postcode" inputMode="numeric" autoComplete="postal-code" maxLength={4} value={addr.postcode} onChange={set("postcode")} className="field" />
                {err("postcode")}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="label">Phone</label>
              <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="04xx xxx xxx" value={addr.phone} onChange={set("phone")} className="field" />
              {err("phone")}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow text-muted">Shipping</legend>
          <div className="mt-4 flex items-center justify-between border border-ink p-4 text-sm">
            <span>Standard shipping · Australia-wide</span>
            <span>{quote ? (quote.shippingFee ? formatAUD(quote.shippingFee) : "Free") : "…"}</span>
          </div>
          <div className="mt-4">
            <label htmlFor="note" className="label">Order note (optional)</label>
            <textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="field" />
          </div>
        </fieldset>

        {message && <p role="alert" className="text-danger">{message}</p>}
        {errors.items && <p className="text-danger">{errors.items}</p>}
        {offline && <p className="text-danger">The store database isn&apos;t connected, so checkout is unavailable.</p>}
        <button type="submit" disabled={busy || offline || (quote ? !quote.ok : false)} className="btn btn-pink w-full">
          {busy ? "Preparing payment…" : "Continue to payment"} <ArrowIcon />
        </button>
      </div>
      {summary}
    </form>
  );
}

// Card helpers for the demo form. Checked in the browser only; the full number is never sent.
const digits = (v: string) => v.replace(/\D/g, "");
const groupCard = (v: string) => digits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

function luhn(num: string) {
  let sum = 0;
  for (let i = 0; i < num.length; i++) {
    let d = Number(num[num.length - 1 - i]);
    if (i % 2) d = d * 2 > 9 ? d * 2 - 9 : d * 2;
    sum += d;
  }
  return num.length >= 13 && sum % 10 === 0;
}

function cardBrand(num: string) {
  if (/^4/.test(num)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(num)) return "Mastercard";
  if (/^3[47]/.test(num)) return "Amex";
  return "Card";
}

function expiryOk(v: string) {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v);
  if (!m) return false;
  const month = Number(m[1]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const end = new Date(2000 + Number(m[2]), month, 1); // first day after the expiry month
  return end > now;
}

function DemoPayForm({ pay, onPaid }: { pay: Pay; onPaid: () => void }) {
  const router = useRouter();
  const [method, setMethod] = useState<"card" | "afterpay">("card");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const instalment = Math.ceil(pay.total / demoPayment.afterpayInstalments);

  const setField = (k: keyof typeof card) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (k === "number") v = groupCard(v);
    if (k === "expiry") v = digits(v).slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
    if (k === "cvc") v = digits(v).slice(0, 4);
    setCard({ ...card, [k]: v });
  };

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const num = digits(card.number);
    if (method === "card") {
      const errs: FieldErrors = {};
      if (card.name.trim().length < 2) errs.cardName = "Enter the name on the card.";
      if (!luhn(num)) errs.cardNumber = "Enter a valid card number.";
      if (!expiryOk(card.expiry)) errs.cardExpiry = "Enter a valid expiry (MM/YY).";
      if (!/^\d{3,4}$/.test(card.cvc)) errs.cardCvc = "Enter the 3 or 4 digit code.";
      setErrors(errs);
      if (Object.keys(errs).length) return;
    }
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 1200)); // feel of a real gateway
      const res = await fetch("/api/payments/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo: pay.orderNo, accessKey: pay.accessKey, method, last4: method === "card" ? num.slice(-4) : undefined, brand: cardBrand(num) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Payment failed. Please try again.");
        setBusy(false);
        return;
      }
      onPaid();
      router.push(`/order/${pay.orderNo}?k=${pay.accessKey}&fresh=1`);
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  const tab = (m: typeof method, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={method === m}
      onClick={() => { setMethod(m); setError(""); }}
      className={`flex-1 border px-4 py-3 text-xs tracking-[0.2em] uppercase ${method === m ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"}`}
    >
      {label}
    </button>
  );
  const fieldErr = (k: string) => errors[k] && <p className="mt-1 text-sm text-danger">{errors[k]}</p>;

  return (
    <form onSubmit={onPay} noValidate className="mt-6">
      <div className="border border-pink bg-pink/25 p-4 text-sm">
        <p className="font-medium">{demoPayment.banner}</p>
        <p className="mt-1 text-muted">
          Use test card <span className="whitespace-nowrap font-medium text-ink">{demoPayment.testCard}</span>, any future expiry and any CVC.
          A card ending in 0002 is declined.
        </p>
      </div>

      <div role="tablist" aria-label="Payment method" className="mt-6 flex gap-2">
        {tab("card", "Card")}
        {tab("afterpay", "Afterpay")}
      </div>

      {method === "card" ? (
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label htmlFor="cardName" className="label">Name on card</label>
            <input id="cardName" autoComplete="off" value={card.name} onChange={setField("name")} className="field" />
            {fieldErr("cardName")}
          </div>
          <div className="col-span-2">
            <label htmlFor="cardNumber" className="label">Card number</label>
            <input id="cardNumber" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" value={card.number} onChange={setField("number")} className="field" />
            {fieldErr("cardNumber")}
          </div>
          <div>
            <label htmlFor="cardExpiry" className="label">Expiry</label>
            <input id="cardExpiry" inputMode="numeric" autoComplete="off" placeholder="MM/YY" value={card.expiry} onChange={setField("expiry")} className="field" />
            {fieldErr("cardExpiry")}
          </div>
          <div>
            <label htmlFor="cardCvc" className="label">CVC</label>
            <input id="cardCvc" inputMode="numeric" autoComplete="off" placeholder="123" value={card.cvc} onChange={setField("cvc")} className="field" />
            {fieldErr("cardCvc")}
          </div>
        </div>
      ) : (
        <div className="mt-5 border border-line p-5 text-sm">
          <p className="font-serif text-2xl">{demoPayment.afterpayInstalments} payments of {formatAUD(instalment)}</p>
          <p className="mt-2 text-muted">Pay fortnightly, interest-free. In this demo the plan is approved straight away.</p>
        </div>
      )}

      {error && <p role="alert" className="mt-4 text-danger">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-pink mt-6 w-full">
        <LockIcon className="h-4 w-4" />{" "}
        {busy ? "Processing…" : method === "afterpay" ? "Approve with Afterpay (demo)" : `Pay ${formatAUD(pay.total)}`}
      </button>
      <p className="mt-3 text-center text-xs text-muted">Nothing is charged. Card details stay in your browser and are not stored.</p>
    </form>
  );
}
