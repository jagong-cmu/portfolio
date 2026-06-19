import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { readingTimeMinutes } from "@/lib/reading-time";
import BlogPostCard, { type BlogPostCardData } from "@/components/BlogPostCard";
import SystemBar from "@/components/SystemBar";
import ParallaxProvider from "@/components/parallax/ParallaxProvider";
import ScrollParallax from "@/components/parallax/ScrollParallax";

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
      <SystemBar
        left="Blog"
        right={`${String(published.length).padStart(2, "0")} entries`}
      />

      <ParallaxProvider>
        <header className="py-section pb-12">
          <ScrollParallax speed={0.12} clamp={60}>
            <h1 className="font-display text-5xl font-extrabold uppercase tracking-tighter text-foreground sm:text-6xl md:text-8xl">
              Writing
            </h1>
          </ScrollParallax>
          <p className="mt-6 max-w-content text-xl leading-snug text-muted">
            Notes on software, design, and the space between them.
          </p>
        </header>

        <div className="pb-section">
          {published.length === 0 ? (
            <p className="border-t-2 border-foreground py-8 text-muted">
              No posts published yet — check back soon.
            </p>
          ) : (
            published.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))
          )}
        </div>
      </ParallaxProvider>
    </main>
  );
}
