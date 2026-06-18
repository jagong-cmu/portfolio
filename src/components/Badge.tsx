import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border border-border bg-surface-2 " +
        "px-2.5 py-1 font-mono text-[0.6875rem] uppercase leading-none tracking-wider text-muted" +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </span>
  );
}
