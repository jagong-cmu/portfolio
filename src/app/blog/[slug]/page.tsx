import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { readingTimeMinutes } from "@/lib/reading-time";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

function getPost(slug: string) {
  return prisma.blogPost.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt?.toISOString() ?? undefined,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const date = post.publishedAt ?? post.createdAt;
  const readingTime = readingTimeMinutes(post.content);

  return (
    <main className="mx-auto w-full max-w-content flex-1 px-6 md:px-10">
      {/* Document-header strip */}
      <div className="flex items-center justify-between border-b border-border py-4 font-mono text-xs uppercase tracking-widest text-subtle">
        <Link href="/blog" className="transition-colors hover:text-accent">
          ← Blog
        </Link>
        <span>{format(date, "yyyy")}</span>
      </div>

      {/* Article header */}
      <header className="py-section pb-10">
        <div className="font-mono text-xs uppercase tracking-widest text-subtle">
          <time dateTime={date.toISOString()}>
            {format(date, "MMMM d, yyyy")}
          </time>
          <span> · {readingTime} min read</span>
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-muted">
          {post.excerpt}
        </p>
      </header>

      {/* Body */}
      <article className="prose max-w-none pb-section prose-headings:font-semibold prose-headings:tracking-tight prose-pre:rounded-lg prose-pre:border prose-pre:border-border">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}
