import type { Metadata } from "next";
import ProjectCard, { type Project } from "@/components/ProjectCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected software and design work.",
};

// Reads the database at request time — don't statically prerender at build.
export const dynamic = "force-dynamic";

// Server Component — reads the database directly, no useEffect or loading state.
export default async function ProjectsPage() {
  const rows = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  // Map the DB model onto the ProjectCard's display shape.
  const projects: Project[] = rows.map((p) => ({
    title: p.title,
    description: p.description,
    href: p.liveUrl ?? p.githubUrl ?? "#",
    tags: p.techStack,
    year: String(p.createdAt.getFullYear()),
    image: p.imageUrl ?? undefined,
  }));

  return (
    <main className="mx-auto w-full max-w-wide flex-1 px-6 md:px-10">
      {/* Document-header strip */}
      <div className="flex items-center justify-between border-b border-border py-4 font-mono text-xs uppercase tracking-widest text-subtle">
        <span>Projects</span>
        <span>{String(projects.length).padStart(2, "0")} entries</span>
      </div>

      <header className="py-section pb-12">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          Selected work
        </h1>
        <p className="mt-6 max-w-content text-xl leading-relaxed text-muted">
          A short catalog of things I&apos;ve designed and built — tools I
          wanted to exist, made carefully.
        </p>
      </header>

      <div className="grid gap-6 pb-section sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} index={i + 1} {...project} />
        ))}
      </div>
    </main>
  );
}
