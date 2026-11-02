import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { CheckoutView } from "@/components/CheckoutView";

export const metadata = buildMetadata("checkout", { noindex: true });

export default function CheckoutPage() {
  return (
    <section className="py-10 md:py-14">
      <Container narrow>
        <h1 className="display mb-8 text-[34px] md:text-[44px]">Checkout</h1>
        <CheckoutView />
      </Container>
    </section>
  );
}
