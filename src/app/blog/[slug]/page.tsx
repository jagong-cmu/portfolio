import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { readingTimeMinutes } from "@/lib/reading-time";
import SystemBar from "@/components/SystemBar";

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
      <SystemBar
        left={
          <Link href="/blog" className="transition-colors hover:text-accent">
            ← Blog
          </Link>
        }
        right={format(date, "yyyy")}
      />

      {/* Article header */}
      <header className="py-section pb-10">
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-subtle">
          <time dateTime={date.toISOString()}>
            {format(date, "MMMM d, yyyy")}
          </time>
          <span> · {readingTime} min read</span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-foreground md:text-6xl">
          {post.title}
        </h1>
        <p className="mt-6 text-xl leading-snug text-muted">{post.excerpt}</p>
      </header>

      {/* Body */}
      <article className="prose max-w-none pb-section prose-headings:font-extrabold prose-headings:uppercase prose-headings:tracking-tight prose-pre:rounded-none prose-pre:border-2 prose-pre:border-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}
