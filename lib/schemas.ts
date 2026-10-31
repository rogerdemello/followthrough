import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ExtractionSchema = z.object({
  speakers: z.array(z.string()),
  decisions: z.array(z.object({ text: z.string(), topic: z.string() })),
  action_items: z.array(
    z.object({
      text: z.string(),
      owner: z.string().nullable(),
      due_on: isoDate.nullable(),
      evidence: z.string(),
    }),
  ),
  assumptions: z.array(z.string()),
});
export type Extraction = z.infer<typeof ExtractionSchema>;

export const ConflictResultSchema = z.object({
  results: z.array(
    z.object({
      new_index: z.number().int(),
      old_decision_id: z.number().int(),
      kind: z.enum(["contradicts", "supersedes", "consistent"]),
      reason: z.string(),
    }),
  ),
});

export const ExtractBodySchema = z.object({
  title: z.string().min(1),
  heldOn: isoDate,
  rawText: z.string().min(10),
  source: z.enum(["paste", "dictated"]),
});

export const ConfirmBodySchema = z.object({
  title: z.string().min(1),
  heldOn: isoDate,
  rawText: z.string(),
  source: z.enum(["paste", "dictated"]),
  decisions: z.array(
    z.object({
      text: z.string().min(1),
      topic: z.string(),
      resolution: z.enum(["replace", "keep_old"]).default("replace"),
      conflicts: z.array(
        z.object({
          old_decision_id: z.number().int(),
          kind: z.enum(["contradicts", "supersedes"]),
          reason: z.string(),
        }),
      ),
    }),
  ),
  actionItems: z.array(
    z.object({
      text: z.string().min(1),
      owner: z.string().nullable(),
      due_on: isoDate.nullable(),
    }),
  ),
  aliasEdits: z.array(z.object({ alias: z.string(), canonical: z.string() })).default([]),
});
