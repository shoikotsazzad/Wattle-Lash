import Image from "next/image";
import Link from "next/link";
import { pages } from "@/data/pages";
import { categorySeed } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export const metadata = buildMetadata("about");

export default function AboutPage() {
  const p = pages.about;
  return (
    <>
      <section className="pt-14 pb-10 md:pt-20 md:pb-14">
        <Container className="grid gap-5 md:grid-cols-[1fr_3fr] md:gap-10">
          <p className="eyebrow text-muted">{p.eyebrow}</p>
          <div>
            <h1 className="max-w-3xl font-serif text-[34px] leading-[1.1] md:text-[52px]">{p.heading}</h1>
            <p className="mt-5 max-w-xl text-muted">{p.intro}</p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="relative aspect-[4/3] overflow-hidden bg-rose md:aspect-[21/9]">
          <Image src={p.image} alt={p.imageAlt} fill priority sizes="(min-width: 1152px) 1056px, 100vw" className="object-cover object-[center_35%]" />
        </div>
      </Container>

      <section className="py-12 md:py-16">
        <Container>
          <ul className="grid gap-8 md:grid-cols-3 md:gap-10">
            {p.highlights.map((h) => (
              <li key={h.title} className="border-t border-ink pt-4">
                <h2 className="font-serif text-2xl">{h.title}</h2>
                <p className="mt-2 text-sm text-muted">{h.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-16 md:pb-20">
        <Container className="grid gap-6 md:grid-cols-[1fr_3fr] md:gap-10">
          <h2 className="eyebrow text-muted">What we stock</h2>
          <div>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {categorySeed.map((c) => (
                <li key={c.slug} className="border-b border-line">
                  <Link href={`/shop/${c.slug}`} className="flex min-h-11 items-center hover:text-mauve">{c.name}</Link>
                </li>
              ))}
            </ul>
            <Button href="/shop" className="mt-8">Shop the range</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
