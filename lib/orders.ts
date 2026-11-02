// Order helpers shared by checkout, the demo payment route and admin.
import { randomBytes } from "node:crypto";
import { revalidateTag } from "next/cache";

/** WL-YYMMDD-0001, date in Melbourne time, sequence per day. */
export async function newOrderNo() {
  const { nextSeq } = await import("@/models/Counter");
  const parts = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Melbourne", year: "2-digit", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const day = `${get("year")}${get("month")}${get("day")}`;
  const seq = await nextSeq(`order-${day}`);
  return `WL-${day}-${String(seq).padStart(4, "0")}`;
}

export const newAccessKey = () => randomBytes(16).toString("hex");

/**
 * Mark an order paid (demo gateway). Atomic: only the first call for an unpaid
 * or failed order wins, so a double submit can't pay or deduct stock twice.
 */
export async function markPaid(orderId: string, method: string) {
  const { OrderModel } = await import("@/models/Order");
  const order = await OrderModel.findOneAndUpdate(
    { _id: orderId, "payment.status": { $in: ["unpaid", "failed"] } },
    {
      $set: { "payment.status": "paid", "payment.paidAt": new Date(), "payment.method": method },
      $push: { timeline: { at: new Date(), text: "Payment received (demo)" } },
    },
    { returnDocument: "after" },
  );
  if (order) await applyStock(orderId);
  return order;
}

/** Decrement stock and count coupon use once per order. */
export async function applyStock(orderId: string) {
  const { OrderModel } = await import("@/models/Order");
  const { ProductModel } = await import("@/models/Product");
  const { CouponModel } = await import("@/models/Coupon");
  const order = await OrderModel.findOneAndUpdate({ _id: orderId, stockApplied: false }, { $set: { stockApplied: true } }, { returnDocument: "after" });
  if (!order) return; // already applied
  await ProductModel.bulkWrite(
    order.items.map((i) => ({
      updateOne: { filter: { sku: i.sku }, update: [{ $set: { stock: { $max: [0, { $subtract: ["$stock", i.qty ?? 0] }] } } }] },
    })),
  );
  if (order.couponCode) await CouponModel.updateOne({ code: order.couponCode }, { $inc: { uses: 1 } });
  revalidateTag("catalog", "max");
}
