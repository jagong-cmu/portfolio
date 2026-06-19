import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent";

const base =
  "group inline-flex items-center justify-center gap-2 border-2 border-foreground " +
  "font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 select-none " +
  "shadow-brutal transition-[transform,box-shadow,background-color,color] duration-100 " +
  "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg " +
  "active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";

const variants: Record<Variant, string> = {
  primary: "bg-foreground text-background",
  secondary: "bg-transparent text-foreground",
  accent: "bg-accent text-accent-foreground",
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
