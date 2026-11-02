import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

// Removes admin access (the account stays as a customer) and signs them out.
export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/users/[id]">) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found.", 404);
  if (id === admin.id) return fail("You can't remove your own admin access.");
  const { UserModel } = await import("@/models/User");
  await UserModel.updateOne({ _id: id, role: "admin" }, { $set: { role: "customer" }, $inc: { sessionVersion: 1 } });
  return ok();
}
