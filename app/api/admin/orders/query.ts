import { escapeRegex } from "@/lib/api";

/** Shared order filters for the list and CSV export. */
export function orderFilter(sp: URLSearchParams) {
  const f: Record<string, unknown> = {};
  const status = sp.get("status");
  const payment = sp.get("payment");
  const q = sp.get("q")?.trim();
  const from = sp.get("from");
  const to = sp.get("to");
  if (status) f.status = status;
  if (payment) f["payment.status"] = payment;
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    f.$or = [{ orderNo: rx }, { email: rx }, { "customer.name": rx }, { "customer.phone": rx }];
  }
  if (from || to) {
    const range: Record<string, Date> = {};
    if (from) range.$gte = new Date(`${from}T00:00:00+10:00`);
    if (to) range.$lte = new Date(`${to}T23:59:59+10:00`);
    f.createdAt = range;
  }
  return f;
}
