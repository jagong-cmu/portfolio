import type { ReactNode } from "react";

/**
 * Inverted "system bar" page header — bleeds to the edge of the surrounding
 * max-w container (cancels the parent's px-6/px-10), ink fill with off-white
 * mono label. Used at the top of every page.
 */
export default function SystemBar({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="-mx-6 flex items-center justify-between border-b-2 border-foreground bg-foreground px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-background md:-mx-10 md:px-10">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
