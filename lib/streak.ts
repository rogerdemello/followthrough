// A small habit loop, kept in this browser only: confirm a meeting on consecutive days to build a streak.
const KEY = "ft_activity_v1";

function dayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function readActivity(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function recordActivity(): void {
  try {
    const days = new Set(readActivity());
    days.add(dayKey(new Date()));
    localStorage.setItem(KEY, JSON.stringify([...days].sort().slice(-120)));
    window.dispatchEvent(new Event("ft-activity"));
  } catch {
    // Storage can be unavailable (private mode); the streak is a nicety, so ignore.
  }
}

/** Consecutive days with activity, counting back from today (or yesterday, so the day isn't lost mid-way). */
export function computeStreak(days: string[]): number {
  const set = new Set(days);
  const cursor = new Date();
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function markVisit(): boolean {
  try {
    const seen = localStorage.getItem("ft_seen") !== null;
    localStorage.setItem("ft_seen", dayKey(new Date()));
    return seen;
  } catch {
    return false;
  }
}
