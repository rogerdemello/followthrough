import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const Body = z.object({ done: z.boolean() });

// Marks a task done, or reopens it.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { done } = Body.parse(await req.json());
    const res = getDb()
      .prepare("UPDATE action_items SET status = ? WHERE id = ?")
      .run(done ? "done" : "open", Number(id));
    if (Number(res.changes) === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
