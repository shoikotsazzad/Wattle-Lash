"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "../Icons";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/coupons", label: "Discount codes" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/users", label: "Admin users" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  if (pathname === "/admin/login") return <>{children}</>;

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined} className={`flex min-h-10 items-center px-3 text-sm ${active(n.href) ? "bg-cream/10 text-pink" : "text-cream/80 hover:text-cream"}`}>
          {n.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-blush md:flex-row">
      <aside className="bg-espresso text-cream md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:overflow-y-auto">
        <div className="flex h-16 items-center justify-between px-4 md:h-20">
          <Link href="/admin" className="leading-none">
            <span className="display block text-xl tracking-[0.06em]">Wattle &amp; Lash</span>
            <span className="text-[9px] tracking-[0.35em] text-pink uppercase">Admin</span>
          </Link>
          <button type="button" className="grid h-11 w-11 place-items-center md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpenOn(open ? null : pathname)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        <div className={`${open ? "block" : "hidden"} px-2 pb-4 md:block`}>
          {nav}
          <div className="mt-6 border-t border-cream/15 px-3 pt-4 text-sm">
            <Link href="/" className="block py-1.5 text-cream/70 hover:text-cream" target="_blank">View store ↗</Link>
            <button type="button" onClick={logout} className="py-1.5 text-cream/70 hover:text-cream">Log out</button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
