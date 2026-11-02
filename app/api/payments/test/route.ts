import { timingSafeEqual } from "node:crypto";
import { connectDB, dbEnabled } from "@/lib/db";
import { fail, noDb, ok, readJson } from "@/lib/api";
import { rateLimited } from "@/lib/ratelimit";
import { str } from "@/lib/validate";
import { markPaid } from "@/lib/orders";
import { DECLINE_LAST4 } from "@/data/payment";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

// Test mode: no money moves. The browser sends only the method and the card's
// last 4 digits (never the full number). A card ending in DECLINE_LAST4 is declined.
export async function POST(request: Request) {
  if (!dbEnabled()) return noDb();
  if (rateLimited(request, "pay", 20)) return fail("Too many attempts. Please wait a few minutes.", 429);

  const b = (await readJson(request)) ?? {};
  const orderNo = str(b.orderNo, 30);
  const key = str(b.accessKey, 64);
  const method = str(b.method, 10);
  const last4 = str(b.last4, 4);
  const brand = str(b.brand, 20) || "Card";
  if (method !== "card" && method !== "afterpay") return fail("Choose a payment method.");
  if (method === "card" && !/^\d{4}$/.test(last4)) return fail("Enter a valid card.");

  await connectDB();
  const { OrderModel } = await import("@/models/Order");
  const order = await OrderModel.findOne({ orderNo });
  if (!order || !same(order.accessKey, key)) return fail("Order not found.", 404);
  if (order.payment?.status === "paid") return fail("This order is already paid.", 409);
  if (order.status === "cancelled") return fail("This order was cancelled.", 409);

  if (method === "card" && last4 === DECLINE_LAST4) {
    order.set("payment.status", "failed");
    order.timeline.push({ at: new Date(), text: `Card ending ${last4} declined (test)` });
    await order.save();
    return fail("Your card was declined. Try another card.", 402);
  }

  const label = method === "afterpay" ? "Afterpay (test)" : `${brand} •••• ${last4} (test)`;
  const paid = await markPaid(String(order._id), label);
  if (!paid) return fail("This order is already paid.", 409);
  return ok({ orderNo });
}
