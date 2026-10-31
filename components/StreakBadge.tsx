"use client";

import { useEffect, useState } from "react";
import { computeStreak, readActivity } from "@/lib/streak";

export function useStreak(): number {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const update = () => setStreak(computeStreak(readActivity()));
    update();
    window.addEventListener("ft-activity", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("ft-activity", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return streak;
}

export default function StreakBadge() {
  const streak = useStreak();
  if (streak === 0) {
    return (
      <span
        className="hidden text-xs text-slate-400 md:inline"
        title="Confirm a meeting each day to build a streak"
      >
        Recap today to start a streak
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-200"
      title="Confirm a meeting each day to keep your streak alive"
    >
      <span aria-hidden>🔥</span>
      {streak}-day streak
    </span>
  );
}
