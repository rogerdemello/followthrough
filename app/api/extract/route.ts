import { NextResponse } from "next/server";
import { ExtractBodySchema } from "@/lib/schemas";
import { extractMeeting } from "@/lib/extract";
import { detectConflicts } from "@/lib/conflicts";
import { getActiveDecisions, getAliases, getPeople } from "@/lib/queries";
import { trackerLabel } from "@/lib/tracker";
import type { Draft } from "@/lib/types";

export const dynamic = "force-dynamic";

// Builds a draft only. Nothing is saved and nothing is posted until /api/confirm.
export async function POST(req: Request) {
  try {
    const body = ExtractBodySchema.parse(await req.json());

    const extraction = await extractMeeting({
      heldOn: body.heldOn,
      rawText: body.rawText,
      knownPeople: getPeople(),
      aliases: getAliases(),
    });

    const active = getActiveDecisions();
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
    const message = err instanceof Error ? err.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
