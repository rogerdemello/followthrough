import { NextResponse } from "next/server";
import { ExtractBodySchema } from "@/lib/schemas";
import { extractMeeting } from "@/lib/extract";
import { detectConflicts } from "@/lib/conflicts";
import { getActiveDecisions, getAliases, getPeople } from "@/lib/queries";
import { savedSampleDraft } from "@/lib/sample-fallback";
import { trackerLabel } from "@/lib/tracker";
import type { Draft } from "@/lib/types";

export const dynamic = "force-dynamic";

// Builds a draft only. Nothing is saved and nothing is posted until /api/confirm.
export async function POST(req: Request) {
  let body;
  try {
    body = ExtractBodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Add a title and a few words of recap." }, { status: 400 });
  }

  const active = getActiveDecisions();
  try {
    const extraction = await extractMeeting({
      heldOn: body.heldOn,
      rawText: body.rawText,
      knownPeople: getPeople(),
      aliases: getAliases(),
    });

    const conflictMap = await detectConflicts(extraction.decisions, active);

    const draft: Draft = {
      earlierDecisions: active.length,
      tracker: trackerLabel(),
      speakers: extraction.speakers,
      decisions: extraction.decisions.map((d, i) => ({
        ...d,
        conflicts: conflictMap.get(i) ?? [],
      })),
      action_items: extraction.action_items,
      assumptions: extraction.assumptions,
    };
    return NextResponse.json({ draft });
  } catch (err) {
    console.error("Extraction failed:", err);
    const saved = savedSampleDraft(body.rawText, active, trackerLabel());
    if (saved) return NextResponse.json({ draft: saved });
    const message = err instanceof Error ? err.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
