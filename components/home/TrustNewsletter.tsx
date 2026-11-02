import { home } from "@/data/home";
import { Container } from "../Container";
import { trustIcons } from "../Icons";
import { NewsletterForm } from "../NewsletterForm";

// New section 9: trust strip + "Join the list" band.
export function TrustNewsletter() {
  const n = home.newsletter;
  return (
    <>
      <section aria-label="Why shop with us" className="border-t border-line">
        <Container>
          <ul className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {home.trust.map((t) => {
              const Icon = trustIcons[t.icon as keyof typeof trustIcons];
              return (
                <li key={t.title} className="flex gap-4 py-7 sm:px-2 lg:px-6 lg:first:pl-0">
                  <Icon className="h-7 w-7 shrink-0 text-mauve" />
                  <div>
                    <p className="eyebrow text-[11px]">{t.title}</p>
                    <p className="mt-1.5 text-sm text-muted">{t.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="border-b border-cream/15 bg-espresso py-10 text-center text-cream md:py-12 lg:text-left">
        <Container className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <p className="eyebrow text-[11px] text-pink">{n.eyebrow}</p>
            <h2 className="mx-auto mt-2 max-w-md font-serif text-[26px] leading-tight md:text-[32px] lg:mx-0">{n.heading}</h2>
          </div>
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <NewsletterForm />
            <p className="mt-3 text-xs text-cream/60">{n.text}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
