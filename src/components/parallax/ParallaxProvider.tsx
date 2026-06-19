"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ParallaxContext,
  type ParallaxCtx,
  type ParallaxState,
  type Subscriber,
} from "./use-parallax";

/**
 * Owns ONE requestAnimationFrame loop + a registry of subscriber layers for the
 * subtree it wraps. Reads (scroll/pointer) happen in passive listeners; writes
 * (transforms) happen once per frame in the rAF tick. If prefers-reduced-motion
 * is set, the loop never starts, so all layers stay at their identity transform.
 */
export default function ParallaxProvider({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const subs = useRef<Set<Subscriber>>(new Set());
  const state = useRef<ParallaxState>({ scrollY: 0, mx: 0, my: 0 });
  const dirty = useRef(true);
  const [reduced, setReduced] = useState(false);

  // Stable context object (same reference across renders).
  const ctx = useRef<ParallaxCtx | null>(null);
  if (ctx.current === null) {
    ctx.current = {
      subscribe: (fn) => {
        subs.current.add(fn);
        dirty.current = true; // position the new layer on the next frame
        return () => subs.current.delete(fn);
      },
      reduced: false,
    };
  }
  ctx.current.reduced = reduced;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      return; // never start the loop → no motion
    }

    let raf = 0;

    const onScroll = () => {
      state.current.scrollY = window.scrollY;
      dirty.current = true;
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      state.current.mx = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.my = (e.clientY / window.innerHeight) * 2 - 1;
      dirty.current = true;
    };

    const tick = () => {
      if (dirty.current) {
        for (const fn of subs.current) fn(state.current);
        dirty.current = false;
      }
      raf = requestAnimationFrame(tick);
    };

    state.current.scrollY = window.scrollY;
    dirty.current = true;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <ParallaxContext.Provider value={ctx.current}>
      <div className={className}>{children}</div>
    </ParallaxContext.Provider>
  );
}
