import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { pages, sitemapPages } from "@/data/pages";
import { getCatalog } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products } = await getCatalog();
  const url = (path: string) => new URL(path, site.url).toString();
  return [
    ...sitemapPages.map((k) => ({ url: url(pages[k].path), changeFrequency: "weekly" as const, priority: k === "home" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: url(`/shop/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: url(`/product/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
