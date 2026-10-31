export function sourceLabel(source: string): string {
  return source === "dictated" ? "Dictated recap" : "Pasted transcript";
}

export function daysBetween(fromISO: string, toISO: string): number {
  const ms = new Date(`${toISO}T00:00:00Z`).getTime() - new Date(`${fromISO}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

/** "today", "in 5 days", "3 days overdue", with a tone for colouring. */
export function relativeDue(
  dueOn: string | null,
  today: string,
): { label: string; tone: "overdue" | "soon" | "later" | "none" } {
  if (!dueOn) return { label: "no date", tone: "none" };
  const d = daysBetween(today, dueOn);
  if (d < 0) return { label: `${-d} day${d === -1 ? "" : "s"} overdue`, tone: "overdue" };
  if (d === 0) return { label: "due today", tone: "soon" };
  if (d === 1) return { label: "due tomorrow", tone: "soon" };
  return { label: `due in ${d} days`, tone: d <= 7 ? "soon" : "later" };
}
