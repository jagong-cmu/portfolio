// This is a Server Component by default (no "use client" needed)
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  return (
    <nav className="flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-5 backdrop-blur md:px-10">
      <Link
        href="/"
        className="shrink-0 font-mono text-sm uppercase tracking-widest text-foreground"
      >
        Portfolio
      </Link>
      <div className="flex gap-4 sm:gap-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent sm:text-sm sm:normal-case sm:tracking-normal"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
