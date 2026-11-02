import { buildMetadata } from "@/lib/seo";
import { getBestsellers, toCard } from "@/lib/catalog";
import { Container, PageHeader } from "@/components/Container";
import { ShopBrowser } from "@/components/ShopBrowser";

export const metadata = buildMetadata("bestsellers");

export default async function BestsellersPage() {
  const products = await getBestsellers();
  return (
    <>
      <PageHeader eyebrow="Our bestsellers" title="Bestsellers" intro="The lashes, serums, glues and tools our customers reorder most." />
      <section className="py-10 md:py-14">
        <Container>
          <ShopBrowser products={products.map(toCard)} />
        </Container>
      </section>
    </>
  );
}
