import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getCategory, getProductBySlug, getProducts, getRelated, toCard } from "@/lib/catalog";
import { formatAUD } from "@/lib/money";
import { patchTestCategories, supplementCategories } from "@/data/categories";
import { shipping } from "@/data/shipping";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { ProductJsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/AddToCart";
import { TruckIcon, TagIcon } from "@/components/Icons";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProductBySlug(slug);
  if (!p) return buildMetadata(null, { title: "Not found", noindex: true });
  return buildMetadata(null, {
    title: `${p.name} | ${formatAUD(p.price)}`,
    description: `${p.description} ${p.size ? `${p.size}. ` : ""}Free shipping over $100 Australia-wide.`,
    path: `/product/${p.slug}`,
    image: p.image,
  });
}

async function ProductContent({ params }: Pick<PageProps<"/product/[slug]">, "params">) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const [cat, related] = await Promise.all([getCategory(p.category), getRelated(p, 4)]);
  const gallery = p.images.length ? p.images : [p.image];
  const patchTest = patchTestCategories.includes(p.category) || /tint/i.test(p.name);
  const supplement = supplementCategories.includes(p.category);

  return (
    <>
      <ProductJsonLd p={p} categoryName={cat?.name ?? ""} />
      <section className="py-8 md:py-12">
        <Container>
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: cat?.name ?? "Shop", path: cat ? `/shop/${cat.slug}` : "/shop" }, { name: p.name, path: `/product/${p.slug}` }]} />

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-3">
              {gallery.map((src, i) => (
                <div key={src} className="tint relative aspect-[4/5] overflow-hidden bg-rose">
                  <Image src={src} alt={i === 0 ? p.name : ""} fill priority={i === 0} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>

            <div className="md:sticky md:top-20 md:self-start lg:top-28">
              <p className="eyebrow text-muted">{cat?.name}</p>
              <h1 className="display mt-3 text-[34px] md:text-[44px]">{p.name}</h1>
              <p className="mt-4 text-xl">
                {formatAUD(p.price)}
                {p.compareAtPrice && p.compareAtPrice > p.price && <s className="ml-3 text-base text-muted">{formatAUD(p.compareAtPrice)}</s>}
                <span className="ml-2 text-xs text-muted">incl. GST</span>
              </p>
              <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
                {p.size && (<div className="flex gap-1.5"><dt>Size:</dt><dd className="text-ink">{p.size}</dd></div>)}
                <div className="flex gap-1.5"><dt>SKU:</dt><dd className="text-ink">{p.sku}</dd></div>
                {p.vegan && <div><dd className="text-ink">Vegan</dd></div>}
              </dl>

              <p className="mt-6 leading-relaxed">{p.description}</p>

              <div className="mt-8">
                <AddToCart item={{ sku: p.sku, slug: p.slug, name: p.name, size: p.size, price: p.price, image: p.image }} stock={p.stock} />
              </div>

              <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
                <li className="flex gap-3"><TruckIcon className="h-5 w-5 shrink-0 text-mauve" />Free standard shipping on orders over {formatAUD(shipping.freeThreshold)}, otherwise {formatAUD(shipping.methods[0].price)} Australia-wide.</li>
                <li className="flex gap-3"><TagIcon className="h-5 w-5 shrink-0 text-mauve" />Price includes GST. Demo checkout: card or Afterpay, no real payment.</li>
              </ul>

              {(patchTest || supplement) && (
                <div className="mt-6 border border-line bg-surface p-4 text-sm">
                  {patchTest && <p><strong className="font-medium">Patch test first.</strong> Apply a small amount behind the ear or on the inner arm 24 hours before use. Professional products are intended for trained users. Not for use under 18.</p>}
                  {supplement && <p><strong className="font-medium">Always read the label</strong> and follow the directions for use. Supplements should not replace a balanced diet.</p>}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line py-14 md:py-16">
          <Container>
            <h2 className="font-serif text-3xl md:text-4xl">You may also like</h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-5">
              {related.map((r) => <li key={r.sku}><ProductCard p={toCard(r)} /></li>)}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <ProductContent params={props.params} />
    </Suspense>
  );
}
