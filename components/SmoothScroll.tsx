"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Eases mouse-wheel scrolling so the page glides instead of jumping in steps.
 * Touch, trackpads' native momentum and reduced-motion preferences are left alone.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchOnly = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touchOnly) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
