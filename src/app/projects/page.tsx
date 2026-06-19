import type { Metadata } from "next";
import ProjectCard, { type Project } from "@/components/ProjectCard";
import SystemBar from "@/components/SystemBar";
import ParallaxProvider from "@/components/parallax/ParallaxProvider";
import ScrollParallax from "@/components/parallax/ScrollParallax";
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
      <SystemBar
        left="Projects"
        right={`${String(projects.length).padStart(2, "0")} entries`}
      />

      <ParallaxProvider>
        <header className="py-section pb-12">
          <ScrollParallax speed={0.12} clamp={60}>
            <h1 className="font-display text-5xl font-extrabold uppercase tracking-tighter text-foreground sm:text-6xl md:text-8xl">
              Selected work
            </h1>
          </ScrollParallax>
          <p className="mt-6 max-w-content text-xl leading-snug text-muted">
            A short catalog of things I&apos;ve designed and built — tools I
            wanted to exist, made carefully.
          </p>
        </header>

        <div className="grid gap-6 pb-section sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ScrollParallax
              key={project.title}
              speed={0.04 + (i % 3) * 0.035}
              clamp={40}
              className="h-full"
            >
              <ProjectCard index={i + 1} {...project} />
            </ScrollParallax>
          ))}
        </div>
      </ParallaxProvider>
    </main>
  );
}
