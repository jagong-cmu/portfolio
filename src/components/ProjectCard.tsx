import Image from "next/image";
import Link from "next/link";
import Badge from "./Badge";

export type Project = {
  title: string;
  description: string;
  href: string;
  tags: string[];
  year: string;
  /** Optional preview image (e.g. "/projects/foo.png"). Falls back to a placeholder. */
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
  image,
  index,
}: Project) {
  const external = href.startsWith("http");
  const label = index != null ? String(index).padStart(2, "0") : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-200 hover:border-accent hover:shadow-lg">
      {/* Stretched link — makes the whole card clickable, keeps markup simple */}
      <Link
        href={href}
        aria-label={title}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      />

      {/* Preview */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-6xl font-medium tracking-tight text-border">
              {label ?? "—"}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-subtle">
          <span>{label ? `№ ${label}` : "Project"}</span>
          <span>{year}</span>
        </div>

        <h3 className="text-2xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
          {title}
        </h3>

        <p className="text-base leading-relaxed text-muted">{description}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent">
          View project
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            {external ? "↗" : "→"}
          </span>
        </span>
      </div>
    </article>
  );
}
