import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/Container";
import { CartView } from "@/components/CartView";

export const metadata = buildMetadata("cart", { noindex: true });

export default function CartPage() {
  return (
    <>
      <PageHeader title="Your cart" narrow />
      <section className="py-10 md:py-14">
        <Container narrow><CartView /></Container>
      </section>
    </>
  );
}
