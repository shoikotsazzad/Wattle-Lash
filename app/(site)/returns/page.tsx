import { pages } from "@/data/pages";
import { returnsPolicy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export const metadata = buildMetadata("returns");

export default function Page() {
  return <LegalPage title={pages.returns.title} sections={returnsPolicy} />;
}
