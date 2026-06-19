import Link from "next/link";

export type Project = {
  title: string;
  description: string;
  href: string;
  tags: string[];
  year: string;
  /** Kept for data compatibility; not shown in this minimalist card variant. */
  image?: string;
  /** Catalog position, rendered as a zero-padded index. */
  index?: number;
};

export default function ProjectCard({
  title,
  description,
  href,
  tags,
  year,
  index,
}: Project) {
  const external = href.startsWith("http");
  const label = index != null ? String(index).padStart(2, "0") : null;

  return (
    <article className="group relative flex h-full flex-col justify-between border-2 border-foreground bg-surface p-7 transition-colors duration-200 hover:bg-foreground">
      {/* Stretched link — makes the whole card clickable */}
      <Link
        href={href}
        aria-label={title}
        className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      />

      <div>
        <div className="flex items-start justify-between">
          <span className="font-display text-6xl font-extrabold leading-none tracking-tighter text-foreground/15 transition-colors group-hover:text-background/25">
            {label ?? "—"}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-subtle transition-colors group-hover:text-background/60">
            {year}
          </span>
        </div>

        <h3 className="mt-8 font-display text-2xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground transition-colors group-hover:text-background">
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted transition-colors group-hover:text-background/75">
          {description}
        </p>
      </div>

      <div className="mt-8">
        <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-subtle transition-colors group-hover:text-background/60">
          {tags.join("  ·  ")}
        </p>
        <span className="mt-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:text-background">
          View project
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            {external ? "↗" : "→"}
          </span>
        </span>
      </div>
    </article>
  );
}
