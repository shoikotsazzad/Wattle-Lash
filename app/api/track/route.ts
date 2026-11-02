import { connectDB, dbEnabled } from "@/lib/db";
import { fail, noDb, ok, readJson } from "@/lib/api";
import { rateLimited } from "@/lib/ratelimit";
import { str } from "@/lib/validate";

// Order number + email → status only (no address or contact details).
export async function POST(request: Request) {
  if (!dbEnabled()) return noDb();
  if (rateLimited(request, "track", 20)) return fail("Too many attempts. Try again later.", 429);
  const body = await readJson(request);
  const orderNo = str(body?.orderNo, 30).toUpperCase();
  const email = str(body?.email, 120).toLowerCase();
  if (!orderNo || !email) return fail("Enter your order number and email.");

  await connectDB();
  const { OrderModel } = await import("@/models/Order");
  const o = await OrderModel.findOne({ orderNo, email }).lean();
  if (!o) return fail("We couldn't find an order with those details.", 404);
  return ok({
    order: {
      orderNo: o.orderNo,
      createdAt: o.createdAt?.toISOString(),
      status: o.status,
      paymentStatus: o.payment?.status,
      trackingNo: o.trackingNo,
      carrier: o.carrier,
      itemCount: o.items.reduce((s, i) => s + (i.qty ?? 0), 0),
      total: o.total,
      timeline: (o.timeline ?? []).map((t) => ({ at: t.at?.toISOString(), text: t.text })),
    },
  });
}
