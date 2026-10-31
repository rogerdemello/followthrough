import type { DecisionRow } from "./queries";
import type { Draft } from "./types";
import { MEETING2, MEETING2_SAVED } from "@/seed/data";

/**
 * If the live model is unavailable (for example, free quota used up) and the text is exactly the
 * built-in sample recap, return its saved result so the demo still works. The result says so.
 * Any other text is never answered from here.
 */
export function savedSampleDraft(rawText: string, active: DecisionRow[], tracker: string): Draft | null {
  if (rawText.trim() !== MEETING2.text.trim()) return null;

  return {
    notice:
      "The AI service is busy right now, so this is the saved result for the sample recap. Your own recaps are always analyzed live.",
    earlierDecisions: active.length,
    tracker,
    speakers: MEETING2_SAVED.speakers,
    decisions: MEETING2_SAVED.decisions.map((d) => {
      const old = active.find((a) => a.topic.toLowerCase() === d.topic.toLowerCase());
      return {
        text: d.text,
        topic: d.topic,
        conflicts: old
          ? [
              {
                old_decision_id: old.id,
                old_text: old.text,
                old_meeting: old.meeting_title,
                old_date: old.held_on,
                kind: d.kind,
                reason: d.reason,
              },
            ]
          : [],
      };
    }),
    action_items: MEETING2_SAVED.actions,
    assumptions: [],
  };
}
