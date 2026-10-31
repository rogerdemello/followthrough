# Followthrough

**Meetings end. The promises shouldn't.**

Followthrough turns what was said in a meeting into work that gets done. Speak or paste a recap, and it writes down who is doing what by when. It also tells you when today's meeting quietly contradicts an earlier decision.

Built for the Agentic AI Hackathon by Product Space x Wispr Flow, Track 3: meeting-to-execution agent.

- **Live demo:** https://followthrough-4ooj.onrender.com (click "Try the 2-minute demo"; the first load can take up to a minute while the free host wakes up)
- **Code:** this repository

## How it works

1. **Speak or paste a recap.** Dictate with Wispr Flow (or the built-in mic button) or paste a transcript. Filler words and self-corrections are fine.
2. **Review what it found.** Decisions, owners and deadlines are pulled out. Anything that contradicts an earlier decision is flagged, and you choose which one stands.
3. **Confirm to create tasks.** Nothing is saved or sent until you confirm. Tasks are then tracked per person, with a weekly digest and calendar reminders.

## What it does

- Cleans up messy speech: "Thursday, no wait, Friday" becomes the right date.
- Remembers earlier decisions and flags contradictions or changed plans across meetings.
- Asks you to confirm before anything is saved or posted.
- Creates tasks in a demo tracker, or as GitHub Issues when a token is configured.
- Per-person weekly digest, tick-off tasks, and one-click calendar reminders.

## Stack

Next.js (App Router) and TypeScript, SQLite via Node's built-in `node:sqlite`, Tailwind CSS. The AI step works with any OpenAI-compatible model API (tested with Gemini) or Anthropic's API, and returns schema-validated JSON.

## Run it

Needs Node 22.5+ (tested on Node 24).

```bash
npm install
cp .env.example .env.local   # then set LLM_* (e.g. Gemini) or ANTHROPIC_API_KEY (GitHub vars are optional)
npm run dev
```

Open http://localhost:3000 and click "Try the 2-minute demo". Without `GITHUB_TOKEN` and `GITHUB_REPO`, tasks go to a demo tracker.

`LLM_MODEL` accepts a comma-separated list. If one model is out of free quota, the next one is tried.

## Limits

- Works from text (dictated or pasted); it does not join live calls.
- Tasks go to a demo tracker unless GitHub is configured.
- Free-tier AI quotas are small, so heavy use can slow it down.
- Tasks are not yet linked to the decisions they depend on.

## Docs

| # | Doc | Purpose |
|---|-----|---------|
| 1 | [Overview and rules](docs/01-overview-and-rules.md) | Event facts, deadlines, track requirements |
| 2 | [Judging criteria playbook](docs/02-judging-criteria-playbook.md) | Each scoring criterion mapped to what was built |
| 3 | [PRD](docs/03-prd.md) | Persona, problem, scope, user flow |
| 4 | [Architecture](docs/04-architecture.md) | Stack, data model, extraction schema, conflict detection |
| 5 | [Build plan](docs/05-build-plan.md) | Timeboxed plan and cut lines |
| 6 | [Demo script and seed data](docs/06-demo-script-and-seed-data.md) | The 2-minute demo and sample meetings |
| 7 | [LinkedIn plan](docs/07-linkedin-plan.md) | Posting plan |
