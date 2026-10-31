# Followthrough: Meeting-to-Execution Agent

**Agentic AI Hackathon by Product Space x Wispr Flow, Track 3.**
Working name: *Followthrough* (rename freely).

> Turn what was said in a meeting (or dictated afterward) into decisions, owners and deadlines, catch when a new meeting contradicts an old decision, and push confirmed tasks into a tracker.

## Run it

Needs Node 22.5+ (uses the built-in `node:sqlite`; tested on Node 24).

```bash
npm install
cp .env.example .env.local   # then set LLM_* (e.g. Gemini) or ANTHROPIC_API_KEY (GitHub vars are optional)
npm run dev
```

Open http://localhost:3000, click **Reset demo data** (loads Meeting 1), then **New meeting → Load demo recap → Extract**. Without `GITHUB_TOKEN`/`GITHUB_REPO`, tasks go to a mock tracker.

## Docs

| # | Doc | Purpose |
|---|-----|---------|
| 1 | [Overview and rules](docs/01-overview-and-rules.md) | Event facts, deadlines, track requirements, open questions |
| 2 | [Judging criteria playbook](docs/02-judging-criteria-playbook.md) | Every scoring criterion mapped to what we build and what evidence we capture |
| 3 | [PRD](docs/03-prd.md) | Persona, problem, scope (P0/P1/P2), user flow, acceptance criteria |
| 4 | [Architecture](docs/04-architecture.md) | Stack, data model, extraction schema, conflict detection, API |
| 5 | [Build plan](docs/05-build-plan.md) | Timeboxed plan to the 31 Oct 11:59 PM IST deadline, cut lines |
| 6 | [Demo script and seed data](docs/06-demo-script-and-seed-data.md) | 2-minute demo, sample meetings that trigger the conflict moment |
| 7 | [LinkedIn plan](docs/07-linkedin-plan.md) | Three-post streak, drafts, tagging, engagement tactics |

## Non-negotiables

1. **Submit before 31 Oct 2026, 11:59 PM IST.** Aim for a working submission by 9:00 PM IST, then improve.
2. **Build by voice with Wispr Flow** and capture proof as we go (20% of score).
3. **Voice is also the product input**: messy dictated recap in, clean structured output out.
4. **Conflict detection and a confirmation step** are the differentiators. Protect time for both.
5. **Three LinkedIn posts**, tagging Product Space and Wispr Flow. Links due 1 Nov 11:59 PM IST.
