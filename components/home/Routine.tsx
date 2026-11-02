import Link from "next/link";
import { home } from "@/data/home";
import { Container } from "../Container";
import { ArrowIcon } from "../Icons";

// New section 7: how-to steps, each linking to its category.
export function Routine() {
  const r = home.routine;
  return (
    <section className="bg-surface py-10 md:py-20">
      <Container>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-muted">{r.eyebrow}</p>
            <h2 className="mt-2 font-serif text-[26px] leading-tight md:mt-4 md:text-5xl">{r.heading}</h2>
          </div>
        </div>
        <ol className="mt-5 grid grid-cols-2 border-t border-l border-line md:mt-10 lg:grid-cols-4">
          {r.steps.map((s) => (
            <li key={s.n} className="flex flex-col border-r border-b border-line p-3.5 md:p-7">
              <span className="font-serif text-[28px] leading-none text-mauve md:text-6xl">{s.n}</span>
              <h3 className="display mt-2 text-lg md:mt-6 md:text-2xl">{s.title}</h3>
              <p className="mt-1 flex-1 text-xs leading-snug text-muted md:mt-2 md:text-sm md:leading-normal">{s.text}</p>
              <Link href={s.href} className="link-arrow mt-3 self-start text-[10px] tracking-[0.12em] hover:opacity-70 md:mt-6 md:text-[11px] md:tracking-[0.2em]">
                {s.link} <span className="hidden md:inline-flex"><ArrowIcon /></span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
