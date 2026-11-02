import { requireAdmin } from "@/lib/auth";
import { escapeRegex, ok } from "@/lib/api";

// Customers = everyone who has ordered (guest or account), grouped by email.
export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const q = new URL(request.url).searchParams.get("q")?.trim();
  const { OrderModel } = await import("@/models/Order");
  const { UserModel } = await import("@/models/User");
  const match = q ? { $or: [{ email: new RegExp(escapeRegex(q), "i") }, { "customer.name": new RegExp(escapeRegex(q), "i") }] } : {};
  const rows = await OrderModel.aggregate<{ _id: string; name: string; phone: string; state: string; orders: number; spent: number; last: Date }>([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$email",
        name: { $first: "$customer.name" },
        phone: { $first: "$customer.phone" },
        state: { $first: "$address.state" },
        orders: { $sum: 1 },
        spent: { $sum: { $cond: [{ $eq: ["$payment.status", "paid"] }, "$total", 0] } },
        last: { $first: "$createdAt" },
      },
    },
    { $sort: { last: -1 } },
    { $limit: 500 },
  ]);
  const accounts = await UserModel.find({ email: { $in: rows.map((r) => r._id) } }).select("email").lean();
  const registered = await UserModel.countDocuments({ role: "customer" });
  return ok({
    registered,
    customers: rows.map((r) => ({
      email: r._id,
      name: r.name,
      phone: r.phone,
      state: r.state,
      orders: r.orders,
      spent: r.spent,
      last: r.last?.toISOString(),
      hasAccount: accounts.some((a) => a.email === r._id),
    })),
  });
}
