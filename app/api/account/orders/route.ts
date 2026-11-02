import { requireUser } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function GET() {
  const user = await requireUser();
  if (user instanceof Response) return user;
  const { OrderModel } = await import("@/models/Order");
  const orders = await OrderModel.find({ $or: [{ userId: user.id }, { email: user.email }] })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return ok({
    orders: orders.map((o) => ({
      orderNo: o.orderNo,
      createdAt: o.createdAt?.toISOString(),
      total: o.total,
      status: o.status,
      paymentStatus: o.payment?.status,
      itemCount: o.items.reduce((s, i) => s + (i.qty ?? 0), 0),
    })),
  });
}
