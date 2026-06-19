import type { ReactNode } from "react";

/**
 * CSS-only infinite ticker (no JS, no provider). The item sequence is duplicated
 * and the track translated -50% via the `marquee` keyframes in globals.css, which
 * are disabled under prefers-reduced-motion. Server Component.
 */
type MarqueeProps = {
  items: ReactNode[];
  durationSec?: number;
  reverse?: boolean;
  separator?: ReactNode;
  className?: string;
};

export default function Marquee({
  items,
  durationSec = 30,
  reverse = false,
  separator = "✱",
  className,
}: MarqueeProps) {
  const sequence = [...items, ...items];

  return (
    <div
      className={"marquee" + (className ? ` ${className}` : "")}
      aria-hidden="true"
    >
      <div
        className="marquee__track"
        style={{
          animationDuration: `${durationSec}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {sequence.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 px-4 font-mono text-sm font-bold uppercase tracking-widest"
          >
            {item}
            <span className="text-accent">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
