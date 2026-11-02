"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { useCart } from "./StoreProvider";
import { BagIcon, ChevronIcon, SearchIcon, UserIcon } from "./Icons";

type Cat = { slug: string; name: string };

export function Header({ categories }: { categories: Cat[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const overHero = pathname === "/";

  // Panels are "open on" a path so they close automatically on navigation.
  const [panel, setPanel] = useState<{ name: "mega" | "search"; on: string } | null>(null);
  const open = (name: "mega" | "search") => panel?.name === name && panel.on === pathname;
  const toggle = (name: "mega" | "search") => setPanel(open(name) ? null : { name, on: pathname });
  const close = () => setPanel(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const anyOpen = open("mega") || open("search");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    if (open("search")) searchRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  });

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    close();
  }

  const iconBtn = "relative grid h-11 w-11 place-items-center transition hover:text-pink";
  const solid = !overHero || anyOpen;

  return (
    <header className={`${overHero ? "absolute inset-x-0 top-9" : "sticky top-0"} z-40 text-cream ${solid ? "bg-espresso" : "bg-transparent"} transition-colors`}>
      <nav aria-label="Main" className="px-5 md:px-10 lg:px-12 mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center lg:h-24">
        {/* Left: nav (desktop only; phones and tablets use the bottom bar) */}
        <div className="flex items-center">
          <ul className="hidden items-center gap-4 lg:flex xl:gap-6">
            {site.nav.map((item) =>
              item.mega ? (
                <li key="mega">
                  <button type="button" className="eyebrow flex min-h-11 items-center gap-1 text-[11px] hover:text-pink xl:text-xs" aria-expanded={open("mega")} aria-controls="mega-menu" onClick={() => toggle("mega")}>
                    {item.label}
                    <ChevronIcon className={`h-3.5 w-3.5 transition ${open("mega") ? "rotate-180" : ""}`} />
                  </button>
                </li>
              ) : (
                <li key={item.label}>
                  <Link href={item.href} className="eyebrow flex min-h-11 items-center text-[11px] hover:text-pink xl:text-xs" aria-current={pathname === item.href ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Centre: wordmark */}
        <Link href="/" className="flex flex-col items-center text-center leading-none" aria-label={`${site.name} home`}>
          <span className="display text-[22px] tracking-[0.06em] sm:text-[26px] lg:text-[28px] xl:text-[32px]">Wattle &amp; Lash</span>
          <span className="mt-1 text-[8px] tracking-[0.42em] uppercase lg:mt-1.5 lg:text-[10px]">{site.wordmarkSub}</span>
        </Link>

        {/* Right: icons (desktop; the bottom bar has them below lg) */}
        <div className="-mr-2 hidden items-center justify-end lg:flex">
          <button type="button" className={iconBtn} aria-label="Search" aria-expanded={open("search")} onClick={() => toggle("search")}>
            <SearchIcon />
          </button>
          <Link href="/account" className={iconBtn} aria-label="Account">
            <UserIcon />
          </Link>
          <Link href="/cart" className={iconBtn} aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
            <BagIcon />
            {count > 0 && (
              <span className="absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-pink px-1 text-[10px] font-medium text-ink">{count}</span>
            )}
          </Link>
        </div>
      </nav>

      {/* Search panel */}
      {open("search") && (
        <div className="border-t border-cream/15 bg-espresso">
          <form role="search" onSubmit={onSearch} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
            <SearchIcon className="h-5 w-5 shrink-0 opacity-70" />
            <label htmlFor="site-search" className="sr-only">Search products</label>
            <input ref={searchRef} id="site-search" name="q" type="search" placeholder="Search lashes, serums, brow gel…" className="min-h-12 w-full border-b border-cream/40 bg-transparent font-serif text-2xl text-cream placeholder:text-cream/50 focus:border-pink focus:outline-none" />
            <button type="submit" className="btn btn-pink shrink-0">Search</button>
          </form>
        </div>
      )}

      {/* Collections mega menu (desktop) */}
      {open("mega") && (
        <div id="mega-menu" className="hidden border-t border-cream/15 bg-espresso lg:block">
          <div className="mx-auto grid max-w-6xl grid-cols-4 gap-8 px-6 py-10">
            <div>
              <p className="eyebrow text-pink">Shop</p>
              <ul className="mt-4 space-y-3 font-serif text-xl">
                <li><Link href="/shop" className="hover:text-pink">Shop all</Link></li>
                <li><Link href="/bestsellers" className="hover:text-pink">Bestsellers</Link></li>
                <li><Link href="/shop/gift-sets-and-bundles" className="hover:text-pink">Gift sets</Link></li>
              </ul>
            </div>
            <ul className="col-span-3 grid grid-cols-3 gap-x-8 gap-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/shop/${c.slug}`} className="text-cream/85 hover:text-pink">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export function AnnouncementBar() {
  return (
    <div className="flex h-9 items-center justify-center bg-night px-4 text-center text-cream">
      <p className="eyebrow text-[10px] sm:text-[11px]">{site.announcement}</p>
    </div>
  );
}
