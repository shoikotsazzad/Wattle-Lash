import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/Container";
import { AccountHome } from "@/components/AccountViews";

export const metadata = buildMetadata(null, { title: "My account", path: "/account", noindex: true });

export default function AccountPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="My account" />
      <section className="py-12 md:py-16"><Container narrow><AccountHome /></Container></section>
    </>
  );
}
