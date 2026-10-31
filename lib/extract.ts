import { callTool } from "./llm";
import { ExtractionSchema, type Extraction } from "./schemas";

const INPUT_SCHEMA = {
  type: "object" as const,
  properties: {
    speakers: { type: "array", items: { type: "string" } },
    decisions: {
      type: "array",
      items: {
        type: "object",
        properties: { text: { type: "string" }, topic: { type: "string" } },
        required: ["text", "topic"],
      },
    },
    action_items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          owner: { type: ["string", "null"] },
          due_on: { type: ["string", "null"], description: "YYYY-MM-DD or null" },
          evidence: { type: "string" },
        },
        required: ["text", "owner", "due_on", "evidence"],
      },
    },
    assumptions: { type: "array", items: { type: "string" } },
  },
  required: ["speakers", "decisions", "action_items", "assumptions"],
};

type ExtractArgs = {
  heldOn: string;
  rawText: string;
  knownPeople: string[];
  aliases: { alias: string; canonical: string }[];
};

export async function extractMeeting(args: ExtractArgs): Promise<Extraction> {
  const weekday = new Date(`${args.heldOn}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  const people = args.knownPeople.length ? args.knownPeople.join(", ") : "none yet";
  const aliasLines = args.aliases.length
    ? args.aliases.map((a) => `"${a.alias}" means "${a.canonical}"`).join("; ")
    : "none";

  const system = `You turn meeting transcripts or dictated recaps into structured records.

Rules:
- Ignore filler words (um, uh, like), small talk and digressions.
- If a speaker corrects themselves ("Thursday, no wait, Friday"), use only the final version.
- The meeting was held on ${args.heldOn} (${weekday}). Resolve relative dates ("next Friday", "the week of the 23rd") to a specific YYYY-MM-DD relative to that date. If a date cannot be resolved with confidence, use null and add an assumption.
- A decision is something the group settled on: a choice, a plan, or a change of plan. An action item is a task someone must do. Put the commitment in action_items and the underlying choice in decisions; do not duplicate them.
- Write each decision as a clear standalone statement, not a quote (for example "Beta launch moved to December 1", "Payments provider switched from Stripe to Razorpay").
- Write each action item as a short imperative task title that stands alone (for example "Integrate Razorpay payments", "Update onboarding screens for the new payment flow").
- Rescheduling or reassigning a single task is an action item, not a decision. Only record a decision when the group changed a shared choice or plan.
- Never invent an owner. If no owner is stated, use null and add an assumption.
- Use full canonical names for owners. Known people: ${people}. Aliases: ${aliasLines}.
- topic: a short normalized noun phrase (for example "payments provider", "beta launch date") so decisions on the same subject share a topic.
- evidence: for each action item, a short verbatim quote from the input that supports it. Include the self-correction if there was one.
- speakers: the people who speak or are named as participants.`;

  const result = await callTool({
    system,
    user: `Meeting text:\n\n${args.rawText}`,
    toolName: "record_meeting",
    toolDescription: "Record the structured contents of the meeting.",
    inputSchema: INPUT_SCHEMA,
    parser: ExtractionSchema,
  });

  // Apply remembered name corrections deterministically, on top of the model's own mapping.
  const aliasMap = new Map(args.aliases.map((a) => [a.alias.toLowerCase(), a.canonical]));
  return {
    ...result,
    action_items: result.action_items.map((item) => ({
      ...item,
      owner: item.owner ? (aliasMap.get(item.owner.toLowerCase()) ?? item.owner) : null,
    })),
  };
}
