import { requireAdmin } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { CategoryModel } = await import("@/models/Category");
  const { ProductModel } = await import("@/models/Product");
  const [cats, counts] = await Promise.all([
    CategoryModel.find().sort({ order: 1 }).lean(),
    ProductModel.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$category", n: { $sum: 1 } } }]),
  ]);
  return ok({
    categories: cats.map((c) => ({
      id: String(c._id),
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      order: c.order,
      count: counts.find((x) => x._id === c.slug)?.n ?? 0,
    })),
  });
}
