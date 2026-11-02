import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";

export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  const status = (await readJson(request))?.status;
  if (!isValidObjectId(id) || !["new", "contacted", "closed"].includes(String(status))) return fail("Invalid request.");
  const { LeadModel } = await import("@/models/Lead");
  await LeadModel.updateOne({ _id: id }, { $set: { status } });
  return ok();
}
