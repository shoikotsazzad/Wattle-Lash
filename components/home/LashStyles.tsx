import Image from "next/image";
import Link from "next/link";
import { home } from "@/data/home";
import { Container } from "../Container";
import { TextLink } from "../Button";
import { BrushUnderline, DoodleHeart } from "../Doodles";

export function LashStyles({ slugs }: { slugs: Record<string, string> }) {
  const l = home.lashStyles;
  return (
    <section className="py-16 md:py-20">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)] lg:items-center">
        <div>
          <p className="eyebrow text-muted">{l.eyebrow}</p>
          <h2 className="display relative mt-4 inline-block text-[36px] whitespace-nowrap md:text-[44px]">
            {l.heading[0]}
            <br />
            <span className="relative inline-block">
              {l.heading[1]}
              <BrushUnderline className="absolute -bottom-2 left-0 h-3 w-full text-pink" />
            </span>
            <DoodleHeart className="absolute -right-12 bottom-0 h-8 w-8 text-ink max-[359px]:hidden" />
          </h2>
          <p className="mt-6 max-w-xs text-sm text-muted">{l.text}</p>
          <TextLink href={l.link.href} className="mt-8">{l.link.label}</TextLink>
        </div>

        <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
          {l.items.map((s) => (
            <li key={s.label} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <Link href={slugs[s.sku] ? `/product/${slugs[s.sku]}` : l.link.href} className="group block text-center">
                <div className="relative aspect-[4/3] overflow-hidden bg-rose">
                  <Image src={s.image} alt={`${s.label} lash look`} fill sizes="(min-width: 640px) 22vw, 72vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <p className="eyebrow mt-4">{s.label}</p>
                <p className="mt-1 text-xs text-muted">{s.sub}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
