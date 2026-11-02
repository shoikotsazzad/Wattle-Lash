import Link from "next/link";
import { ArrowIcon } from "./Icons";

type Props = { href: string; children: React.ReactNode; variant?: "pink" | "dark" | "outline"; arrow?: boolean; className?: string };

/** Square tracked-uppercase button with arrow (reference style). */
export function Button({ href, children, variant = "pink", arrow = true, className = "" }: Props) {
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowIcon />}
    </>
  );
  return /^(https?:|mailto:|tel:)/.test(href) ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link-arrow hover:opacity-70 ${className}`}>
      {children}
      <ArrowIcon />
    </Link>
  );
}
