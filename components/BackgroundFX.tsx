"use client";

import { useEffect, useRef } from "react";

const GAP = 28;
const REACH = 140;
const grain =
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='.55'/></svg>";

/**
 * A quiet field of ink dots on paper. Dots near the cursor lean away and swell in the accent colour;
 * a click sends a ripple through them.
 *
 * It only draws while something is moving. When the pointer is still, nothing is redrawn, so page
 * scrolling gets the whole frame budget. Respects reduced-motion and never blocks clicks.
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
    let lastMove = 0;
    let dots: { x: number; y: number }[] = [];
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
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) dots.push({ x, y });
      draw(performance.now());
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);
      for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t0 > 1000) ripples.splice(i, 1);

      // Most dots are untouched: batch them into a single path. Only dots near the pointer or a ripple are drawn one by one.
      const hot: { x: number; y: number; r: number; a: number }[] = [];
      ctx!.fillStyle = "rgba(27,26,23,0.15)";
      ctx!.beginPath();
      for (const d of dots) {
        let px = d.x;
        let py = d.y;
        let r = 1.1;
        let a = 0.15;
        let touched = false;

        if (mouse.active) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REACH && dist > 0.5) {
            const k = 1 - dist / REACH;
            const push = k * k * 11;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
            r += k * 2.2;
            a += k * 0.5;
            touched = true;
          }
        }
        for (const rp of ripples) {
          const age = (t - rp.t0) / 1000;
          const off = Math.abs(Math.hypot(d.x - rp.x, d.y - rp.y) - age * 280);
          if (off < 20) {
            const k = (1 - off / 20) * (1 - age);
            r += k * 2.4;
            a += k * 0.5;
            touched = true;
          }
        }

        if (touched) hot.push({ x: px, y: py, r, a: Math.min(a, 0.8) });
        else {
          ctx!.moveTo(d.x + r, d.y);
          ctx!.arc(d.x, d.y, r, 0, Math.PI * 2);
        }
      }
      ctx!.fill();

      ctx!.fillStyle = "rgba(214,69,42,0.5)";
      for (const hd of hot) {
        ctx!.fillStyle = `rgba(214,69,42,${hd.a})`;
        ctx!.beginPath();
        ctx!.arc(hd.x, hd.y, hd.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop(t: number) {
      const busy = ripples.length > 0 || (mouse.active && t - lastMove < 1200);
      if (!busy) {
        // Settle into the resting grid and stop drawing until the pointer moves again.
        mouse.active = false;
        draw(t);
        raf = 0;
        return;
      }
      draw(t);
      raf = requestAnimationFrame(loop);
    }
    function kick() {
      if (!raf && !reduceMotion) raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      lastMove = performance.now();
      kick();
    }
    function onDown(e: PointerEvent) {
      if (reduceMotion) return;
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
      kick();
    }
    function onLeave() {
      mouse.active = false;
      kick();
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduceMotion) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-paper">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Plain low-opacity texture. No blend mode, which forces the whole page to be re-composited while scrolling. */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(grain)}")` }}
      />
    </div>
  );
}
