import "dotenv/config";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const POSTS_DIR = join(process.cwd(), "content", "posts");

type Frontmatter = {
  title: string;
  date: string;
  excerpt: string;
  published: boolean;
};

// Minimal frontmatter parser for our simple `key: "value"` / `key: true` files.
function parsePost(raw: string): { frontmatter: Frontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error("Missing frontmatter block");

  const [, fm, body] = match;
  const data: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    // Strip surrounding double quotes if present.
    data[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
  }

  return {
    frontmatter: {
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      published: data.published !== "false",
    },
    body: body.trim(),
  };
}

async function main() {
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = readFileSync(join(POSTS_DIR, file), "utf8");
    const { frontmatter, body } = parsePost(raw);
    const publishedAt = frontmatter.published ? new Date(frontmatter.date) : null;

    // Upsert by slug so re-running is safe and won't create duplicates.
    await prisma.blogPost.upsert({
      where: { slug },
      create: {
        title: frontmatter.title,
        slug,
        excerpt: frontmatter.excerpt,
        content: body,
        published: frontmatter.published,
        publishedAt,
        // Keep original authoring date as createdAt so ordering is stable.
        createdAt: new Date(frontmatter.date),
      },
      update: {
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        content: body,
        published: frontmatter.published,
        publishedAt,
      },
    });
    console.log(`✓ ${slug}`);
  }

  console.log(`\nMigrated ${files.length} posts into BlogPost.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
