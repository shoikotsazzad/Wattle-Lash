// Server-side validation for public forms. Keep it dependency-free.
import { AU_STATES, type AuState } from "@/data/shipping";
import type { CartLine } from "@/lib/types";

// Australian mobile (04xx xxx xxx) or landline (0x xxxx xxxx), optional +61.
export const AU_PHONE = /^(?:\+?61|0)[2-478]\d{8}$/;
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const POSTCODE = /^\d{4}$/;

export type FieldErrors = Record<string, string>;
type Result<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

export const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const normPhone = (v: string) => v.replace(/[\s()-]/g, "");

const done = <T,>(data: T, errors: FieldErrors): Result<T> =>
  Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };

// Contact form
export type ContactInput = { name: string; email: string; phone?: string; orderNo?: string; message: string; page?: string };

export function validateContact(body: unknown): Result<ContactInput> {
  const b = (body ?? {}) as Record<string, unknown>;
  const data: ContactInput = {
    name: str(b.name, 100),
    email: str(b.email, 120).toLowerCase(),
    phone: normPhone(str(b.phone, 20)) || undefined,
    orderNo: str(b.orderNo, 30) || undefined,
    message: str(b.message, 2000),
    page: str(b.page, 200) || undefined,
  };
  const errors: FieldErrors = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(data.email)) errors.email = "Enter a valid email address.";
  if (data.phone && !AU_PHONE.test(data.phone)) errors.phone = "Enter an Australian number, e.g. 0412 345 678.";
  if (data.message.length < 5) errors.message = "Please write a short message.";
  return done(data, errors);
}

// Address (checkout + account)
export type AddressInput = { name: string; phone: string; line1: string; line2?: string; suburb: string; state: AuState; postcode: string };

export function validateAddress(body: unknown, errors: FieldErrors = {}, prefix = ""): AddressInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const a = {
    name: str(b.name, 100),
    phone: normPhone(str(b.phone, 20)),
    line1: str(b.line1, 120),
    line2: str(b.line2, 120) || undefined,
    suburb: str(b.suburb, 60),
    state: str(b.state, 3).toUpperCase() as AuState,
    postcode: str(b.postcode, 4),
  };
  if (a.name.length < 2) errors[`${prefix}name`] = "Please enter your full name.";
  if (!AU_PHONE.test(a.phone)) errors[`${prefix}phone`] = "Enter an Australian number, e.g. 0412 345 678.";
  if (a.line1.length < 3) errors[`${prefix}line1`] = "Enter your street address.";
  if (a.suburb.length < 2) errors[`${prefix}suburb`] = "Enter your suburb.";
  if (!AU_STATES.includes(a.state)) errors[`${prefix}state`] = "Choose a state or territory.";
  if (!POSTCODE.test(a.postcode)) errors[`${prefix}postcode`] = "Enter a 4-digit postcode.";
  return a;
}

// Cart lines from the browser: only SKU + qty are trusted, prices come from the DB.
export function parseCart(v: unknown): CartLine[] {
  if (!Array.isArray(v)) return [];
  const map = new Map<string, number>();
  for (const raw of v.slice(0, 100)) {
    const r = (raw ?? {}) as Record<string, unknown>;
    const sku = str(r.sku, 40);
    const qty = Math.floor(Number(r.qty));
    if (sku && qty > 0) map.set(sku, Math.min(99, (map.get(sku) ?? 0) + qty));
  }
  return [...map].map(([sku, qty]) => ({ sku, qty }));
}

// Checkout
export type CheckoutInput = { email: string; address: AddressInput; shippingMethod: string; note?: string; items: CartLine[]; couponCode?: string };

export function validateCheckout(body: unknown): Result<CheckoutInput> {
  const b = (body ?? {}) as Record<string, unknown>;
  const errors: FieldErrors = {};
  const email = str(b.email, 120).toLowerCase();
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  const address = validateAddress(b.address, errors);
  const items = parseCart(b.items);
  if (!items.length) errors.items = "Your cart is empty.";
  return done(
    { email, address, shippingMethod: str(b.shippingMethod, 20) || "standard", note: str(b.note, 500) || undefined, items, couponCode: str(b.couponCode, 30).toUpperCase() || undefined },
    errors,
  );
}

// Accounts
export function validateRegister(body: unknown): Result<{ name: string; email: string; password: string }> {
  const b = (body ?? {}) as Record<string, unknown>;
  const data = { name: str(b.name, 100), email: str(b.email, 120).toLowerCase(), password: typeof b.password === "string" ? b.password : "" };
  const errors: FieldErrors = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(data.email)) errors.email = "Enter a valid email address.";
  if (data.password.length < 8) errors.password = "Use at least 8 characters.";
  if (data.password.length > 200) errors.password = "That password is too long.";
  return done(data, errors);
}
