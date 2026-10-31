"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { btn } from "@/lib/ui";

export default function DeleteMeetingButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    const ok = window.confirm(
      `Delete “${title}”?\n\nIts decisions and tasks will be removed, and any earlier decisions it replaced will count again.`,
    );
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/meetings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/meetings");
      router.refresh();
    } catch {
      setError("Couldn’t delete this meeting. Try again.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button onClick={remove} disabled={busy} className={`${btn.secondary} !px-3 !py-1.5 !text-accent`}>
        {busy ? "Deleting…" : "Delete this meeting"}
      </button>
      {error && <p role="alert" className="mt-2 text-xs text-accent">{error}</p>}
    </div>
  );
}
