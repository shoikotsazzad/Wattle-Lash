import { pages } from "@/data/pages";
import { shippingPolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export const metadata = buildMetadata("shipping");

export default function Page() {
  return <LegalPage title={pages.shipping.title} sections={shippingPolicy} />;
}
