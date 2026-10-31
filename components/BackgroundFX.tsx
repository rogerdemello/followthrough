"use client";

import { useEffect, useRef } from "react";

const GAP = 28;
const REACH = 140;
const grain =
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='.55'/></svg>";

/**
 * A quiet field of ink dots on paper. Dots near the cursor lean away and swell in the accent colour;
 * a click sends a ripple through them. Respects reduced-motion and never blocks clicks.
 */
export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    const ripples: { x: number; y: number; t0: number }[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion) draw(0);
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);
      for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t0 > 1000) ripples.splice(i, 1);

      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          let px = x;
          let py = y;
          let r = 1.1;
          let a = 0.15;
          let accent = 0;

          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < REACH && d > 0.5) {
              const k = 1 - d / REACH;
              const push = k * k * 11;
              px += (dx / d) * push;
              py += (dy / d) * push;
              r += k * 2.2;
              a += k * 0.5;
              accent = k;
            }
          }
          for (const rp of ripples) {
            const age = (t - rp.t0) / 1000;
            const ring = age * 280;
            const off = Math.abs(Math.hypot(x - rp.x, y - rp.y) - ring);
            if (off < 20) {
              const k = (1 - off / 20) * (1 - age);
              r += k * 2.4;
              a += k * 0.5;
              accent = Math.max(accent, k);
            }
          }

          ctx!.fillStyle = accent > 0.02 ? `rgba(214,69,42,${Math.min(a, 0.8)})` : `rgba(27,26,23,${a})`;
          ctx!.beginPath();
          ctx!.arc(px, py, r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function loop(t: number) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onDown(e: PointerEvent) {
      if (!reduceMotion) ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
    }
    function onLeave() {
      mouse.active = false;
    }
    function onVisibility() {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduceMotion) raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    if (reduceMotion) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-paper">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(grain)}")` }}
      />
    </div>
  );
}
