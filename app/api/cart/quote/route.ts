import { dbEnabled } from "@/lib/db";
import { fail, noDb, ok, readJson } from "@/lib/api";
import { parseCart, str } from "@/lib/validate";
import { priceCart } from "@/lib/pricing";
import { rateLimited } from "@/lib/ratelimit";

export async function POST(request: Request) {
  if (!dbEnabled()) return noDb();
  if (rateLimited(request, "quote", 120)) return fail("Too many requests.", 429);
  const body = await readJson(request);
  const items = parseCart(body?.items);
  const { productIds: _ids, ...quote } = await priceCart(items, str(body?.couponCode, 30) || undefined, str(body?.shippingMethod, 20) || undefined);
  void _ids;
  return ok({ quote });
}
