import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";

type Ctx = RouteContext<"/api/admin/coupons/[id]">;

export async function PATCH(request: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found.", 404);
  const b = (await readJson(request)) ?? {};
  const { CouponModel } = await import("@/models/Coupon");
  await CouponModel.updateOne({ _id: id }, { $set: { active: Boolean(b.active) } });
  return ok();
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found.", 404);
  const { CouponModel } = await import("@/models/Coupon");
  await CouponModel.deleteOne({ _id: id });
  return ok();
}
