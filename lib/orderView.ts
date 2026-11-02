import type { Order } from "@/models/Order";

type OrderDoc = Order & { _id: unknown; createdAt?: Date };

/** What a customer may see about their order. */
export function publicOrder(o: OrderDoc) {
  return {
    orderNo: o.orderNo,
    createdAt: o.createdAt?.toISOString(),
    email: o.email,
    customer: { name: o.customer?.name ?? "", phone: o.customer?.phone ?? "" },
    address: {
      line1: o.address?.line1 ?? "",
      line2: o.address?.line2 ?? undefined,
      suburb: o.address?.suburb ?? "",
      state: o.address?.state ?? "",
      postcode: o.address?.postcode ?? "",
    },
    items: (o.items ?? []).map((i) => ({ sku: i.sku, slug: i.slug, name: i.name, size: i.size, image: i.image, price: i.price, qty: i.qty })),
    subtotal: o.subtotal,
    discount: o.discount,
    couponCode: o.couponCode,
    shippingFee: o.shippingFee,
    total: o.total,
    gst: o.gst,
    paymentStatus: o.payment?.status ?? "unpaid",
    paymentMethod: o.payment?.method,
    status: o.status,
    trackingNo: o.trackingNo,
    carrier: o.carrier,
    timeline: (o.timeline ?? []).map((t) => ({ at: t.at?.toISOString(), text: t.text })),
  };
}

export type PublicOrder = ReturnType<typeof publicOrder>;
