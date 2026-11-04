export function Container({ children, className = "", narrow = false }: { children: React.ReactNode; className?: string; narrow?: boolean }) {
  const width = className.includes("max-w-") ? "" : narrow ? "max-w-5xl" : "max-w-[1760px]";
  return <div className={`px-5 md:px-10 lg:px-12 mx-auto w-full ${width} ${className}`}>{children}</div>;
}

export function PageHeader({ title, intro, eyebrow, narrow }: { title: string; intro?: string; eyebrow?: string; narrow?: boolean }) {
  return (
    <section className="border-b border-line bg-surface py-9 md:py-12">
      <Container narrow={narrow}>
        {eyebrow && <p className="eyebrow text-muted">{eyebrow}</p>}
        <h1 className="display mt-2 text-[32px] md:text-[44px]">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
      </Container>
    </section>
  );
}
