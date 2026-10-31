# 04. Architecture

Optimized for one day: few moving parts, one language, local database.

## Stack (default; change if you prefer another)

| Layer | Choice | Why |
|-------|--------|-----|
| App | Next.js (App Router) + TypeScript | UI and API in one repo, easy to deploy |
| UI | Tailwind CSS + shadcn/ui | Fast, clean look |
| LLM | Claude via the Anthropic API (`claude-sonnet-5-5`) | Strong at structured extraction; tool use for JSON schema |
| DB | SQLite (`better-sqlite3`) with a tiny query layer | Zero setup, persists across restarts |
| Tracker | GitHub Issues REST API | One POST per task, free |
| Deploy | Render or Vercel (see note) | Public demo link for submission |

Note: SQLite on serverless hosts (Vercel) does not persist. If deploying there, use Render with a persistent disk, or seed the DB on boot for the demo. Decide before deploying.

## Components

```
Browser (Next.js UI)
   |  capture, review, confirm, digest
   v
API routes
   |-- /api/extract       -> LLM extraction + conflict check (no writes to tracker)
   |-- /api/confirm       -> persist final items, create issues
   |-- /api/digest        -> query per-person view
   v
SQLite  <---->  Anthropic API
   |
   +--> GitHub Issues API (only after confirm)
```

## Data model

```sql
meetings(id, title, held_on, raw_text, source TEXT /* paste | dictated */, created_at)

decisions(id, meeting_id, text, topic, status TEXT /* active | superseded */,
          superseded_by NULL, created_at)

action_items(id, meeting_id, text, owner, due_on NULL, status TEXT /* open | done */,
             tracker_url NULL, created_at)

conflicts(id, new_decision_id, old_decision_id, kind TEXT /* contradicts | supersedes */,
          reason, resolution TEXT /* pending | keep_old | replace */)

aliases(id, alias, canonical)  -- correction loop: "Raj" -> "Rahul K."
```

Extraction results are held as a draft (client state or a `draft_json` column) until the user confirms; only confirmed items are written to `decisions` and `action_items`.

## Extraction

One LLM call with a forced tool/JSON schema.

**Input:** `held_on` date, known people (from past meetings and aliases), raw text.

**Output schema**
```json
{
  "speakers": ["string"],
  "decisions": [{ "text": "string", "topic": "string" }],
  "action_items": [{
    "text": "string",
    "owner": "string | null",
    "due_on": "YYYY-MM-DD | null",
    "evidence": "short quote from the text"
  }],
  "assumptions": ["string"]
}
```

**Prompt rules**
- Ignore filler words and digressions.
- When the speaker corrects themselves ("Thursday, no wait, Friday"), use the final version.
- Resolve relative dates against `held_on`. If ambiguous, set `due_on` to null and add an assumption.
- Never invent an owner. Use null and flag it.
- Map names through the alias table to canonical names.
- Topic is a short normalized phrase (for example "payments provider", "beta launch date").

## Conflict detection

For each new decision, compare against active past decisions. The number of decisions per workspace is small in a hackathon, so pass all active decisions in one call (no embeddings needed).

**Input:** new decisions + list of active past decisions with ids, meeting titles and dates.

**Output**
```json
{
  "results": [{
    "new_index": 0,
    "old_decision_id": 12,
    "kind": "contradicts | supersedes | consistent",
    "reason": "one sentence"
  }]
}
```

Only `contradicts` and `supersedes` appear in the UI. If the user picks **Replace with new**, the old decision becomes `superseded` and `superseded_by` is set. If **Keep previous**, the new decision is dropped from the active set and noted.

Optimization if time allows: pre-filter by `topic` match before the LLM call.

## Task creation

On confirm, for each action item:
- `POST /repos/{owner}/{repo}/issues` with title, body (context + meeting link + due date), and labels (`owner:<name>`).
- Store the returned `html_url` in `action_items.tracker_url`.
- If `GITHUB_TOKEN` is missing, use a mock adapter that writes to a local "Tasks" board in the UI. The demo works either way.

## Digest

Query `action_items` by owner: open, due within 7 days, overdue. Query `decisions` where status changed in the last 7 days. Optionally a short LLM-written summary paragraph. Render as a page, not an email.

## Environment variables

```
ANTHROPIC_API_KEY=
GITHUB_TOKEN=          # optional; mock tracker used if empty
GITHUB_REPO=owner/name # target repo for issues
```

Never commit keys. Add `.env.local` to `.gitignore`.

## Folder layout (target)

```
/app
  /meetings/new
  /meetings/[id]/review
  /digest
  /api/extract, /api/confirm, /api/digest
/lib
  db.ts, llm.ts, extract.ts, conflicts.ts, tracker.ts
/seed
  meeting1.txt, meeting2.txt, seed.ts
/docs
```

## Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| LLM returns malformed JSON | Forced tool schema, validate with zod, one retry |
| API latency during demo | Cache seeded results; show loading state; record a backup video |
| GitHub token or rate issues | Mock tracker fallback |
| Wrong conflict flags | Show reason text; user resolves manually |
| Persistence on host | Choose Render with disk, or reseed on boot |
