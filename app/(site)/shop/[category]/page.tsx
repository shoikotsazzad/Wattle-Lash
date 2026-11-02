import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getByCategory, getCategories, getCategory, toCard } from "@/lib/catalog";
import { categoryList } from "@/data/categories";
import { Container, PageHeader } from "@/components/Container";
import { ShopBrowser } from "@/components/ShopBrowser";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return categoryList.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const c = await getCategory(category);
  if (!c) return buildMetadata(null, { title: "Not found", noindex: true });
  return buildMetadata(null, { title: `${c.name} | Shop Online Australia`, description: `${c.description} Prices include GST. Free shipping over $100.`, path: `/shop/${c.slug}`, image: c.image });
}

async function CategoryContent({ params }: Pick<PageProps<"/shop/[category]">, "params">) {
  const { category } = await params;
  const [c, products, categories] = await Promise.all([getCategory(category), getByCategory(category), getCategories()]);
  if (!c) notFound();
  return (
    <>
      <PageHeader eyebrow="Collection" title={c.name} intro={c.description} />
      <section className="py-10 md:py-14">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: c.name, path: `/shop/${c.slug}` }]} />
          <div className="mt-6">
            <ShopBrowser products={products.map(toCard)} categories={categories} activeCategory={c.slug} />
          </div>
        </Container>
      </section>
    </>
  );
}

export default function CategoryPage(props: PageProps<"/shop/[category]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-surface" />}>
      <CategoryContent params={props.params} />
    </Suspense>
  );
}
