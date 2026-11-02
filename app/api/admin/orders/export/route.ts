import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/api";
import { orderFilter } from "../query";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { OrderModel } = await import("@/models/Order");
  const orders = await OrderModel.find(orderFilter(new URL(request.url).searchParams)).sort({ createdAt: -1 }).limit(5000).lean();
  const $ = (c?: number | null) => ((c ?? 0) / 100).toFixed(2);
  const rows = [
    ["Order", "Date", "Name", "Email", "Phone", "Address", "Suburb", "State", "Postcode", "Items", "Subtotal", "Discount", "Coupon", "Shipping", "Total", "GST", "Payment", "Status", "Tracking"],
    ...orders.map((o) => [
      o.orderNo,
      o.createdAt?.toISOString(),
      o.customer?.name,
      o.email,
      o.customer?.phone,
      [o.address?.line1, o.address?.line2].filter(Boolean).join(", "),
      o.address?.suburb,
      o.address?.state,
      o.address?.postcode,
      o.items.map((i) => `${i.qty}x ${i.sku}`).join("; "),
      $(o.subtotal),
      $(o.discount),
      o.couponCode,
      $(o.shippingFee),
      $(o.total),
      $(o.gst),
      o.payment?.status,
      o.status,
      o.trackingNo,
    ]),
  ];
  return new Response(toCsv(rows), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="orders.csv"` },
  });
}
