import type { DatabaseSync } from "node:sqlite";
import { MEETING1 } from "@/seed/data";

/** Wipes the database and loads the demo starting point: Meeting 1, already confirmed. */
export function resetToDemo(db: DatabaseSync): void {
  db.exec("BEGIN");
  try {
    db.exec(
      "DELETE FROM conflicts; DELETE FROM decisions; DELETE FROM action_items; DELETE FROM meetings; DELETE FROM aliases; DELETE FROM sqlite_sequence;",
    );
    const m = db
      .prepare("INSERT INTO meetings (title, held_on, raw_text, source) VALUES (?, ?, ?, ?)")
      .run(MEETING1.title, MEETING1.heldOn, MEETING1.text, MEETING1.source);
    const meetingId = Number(m.lastInsertRowid);

    const insD = db.prepare("INSERT INTO decisions (meeting_id, text, topic) VALUES (?, ?, ?)");
    for (const d of MEETING1.decisions) insD.run(meetingId, d.text, d.topic);

    // Seeded tasks are marked as already sent to the demo tracker, like a confirmed meeting.
    const insA = db.prepare(
      "INSERT INTO action_items (meeting_id, text, owner, due_on, tracker_url) VALUES (?, ?, ?, ?, ?)",
    );
    MEETING1.actions.forEach((a, i) => insA.run(meetingId, a.text, a.owner, a.due_on, `mock:seed-${i + 1}`));

    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
