"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RemindLink from "@/components/RemindLink";
import Spinner from "@/components/Spinner";
import { useStreak } from "@/components/StreakBadge";
import Stepper from "@/components/Stepper";
import TaskLink from "@/components/TaskLink";
import { recordActivity } from "@/lib/streak";
import type { ConfirmResult, ConflictInfo, Draft } from "@/lib/types";
import { btn, card, input, sectionLabel } from "@/lib/ui";
import { MEETING2 } from "@/seed/data";

type Source = "paste" | "dictated";
type Resolution = "replace" | "keep_old";

type ReviewDecision = {
  text: string;
  topic: string;
  conflicts: ConflictInfo[];
  resolution: Resolution;
};

type ReviewAction = {
  text: string;
  owner: string;
  originalOwner: string | null;
  due_on: string;
  evidence: string;
  include: boolean;
};

const ANALYZING_MESSAGES = [
  "Reading your recap…",
  "Pulling out decisions, owners and deadlines…",
  "Checking earlier decisions for conflicts…",
];

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      {children}
    </label>
  );
}

function StepHeader({ step, title, body }: { step: number; title: string; body?: string }) {
  return (
    <header className="mb-6">
      <p className="hidden text-sm font-semibold text-accent lg:block">
        Step {step} of 3
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      {body && <p className="mt-1 text-sm text-ink-2">{body}</p>}
    </header>
  );
}

function Choice({
  selected,
  onSelect,
  title,
  meta,
  text,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  meta: string;
  text: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`rounded-md border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        selected
          ? "border-ink bg-card shadow-[3px_3px_0_0_var(--color-accent)]"
          : "border-ink/25 bg-white/70 hover:border-ink/50"
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span
          aria-hidden
          className={`h-4 w-4 shrink-0 rounded-full border-2 ${
            selected ? "border-ink bg-ink shadow-[inset_0_0_0_2px_var(--color-card)]" : "border-ink/50"
          }`}
        />
        {title}
      </span>
      <span className="mt-1 block text-xs text-muted">{meta}</span>
      <span className="mt-1 block text-sm text-ink">“{text}”</span>
    </button>
  );
}

export default function NewMeetingPage() {
  const streak = useStreak();
  const [title, setTitle] = useState("");
  const [heldOn, setHeldOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState<Source>("dictated");
  const [rawText, setRawText] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [meta, setMeta] = useState<{ earlierDecisions: number; tracker: string }>({
    earlierDecisions: 0,
    tracker: "",
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [decisions, setDecisions] = useState<ReviewDecision[] | null>(null);
  const [actions, setActions] = useState<ReviewAction[]>([]);
  const [result, setResult] = useState<ConfirmResult | null>(null);

  function loadSample() {
    setTitle(MEETING2.title);
    setHeldOn(MEETING2.heldOn);
    setSource(MEETING2.source);
    setRawText(MEETING2.text);
    setError(null);
  }

  // "Start the guided demo" on the home page links here with ?demo=1.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("demo") === "1") {
      loadSample();
      setDemoMode(true);
    }
  }, []);

  // Rotate the progress message while the model works.
  useEffect(() => {
    if (!loading || decisions) return;
    setMessageIndex(0);
    const id = setInterval(() => setMessageIndex((i) => Math.min(i + 1, ANALYZING_MESSAGES.length - 1)), 3000);
    return () => clearInterval(id);
  }, [loading, decisions]);

  async function post<T>(url: string, payload: unknown): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Something went wrong");
    return data as T;
  }

  async function extract() {
    setLoading(true);
    setError(null);
    try {
      const { draft } = await post<{ draft: Draft }>("/api/extract", {
        title: title.trim(),
        heldOn,
        rawText,
        source,
      });
      setMeta({ earlierDecisions: draft.earlierDecisions, tracker: draft.tracker });
      setNotice(draft.notice ?? null);
      setSpeakers(draft.speakers);
      setAssumptions(draft.assumptions);
      setDecisions(draft.decisions.map((d) => ({ ...d, resolution: "replace" as Resolution })));
      setActions(
        draft.action_items.map((a) => ({
          text: a.text,
          owner: a.owner ?? "",
          originalOwner: a.owner,
          due_on: a.due_on ?? "",
          evidence: a.evidence,
          include: true,
        })),
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const reason = err instanceof Error ? err.message : "unknown error";
      setError(`We couldn’t analyze the recap: ${reason}. Your text is still here, so you can try again.`);
    } finally {
      setLoading(false);
    }
  }

  const keptDecisions = (decisions ?? []).filter(
    (d) => d.text.trim() && !(d.resolution === "keep_old" && d.conflicts.length > 0),
  );
  const chosenActions = actions.filter((a) => a.include && a.text.trim());
  const conflictCount = (decisions ?? []).filter((d) => d.conflicts.length > 0).length;
  const nothingToSave = keptDecisions.length === 0 && chosenActions.length === 0;

  async function confirm() {
    if (!decisions) return;
    setLoading(true);
    setError(null);
    try {
      const aliasEdits = chosenActions
        .filter(
          (a) =>
            a.originalOwner &&
            a.owner.trim() &&
            a.originalOwner.toLowerCase() !== a.owner.trim().toLowerCase(),
        )
        .map((a) => ({ alias: a.originalOwner as string, canonical: a.owner.trim() }));

      const res = await post<ConfirmResult>("/api/confirm", {
        title: title.trim(),
        heldOn,
        rawText,
        source,
        decisions: decisions
          .filter((d) => d.text.trim())
          .map((d) => ({
            text: d.text.trim(),
            topic: d.topic,
            resolution: d.resolution,
            conflicts: d.conflicts.map((c) => ({
              old_decision_id: c.old_decision_id,
              kind: c.kind,
              reason: c.reason,
            })),
          })),
        actionItems: chosenActions.map((a) => ({
          text: a.text.trim(),
          owner: a.owner.trim() || null,
          due_on: a.due_on || null,
        })),
        aliasEdits,
      });
      setResult(res);
      recordActivity();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const reason = err instanceof Error ? err.message : "unknown error";
      setError(`We couldn’t save this meeting: ${reason}. Nothing was created, so you can try again.`);
    } finally {
      setLoading(false);
    }
  }

  function updateAction(i: number, patch: Partial<ReviewAction>) {
    setActions((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  }

  function updateDecision(i: number, patch: Partial<ReviewDecision>) {
    setDecisions((prev) => prev && prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  }

  function startOver() {
    setResult(null);
    setDecisions(null);
    setActions([]);
    setTitle("");
    setRawText("");
    setError(null);
    setDemoMode(false);
  }

  const step: 1 | 2 | 3 = result ? 3 : decisions ? 2 : 1;
  const canExtract = title.trim().length > 0 && rawText.trim().length >= 10;

  let content: React.ReactNode;

  if (result) {
    // Step 3: done
    content = (
      <div>
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ok bg-ok-soft text-ok"
          aria-hidden
        >
          <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <StepHeader
          step={3}
          title="Done. Your tasks are created"
          body={`Saved ${plural(result.decisionsAdded, "decision")}${
            result.superseded > 0 ? `, retired ${plural(result.superseded, "earlier decision")}` : ""
          }, and created ${plural(result.actions.length, "task")} in ${meta.tracker || "the tracker"}.`}
        />
        {result.actions.length > 0 && (
          <ul className="space-y-2">
            {result.actions.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-4 rounded-md border border-rule px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-ink">{a.text}</p>
                  <p className="text-xs text-muted">
                    {a.owner ?? "Unassigned"} · due {a.due_on ?? "no date"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                  <TaskLink url={a.tracker_url} />
                  <RemindLink
                    title={a.text}
                    dueOn={a.due_on}
                    details={`From ${title}. Owner: ${a.owner ?? "unassigned"}.`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        {streak > 0 && (
          <p className="mt-5 rounded-md border border-accent bg-accent-soft px-4 py-3 text-sm text-ink">
            <span className="font-semibold">{streak} {streak === 1 ? "day" : "days"} in a row.</span> Come back tomorrow with the next
            recap to keep it going.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/digest" className={btn.primary}>
            See each person’s digest
          </Link>
          <Link href={`/meetings/${result.meetingId}`} className={btn.secondary}>
            View this meeting
          </Link>
          <button onClick={startOver} className={btn.ghost}>
            Add another meeting
          </button>
        </div>
      </div>
    );
  } else if (decisions) {
    // Step 2: review
    content = (
      <div>
        <StepHeader
          step={2}
          title={`Review “${title}”`}
          body={`Nothing is saved or sent until you confirm. Fix anything that looks wrong.${
            speakers.length > 0 ? ` People mentioned: ${speakers.join(", ")}.` : ""
          }`}
        />

        {notice && (
          <p className="mb-4 rounded-md border border-rule bg-paper px-4 py-3 text-sm text-ink-2">
            {notice}
          </p>
        )}
        <div
          role="status"
          className={`mb-8 rounded-md border px-4 py-3 text-sm ${
            conflictCount > 0
              ? "border-accent bg-accent-soft text-ink"
              : "border-ok/40 bg-ok-soft text-ok"
          }`}
        >
          {decisions.length === 0
            ? "No decisions were found in this recap, so there was nothing to compare."
            : meta.earlierDecisions === 0
              ? "There are no earlier decisions yet, so there was nothing to compare against."
              : conflictCount === 0
                ? `Checked against ${plural(meta.earlierDecisions, "earlier decision")}: no conflicts found.`
                : `Checked against ${plural(meta.earlierDecisions, "earlier decision")}: ${plural(conflictCount, "conflict")} found. Choose which decision should stand.`}
        </div>

        <section className="mb-10">
          <h2 className={sectionLabel}>Decisions</h2>
          <p className="mb-3 mt-1 text-sm text-ink-2">What the group settled on in this meeting.</p>
          {decisions.length === 0 && <p className="text-sm text-muted">No decisions found in this recap.</p>}
          <div className="space-y-3">
            {decisions.map((d, i) => {
              const first = d.conflicts[0];
              return (
                <div key={i} className="rounded-md border border-rule p-4">
                  <Field label="Decision">
                    <input
                      className={input}
                      value={d.text}
                      onChange={(e) => updateDecision(i, { text: e.target.value })}
                    />
                  </Field>
                  {first && (
                    <div className="mt-4 rounded-md border border-accent bg-accent-soft p-4">
                      <p className="text-sm font-semibold text-ink">
                        {first.kind === "contradicts" ? "This contradicts an earlier decision" : "This changes an earlier decision"}
                      </p>
                      {d.conflicts.map((c) => (
                        <p key={c.old_decision_id} className="mt-0.5 text-sm text-ink-2">
                          {c.reason}
                        </p>
                      ))}
                      <p className="mb-2 mt-3 text-sm font-semibold text-ink">
                        Which one should stand?
                      </p>
                      <div role="radiogroup" aria-label="Which decision should stand" className="grid gap-2 sm:grid-cols-2">
                        <Choice
                          selected={d.resolution === "keep_old"}
                          onSelect={() => updateDecision(i, { resolution: "keep_old" })}
                          title="Keep the earlier decision"
                          meta={`${first.old_meeting} · ${first.old_date}${d.conflicts.length > 1 ? ` (+${d.conflicts.length - 1} more)` : ""}`}
                          text={first.old_text}
                        />
                        <Choice
                          selected={d.resolution === "replace"}
                          onSelect={() => updateDecision(i, { resolution: "replace" })}
                          title="Use the new decision"
                          meta="This recap"
                          text={d.text}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <h2 className={sectionLabel}>Action items</h2>
          <p className="mb-3 mt-1 text-sm text-ink-2">
            Tasks someone must do. Untick “Create task” to skip one.
          </p>
          {actions.length === 0 && <p className="text-sm text-muted">No action items found in this recap.</p>}
          <div className="space-y-3">
            {actions.map((a, i) => (
              <div
                key={i}
                className={`rounded-md border border-rule p-4 transition ${a.include ? "" : "bg-paper opacity-60"}`}
              >
                <div className="grid gap-3 sm:grid-cols-[1fr_10rem_9.5rem]">
                  <Field label="Task">
                    <input
                      className={input}
                      value={a.text}
                      onChange={(e) => updateAction(i, { text: e.target.value })}
                    />
                  </Field>
                  <Field label="Owner">
                    <input
                      className={input}
                      placeholder="Unassigned"
                      value={a.owner}
                      onChange={(e) => updateAction(i, { owner: e.target.value })}
                    />
                  </Field>
                  <Field label="Due date">
                    <input
                      type="date"
                      className={input}
                      value={a.due_on}
                      onChange={(e) => updateAction(i, { due_on: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="mt-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2 text-xs text-muted">
                  <p className="max-w-lg">
                    <span className="font-medium text-ink-2">From your recap:</span> “{a.evidence}”
                  </p>
                  <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-ink-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-ink"
                      checked={a.include}
                      onChange={(e) => updateAction(i, { include: e.target.checked })}
                    />
                    Create task
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {assumptions.length > 0 && (
          <section className="mb-10">
            <h2 className={`mb-2 ${sectionLabel}`}>Please double-check</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink-2">
              {assumptions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {error && (
          <p role="alert" className="mb-4 rounded-md bg-accent-soft p-3 text-sm text-accent">
            {error}
          </p>
        )}
        {nothingToSave && (
          <p className="mb-4 rounded-md border border-rule bg-paper p-3 text-sm text-ink-2">
            There is nothing to save yet. Go back and add more detail about what was decided or who will do what.
          </p>
        )}

        <div className="sticky bottom-0 -mx-5 -mb-5 mt-6 rounded-b-xl border-t border-rule bg-white/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:-mb-8 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={confirm} disabled={loading || nothingToSave} className={btn.primary}>
              {loading && <Spinner />}
              {loading
                ? "Saving…"
                : `Confirm: save ${plural(keptDecisions.length, "decision")} and create ${plural(chosenActions.length, "task")}`}
            </button>
            <button
              onClick={() => {
                setDecisions(null);
                setError(null);
              }}
              disabled={loading}
              className={btn.ghost}
            >
              ← Back to recap
            </button>
          </div>
          {meta.tracker && !nothingToSave && (
            <p className="mt-2 text-xs text-muted">Tasks will be created in {meta.tracker}.</p>
          )}
        </div>
      </div>
    );
  } else if (loading) {
    // Step 1, waiting on the model
    content = (
      <div className="flex flex-col items-center py-16 text-center" role="status" aria-live="polite">
        <Spinner className="h-8 w-8 text-accent" />
        <p className="mt-5 text-lg font-semibold text-ink">{ANALYZING_MESSAGES[messageIndex]}</p>
        <p className="mt-1 text-sm text-muted">This usually takes about 10 seconds.</p>
      </div>
    );
  } else {
    // Step 1: capture
    content = (
      <div>
        <StepHeader
          step={1}
          title="Speak or paste a recap"
          body="Click into the box and dictate with Wispr Flow, or paste a transcript. Filler words and self-corrections are fine."
        />

        {demoMode && (
          <div className="mb-6 rounded-md border border-ink/20 bg-mark/40 p-4 text-sm text-ink">
            <p className="font-semibold">Demo mode</p>
            <p className="mt-0.5">
              Monday’s meeting (beta on Nov 15, payments with Stripe) is already saved. This recap
              reverses both. Press <span className="font-semibold">Continue to review</span> to see them
              caught.
            </p>
          </div>
        )}

        <Field label="What was said">
          <textarea
            className={`${input} h-56 leading-relaxed`}
            placeholder="Click here and start talking, or paste your transcript…"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </Field>
        <p className="mt-2 text-xs text-muted">
          Tip: talk naturally. “Um”, “uh” and “Thursday, no wait, Friday” are handled.{" "}
          <button type="button" onClick={loadSample} className="font-medium text-ink underline">
            Load a sample recap
          </button>
        </p>

        <div className="mt-8">
          <h2 className={`mb-3 ${sectionLabel}`}>Meeting details</h2>
          <div className="grid gap-4 sm:grid-cols-[1fr_10rem_11rem]">
            <Field label="Title">
              <input
                className={input}
                placeholder="e.g. Product sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field label="Date held">
              <input type="date" className={input} value={heldOn} onChange={(e) => setHeldOn(e.target.value)} />
            </Field>
            <Field label="Input type">
              <select className={input} value={source} onChange={(e) => setSource(e.target.value as Source)}>
                <option value="dictated">Dictated recap</option>
                <option value="paste">Pasted transcript</option>
              </select>
            </Field>
          </div>
          <p className="mt-2 text-xs text-muted">
            The date matters: “by Friday” is worked out relative to it.
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-md bg-accent-soft p-3 text-sm text-accent">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={extract} disabled={!canExtract} className={`${btn.primary} ${btn.large}`}>
            Continue to review →
          </button>
          {!canExtract && (
            <p className="text-xs text-muted">Add a title and a few words of recap to continue.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[19rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Stepper current={step} />
      </aside>
      <div className={`${card} p-5 sm:p-8`}>{content}</div>
    </div>
  );
}
