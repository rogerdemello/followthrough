# 05. Build Plan

Deadline: **31 Oct 2026, 11:59 PM IST.** Target a working, submitted version by **9:00 PM IST**; use the remaining time for polish and a resubmission if the form allows edits.

Adjust the clock times to when you actually start. The durations matter more than the times.

## Timeboxes

| Block | Duration | Goal | Exit check |
|-------|----------|------|-----------|
| 0. Setup | 30 min | Next.js app, Tailwind, DB, env vars, repo pushed | App runs locally |
| 1. Extraction | 60 min | Capture page, `/api/extract`, schema validation | Seed Meeting 1 extracts correctly |
| 2. Review and confirm UI | 60 min | Review screen, inline edit, confirm button | Can edit and confirm without errors |
| 3. Memory and conflicts | 60 min | Persist decisions, conflict check, resolve UI | Seed Meeting 2 flags both conflicts |
| 4. Task creation | 30 min | GitHub Issues adapter and mock fallback | Issues appear with links in UI |
| 5. Deploy | 30 min | Public URL, env vars set, seed loaded | Demo path works on the live URL |
| **Submit v1** | 15 min | Fill the submission form | Submitted |
| 6. Digest (P1) | 45 min | Per-person view | Priya's week renders |
| 7. Correction loop (P1) | 30 min | Alias table, applied in extraction | Edit once, see effect next time |
| 8. Polish | 45 min | Empty/loading/error states, copy, spacing | No rough edges on the demo path |
| 9. Demo video | 30 min | 2-minute recording | Uploaded, link ready |
| 10. Resubmit and LinkedIn | 30 min | Final submission, Post 3 | All links filed |

Total core (blocks 0-5): about 4.5 hours.

## Cut lines (what to drop first when behind)

1. Correction loop (P1)
2. Raw vs cleaned panel (P1)
3. Digest LLM summary paragraph; keep the plain list
4. Live GitHub integration; keep the mock tracker
5. Deploy polish; fall back to local demo plus video

**Never cut:** conflict detection, confirm-before-post, the seeded demo path, Wispr Flow evidence, submission before the deadline.

## Voice-build workflow

For every block, dictate with Wispr Flow into Claude/Cursor:
1. Dictate the goal in plain speech, including the acceptance check.
2. Let the tool generate; dictate fixes as you test.
3. Record a short clip for 3-5 of these moments (see evidence list in doc 02).
4. Dictate commit messages.

Keep a running note in `docs/voice-log.md`: timestamp, what you dictated, what it produced. This becomes the "How I built it by voice" section.

## Checklist: before submitting

- [ ] Public URL (or repo plus run instructions) works
- [ ] README opens with persona, pain and the 2-minute demo link
- [ ] Wispr Flow section: how it was used to build and in-product
- [ ] Known limits listed
- [ ] Demo video link
- [ ] Repo contains no secrets
- [ ] Submission form filled and confirmation saved (screenshot)

## Checklist: LinkedIn

- [ ] Post 1 published after starting (tags: Product Space, Wispr Flow)
- [ ] Post 2 published while building, with a Wispr Flow clip
- [ ] Post 3 published after submission, with the demo
- [ ] Links and engagement screenshots submitted by 1 Nov 11:59 PM IST

## Today's first message to organizers

> Hi, I couldn't attend the 12:30 PM kick-off call today. I've read the problem statements and I'm building Track 3. Can I still submit and be judged? Also, what does the submission form need (repo, demo link, video)?
