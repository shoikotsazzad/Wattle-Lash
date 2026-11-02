import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { getProducts, toCard } from "@/lib/catalog";
import { Container } from "@/components/Container";
import { SearchResults } from "@/components/SearchResults";

export const metadata = buildMetadata("search", { noindex: true });

export default async function SearchPage() {
  const products = (await getProducts()).map(toCard);
  return (
    <section className="py-12 md:py-16">
      <Container>
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <SearchResults products={products} />
        </Suspense>
      </Container>
    </section>
  );
}
