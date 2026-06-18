import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const projects = [
  {
    title: "Portfolio Design System",
    description:
      "The editorial design-token system and component library behind this site — color, type, and spacing tokens built on Tailwind v4's CSS-first theming.",
    techStack: ["Next.js", "Tailwind", "TypeScript"],
    githubUrl: "https://github.com/jagong-cmu/portfolio",
    featured: true,
  },
  {
    title: "Marginalia",
    description:
      "A reading companion that turns scattered Kindle highlights into a searchable, cross-linked notebook — so the best lines don't disappear after you finish a book.",
    techStack: ["React", "Next.js", "PostgreSQL"],
    githubUrl: "https://github.com/jagong-cmu",
  },
  {
    title: "Cadence",
    description:
      "A terminal habit tracker built around honest streak math and quiet nudges instead of gamification. Fast to log, hard to game.",
    techStack: ["Python", "SQLite"],
    githubUrl: "https://github.com/jagong-cmu",
  },
];

async function main() {
  // Idempotent seed: start from a clean Project table.
  await prisma.project.deleteMany();
  await prisma.project.createMany({ data: projects });
  console.log(`Seeded ${projects.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
