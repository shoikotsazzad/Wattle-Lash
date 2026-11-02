import { requireAdmin } from "@/lib/auth";
import { ok } from "@/lib/api";
import { orderFilter } from "./query";

const PAGE = 25;

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const sp = new URL(request.url).searchParams;
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const { OrderModel } = await import("@/models/Order");
  const filter = orderFilter(sp);
  const [orders, total] = await Promise.all([
    OrderModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE).limit(PAGE).lean(),
    OrderModel.countDocuments(filter),
  ]);
  return ok({
    page,
    pages: Math.max(1, Math.ceil(total / PAGE)),
    total,
    orders: orders.map((o) => ({
      id: String(o._id),
      orderNo: o.orderNo,
      createdAt: o.createdAt?.toISOString(),
      name: o.customer?.name,
      email: o.email,
      state: o.address?.state,
      itemCount: o.items.reduce((s, i) => s + (i.qty ?? 0), 0),
      total: o.total,
      status: o.status,
      paymentStatus: o.payment?.status,
    })),
  });
}
