import { pages } from "@/data/pages";
import { terms } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export const metadata = buildMetadata("terms");

export default function Page() {
  return <LegalPage title={pages.terms.title} sections={terms} />;
}
