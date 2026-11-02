import Image from "next/image";
import Link from "next/link";
import { home } from "@/data/home";
import { ArrowIcon } from "../Icons";
import { Container } from "../Container";

export function Collections() {
  const c = home.collections;
  return (
    <section className="py-16 md:py-20">
      <Container>
        <h2 className="eyebrow text-center text-[13px]">{c.eyebrow}</h2>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {c.items.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="group relative block aspect-[6/5] overflow-hidden bg-mauve text-cream">
                <Image src={item.image} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#5a2f38]/75 via-mauve/25 to-transparent" />
                <span className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5">
                  <span className="display block text-2xl md:text-[28px]">{item.title}</span>
                  <span className="mt-1.5 flex items-center gap-2 text-xs">
                    Shop now <ArrowIcon />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
