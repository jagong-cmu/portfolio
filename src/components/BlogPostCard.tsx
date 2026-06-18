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
      className="group block border-b border-border py-8 transition-colors first:border-t hover:bg-surface-2/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <article className="grid gap-3 md:grid-cols-[11rem_1fr] md:gap-8">
        <div className="font-mono text-xs uppercase leading-relaxed tracking-widest text-subtle md:pt-1">
          <time dateTime={post.date}>{format(date, "MMM d, yyyy")}</time>
          <span className="block md:mt-1">{readingTime} min</span>
        </div>

        <div>
          <h3 className="text-2xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <p className="mt-3 max-w-content text-base leading-relaxed text-muted">
            {post.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent">
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
