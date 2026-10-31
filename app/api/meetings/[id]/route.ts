import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// Deletes a meeting with its decisions and tasks. Earlier decisions it had replaced become active again.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meetingId = Number(id);
  const db = getDb();
  db.exec("BEGIN");
  try {
    db.prepare(
      `UPDATE decisions SET status = 'active', superseded_by = NULL
       WHERE superseded_by IN (SELECT id FROM decisions WHERE meeting_id = ?)`,
    ).run(meetingId);
    const res = db.prepare("DELETE FROM meetings WHERE id = ?").run(meetingId);
    db.exec("COMMIT");
    if (Number(res.changes) === 0) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    db.exec("ROLLBACK");
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
