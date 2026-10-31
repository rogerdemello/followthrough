import { callTool } from "./llm";
import { ConflictResultSchema } from "./schemas";
import type { ConflictInfo } from "./types";
import type { DecisionRow } from "./queries";

const INPUT_SCHEMA = {
  type: "object" as const,
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          new_index: { type: "integer" },
          old_decision_id: { type: "integer" },
          kind: { type: "string", enum: ["contradicts", "supersedes", "consistent"] },
          reason: { type: "string" },
        },
        required: ["new_index", "old_decision_id", "kind", "reason"],
      },
    },
  },
  required: ["results"],
};

const SYSTEM = `You compare newly made decisions with earlier decisions from the same team.

For each new decision, check it against each earlier decision on the same subject:
- "contradicts": both cannot hold (for example, Stripe was chosen earlier and Razorpay is chosen now).
- "supersedes": the new decision changes a plan, date or parameter that was set earlier (for example, a launch date is moved).
- "consistent": no conflict.

Only return pairs that are about the same subject. Skip unrelated pairs.
reason: one short sentence that names the earlier choice and what changed.`;

/** Returns, per new-decision index, the earlier decisions it conflicts with. */
export async function detectConflicts(
  newDecisions: { text: string; topic: string }[],
  active: DecisionRow[],
): Promise<Map<number, ConflictInfo[]>> {
  const out = new Map<number, ConflictInfo[]>();
  if (newDecisions.length === 0 || active.length === 0) return out;

  const user = JSON.stringify(
    {
      new_decisions: newDecisions.map((d, index) => ({ index, text: d.text, topic: d.topic })),
      earlier_decisions: active.map((d) => ({
        id: d.id,
        text: d.text,
        topic: d.topic,
        meeting: d.meeting_title,
        date: d.held_on,
      })),
    },
    null,
    2,
  );

  const result = await callTool({
    system: SYSTEM,
    user,
    toolName: "report_conflicts",
    toolDescription: "Report how each new decision relates to earlier decisions.",
    inputSchema: INPUT_SCHEMA,
    parser: ConflictResultSchema,
  });

  const byId = new Map(active.map((d) => [d.id, d]));
  for (const r of result.results) {
    if (r.kind === "consistent") continue;
    const old = byId.get(r.old_decision_id);
    if (!old || r.new_index < 0 || r.new_index >= newDecisions.length) continue;
    const list = out.get(r.new_index) ?? [];
    list.push({
      old_decision_id: old.id,
      old_text: old.text,
      old_meeting: old.meeting_title,
      old_date: old.held_on,
      kind: r.kind,
      reason: r.reason,
    });
    out.set(r.new_index, list);
  }
  return out;
}
