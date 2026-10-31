export type ConflictKind = "contradicts" | "supersedes";

export type ConflictInfo = {
  old_decision_id: number;
  old_text: string;
  old_meeting: string;
  old_date: string;
  kind: ConflictKind;
  reason: string;
};

export type DraftDecision = {
  text: string;
  topic: string;
  conflicts: ConflictInfo[];
};

export type DraftAction = {
  text: string;
  owner: string | null;
  due_on: string | null;
  evidence: string;
};

export type Draft = {
  /** Set when the result came from a saved sample instead of the live model. */
  notice?: string;
  /** Number of earlier decisions the new ones were checked against. */
  earlierDecisions: number;
  /** Where tasks will be created, as a readable phrase. */
  tracker: string;
  speakers: string[];
  decisions: DraftDecision[];
  action_items: DraftAction[];
  assumptions: string[];
};

export type CreatedAction = {
  id: number;
  text: string;
  owner: string | null;
  due_on: string | null;
  tracker_url: string | null;
};

export type ConfirmResult = {
  meetingId: number;
  actions: CreatedAction[];
  decisionsAdded: number;
  superseded: number;
};
