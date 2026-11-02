import { Suspense } from "react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { AccountOrder } from "@/components/AccountViews";

export const metadata = buildMetadata(null, { title: "Order details", noindex: true });

export function generateStaticParams() {
  return [{ orderNo: "WL-000000-0000" }]; // placeholder; real orders render at request time
}

async function Content({ params }: Pick<PageProps<"/account/orders/[orderNo]">, "params">) {
  const { orderNo } = await params;
  return (
    <>
      <h1 className="display mt-6 mb-4 text-[34px]">Order {orderNo}</h1>
      <AccountOrder orderNo={orderNo} />
    </>
  );
}

export default function AccountOrderPage(props: PageProps<"/account/orders/[orderNo]">) {
  return (
    <section className="py-12 md:py-16">
      <Container narrow>
        <Link href="/account" className="link-arrow text-[11px]">Back to account</Link>
        <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}>
          <Content params={props.params} />
        </Suspense>
      </Container>
    </section>
  );
}
