import { NextResponse } from "next/server";
import { ConfirmBodySchema } from "@/lib/schemas";
import { getDb } from "@/lib/db";
import { createTask } from "@/lib/tracker";
import type { ConfirmResult, CreatedAction } from "@/lib/types";

export const dynamic = "force-dynamic";

// The only place that writes decisions and tasks. Runs after the user confirms the review.
export async function POST(req: Request) {
  try {
    const body = ConfirmBodySchema.parse(await req.json());
    const db = getDb();

    let meetingId = 0;
    let decisionsAdded = 0;
    let superseded = 0;
    const created: CreatedAction[] = [];

    db.exec("BEGIN");
    try {
      const meeting = db
        .prepare("INSERT INTO meetings (title, held_on, raw_text, source) VALUES (?, ?, ?, ?)")
        .run(body.title, body.heldOn, body.rawText, body.source);
      meetingId = Number(meeting.lastInsertRowid);

      const insertDecision = db.prepare(
        "INSERT INTO decisions (meeting_id, text, topic) VALUES (?, ?, ?)",
      );
      const insertConflict = db.prepare(
        "INSERT INTO conflicts (new_decision_id, old_decision_id, kind, reason, resolution) VALUES (?, ?, ?, ?, ?)",
      );
      const supersede = db.prepare(
        "UPDATE decisions SET status = 'superseded', superseded_by = ? WHERE id = ? AND status = 'active'",
      );

      for (const d of body.decisions) {
        if (d.resolution === "keep_old" && d.conflicts.length > 0) continue;
        const res = insertDecision.run(meetingId, d.text, d.topic);
        const newId = Number(res.lastInsertRowid);
        decisionsAdded += 1;
        for (const c of d.conflicts) {
          insertConflict.run(newId, c.old_decision_id, c.kind, c.reason, d.resolution);
          if (d.resolution === "replace") {
            const r = supersede.run(newId, c.old_decision_id);
            superseded += Number(r.changes);
          }
        }
      }

      const insertAction = db.prepare(
        "INSERT INTO action_items (meeting_id, text, owner, due_on) VALUES (?, ?, ?, ?)",
      );
      for (const a of body.actionItems) {
        const res = insertAction.run(meetingId, a.text, a.owner, a.due_on);
        created.push({
          id: Number(res.lastInsertRowid),
          text: a.text,
          owner: a.owner,
          due_on: a.due_on,
          tracker_url: null,
        });
      }

      const upsertAlias = db.prepare(
        "INSERT INTO aliases (alias, canonical) VALUES (?, ?) ON CONFLICT(alias) DO UPDATE SET canonical = excluded.canonical",
      );
      for (const e of body.aliasEdits) upsertAlias.run(e.alias.toLowerCase(), e.canonical);

      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }

    // Tasks are created only after the confirmed items are safely stored.
    const setUrl = db.prepare("UPDATE action_items SET tracker_url = ? WHERE id = ?");
    for (const a of created) {
      const url = await createTask({
        title: a.text,
        body: [
          `From meeting: ${body.title} (${body.heldOn})`,
          a.owner ? `Owner: ${a.owner}` : "Owner: unassigned",
          a.due_on ? `Due: ${a.due_on}` : "Due: not set",
        ].join("\n"),
        owner: a.owner,
      });
      setUrl.run(url, a.id);
      a.tracker_url = url;
    }

    const result: ConfirmResult = { meetingId, actions: created, decisionsAdded, superseded };
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Confirm failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
