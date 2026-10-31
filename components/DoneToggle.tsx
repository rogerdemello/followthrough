"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** A checkbox that marks a task done (or reopens it) and refreshes the page. */
export default function DoneToggle({ id, done, label }: { id: number; done: boolean; label: string }) {
  const router = useRouter();
  const [checked, setChecked] = useState(done);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !checked;
    setChecked(next);
    setBusy(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setChecked(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={busy}
      onChange={toggle}
      aria-label={`${checked ? "Reopen" : "Mark done"}: ${label}`}
      title={checked ? "Done. Click to reopen" : "Mark as done"}
      className="h-5 w-5 shrink-0 cursor-pointer accent-ink"
    />
  );
}
