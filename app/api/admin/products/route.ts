import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { escapeRegex, fail, ok, readJson } from "@/lib/api";
import { validateProduct } from "@/lib/adminValidate";

const PAGE = 30;

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const sp = new URL(request.url).searchParams;
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const f: Record<string, unknown> = {};
  const q = sp.get("q")?.trim();
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    f.$or = [{ name: rx }, { sku: rx }];
  }
  if (sp.get("category")) f.category = sp.get("category");
  if (sp.get("stock") === "low") f.stock = { $lte: 10 };
  if (sp.get("active") === "false") f.active = false;

  const { ProductModel } = await import("@/models/Product");
  const [products, total] = await Promise.all([
    ProductModel.find(f).sort({ sku: 1 }).skip((page - 1) * PAGE).limit(PAGE).lean(),
    ProductModel.countDocuments(f),
  ]);
  return ok({
    page,
    pages: Math.max(1, Math.ceil(total / PAGE)),
    total,
    products: products.map((p) => ({
      id: String(p._id),
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      bestseller: p.bestseller,
      vegan: p.vegan,
      active: p.active,
      image: p.images?.[0] ?? "",
    })),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { data, errors } = validateProduct(await readJson(request));
  if (Object.keys(errors).length) return fail("Please check the form.", 400, { errors });
  const { ProductModel } = await import("@/models/Product");
  if (await ProductModel.exists({ $or: [{ sku: String(data.sku) }, { slug: String(data.slug) }] })) {
    return fail("SKU or slug already in use.", 409, { errors: { sku: "SKU or slug already in use." } });
  }
  const p = await ProductModel.create(data as Record<string, never>);
  revalidateTag("catalog", { expire: 0 });
  return ok({ id: String(p._id) });
}
