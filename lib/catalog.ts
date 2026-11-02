// Public catalogue reads. Cached and tagged "catalog"; admin edits and paid orders revalidate it.
// Without MONGODB_URI (or before `npm run seed`) the seed file is shown read-only.
import { cacheLife, cacheTag } from "next/cache";
import { connectDB, dbEnabled } from "@/lib/db";
import { categorySeed } from "@/data/categories";
import { slugify } from "@/lib/slug";
import { toCents } from "@/lib/money";
import type { CategoryView, ProductView } from "@/lib/types";
import seed from "@/notes/assets/products.json";

type Catalog = { categories: CategoryView[]; products: ProductView[]; source: "db" | "seed" };

const categoryImage = (slug: string, cats: { slug: string; image: string }[]) =>
  cats.find((c) => c.slug === slug)?.image || "/images/placeholder.svg";

// Each seeded product has its own stand-in photo; anything else falls back to the category photo.
const seededSkus = new Set(seed.products.map((p) => p.sku));
const standInImage = (sku: string, category: string, cats: { slug: string; image: string }[]) =>
  seededSkus.has(sku) ? `/images/products/${sku.toLowerCase()}.webp` : categoryImage(category, cats);

function withCounts(cats: Omit<CategoryView, "count">[], products: ProductView[]): CategoryView[] {
  return cats
    .map((c) => ({ ...c, count: products.filter((p) => p.category === c.slug).length }))
    .sort((a, b) => a.order - b.order);
}

function seedCatalog(): Catalog {
  const products: ProductView[] = seed.products.map((p, i) => ({
    id: p.sku,
    sku: p.sku,
    slug: slugify(p.name),
    category: p.category,
    name: p.name,
    description: p.description,
    size: p.size,
    price: toCents(p.price_aud),
    stock: p.stock_qty,
    bestseller: p.bestseller,
    vegan: p.vegan,
    images: [],
    image: standInImage(p.sku, p.category, categorySeed),
    // Stable fake ordering so "New in" has something to show before seeding.
    createdAt: new Date(Date.UTC(2026, 0, 1) + i * 60_000).toISOString(),
  }));
  return { categories: withCounts(categorySeed, products), products, source: "seed" };
}

export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  if (!dbEnabled()) return seedCatalog();
  try {
    await connectDB();
    const { CategoryModel } = await import("@/models/Category");
    const { ProductModel } = await import("@/models/Product");
    const [cats, prods] = await Promise.all([
      CategoryModel.find().sort({ order: 1 }).lean(),
      ProductModel.find({ active: true }).sort({ createdAt: 1 }).lean(),
    ]);
    if (!prods.length) return seedCatalog();

    const categories = cats.length
      ? cats.map((c) => ({ slug: c.slug, name: c.name, description: c.description ?? "", image: c.image || categoryImage(c.slug, categorySeed), order: c.order ?? 0 }))
      : categorySeed;

    const products: ProductView[] = prods.map((p) => ({
      id: String(p._id),
      sku: p.sku,
      slug: p.slug,
      category: p.category,
      name: p.name,
      description: p.description ?? "",
      size: p.size ?? "",
      price: p.price,
      ...(p.compareAtPrice ? { compareAtPrice: p.compareAtPrice } : {}),
      stock: p.stock ?? 0,
      bestseller: Boolean(p.bestseller),
      vegan: Boolean(p.vegan),
      images: p.images ?? [],
      image: p.images?.[0] || standInImage(p.sku, p.category, categories),
      createdAt: (p.createdAt as Date).toISOString(),
    }));
    return { categories: withCounts(categories, products), products, source: "db" };
  } catch (err) {
    console.error("Catalog load failed, showing seed data", err);
    return seedCatalog();
  }
}

export async function getCategories() {
  return (await getCatalog()).categories;
}

export async function getProducts() {
  return (await getCatalog()).products;
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProductsBySku(skus: string[]) {
  const all = await getProducts();
  return skus.map((s) => all.find((p) => p.sku === s)).filter((p): p is ProductView => Boolean(p));
}

export async function getBestsellers(limit?: number) {
  const list = (await getProducts()).filter((p) => p.bestseller);
  return limit ? list.slice(0, limit) : list;
}

export async function getNewest(limit: number) {
  return [...(await getProducts())].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export async function getByCategory(slug: string) {
  return (await getProducts()).filter((p) => p.category === slug);
}

export async function getRelated(product: ProductView, limit = 4) {
  return (await getByCategory(product.category)).filter((p) => p.sku !== product.sku).slice(0, limit);
}

/** Trimmed fields for client-side grids/search (keeps the payload small). */
export type ProductCardData = Pick<ProductView, "sku" | "slug" | "name" | "category" | "size" | "price" | "compareAtPrice" | "image" | "vegan" | "stock" | "bestseller" | "createdAt">;
export const toCard = (p: ProductView): ProductCardData => ({
  sku: p.sku,
  slug: p.slug,
  name: p.name,
  category: p.category,
  size: p.size,
  price: p.price,
  compareAtPrice: p.compareAtPrice,
  image: p.image,
  vegan: p.vegan,
  stock: p.stock,
  bestseller: p.bestseller,
  createdAt: p.createdAt,
});
