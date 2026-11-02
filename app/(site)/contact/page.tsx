import { site } from "@/data/site";
import { pages } from "@/data/pages";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export const metadata = buildMetadata("contact");

export default function ContactPage() {
  const a = site.address;
  const items = [
    { label: "Call", value: site.phoneDisplay, href: `tel:${site.phone}` },
    { label: "Mobile", value: site.mobileDisplay, href: `tel:${site.mobile}` },
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Orders", value: site.ordersEmail, href: `mailto:${site.ordersEmail}` },
    { label: "Address", value: `${a.street}, ${a.suburb} ${a.state} ${a.postcode}` },
    { label: "Social", value: site.socials.map((s) => s.name).join(" · ") },
  ];
  return (
    <section className="py-14 md:py-20">
      <Container narrow className="grid gap-12 md:grid-cols-2 md:gap-14 lg:gap-20">
        <div>
          <p className="eyebrow text-muted">Contact</p>
          <h1 className="mt-3 font-serif text-[40px] leading-[1.05] md:text-[52px]">{pages.contact.heading}</h1>
          <p className="mt-4 max-w-sm text-muted">{pages.contact.intro}</p>
          <dl className="mt-10 border-t border-line text-sm">
            {items.map((it) => (
              <div key={it.label} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 border-b border-line py-3">
                <dt className="text-muted">{it.label}</dt>
                <dd className="break-words">{it.href ? <a href={it.href} className="hover:text-mauve">{it.value}</a> : it.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ContactForm />
      </Container>
    </section>
  );
}
