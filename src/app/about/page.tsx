import type { Metadata } from "next";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "About",
  description: "Software engineer and designer at Carnegie Mellon.",
};

const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind",
  "Python",
  "PostgreSQL",
  "Figma",
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-wide flex-1 px-6 md:px-10">
      {/* Document-header strip */}
      <div className="flex items-center justify-between border-b border-border py-4 font-mono text-xs uppercase tracking-widest text-subtle">
        <span>About</span>
        <span>Profile</span>
      </div>

      <div className="grid gap-12 py-section md:grid-cols-[18rem_1fr] md:gap-16">
        {/* Portrait slot — styled like a dossier ID photo */}
        <div className="md:pt-2">
          <div className="flex aspect-[4/5] items-center justify-center rounded-lg border border-border bg-surface-2">
            {/* Replace with: <Image src="/portrait.jpg" ... fill className="rounded-lg object-cover" /> */}
            <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-subtle">
              Portrait
            </span>
          </div>
          <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-widest text-subtle">
            Fig. 01 — Jonathan Gong
          </p>
        </div>

        {/* Prose */}
        <div className="max-w-content">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
            I build software that sweats the details most products skip.
          </h1>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted">
            <p>
              I&apos;m Jonathan, a software engineer and designer studying
              computer science at Carnegie Mellon. I&apos;m drawn to the parts
              of a product that usually get treated as afterthoughts — the empty
              states, the loading moments, the exact words on a button — because
              that&apos;s where it either earns someone&apos;s trust or loses it.
            </p>
            <p>
              I move between engineering and design instead of picking one. A
              typeface choice and a database schema feel like the same kind of
              decision to me: both are about making something legible. The work
              I like best is the kind I can hold end to end, from the data model
              to the last pixel.
            </p>
            <p>
              Right now I&apos;m focused on developer tools and interfaces that
              respect the people using them. When I&apos;m not building,
              I&apos;m usually reading, taking apart a design I admire, or
              writing about what I learn along the way.
            </p>
          </div>

          {/* Stack */}
          <div className="mt-10">
            <p className="font-mono text-xs uppercase tracking-widest text-subtle">
              Currently working with
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <Button href="mailto:jonathan@example.com" variant="secondary">
              Get in touch
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
