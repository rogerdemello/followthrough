"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { btn } from "@/lib/ui";

export default function ResetDemoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function reset() {
    if (!window.confirm("This deletes all meetings, decisions and tasks, then reloads the sample data. Continue?")) {
      return;
    }
    setBusy(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={reset}
      disabled={busy}
      title="Clears everything and reloads Monday's sample meeting"
      className={`${btn.glass} !px-3 !py-1.5`}
    >
      {busy ? "Resetting…" : "Reset demo data"}
    </button>
  );
}
