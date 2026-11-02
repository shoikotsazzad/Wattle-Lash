import { Suspense } from "react";
import { OrdersList } from "@/components/admin/OrdersList";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersList />
    </Suspense>
  );
}
