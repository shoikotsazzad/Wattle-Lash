import Link from "next/link";
import { site } from "@/data/site";
import { Container } from "./Container";
import { MailIcon, PhoneIcon } from "./Icons";
import { Year } from "./Year";

/** Compact footer: centred on phones and tablets, a single row on desktop. */
export function Footer() {
  const chip = "inline-flex min-h-10 items-center gap-2 whitespace-nowrap border border-cream/25 px-3 text-[13px] text-cream/85 transition hover:border-pink hover:text-pink";
  return (
    <footer className="mt-auto bg-espresso pb-[calc(4rem+env(safe-area-inset-bottom))] text-center text-cream lg:pb-0 lg:text-left">
      <Container className="py-10 lg:py-9">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between lg:gap-10">
          <div className="shrink-0">
            <Link href="/" className="display text-2xl tracking-[0.06em]">{site.name}</Link>
            <p className="mt-1 text-xs text-cream/60">{site.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm lg:gap-x-3.5 lg:text-[13px] xl:gap-x-4">
              {site.footer.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="whitespace-nowrap text-cream/80 hover:text-pink">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="flex shrink-0 flex-wrap justify-center gap-2">
            <a href={`tel:${site.phone}`} className={chip}><PhoneIcon className="h-4 w-4" />{site.phoneDisplay}</a>
            <a href={`mailto:${site.email}`} className={chip}><MailIcon className="h-4 w-4" />Email us</a>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center gap-3 border-t border-cream/15 pt-5 text-xs text-cream/60 lg:flex-row lg:justify-between">
          <p>© <Year /> {site.name} · ABN {site.abn} · Prices in AUD incl. GST</p>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {site.socials.map((s) => (
              <li key={s.name}>
                {s.url ? <a href={s.url} target="_blank" rel="noopener" className="hover:text-pink">{s.name}</a> : <span title={`${s.name}: ${s.handle}`}>{s.name}</span>}
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap justify-center gap-1.5">
            {site.footer.payments.map((p) => <li key={p} className="border border-cream/20 px-2 py-0.5 text-[11px]">{p}</li>)}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
