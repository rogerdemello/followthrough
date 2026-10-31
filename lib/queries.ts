import { all, one } from "./db";

export type MeetingRow = {
  id: number;
  title: string;
  held_on: string;
  raw_text: string;
  source: string;
  created_at: string;
};

export type DecisionRow = {
  id: number;
  meeting_id: number;
  text: string;
  topic: string;
  status: "active" | "superseded";
  superseded_by: number | null;
  meeting_title: string;
  held_on: string;
};

export type ActionRow = {
  id: number;
  meeting_id: number;
  text: string;
  owner: string | null;
  due_on: string | null;
  status: string;
  tracker_url: string | null;
  meeting_title: string;
  held_on: string;
};

const DECISION_SELECT = `
  SELECT d.id, d.meeting_id, d.text, d.topic, d.status, d.superseded_by,
         m.title AS meeting_title, m.held_on AS held_on
  FROM decisions d JOIN meetings m ON m.id = d.meeting_id`;

const ACTION_SELECT = `
  SELECT a.id, a.meeting_id, a.text, a.owner, a.due_on, a.status, a.tracker_url,
         m.title AS meeting_title, m.held_on AS held_on
  FROM action_items a JOIN meetings m ON m.id = a.meeting_id`;

export function listMeetings(): MeetingRow[] {
  return all<MeetingRow>("SELECT * FROM meetings ORDER BY held_on DESC, id DESC");
}

export function getMeeting(id: number): MeetingRow | undefined {
  return one<MeetingRow>("SELECT * FROM meetings WHERE id = ?", id);
}

export function getActiveDecisions(): DecisionRow[] {
  return all<DecisionRow>(`${DECISION_SELECT} WHERE d.status = 'active' ORDER BY m.held_on, d.id`);
}

export function getDecisionsForMeeting(meetingId: number): DecisionRow[] {
  return all<DecisionRow>(`${DECISION_SELECT} WHERE d.meeting_id = ? ORDER BY d.id`, meetingId);
}

export function getSupersededDecisions(): (DecisionRow & { replaced_text: string | null })[] {
  return all<DecisionRow & { replaced_text: string | null }>(
    `SELECT d.id, d.meeting_id, d.text, d.topic, d.status, d.superseded_by,
            m.title AS meeting_title, m.held_on AS held_on,
            n.text AS replaced_text
     FROM decisions d
     JOIN meetings m ON m.id = d.meeting_id
     LEFT JOIN decisions n ON n.id = d.superseded_by
     WHERE d.status = 'superseded' ORDER BY m.held_on, d.id`,
  );
}

export function getActionsForMeeting(meetingId: number): ActionRow[] {
  return all<ActionRow>(`${ACTION_SELECT} WHERE a.meeting_id = ? ORDER BY a.id`, meetingId);
}

export function getOpenActionsFor(person: string): ActionRow[] {
  return all<ActionRow>(
    `${ACTION_SELECT} WHERE a.status = 'open' AND lower(a.owner) = lower(?) ORDER BY a.due_on IS NULL, a.due_on`,
    person,
  );
}

export function getDoneActionsFor(person: string, limit = 8): ActionRow[] {
  return all<ActionRow>(
    `${ACTION_SELECT} WHERE a.status = 'done' AND lower(a.owner) = lower(?) ORDER BY a.id DESC LIMIT ?`,
    person,
    limit,
  );
}

export function getAllOpenActions(): ActionRow[] {
  return all<ActionRow>(`${ACTION_SELECT} WHERE a.status = 'open' ORDER BY a.due_on IS NULL, a.due_on, a.id`);
}

export function countOpenActions(): number {
  return one<{ n: number }>("SELECT COUNT(*) AS n FROM action_items WHERE status = 'open'")?.n ?? 0;
}

export function getPeople(): string[] {
  return all<{ owner: string }>(
    "SELECT DISTINCT owner FROM action_items WHERE owner IS NOT NULL ORDER BY owner",
  ).map((r) => r.owner);
}

export function getAliases(): { alias: string; canonical: string }[] {
  return all<{ alias: string; canonical: string }>("SELECT alias, canonical FROM aliases");
}
