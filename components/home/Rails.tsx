"use client";

import Image from "next/image";
import { useState } from "react";
import { home } from "@/data/home";
import type { ProductCardData } from "@/lib/catalog";
import { Container } from "../Container";
import { Button } from "../Button";
import { ProductCard } from "../ProductCard";

// New section 8: "New in" / "Gift sets" tabs beside a gift banner.
export function Rails({ lists }: { lists: Record<string, ProductCardData[]> }) {
  const r = home.rails;
  const [tab, setTab] = useState(r.tabs[0].key);
  const g = r.giftBanner;

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="eyebrow text-muted">{r.eyebrow}</p>
          <div role="tablist" aria-label="Product lists" className="flex gap-6">
            {r.tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={tab === t.key}
                aria-controls="rail-panel"
                onClick={() => setTab(t.key)}
                className={`font-serif text-2xl md:text-3xl ${tab === t.key ? "border-b border-ink" : "text-muted hover:text-ink"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          <div className="relative flex min-h-[340px] flex-col justify-end overflow-hidden bg-rose p-6 text-cream">
            <Image src={g.image} alt={g.imageAlt} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4a2730]/85 via-mauve/30 to-transparent" />
            <div className="relative">
              <p className="eyebrow text-[11px]">{g.eyebrow}</p>
              <p className="display mt-2 text-3xl">{g.heading}</p>
              <p className="mt-2 text-sm text-cream/85">{g.text}</p>
              <Button href={g.cta.href} className="mt-5 gap-2 px-5 lg:w-full lg:px-3">{g.cta.label}</Button>
            </div>
          </div>
          <ul id="rail-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:col-span-3 lg:grid-cols-3 lg:[&>li:nth-child(n+4)]:hidden">
            {(lists[tab] ?? []).map((p) => (
              <li key={p.sku}><ProductCard p={p} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 25vw, 50vw" /></li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
