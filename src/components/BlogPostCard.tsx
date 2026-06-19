import Link from "next/link";
import { format } from "date-fns";

export type BlogPostCardData = {
  title: string;
  slug: string;
  excerpt: string;
  // ISO date string used for both the <time> attribute and the display label.
  date: string;
  readingTime: number;
};

export default function BlogPostCard({ post }: { post: BlogPostCardData }) {
  const date = new Date(post.date);
  const readingTime = Math.max(1, Math.round(post.readingTime));

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-b-2 border-foreground py-8 transition-colors first:border-t-2 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <article className="grid gap-3 px-4 md:grid-cols-[11rem_1fr] md:gap-8">
        <div className="font-mono text-xs uppercase leading-relaxed tracking-widest md:pt-2">
          <time dateTime={post.date} className="font-bold text-foreground">
            {format(date, "MMM d, yyyy")}
          </time>
          <span className="block text-subtle md:mt-1">{readingTime} min</span>
        </div>

        <div>
          <h3 className="font-display text-2xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground transition-colors group-hover:text-accent md:text-3xl">
            {post.title}
          </h3>
          <p className="mt-3 max-w-content text-base leading-relaxed text-muted">
            {post.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
            Read more
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}
