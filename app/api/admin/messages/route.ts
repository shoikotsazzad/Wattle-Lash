import { requireAdmin } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { LeadModel } = await import("@/models/Lead");
  const list = await LeadModel.find().sort({ createdAt: -1 }).limit(300).lean();
  return ok({ messages: list.map((m) => ({ ...m, _id: undefined, id: String(m._id), createdAt: m.createdAt?.toISOString(), updatedAt: undefined })) });
}
