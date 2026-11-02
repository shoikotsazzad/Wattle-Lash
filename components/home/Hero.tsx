import Image from "next/image";
import { home } from "@/data/home";
import { Button } from "../Button";

export function Hero() {
  const h = home.hero;
  return (
    <section className="relative isolate flex min-h-[600px] items-end overflow-hidden bg-espresso text-cream md:min-h-[640px] md:items-center">
      <Image src={h.image} alt={h.imageAlt} fill priority sizes="100vw" className="-z-10 object-cover object-[70%_center] md:object-right" />
      {/* Darken the left for text, keep the face on the right */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/30 md:bg-gradient-to-r md:from-espresso md:via-espresso/70 md:to-transparent" />
      <div className="px-5 md:px-10 lg:px-12 mx-auto w-full max-w-6xl pt-32 pb-14 md:pt-28 md:pb-0">
        <p className="eyebrow text-cream/90">{h.eyebrow}</p>
        <h1 className="display mt-5 text-[40px] md:text-[64px]">
          {h.heading[0]}
          <br />
          {h.heading[1]}
        </h1>
        <p className="mt-5 max-w-sm text-cream/85">{h.text}</p>
        <Button href={h.cta.href} className="mt-8">{h.cta.label}</Button>
      </div>
    </section>
  );
}
