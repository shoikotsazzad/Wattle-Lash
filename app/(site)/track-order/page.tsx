import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/Container";
import { TrackOrderForm } from "@/components/TrackOrderForm";

export const metadata = buildMetadata("trackOrder");

export default function TrackOrderPage() {
  return (
    <>
      <PageHeader eyebrow="Help" title="Track your order" intro="Enter your order number and the email you used at checkout." />
      <section className="py-12 md:py-16">
        <Container narrow><TrackOrderForm /></Container>
      </section>
    </>
  );
}
