import { Suspense } from "react";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata = { title: "Edit product" };

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

async function Content({ params }: Pick<PageProps<"/admin/products/[id]">, "params">) {
  const { id } = await params;
  return <ProductEditor id={id} />;
}

export default function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  return <Suspense><Content params={props.params} /></Suspense>;
}
