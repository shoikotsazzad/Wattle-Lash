import { Suspense } from "react";
import { ProductsList } from "@/components/admin/ProductsList";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return <Suspense><ProductsList /></Suspense>;
}
