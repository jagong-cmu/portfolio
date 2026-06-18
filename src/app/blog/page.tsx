import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { readingTimeMinutes } from "@/lib/reading-time";
import BlogPostCard, { type BlogPostCardData } from "@/components/BlogPostCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on software, design, and the space between them.",
};

// Always reflect the latest published posts from the database.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const published: BlogPostCardData[] = rows.map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    date: (p.publishedAt ?? p.createdAt).toISOString(),
    readingTime: readingTimeMinutes(p.content),
  }));

  return (
    <main className="mx-auto w-full max-w-wide flex-1 px-6 md:px-10">
      {/* Document-header strip */}
      <div className="flex items-center justify-between border-b border-border py-4 font-mono text-xs uppercase tracking-widest text-subtle">
        <span>Blog</span>
        <span>{String(published.length).padStart(2, "0")} entries</span>
      </div>

      <header className="py-section pb-12">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          Writing
        </h1>
        <p className="mt-6 max-w-content text-xl leading-relaxed text-muted">
          Notes on software, design, and the space between them.
        </p>
      </header>

      <div className="pb-section">
        {published.length === 0 ? (
          <p className="border-t border-border py-8 text-muted">
            No posts published yet — check back soon.
          </p>
        ) : (
          published.map((post) => <BlogPostCard key={post.slug} post={post} />)
        )}
      </div>
    </main>
  );
}
