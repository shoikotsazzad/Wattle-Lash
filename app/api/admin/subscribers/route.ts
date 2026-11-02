import { requireAdmin } from "@/lib/auth";
import { ok, toCsv } from "@/lib/api";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { SubscriberModel } = await import("@/models/Subscriber");
  const list = await SubscriberModel.find().sort({ createdAt: -1 }).lean();
  if (new URL(request.url).searchParams.get("format") === "csv") {
    const csv = toCsv([["Email", "Source", "Joined"], ...list.map((s) => [s.email, s.source, s.createdAt?.toISOString()])]);
    return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="subscribers.csv"` } });
  }
  return ok({ subscribers: list.map((s) => ({ id: String(s._id), email: s.email, source: s.source, createdAt: s.createdAt?.toISOString() })) });
}
