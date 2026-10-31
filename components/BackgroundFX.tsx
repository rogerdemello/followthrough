"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: number; pulse: number };

/**
 * Living background: soft light orbs that follow the cursor, and a network of "decision"
 * nodes that drift, link up, lean toward the pointer and occasionally pulse.
 * Respects reduced-motion, pauses when the tab is hidden, and never blocks clicks.
 */
export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbA = useRef<HTMLDivElement>(null);
  const orbB = useRef<HTMLDivElement>(null);
  const orbC = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let lastPulse = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    const orbs = [
      { el: orbA.current, x: 0, y: 0, k: 0.06, f: 0.9 },
      { el: orbB.current, x: 0, y: 0, k: 0.035, f: -0.7 },
      { el: orbC.current, x: 0, y: 0, k: 0.02, f: 0.5 },
    ];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.max(24, Math.floor((w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.2 + Math.random() * 1.8,
        hue: Math.random() < 0.55 ? 245 : 190,
        pulse: 0,
      }));
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);

      if (!reduceMotion && t - lastPulse > 2200 && nodes.length) {
        lastPulse = t;
        nodes[Math.floor(Math.random() * nodes.length)].pulse = 1;
      }

      for (const n of nodes) {
        if (!reduceMotion) {
          if (mouse.active) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const d = Math.hypot(dx, dy);
            if (d < 200 && d > 1) {
              n.vx += (dx / d) * 0.012;
              n.vy += (dy / d) * 0.012;
            }
          }
          n.vx *= 0.995;
          n.vy *= 0.995;
          const speed = Math.hypot(n.vx, n.vy);
          if (speed > 0.9) {
            n.vx = (n.vx / speed) * 0.9;
            n.vy = (n.vy / speed) * 0.9;
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -10) n.x = w + 10;
          if (n.x > w + 10) n.x = -10;
          if (n.y < -10) n.y = h + 10;
          if (n.y > h + 10) n.y = -10;
        }
      }

      // Links between nearby nodes.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            ctx!.strokeStyle = `rgba(129,140,248,${(1 - d / 140) * 0.28})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        // Links from the cursor to nearby nodes.
        if (mouse.active) {
          const n = nodes[i];
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < 190) {
            ctx!.strokeStyle = `rgba(196,181,253,${(1 - d / 190) * 0.65})`;
            ctx!.lineWidth = 1.2;
            ctx!.beginPath();
            ctx!.moveTo(n.x, n.y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx!.fillStyle = `hsla(${n.hue},90%,72%,0.9)`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
        if (n.pulse > 0) {
          const radius = (1 - n.pulse) * 46 + n.r;
          ctx!.strokeStyle = `hsla(${n.hue},90%,75%,${n.pulse * 0.6})`;
          ctx!.lineWidth = 1.5;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, radius, 0, Math.PI * 2);
          ctx!.stroke();
          n.pulse = Math.max(0, n.pulse - 0.014);
        }
      }

      // Orbs ease toward the cursor, and drift gently on their own.
      const cx = mouse.active ? mouse.x - w / 2 : 0;
      const cy = mouse.active ? mouse.y - h / 2 : 0;
      orbs.forEach((o, i) => {
        if (!o.el) return;
        const driftX = reduceMotion ? 0 : Math.sin(t / 5000 + i * 2) * 40;
        const driftY = reduceMotion ? 0 : Math.cos(t / 6000 + i * 3) * 40;
        o.x += (cx * o.f + driftX - o.x) * o.k;
        o.y += (cy * o.f + driftY - o.y) * o.k;
        o.el.style.transform = `translate3d(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px, 0)`;
      });
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
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#060a18]">
      <div
        ref={orbA}
        className="absolute -left-32 -top-32 h-[36rem] w-[36rem] rounded-full bg-indigo-600/40 blur-[120px] will-change-transform"
      />
      <div
        ref={orbB}
        className="absolute -bottom-40 -right-24 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/25 blur-[130px] will-change-transform"
      />
      <div
        ref={orbC}
        className="absolute left-1/3 top-1/3 h-[26rem] w-[26rem] rounded-full bg-cyan-500/20 blur-[120px] will-change-transform"
      />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
