"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useParallax } from "./use-parallax";

/**
 * Translates its children by `factor` px at full pointer deflection. Different
 * `factor` per instance = depth (smaller = further away). Children pass straight
 * through, so server-rendered subtrees stay RSC.
 */
export default function MouseParallax({
  factor = 20,
  className,
  children,
}: {
  factor?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useParallax();

  useEffect(() => {
    if (!ctx || ctx.reduced) return;
    return ctx.subscribe(({ mx, my }) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate3d(${(mx * factor).toFixed(2)}px, ${(
        my * factor
      ).toFixed(2)}px, 0)`;
    });
  }, [ctx, factor]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform", transition: "transform 140ms ease-out" }}
    >
      {children}
    </div>
  );
}
