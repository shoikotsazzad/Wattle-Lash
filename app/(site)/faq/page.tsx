import { faq } from "@/data/faq";
import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildMetadata("faq");

export default function FaqPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <PageHeader eyebrow="Help" title="FAQ" />
      <section className="py-14 md:py-20">
        <Container className="max-w-3xl">
          <div className="divide-y divide-line border-y border-line">
            {faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl">
                  {f.q}
                  <span aria-hidden className="text-2xl transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
