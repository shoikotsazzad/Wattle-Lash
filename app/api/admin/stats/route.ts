import { requireAdmin } from "@/lib/auth";
import { ok } from "@/lib/api";

const DAY = 24 * 60 * 60 * 1000;

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { OrderModel } = await import("@/models/Order");
  const { ProductModel } = await import("@/models/Product");
  const now = Date.now();

  const revenueSince = async (ms: number) => {
    const [r] = await OrderModel.aggregate<{ total: number; count: number }>([
      { $match: { "payment.status": "paid", "payment.paidAt": { $gte: new Date(now - ms) } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ]);
    return { total: r?.total ?? 0, count: r?.count ?? 0 };
  };

  const [today, week, month, byStatus, toShip, lowStock, recent] = await Promise.all([
    revenueSince(DAY),
    revenueSince(7 * DAY),
    revenueSince(30 * DAY),
    OrderModel.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    OrderModel.countDocuments({ "payment.status": "paid", status: { $in: ["new", "processing"] } }),
    ProductModel.find({ active: true, stock: { $lte: 10 } }).sort({ stock: 1 }).limit(10).select("sku name stock").lean(),
    OrderModel.find().sort({ createdAt: -1 }).limit(8).select("orderNo customer.name total status payment.status createdAt").lean(),
  ]);

  return ok({
    revenue: { today, week, month },
    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
    toShip,
    lowStock: lowStock.map((p) => ({ id: String(p._id), sku: p.sku, name: p.name, stock: p.stock })),
    recent: recent.map((o) => ({
      id: String(o._id),
      orderNo: o.orderNo,
      name: o.customer?.name,
      total: o.total,
      status: o.status,
      paymentStatus: o.payment?.status,
      createdAt: o.createdAt?.toISOString(),
    })),
  });
}
