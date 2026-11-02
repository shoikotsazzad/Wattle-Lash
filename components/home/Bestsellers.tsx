import { home } from "@/data/home";
import type { ProductCardData } from "@/lib/catalog";
import { Container } from "../Container";
import { TextLink } from "../Button";
import { DoodleHeart } from "../Doodles";
import { ProductCard } from "../ProductCard";

export function Bestsellers({ products }: { products: ProductCardData[] }) {
  const b = home.bestsellers;
  return (
    <section className="pb-16 md:pb-20">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3.2fr)] lg:items-center lg:gap-12">
        <div className="relative">
          <p className="eyebrow text-muted">{b.eyebrow}</p>
          <h2 className="mt-4 max-w-[12ch] font-serif text-[40px] leading-[1.05] md:text-5xl">{b.heading}</h2>
          <DoodleHeart className="absolute top-10 right-0 h-14 w-14 rotate-12 text-mauve lg:top-auto lg:right-2 lg:-bottom-16" />
          <TextLink href={b.link.href} className="mt-8 lg:mt-16">{b.link.label}</TextLink>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-5">
          {products.map((p) => (
            <li key={p.sku}><ProductCard p={p} sizes="(min-width: 1024px) 18vw, (min-width: 768px) 25vw, 50vw" /></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
