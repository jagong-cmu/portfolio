import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center rounded-none border border-foreground bg-transparent " +
        "px-2.5 py-1 font-mono text-[0.6875rem] font-medium uppercase leading-none tracking-wider text-foreground" +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </span>
  );
}
