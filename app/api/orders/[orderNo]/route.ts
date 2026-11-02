import { timingSafeEqual } from "node:crypto";
import { connectDB, dbEnabled } from "@/lib/db";
import { fail, noDb, ok } from "@/lib/api";
import { publicOrder } from "@/lib/orderView";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

// Confirmation page data. Requires the order's access key from the checkout redirect.
export async function GET(request: Request, ctx: RouteContext<"/api/orders/[orderNo]">) {
  if (!dbEnabled()) return noDb();
  const { orderNo } = await ctx.params;
  const key = new URL(request.url).searchParams.get("k") ?? "";

  await connectDB();
  const { OrderModel } = await import("@/models/Order");
  const order = await OrderModel.findOne({ orderNo }).lean();
  if (!order || !same(order.accessKey, key)) return fail("Order not found.", 404);

  return ok({ order: publicOrder(order) });
}
