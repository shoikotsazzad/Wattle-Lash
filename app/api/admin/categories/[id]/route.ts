import { isValidObjectId } from "mongoose";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";
import { str } from "@/lib/validate";

// Name, description, image and order are editable. The slug is fixed (it's in URLs and products).
export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/categories/[id]">) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found.", 404);
  const b = (await readJson(request)) ?? {};
  const set: Record<string, unknown> = {};
  if ("name" in b) {
    set.name = str(b.name, 80);
    if (!set.name) return fail("Name is required.", 400, { errors: { name: "Name is required." } });
  }
  if ("description" in b) set.description = str(b.description, 400);
  if ("image" in b) {
    const img = str(b.image, 500);
    if (img && !img.startsWith("https://res.cloudinary.com/") && !img.startsWith("/images/")) return fail("Use an uploaded image.");
    set.image = img;
  }
  if ("order" in b) set.order = Math.floor(Number(b.order)) || 0;
  const { CategoryModel } = await import("@/models/Category");
  await CategoryModel.updateOne({ _id: id }, { $set: set });
  revalidateTag("catalog", { expire: 0 });
  return ok();
}
