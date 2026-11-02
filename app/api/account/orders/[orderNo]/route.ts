import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { publicOrder } from "@/lib/orderView";

export async function GET(_request: Request, ctx: RouteContext<"/api/account/orders/[orderNo]">) {
  const user = await requireUser();
  if (user instanceof Response) return user;
  const { orderNo } = await ctx.params;
  const { OrderModel } = await import("@/models/Order");
  const o = await OrderModel.findOne({ orderNo, $or: [{ userId: user.id }, { email: user.email }] }).lean();
  if (!o) return fail("Order not found.", 404);
  return ok({ order: publicOrder(o) });
}
