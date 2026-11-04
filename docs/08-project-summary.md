# 08. Project Summary

A single place that records what was asked, what was built, what was decided, and what is left. Written after the hackathon weekend (31 Oct to 1 Nov 2026).

## At a glance

| | |
|---|---|
| **Product** | Followthrough, a meeting-to-execution agent |
| **Event** | Agentic AI Hackathon by Product Space x Wispr Flow, Track 3 |
| **Team name on the form** | Echo |
| **Live app** | https://followthrough-4ooj.onrender.com |
| **Code** | https://github.com/rogerdemello/followthrough |
| **One line** | Speak or paste a meeting recap; get decisions, owners and deadlines; get warned when a new meeting contradicts an earlier decision; nothing is saved until you confirm. |

## The brief

- **Deadlines (IST):** project submission closed 31 Oct 2026, 11:59 PM. LinkedIn post links and engagement screenshots closed 1 Nov 2026, 11:59 PM.
- **Scoring (out of 100):** Wispr Flow usage 20, prototype quality and UX 20, AI integration 20, problem understanding 15, LinkedIn content and engagement 15, innovation 10. A LinkedIn engagement bonus of +6 to +10 applied on top.
- **Track 3 must-haves:** transcript ingestion with speakers, extraction of decisions, actions, owners and deadlines, conflict detection against earlier decisions, task creation through an integration, reminders, a weekly digest per person, and a confirmation step before anything is posted.
- **Kick-off call:** it was described as mandatory and could not be attended. The pages did not say whether missing it affects judging, so the organizers were to be asked.
- **Not stated on the pages:** team size, prizes, and what the submission must contain beyond the form fields.

## What was built

**The guided path (used everywhere in the product)**
1. Speak or paste a recap. Dictate with Wispr Flow or paste a transcript. Filler words and self-corrections are fine.
2. Review what it found. Decisions, owners and deadlines are pulled out. Anything that contradicts an earlier decision is flagged.
3. Confirm to create tasks. Nothing is saved or sent until you confirm. Then tasks are created and tracked per person.

**Features**
- Capture by pasting, by Wispr Flow dictation, or by the built-in mic button (browser speech recognition).
- Structured extraction with schema-validated output: decisions, action items, owners, due dates, the quote each came from, and assumptions to double-check.
- "Thursday, no wait, Friday" style self-corrections resolved to the final date.
- Memory of earlier decisions and conflict detection (contradicts or changes an earlier decision), with a side-by-side choice of which one stands.
- Confirmation step. Replaced decisions are marked superseded and stay on record.
- Task creation in a demo tracker, or GitHub Issues when a token is set.
- Per-person weekly digest (overdue, due in 7 days, later, done), tick-off tasks, and one-click calendar reminders.
- Return hooks: a "welcome back" list for returning visitors and a day streak kept in the browser.
- Usability: optional title, unfinished recap kept across refreshes, Ctrl+Enter to continue, plain-language errors, delete a meeting (restores the decisions it replaced).
- Interface: paper-and-ink look, serif headlines, taped photo prints, an ink-dot background that reacts to the cursor and clicks, interface scaled to 90%, eased mouse-wheel scrolling.

**Stack**
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
- SQLite through Node's built-in `node:sqlite`.
- AI through any OpenAI-compatible endpoint (used with Gemini) or Anthropic's API. `LLM_MODEL` takes a comma-separated list and falls through to the next model when one is out of free quota. Current order: `gemini-2.5-flash-lite`, `gemini-2.5-flash`, `gemini-3.5-flash`, `gemini-3-flash-preview`.
- Hosted free on Render (Singapore). `SEED_ON_EMPTY=1` reloads the demo data after the free disk is wiped.

See `docs/04-architecture.md` for the data model, extraction schema and conflict-detection design.

## How the work unfolded

1. **Choosing the track.** The five problem statements were read. Track 3 was picked because voice fits it naturally, it is fast to demo with seeded data, and conflict detection across meetings is a clear differentiator.
2. **Project docs.** A README and seven docs were written first: rules, a judging-criteria playbook, PRD, architecture, build plan, demo script and LinkedIn plan.
3. **Scaffold and AI backend.** The app was scaffolded and tested end to end. The first AI key was Gemini through an OpenAI-compatible adapter, so only one file talks to the model.
4. **Interface, three rounds.**
   - A first walk-through fixed clarity problems (unlabelled fields, an empty result that still offered Confirm, a dark 404 page).
   - A guided three-step wizard replaced the single form.
   - A dark, glassy redesign with a particle background was built, then rejected as looking machine-made. A warm editorial direction replaced it: paper palette, serif type, one accent colour, no gradients or emoji.
5. **Usability pass.** Speak-to-type, autosave, mark-done, delete-meeting and friendlier errors were added.
6. **Deployment.** A public GitHub repo was created and deployed on Render's free plan.
7. **Free-quota trouble and the fix.** Gemini's free tier allowed about 20 requests per day per model. The primary model ran out during testing, and the live demo slowed to nearly a minute as it walked down the model list. Fixes: a model fallback chain, a labelled saved-result fallback for the built-in sample recap only, and putting the fast lite model first (about 3 seconds per analysis).
8. **A wrong detail caught in review.** The fast model wrote "moved from November 1st" when the earlier decision said November 15. The conflict prompt was tightened to copy dates and names exactly, and rechecked.
9. **Demo video.** A captioned walkthrough of the live site was recorded with a script, then given an AI voiceover and the author's own 17-second Wispr Flow dictation clip. Overlapping voices at the join were fixed by holding the first frame while the lead-in line plays. Scrolling was smoothed. The video lives in `demo/` and is not in the repository.
10. **LinkedIn.** A "we shipped it" post with the video and a first comment with the links was published. A review found three fixes to make: tag Wispr Flow properly with `@`, disclose the AI voiceover, and change "sends" to "shows" for the digest. Two comments were answered.
11. **Submission form.** Fields: team name, video demo link (Google Drive, link sharing on), Wispr Flow usage screenshot, additional materials. A screenshot was cut from the author's own recording, and the additional-materials text was prepared.
12. **Commit attribution.** Co-author trailers were removed from all 10 commits and the history was force-pushed. GitHub's contributor sidebar is cached and may lag behind.

## Decisions and trade-offs

- **Depth over breadth.** A few flows made solid rather than all seven must-haves shallow. Reminders are calendar links, not a scheduler.
- **Confirm-before-save** is enforced on the server: extraction only builds a draft; `/api/confirm` is the only write path.
- **No fabricated evidence.** The Wispr Flow screenshot and clip come from a real recording. The saved-result fallback is limited to the sample recap and says so on screen. The AI voiceover is disclosed.
- **Free hosting means ephemeral data.** Meetings added on the live site do not survive a restart; the demo data reloads.
- **Gemini over Anthropic for the demo** because a free key was what was available.

## Known limits

- Text input only (dictated or pasted); it does not join live calls.
- Tasks go to a demo tracker unless GitHub is configured (the GitHub path is built but was not exercised live).
- Tasks are not linked to the decisions they depend on, so a task tied to a reversed decision stays open.
- The AI step depends on free-tier quotas.
- The first visit after idle can take up to a minute while the free host wakes up.
- Extraction quality is checked by hand on the sample recap, not by an automated test set.

## Reusable text

**Additional materials (submission form)**
> Followthrough: meeting-to-execution agent (Track 3). Live app: https://followthrough-4ooj.onrender.com (click "Try the 2-minute demo"). Code: https://github.com/rogerdemello/followthrough. Docs: https://github.com/rogerdemello/followthrough/tree/main/docs. How I used Wispr Flow: I dictated the demo recap straight into the app with Wispr Flow (the clip is in the video). Notes: the video's narration is an AI voice; the dictation clip is my own recording. The app uses free-tier AI, so it can be slow if the daily quota is used up.

**LinkedIn post (core points)**
Meetings end, the promises shouldn't. Problem: decisions get forgotten or quietly reversed, action items have no owner or date. It cleans up messy speech, remembers earlier decisions and flags contradictions, saves nothing until you confirm, and gives each person a digest with calendar reminders. Next: live call capture and linking tasks to decisions.

**Reply on "how do you test the corrected date?"**
> I tested with "Thursday, no wait, Friday the 13th" several times, and it picked the 13th each time. The review screen also shows the original quote next to the date, so you can catch mistakes before saving. No automated tests yet. How did you solve it?

## Status to confirm

These are the items that cannot be verified from the code and should be checked by hand:

- [ ] Project form submitted, with the confirmation screenshot saved
- [ ] LinkedIn post edited (Wispr Flow tagged, AI voiceover disclosed, "sends" changed to "shows")
- [ ] LinkedIn post link and engagement screenshot submitted
- [ ] Organizers asked about the missed kick-off
- [ ] Footer line "Built by voice with Wispr Flow" is accurate, or reworded
- [ ] Demo data on the live site reset to its starting state after any live testing

## If work continues

1. Add an owner to each conflict, so someone is responsible for resolving it.
2. Link tasks to the decisions they depend on, and flag open tasks when a decision is replaced.
3. Build an automated test set of recaps with corrections and conflicts.
4. Capture from live calls.
5. Connect a real tracker (GitHub Issues is built in) and move to paid or higher AI quota.
