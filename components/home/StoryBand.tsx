import Image from "next/image";
import { home } from "@/data/home";
import { Button } from "../Button";
import { DoodleSparkle, Tape } from "../Doodles";

export function StoryBand() {
  const s = home.story;
  return (
    <section className="overflow-hidden bg-espresso text-cream">
      <div className="grid md:grid-cols-2 md:items-center lg:grid-cols-[1.15fr_1fr_0.9fr]">
        <div className="relative aspect-[16/10] md:aspect-auto md:h-full md:min-h-[340px]">
          <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw" className="object-cover object-[center_60%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent to-40% md:bg-gradient-to-l" />
        </div>

        <div className="px-5 md:px-10 lg:px-12 relative py-12 md:py-16 md:pr-6 md:pl-10 lg:pr-4">
          <h2 className="display text-[32px] md:text-[40px]">
            {s.heading[0]}
            <br />
            {s.heading[1]}
          </h2>
          <p className="mt-4 max-w-sm text-sm text-cream/80">{s.text}</p>
          <Button href={s.cta.href} className="mt-7">{s.cta.label}</Button>
          <DoodleSparkle className="absolute right-6 bottom-10 hidden h-9 w-9 text-cream md:block" />
        </div>

        <div className="relative mx-auto mb-14 flex h-64 w-full max-w-sm items-center justify-center md:col-span-2 md:mb-10 lg:col-span-1 lg:mb-0 lg:h-[340px]">
          {s.polaroids.map((p, i) => (
            <figure
              key={p.image}
              className={`absolute w-36 bg-white p-2 pb-7 shadow-[0_10px_30px_rgba(0,0,0,.35)] sm:w-40 ${i === 0 ? "left-[8%] -rotate-6" : "right-[8%] top-[18%] rotate-6"}`}
            >
              <div className="relative aspect-[4/5]">
                <Image src={p.image} alt={p.alt} fill sizes="160px" className="object-cover grayscale-[.3]" />
              </div>
              {i === 1 && <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-3" />}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
