import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/Container";
import { AddressBook } from "@/components/AccountViews";

export const metadata = buildMetadata(null, { title: "Saved addresses", path: "/account/addresses", noindex: true });

export default function AddressesPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Saved addresses" />
      <section className="py-12 md:py-16">
        <Container className="max-w-3xl">
          <Link href="/account" className="link-arrow mb-8 text-[11px]">Back to account</Link>
          <div className="mt-8"><AddressBook /></div>
        </Container>
      </section>
    </>
  );
}
