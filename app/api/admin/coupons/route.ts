import { requireAdmin } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";
import { validateCoupon } from "@/lib/adminValidate";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { CouponModel } = await import("@/models/Coupon");
  const list = await CouponModel.find().sort({ createdAt: -1 }).lean();
  return ok({ coupons: list.map((c) => ({ ...c, _id: undefined, id: String(c._id), expiresAt: c.expiresAt?.toISOString() })) });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { data, errors } = validateCoupon(await readJson(request));
  if (Object.keys(errors).length) return fail("Please check the form.", 400, { errors });
  const { CouponModel } = await import("@/models/Coupon");
  if (await CouponModel.exists({ code: data.code })) return fail("Code already exists.", 409, { errors: { code: "Code already exists." } });
  await CouponModel.create(data);
  return ok();
}
