// Validation for admin product / category / coupon forms.
import { str, type FieldErrors } from "@/lib/validate";
import { slugify } from "@/lib/slug";

const cents = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : NaN; // form sends dollars
};

export function validateProduct(body: Record<string, unknown> | null, partial = false) {
  const b = body ?? {};
  const errors: FieldErrors = {};
  const out: Record<string, unknown> = {};
  const has = (k: string) => !partial || k in b;

  if (has("name")) {
    out.name = str(b.name, 160);
    if ((out.name as string).length < 2) errors.name = "Name is required.";
  }
  if (has("sku")) {
    out.sku = str(b.sku, 40).toUpperCase();
    if (!/^[A-Z0-9-]{3,40}$/.test(out.sku as string)) errors.sku = "Use letters, numbers and dashes.";
  }
  if (has("slug") || has("name")) {
    out.slug = slugify(str(b.slug, 160) || str(b.name, 160));
    if (!out.slug) errors.slug = "Slug is required.";
  }
  if (has("category")) {
    out.category = str(b.category, 80);
    if (!out.category) errors.category = "Choose a category.";
  }
  if (has("description")) out.description = str(b.description, 4000);
  if (has("size")) out.size = str(b.size, 80);
  if (has("price")) {
    out.price = cents(b.price);
    if (Number.isNaN(out.price)) errors.price = "Enter a price in dollars.";
  }
  if ("compareAtPrice" in b) {
    const raw = b.compareAtPrice;
    out.compareAtPrice = raw === "" || raw == null ? undefined : cents(raw);
    if (Number.isNaN(out.compareAtPrice)) errors.compareAtPrice = "Enter a price in dollars or leave empty.";
  }
  if (has("stock")) {
    out.stock = Math.floor(Number(b.stock));
    if (!Number.isFinite(out.stock) || (out.stock as number) < 0) errors.stock = "Stock must be 0 or more.";
  }
  for (const k of ["bestseller", "vegan", "active"]) if (k in b) out[k] = Boolean(b[k]);
  if ("images" in b) {
    out.images = (Array.isArray(b.images) ? b.images : [])
      .map((u) => str(u, 500))
      .filter((u) => u.startsWith("https://res.cloudinary.com/") || u.startsWith("/images/"))
      .slice(0, 8);
  }
  return { data: out, errors };
}

export function validateCoupon(body: Record<string, unknown> | null) {
  const b = body ?? {};
  const errors: FieldErrors = {};
  const type: "fixed" | "percent" = b.type === "fixed" ? "fixed" : "percent";
  const rawValue = Number(b.value);
  const data = {
    code: str(b.code, 30).toUpperCase(),
    type,
    value: type === "fixed" ? Math.round(rawValue * 100) : Math.round(rawValue),
    minSubtotal: Math.round((Number(b.minSubtotal) || 0) * 100),
    maxUses: Math.max(0, Math.floor(Number(b.maxUses) || 0)),
    expiresAt: b.expiresAt ? new Date(String(b.expiresAt)) : undefined,
    active: b.active === undefined ? true : Boolean(b.active),
  };
  if (!/^[A-Z0-9_-]{3,30}$/.test(data.code)) errors.code = "3–30 letters, numbers, - or _.";
  if (!Number.isFinite(rawValue) || rawValue <= 0) errors.value = "Enter a value above 0.";
  if (type === "percent" && data.value > 100) errors.value = "Percent can't exceed 100.";
  if (data.expiresAt && Number.isNaN(data.expiresAt.getTime())) errors.expiresAt = "Invalid date.";
  return { data, errors };
}
