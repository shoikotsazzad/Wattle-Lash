import { connectDB, dbEnabled } from "@/lib/db";
import { fail, noDb, ok, readJson } from "@/lib/api";
import { validateCheckout } from "@/lib/validate";
import { priceCart } from "@/lib/pricing";
import { rateLimited } from "@/lib/ratelimit";
import { getAuthUser } from "@/lib/auth";
import { newAccessKey, newOrderNo } from "@/lib/orders";

// Creates the order (unpaid). Payment happens next via /api/payments/test.
export async function POST(request: Request) {
  if (!dbEnabled()) return noDb();
  if (rateLimited(request, "checkout", 15)) return fail("Too many attempts. Please wait a few minutes.", 429);

  const result = validateCheckout(await readJson(request));
  if (!result.ok) return fail("Please check your details.", 400, { errors: result.errors });
  const input = result.data;

  await connectDB();
  const quote = await priceCart(input.items, input.couponCode, input.shippingMethod);
  if (!quote.ok) return fail("Some items in your cart need attention.", 409, { quote });
  if (input.couponCode && quote.couponError) return fail(quote.couponError, 400, { errors: { couponCode: quote.couponError } });

  const user = await getAuthUser();
  const { OrderModel } = await import("@/models/Order");
  const a = input.address;
  const order = await OrderModel.create({
    orderNo: await newOrderNo(),
    accessKey: newAccessKey(),
    userId: user?.id,
    email: input.email,
    customer: { name: a.name, phone: a.phone },
    address: { line1: a.line1, line2: a.line2, suburb: a.suburb, state: a.state, postcode: a.postcode, country: "AU" },
    items: quote.lines.map((l) => ({ productId: quote.productIds[l.sku], sku: l.sku, slug: l.slug, name: l.name, size: l.size, image: l.image, price: l.price, qty: l.qty })),
    subtotal: quote.subtotal,
    discount: quote.discount,
    couponCode: quote.couponCode,
    shippingMethod: input.shippingMethod,
    shippingFee: quote.shippingFee,
    total: quote.total,
    gst: quote.gst,
    note: input.note,
    timeline: [{ at: new Date(), text: "Order placed, awaiting payment" }],
  });

  return ok({ orderNo: order.orderNo, accessKey: order.accessKey, total: quote.total });
}
