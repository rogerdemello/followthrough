"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { btn } from "@/lib/ui";

// One click: reset to the demo starting point, then open the wizard with the demo recap loaded.
export default function StartDemoButton({ large = false }: { large?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function start() {
    setBusy(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      router.push("/meetings/new?demo=1");
    } catch {
      setBusy(false);
    }
  }

  return (
    <button onClick={start} disabled={busy} className={`${btn.primary} ${large ? btn.large : ""}`}>
      {busy && <Spinner />}
      {busy ? "Loading the demo…" : "Start the guided demo"}
    </button>
  );
}
