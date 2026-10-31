"use client";

import { useEffect, useState } from "react";

/** Cycles through words with a rise-in animation. Shows the first word only if motion is reduced. */
export default function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span
      key={i}
      className="animate-word-in inline-block bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent"
    >
      {words[i]}
    </span>
  );
}
