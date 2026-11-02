import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { OrderConfirmation } from "@/components/OrderConfirmation";

export const metadata = buildMetadata(null, { title: "Your order", noindex: true });

export function generateStaticParams() {
  return [{ orderNo: "WL-000000-0000" }]; // placeholder; real orders render at request time
}

async function Content({ params }: Pick<PageProps<"/order/[orderNo]">, "params">) {
  const { orderNo } = await params;
  return <OrderConfirmation orderNo={orderNo} />;
}

export default function OrderPage(props: PageProps<"/order/[orderNo]">) {
  return (
    <section className="py-12 md:py-16">
      <Container narrow>
        <Suspense fallback={<p className="py-12 text-center text-muted">Loading your order…</p>}>
          <Content params={props.params} />
        </Suspense>
      </Container>
    </section>
  );
}
