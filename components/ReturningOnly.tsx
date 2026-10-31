"use client";

import { useEffect, useState } from "react";
import { markVisit } from "@/lib/streak";

/** Shows its children only to someone who has been here before (this browser), or with ?returning=1. */
export default function ReturningOnly({ children }: { children: React.ReactNode }) {
  const [returning, setReturning] = useState(false);
  useEffect(() => {
    const seenBefore = markVisit();
    const forced = new URLSearchParams(window.location.search).get("returning") === "1";
    setReturning(seenBefore || forced);
  }, []);
  return returning ? <>{children}</> : null;
}
