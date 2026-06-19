"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useParallax } from "./use-parallax";

/**
 * Moves its children vertically at a different speed than the page on scroll.
 * The element's untransformed document position is measured once (and on resize)
 * so the per-frame math reads `scrollY` only — no getBoundingClientRect feedback
 * loop, no layout thrash. Requires a <ParallaxProvider> ancestor.
 */
export default function ScrollParallax({
  speed = 0.15,
  clamp = 80,
  className,
  children,
}: {
  speed?: number;
  clamp?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useParallax();

  useEffect(() => {
    if (!ctx || ctx.reduced) return;
    let baseCenter = 0;

    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const prev = el.style.transform;
      el.style.transform = ""; // measure layout position without our offset
      const rect = el.getBoundingClientRect();
      baseCenter = rect.top + window.scrollY + rect.height / 2;
      el.style.transform = prev;
    };

    measure();
    window.addEventListener("resize", measure);

    const unsub = ctx.subscribe(({ scrollY }) => {
      const el = ref.current;
      if (!el) return;
      const fromViewportCenter =
        baseCenter - scrollY - window.innerHeight / 2;
      const offset = Math.max(
        -clamp,
        Math.min(clamp, -fromViewportCenter * speed),
      );
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });

    return () => {
      window.removeEventListener("resize", measure);
      unsub();
    };
  }, [ctx, speed, clamp]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
