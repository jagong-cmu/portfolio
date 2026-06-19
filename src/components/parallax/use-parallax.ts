"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ParallaxState = {
  /** window.scrollY */
  scrollY: number;
  /** pointer X offset from viewport center, normalized to [-1, 1] */
  mx: number;
  /** pointer Y offset from viewport center, normalized to [-1, 1] */
  my: number;
};

export type Subscriber = (s: ParallaxState) => void;

export type ParallaxCtx = {
  subscribe: (fn: Subscriber) => () => void;
  reduced: boolean;
};

export const ParallaxContext = createContext<ParallaxCtx | null>(null);

export const useParallax = () => useContext(ParallaxContext);

/** Tracks prefers-reduced-motion (for components without a provider, e.g. CSS fallbacks). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
