import Button from "@/components/Button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Document-header strip — the audit/dossier signature */}
      <div className="mx-auto w-full max-w-wide px-6 md:px-10">
        <div className="flex items-center justify-between border-b border-border py-4 font-mono text-xs uppercase tracking-widest text-subtle">
          <span>Portfolio — 2026</span>
          <span>Carnegie Mellon</span>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-wide flex-1 flex-col justify-center px-6 py-section md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Software Engineer · Designer
        </p>

        <h1 className="mt-6 text-6xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-8xl">
          Jonathan
          <br />
          Gong
        </h1>

        <p className="mt-10 max-w-content text-xl leading-relaxed text-muted md:text-2xl">
          I build careful software — the kind where the details are the point,
          not a polish pass at the end.
        </p>

        <div className="mt-12">
          <Button href="/projects">View work</Button>
        </div>
      </section>
    </main>
  );
}
