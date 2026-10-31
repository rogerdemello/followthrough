# 06. Demo Script and Seed Data

The demo is built around one moment: **a new meeting contradicts an earlier decision, and the agent catches it.**

## Scenario

Team: a six-person startup. People: Priya (PM), Rahul (engineering), Meera (design), Arjun (marketing).

- **Meeting 1: Mon 26 Oct, Product sync.** Clean transcript. Sets the beta date and the payments provider.
- **Meeting 2: Thu 29 Oct, dictated by Priya afterward.** Messy recap with filler words and a self-correction. Contradicts two earlier decisions.

## Meeting 1 transcript (paste mode)

```
Priya: Okay, let's lock the plan. We're launching the beta on November 15th.
Rahul: Fine by me. For payments I'd go with Stripe, it's what I know best.
Priya: Agreed, Stripe it is. Rahul, can you have the payments integration done by November 8th?
Rahul: Yes, November 8th works.
Meera: I'll finish the onboarding screens by November 5th.
Arjun: I'll draft the launch announcement and share it by November 10th.
Priya: Great. Let's also keep the beta invite-only for the first two weeks.
```

**Expected extraction**
- Decisions: beta launches 15 Nov; payments provider is Stripe; beta is invite-only for the first two weeks.
- Actions: Rahul, payments integration, 2026-11-08; Meera, onboarding screens, 2026-11-05; Arjun, launch announcement, 2026-11-10.

## Meeting 2 recap (dictate mode, messy on purpose)

Speak this with Wispr Flow, or paste it as-is:

```
Okay so, um, quick recap of today's call with the team. So basically we talked about, uh, the beta
date and honestly it's not going to work, Rahul said payments needs more time, so we're pushing the
beta to December 1st. And on payments, um, Rahul found out Stripe is a pain for Indian customers,
so we're going to switch to Razorpay instead. Rahul will own that, he'll have it done by, uh,
Thursday, no wait, Friday the 13th of November. Meera needs to update the onboarding screens for
the new payment flow, that's by November 18th. Oh and Arjun should move the launch announcement
to the week of November 23rd, I'll say the 24th. Anyway, that's it.
```

**Expected extraction (what a correct agent returns)**
- Decisions: beta moves to 1 Dec; payments provider switches to Razorpay.
- Actions: Rahul, Razorpay integration, 2026-11-13 (self-correction applied: Friday); Meera, update onboarding for new payment flow, 2026-11-18; Arjun, move launch announcement, 2026-11-24.

**Expected conflicts**
1. "Beta moves to 1 Dec" **supersedes** "Beta launches 15 Nov" (Meeting 1, Mon 26 Oct).
2. "Switch to Razorpay" **contradicts** "Payments provider is Stripe" (Meeting 1, Mon 26 Oct).

Note: 13 Nov 2026 is a Friday, so the "Friday the 13th" self-correction is consistent. Verify weekdays in code, not by eye.

## The 2-minute demo

| Time | Show | Say (short) |
|------|------|-------------|
| 0:00-0:15 | Title slide or README top | "Priya loses decisions between meetings. Followthrough turns recaps into tracked work and catches contradictions." |
| 0:15-0:35 | Wispr Flow clip: dictating the messy recap | "I speak the recap, fillers, self-corrections and all. Built entirely by voice with Wispr Flow." |
| 0:35-0:55 | Click Extract; show raw vs cleaned | "It cleans the speech: Friday, not Thursday. Owners and dates are structured." |
| 0:55-1:25 | Conflict badges; open one | "It remembers Monday's meeting. Stripe is flagged as contradicted. The beta date is flagged as superseded." |
| 1:25-1:40 | Resolve both: Replace with new; edit one owner | "Nothing is posted until I confirm." |
| 1:40-1:55 | Click Confirm; show created issues | "Tasks land in GitHub with owner and due date." |
| 1:55-2:10 | Digest page for Rahul | "Each person gets a weekly view: what's due, what changed." |

Close with one line on limits and roadmap: text input today; reminders, live capture and more trackers next.

## Seed instructions

- `seed/data.ts` contains both meetings' text and Meeting 1's expected decisions and actions.
- `POST /api/seed` (the **Reset demo data** button) wipes the database and loads Meeting 1 as already confirmed, so the live demo starts at Meeting 2. The **Load demo recap** button on the New meeting page fills in Meeting 2.
- Use a throwaway GitHub repo for the issues, so the demo can run repeatedly.

## Backup plan

- Record the full demo video first, before polishing.
- If the live API is slow: cached extraction response for the seed text, behind a `DEMO_CACHE=1` flag.
- If GitHub fails: the mock tracker shows the same flow.
