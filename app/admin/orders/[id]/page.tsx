import { Suspense } from "react";
import { OrderEditor } from "@/components/admin/OrderEditor";

export const metadata = { title: "Order" };

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

async function Content({ params }: Pick<PageProps<"/admin/orders/[id]">, "params">) {
  const { id } = await params;
  return <OrderEditor id={id} />;
}

export default function AdminOrderPage(props: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense>
      <Content params={props.params} />
    </Suspense>
  );
}
