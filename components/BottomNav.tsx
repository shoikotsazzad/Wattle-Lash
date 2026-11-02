"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./StoreProvider";
import { BagIcon, GridIcon, HomeIcon, SearchIcon, UserIcon } from "./Icons";

const items = [
  { label: "Home", href: "/", Icon: HomeIcon, match: (p: string) => p === "/" },
  { label: "Shop", href: "/shop", Icon: GridIcon, match: (p: string) => /^\/(shop|product|bestsellers)/.test(p) },
  { label: "Search", href: "/search", Icon: SearchIcon, match: (p: string) => p.startsWith("/search") },
  { label: "Bag", href: "/cart", Icon: BagIcon, match: (p: string) => /^\/(cart|checkout)/.test(p) },
  { label: "Account", href: "/account", Icon: UserIcon, match: (p: string) => p.startsWith("/account") },
];

/** App-style bar on phones and tablets. Desktop uses the icons in the header. */
export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  return (
    <nav aria-label="Quick links" className="fixed inset-x-0 bottom-0 z-50 border-t border-cream/15 bg-espresso pb-[env(safe-area-inset-bottom)] text-cream lg:hidden">
      <ul className="mx-auto grid h-16 max-w-xl grid-cols-5">
        {items.map(({ label, href, Icon, match }) => {
          const on = match(pathname);
          return (
            <li key={label}>
              <Link href={href} aria-current={on ? "page" : undefined} className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] ${on ? "text-cream" : "text-cream/65"}`}>
                <span className={`relative grid h-7 w-12 place-items-center rounded-full transition ${on ? "bg-cream text-ink" : ""}`}>
                  <Icon className="h-5 w-5" />
                  {label === "Bag" && count > 0 && (
                    <span className="absolute -top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-pink px-1 text-[10px] leading-none font-medium text-ink">{count}</span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
