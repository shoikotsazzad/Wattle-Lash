import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";
import { str } from "@/lib/validate";
import { ORDER_STATUSES } from "@/models/Order";
import { applyStock } from "@/lib/orders";

async function load(id: string) {
  if (!isValidObjectId(id)) return null;
  const { OrderModel } = await import("@/models/Order");
  return OrderModel.findById(id);
}

export async function GET(_request: Request, ctx: RouteContext<"/api/admin/orders/[id]">) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const order = await load((await ctx.params).id);
  if (!order) return fail("Order not found.", 404);
  const { accessKey: _k, ...o } = order.toObject();
  void _k;
  return ok({ order: { ...o, id: String(order._id) } });
}

// Status / tracking updates and manual "mark paid".
export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/orders/[id]">) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const order = await load((await ctx.params).id);
  if (!order) return fail("Order not found.", 404);
  const b = (await readJson(request)) ?? {};
  const log = (text: string) => order.timeline.push({ at: new Date(), text });

  if (typeof b.status === "string" && b.status !== order.status) {
    if (!(ORDER_STATUSES as readonly string[]).includes(b.status)) return fail("Unknown status.");
    order.set("status", b.status);
    log(`Status changed to ${b.status} by ${admin.name}`);
  }
  if ("trackingNo" in b || "carrier" in b) {
    const trackingNo = str(b.trackingNo, 60);
    const carrier = str(b.carrier, 60);
    if (trackingNo !== (order.trackingNo ?? "") || carrier !== (order.carrier ?? "")) {
      order.set("trackingNo", trackingNo || undefined);
      order.set("carrier", carrier || undefined);
      if (trackingNo) log(`Tracking added: ${carrier ? `${carrier} ` : ""}${trackingNo}`);
    }
  }
  const markPaid = b.markPaid === true && order.payment?.status !== "paid";
  if (markPaid) {
    order.set("payment.status", "paid");
    order.set("payment.paidAt", new Date());
    order.set("payment.method", order.payment?.method ?? "manual");
    log(`Marked paid by ${admin.name}`);
  }
  if (typeof b.note === "string" && b.note.trim()) log(`Note: ${str(b.note, 500)}`);

  await order.save();
  if (markPaid) await applyStock(String(order._id));
  return ok();
}
