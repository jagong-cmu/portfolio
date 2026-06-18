import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-mono text-xs uppercase tracking-widest " +
  "px-5 py-3 transition-colors duration-150 select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm hover:shadow-md",
  secondary:
    "border border-border bg-transparent text-foreground hover:border-accent hover:text-accent",
};

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className"
  >;
type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className"> & { href?: undefined };

export default function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", className, children } = props;
  const classes = cx(base, variants[variant], className);

  if (props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
