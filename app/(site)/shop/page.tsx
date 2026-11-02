import { buildMetadata } from "@/lib/seo";
import { getCatalog, toCard } from "@/lib/catalog";
import { Container, PageHeader } from "@/components/Container";
import { ShopBrowser } from "@/components/ShopBrowser";

export const metadata = buildMetadata("shop");

export default async function ShopPage() {
  const { products, categories } = await getCatalog();
  return (
    <>
      <PageHeader eyebrow="Shop" title="All products" intro="Lashes, brows and eye care. Every price includes GST." />
      <section className="py-10 md:py-14">
        <Container>
          <ShopBrowser products={products.map(toCard)} categories={categories} />
        </Container>
      </section>
    </>
  );
}
