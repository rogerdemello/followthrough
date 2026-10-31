# 02. Judging Criteria Playbook

Scoring is out of 100, plus a LinkedIn engagement bonus. This doc maps each criterion to what we build and the evidence we capture. "What judges look for" is our inference from the criterion names; the pages give only the weights.

## Scorecard

| Criterion | Weight | Our target |
|-----------|--------|------------|
| Wispr Flow usage (how voice was used to build the product) | 20 | Voice used for building *and* as product input, with visible proof |
| Prototype quality and UX | 20 | Two or three flows end to end, polished, no bugs on the demo path |
| AI integration | 20 | Structured extraction, memory, conflict reasoning, learning from corrections |
| Problem understanding | 15 | One specific persona and a real scenario, with honest limits |
| LinkedIn content and engagement | 15 | Three timely, specific posts, fast replies |
| Innovation and creativity | 10 | Conflict detection across meetings, voice-first capture, confirm-before-post |
| **Total** | **100** | |
| LinkedIn engagement bonus | +6 to +10 | Rank by likes plus comments: top +10, 2nd-3rd +9, 4th-7th +8, 8th-15th +7, all other posters +6 |

Judges look at Wispr Flow usage "in your submission and your LinkedIn posts," so evidence must appear in both places.

---

## 1. Wispr Flow usage (20%)

**What judges look for:** real, visible use of voice in the build process and in the product, not a mention.

**What we do**
- Dictate every prompt, spec, bug fix and commit message into Claude/Cursor with Wispr Flow.
- Product input mode "Dictate a recap": the user speaks a messy recap, and the agent cleans it (fillers, self-corrections like "no wait, Friday not Thursday") into structured output.
- Show a before/after panel in the UI: raw dictated text on the left, cleaned structure on the right.

**Evidence to capture (do this as we go)**
- [ ] 3-5 screen recordings (10-20 s each) of dictating a prompt and the result
- [ ] Screenshot of Wispr Flow stats/history if available
- [ ] One self-correction example that the product handles correctly
- [ ] A "How I built it by voice" section in the submission and in LinkedIn post 2

**Done when:** a stranger watching the 2-minute demo sees voice used in the build and in the product.

## 2. Prototype quality and UX (20%)

**What judges look for:** it works, it looks intentional, the flow is obvious.

**What we do**
- One clear path: Capture, Review, Confirm, Tasks created.
- A review screen that shows extracted items editable inline, with conflicts highlighted.
- Seeded demo data so the demo never depends on a live upload or a flaky API.
- Loading and error states for every AI call.

**Done when**
- [ ] The demo path runs 5 times in a row without a failure
- [ ] No unstyled screens, no placeholder text
- [ ] Works at laptop width; mobile is a nice-to-have

## 3. AI integration (20%)

**What judges look for:** AI doing real work in the product, with reliable structured output and some memory or learning, not a single prompt behind a textbox.

**What we do**
- Structured extraction with a JSON schema (decisions, action items, owners, deadlines, speakers).
- Memory of past decisions, queried on every new meeting.
- LLM conflict classification: contradicts / supersedes / consistent, with a one-line explanation.
- Correction loop: when the user edits an owner or deadline, store an alias or rule (for example "Raj" is "Rahul K.") and apply it to later meetings.
- Date normalization: "by next Friday" becomes an ISO date relative to the meeting date.

**Done when**
- [ ] Extraction output validates against the schema for all seed transcripts
- [ ] The conflict moment fires on the seeded Meeting 2
- [ ] One visible example of the correction loop changing a later output

## 4. Problem understanding (15%)

**What judges look for:** a sharp problem, a defined user, evidence the builder understands the pain.

**What we do**
- Persona: Priya, PM at a 6-person startup, who loses decisions and action items between standups and reverses decisions by accident.
- State the pain in one sentence: *decisions get made, forgotten, and contradicted; action items have no owner or date.*
- Use a realistic scenario in the demo (see doc 06).
- Name the limits honestly (transcripts only; one tracker; no live calendar capture).

**Done when:** the submission opens with persona, pain and scenario in under 100 words.

## 5. LinkedIn content and engagement (15% + bonus)

**What judges look for:** consistent, specific posts that show Wispr Flow usage and drive engagement.

**What we do:** see [doc 07](07-linkedin-plan.md). Three posts, real screenshots and a demo clip, both tags (Product Space and Wispr Flow), quick replies to every comment.

**Done when**
- [ ] Post 1 live right after we start building
- [ ] Post 2 live while building, with a Wispr Flow clip
- [ ] Post 3 live after submission, with the demo
- [ ] Links and engagement screenshots submitted before 1 Nov 11:59 PM IST

## 6. Innovation and creativity (10%)

**What we do**
- The conflict moment: "this contradicts what you decided on 27 Oct."
- Voice-first capture that handles self-corrections.
- Confirm-before-post: the agent never creates tasks without approval.
- A per-person weekly digest that pulls open tasks, due-soon items and decisions that changed.

---

## Track requirements mapped to priority

| Must-build item | Priority | Notes |
|-----------------|----------|-------|
| Transcript ingestion with speaker attribution | P0 | `Name: text` format; LLM infers speakers for dictated recaps |
| Extract decisions, actions, owners, deadlines | P0 | JSON schema |
| Conflict detection vs memory | P0 | The differentiator |
| Confirmation step | P0 | Cheap to build, and the brief requires it |
| Task creation via integration | P0 | GitHub Issues (real), with a mock fallback |
| Weekly digest per person | P1 | Generated view, not email |
| Reminders before deadlines | P2 | "Due in 48 hours" panel in the digest; no scheduler |

## Mistakes to avoid

- Spreading across all seven features and shipping none well
- A demo that depends on live network calls without fallbacks
- Posting LinkedIn content that reads like the raw template
- Forgetting evidence of Wispr Flow use until the end
- Submitting at 11:50 PM
