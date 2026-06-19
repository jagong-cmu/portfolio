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
    <nav className="sticky top-0 z-40 flex items-center justify-between gap-4 border-t-4 border-b-2 border-t-accent border-b-foreground bg-background px-6 py-4 md:px-10">
      <Link
        href="/"
        className="shrink-0 font-mono text-sm font-bold uppercase tracking-widest text-foreground"
      >
        Portfolio
      </Link>
      <div className="flex gap-1 sm:gap-2">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-2 py-1 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background sm:text-sm"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
