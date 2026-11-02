import { isValidObjectId } from "mongoose";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";
import { validateProduct } from "@/lib/adminValidate";

type Ctx = RouteContext<"/api/admin/products/[id]">;

export async function GET(_request: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found.", 404);
  const { ProductModel } = await import("@/models/Product");
  const p = await ProductModel.findById(id).lean();
  if (!p) return fail("Not found.", 404);
  return ok({ product: { ...p, _id: undefined, id: String(p._id) } });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found.", 404);
  const { data, errors } = validateProduct(await readJson(request), true);
  if (Object.keys(errors).length) return fail("Please check the form.", 400, { errors });
  const { ProductModel } = await import("@/models/Product");
  if (data.sku || data.slug) {
    const clash = await ProductModel.exists({ _id: { $ne: id }, $or: [{ sku: String(data.sku ?? "\0") }, { slug: String(data.slug ?? "\0") }] });
    if (clash) return fail("SKU or slug already in use.", 409, { errors: { sku: "SKU or slug already in use." } });
  }
  const unset = "compareAtPrice" in data && data.compareAtPrice === undefined ? { compareAtPrice: 1 } : undefined;
  if (unset) delete data.compareAtPrice;
  const res = await ProductModel.updateOne({ _id: id }, { $set: data, ...(unset && { $unset: unset }) });
  if (!res.matchedCount) return fail("Not found.", 404);
  revalidateTag("catalog", { expire: 0 });
  return ok();
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found.", 404);
  const { ProductModel } = await import("@/models/Product");
  await ProductModel.deleteOne({ _id: id }); // past orders keep their own item snapshot
  revalidateTag("catalog", { expire: 0 });
  return ok();
}
