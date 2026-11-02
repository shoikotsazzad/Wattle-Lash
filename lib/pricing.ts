// Server-side cart pricing. Reads live prices and stock from MongoDB; never trusts browser totals.
import { connectDB } from "@/lib/db";
import { gstOf } from "@/lib/money";
import { shipping } from "@/data/shipping";
import { categoryList } from "@/data/categories";
import type { CartLine, Quote, QuoteLine } from "@/lib/types";

export type PricedQuote = Quote & { productIds: Record<string, string> };

export async function priceCart(items: CartLine[], couponCode?: string, shippingMethod = "standard"): Promise<PricedQuote> {
  await connectDB();
  const { ProductModel } = await import("@/models/Product");
  const products = await ProductModel.find({ sku: { $in: items.map((i) => i.sku) } }).lean();

  const productIds: Record<string, string> = {};
  const lines: QuoteLine[] = items.map(({ sku, qty }) => {
    const p = products.find((x) => x.sku === sku);
    if (!p || !p.active) {
      return { sku, slug: "", name: "Unavailable item", size: "", image: "", price: 0, qty, lineTotal: 0, stock: 0, error: "No longer available. Please remove it." };
    }
    productIds[sku] = String(p._id);
    const stock = p.stock ?? 0;
    const line: QuoteLine = {
      sku,
      slug: p.slug,
      name: p.name,
      size: p.size ?? "",
      image: p.images?.[0] || categoryList.find((c) => c.slug === p.category)?.image || "",
      price: p.price,
      qty,
      lineTotal: p.price * qty,
      stock,
    };
    if (stock <= 0) line.error = "Out of stock.";
    else if (qty > stock) line.error = `Only ${stock} left in stock.`;
    return line;
  });

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  let discount = 0;
  let couponError: string | undefined;
  let appliedCode: string | undefined;
  if (couponCode) {
    const { CouponModel } = await import("@/models/Coupon");
    const c = await CouponModel.findOne({ code: couponCode.toUpperCase() }).lean();
    const now = Date.now();
    if (!c || !c.active) couponError = "That code isn't valid.";
    else if (c.expiresAt && c.expiresAt.getTime() < now) couponError = "That code has expired.";
    else if (c.maxUses && c.uses >= c.maxUses) couponError = "That code has been fully used.";
    else if (subtotal < (c.minSubtotal ?? 0)) couponError = `Spend at least $${((c.minSubtotal ?? 0) / 100).toFixed(2)} to use this code.`;
    else {
      discount = c.type === "percent" ? Math.round((subtotal * Math.min(100, c.value)) / 100) : Math.min(c.value, subtotal);
      appliedCode = c.code;
    }
  }

  const afterDiscount = subtotal - discount;
  const method = shipping.methods.find((m) => m.id === shippingMethod) ?? shipping.methods[0];
  const free = afterDiscount >= shipping.freeThreshold;
  const shippingFee = subtotal === 0 || free ? 0 : method.price;
  const total = afterDiscount + shippingFee;

  return {
    lines,
    subtotal,
    discount,
    couponCode: appliedCode,
    couponError,
    shippingFee,
    freeShippingRemaining: Math.max(0, shipping.freeThreshold - afterDiscount),
    total,
    gst: gstOf(total),
    ok: lines.length > 0 && lines.every((l) => !l.error),
    productIds,
  };
}
