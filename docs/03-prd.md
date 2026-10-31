# 03. Product Requirements

## Problem

Teams decide things in meetings, then forget them, never assign an owner, or contradict them a week later. Summaries exist, but they don't track commitments, remember earlier decisions or push work into the tools where it gets done.

## Persona

**Priya, PM at a 6-person startup.** Runs 4-5 meetings a week. Speaks her recaps after meetings (faster than typing, messy, full of self-corrections). Uses GitHub Issues for tasks. Wants: nothing falls through the cracks, and no one silently reverses a decision.

## One-line pitch

Speak or paste a meeting recap; get decisions, owners and deadlines; get warned when it contradicts an earlier decision; confirm; and tasks appear in your tracker.

## Scope

### P0: must ship

1. **Capture**: paste a transcript (`Speaker: text`) or dictate a free-form recap. Meeting title and date are set on capture.
2. **Extract**: the LLM returns structured decisions, action items (owner, due date), and speakers. Messy speech is cleaned (fillers, "no wait, Friday").
3. **Memory**: decisions and actions persist across meetings.
4. **Conflict detection**: each new decision is compared with active past decisions. Output: `contradicts`, `supersedes` or `consistent`, plus a one-line reason and a link to the old meeting.
5. **Review and confirm**: the user sees all extracted items, edits inline, resolves conflicts (keep old / replace with new), then clicks Confirm. Nothing is posted before this.
6. **Task creation**: confirmed actions become GitHub Issues (assignee label, due date in body), with links stored. Mock tracker fallback if no token.

### P1: ship if time allows

7. **Weekly digest per person**: open tasks, due in the next 7 days, overdue, decisions that changed.
8. **Correction loop**: edits to owner names or dates are remembered (name aliases) and applied next time.
9. **Raw vs cleaned view**: the before/after panel that shows voice cleanup.

### P2: mention in the roadmap, do not build

10. Real reminder scheduling (email, Slack)
11. Live meeting capture and calendar integration
12. Multiple trackers; auth and teams

## User flow

1. **Meetings** page, then **New meeting**: title, date, paste or dictate text.
2. Click **Extract**. Loading state. The review screen appears.
3. **Review**: three sections.
   - Decisions (each with a conflict badge if any)
   - Action items (owner, due date, editable)
   - Detected speakers and any assumptions the agent made
4. For each conflict: **Keep previous** or **Replace with new**. Replacing marks the old decision `superseded`.
5. Click **Confirm and create tasks**. Success state shows issue links.
6. **Digest** page: pick a person, see their week.

## Acceptance criteria

- [ ] A messy dictated recap with a self-correction produces the corrected deadline.
- [ ] Meeting 2 in the seed data flags exactly two conflicts with Meeting 1.
- [ ] No task is created before Confirm.
- [ ] Confirmed tasks appear as GitHub Issues (or in the mock tracker) with links in the UI.
- [ ] Restarting the app preserves meetings, decisions and actions.
- [ ] The demo path runs five times without error.

## Out of scope / known limits (state honestly in the submission)

- Text input only; no audio ingestion (voice enters via Wispr Flow dictation into the text box)
- Speaker attribution depends on the transcript format or on names mentioned in the recap
- One tracker integration
- Single workspace, no auth

## Success metrics (for the pitch)

- Time from recap to tracked tasks: under 1 minute
- Conflicts caught in the demo scenario: 2 of 2
- Fields extracted correctly in seed data (owner, due date): 100% on the demo path
