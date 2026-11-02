import Image from "next/image";
import Link from "next/link";
import { formatAUD } from "@/lib/money";
import type { ProductCardData } from "@/lib/catalog";

/** Product card: rose-tinted photo, name, price. */
export function ProductCard({ p, sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw", priority = false }: { p: ProductCardData; sizes?: string; priority?: boolean }) {
  const soldOut = p.stock <= 0;
  return (
    <article className="group">
      <Link href={`/product/${p.slug}`} className="tint relative block aspect-[4/5] overflow-hidden bg-rose">
        <Image src={p.image} alt="" fill sizes={sizes} priority={priority} className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        <span className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1">
          {p.vegan && <span className="bg-surface/90 px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase">Vegan</span>}
          {soldOut && <span className="bg-espresso px-2 py-0.5 text-[10px] tracking-[0.16em] text-cream uppercase">Sold out</span>}
        </span>
      </Link>
      <h3 className="mt-3 text-sm leading-snug">
        <Link href={`/product/${p.slug}`} className="hover:underline">{p.name}</Link>
      </h3>
      <p className="mt-1 text-sm">
        {formatAUD(p.price)}
        {p.compareAtPrice && p.compareAtPrice > p.price && <s className="ml-2 text-muted">{formatAUD(p.compareAtPrice)}</s>}
      </p>
    </article>
  );
}
