import Link from "next/link";

// Rendered outside the (site) layout, so it carries its own minimal header.
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-espresso px-4 py-24 text-center text-cream">
      <Link href="/" className="display text-3xl tracking-[0.06em]">Wattle &amp; Lash</Link>
      <p className="eyebrow mt-16 text-pink">404</p>
      <h1 className="display mt-3 text-[38px] md:text-[56px]">Page not found</h1>
      <p className="mt-4 text-cream/75">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-pink">Go home</Link>
        <Link href="/shop" className="btn btn-outline">Shop all</Link>
      </div>
    </main>
  );
}
