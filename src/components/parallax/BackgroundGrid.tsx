"use client";

import { useEffect, useRef } from "react";

/**
 * Global brutalist grid that sits fixed behind every page (off-white gaps show
 * it at low opacity) and drifts subtly with the mouse. Self-contained: owns its
 * own pointer listener + rAF, gated on prefers-reduced-motion. pointer-events
 * none and -z-10 so it never intercepts or clips page content.
 */
export default function BackgroundGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return; // static grid, no drift

    let raf = 0;
    let dirty = false;
    let mx = 0;
    let my = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      dirty = true;
    };

    const tick = () => {
      if (dirty && ref.current) {
        ref.current.style.transform = `translate3d(${(mx * 14).toFixed(
          2,
        )}px, ${(my * 14).toFixed(2)}px, 0)`;
        dirty = false;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        ref={ref}
        className="brutal-grid absolute -inset-10"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
