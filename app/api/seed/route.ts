import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { resetToDemo } from "@/lib/seed";

export const dynamic = "force-dynamic";

// Resets the database to the demo starting point: Meeting 1 already confirmed.
export async function POST() {
  try {
    resetToDemo(getDb());
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
