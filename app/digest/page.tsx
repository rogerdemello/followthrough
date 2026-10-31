import Link from "next/link";
import RemindLink from "@/components/RemindLink";
import TaskLink from "@/components/TaskLink";
import { daysBetween, relativeDue } from "@/lib/format";
import { btn, card, sectionLabel } from "@/lib/ui";
import { getOpenActionsFor, getPeople, getSupersededDecisions, type ActionRow } from "@/lib/queries";

export const dynamic = "force-dynamic";

function Group({ title, items, tone, today }: { title: string; items: ActionRow[]; tone: string; today: string }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className={`mb-2 font-display text-xl font-semibold ${tone}`}>
        {title} <span className="text-base font-normal text-muted">({items.length})</span>
      </h2>
      <ul className={`${card} divide-y divide-rule`}>
        {items.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
            <div>
              <p className="font-medium">{a.text}</p>
              <p className="mt-0.5 text-xs text-muted">
                {a.meeting_title} · {a.due_on ? `${a.due_on} (${relativeDue(a.due_on, today).label})` : "no date"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <TaskLink url={a.tracker_url} />
              <RemindLink
                title={a.text}
                dueOn={a.due_on}
                details={`From ${a.meeting_title}. Owner: ${a.owner ?? "unassigned"}.`}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function DigestPage({
  searchParams,
}: {
  searchParams: Promise<{ person?: string }>;
}) {
  const { person } = await searchParams;
  const people = getPeople();
  const selected = person && people.some((p) => p.toLowerCase() === person.toLowerCase()) ? person : people[0];

  const today = new Date().toISOString().slice(0, 10);
  const open = selected ? getOpenActionsFor(selected) : [];
  const overdue = open.filter((a) => a.due_on && a.due_on < today);
  const soon = open.filter((a) => a.due_on && a.due_on >= today && daysBetween(today, a.due_on) <= 7);
  const later = open.filter((a) => !a.due_on || daysBetween(today, a.due_on) > 7);
  const changed = getSupersededDecisions();

  return (
    <div className="space-y-12">
      <div className="border-b-2 border-ink pb-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Weekly digest</h1>
        <p className="mt-1 text-sm text-ink-2">
          Each person’s open tasks, grouped by urgency, plus the decisions that changed. Today is {today}.
        </p>
      </div>

      {people.length === 0 ? (
        <div className={`${card} p-10 text-center`}>
          <p className="font-display text-xl font-semibold">No tasks yet</p>
          <p className="mt-1 text-sm text-ink-2">Confirm a meeting and each owner’s tasks will show up here.</p>
          <Link href="/meetings/new" className={`${btn.primary} mt-5`}>
            Add a meeting
          </Link>
        </div>
      ) : (
        <>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-2">Whose week?</p>
            <div className="flex flex-wrap gap-2">
              {people.map((p) => (
                <Link
                  key={p}
                  href={`/digest?person=${encodeURIComponent(p)}`}
                  className={`rounded-md border px-4 py-1.5 text-sm font-semibold transition ${
                    p === selected
                      ? "border-ink bg-ink text-paper shadow-[3px_3px_0_0_var(--color-accent)]"
                      : "border-ink/30 bg-card text-ink hover:bg-paper-2"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {open.length === 0 && <p className="text-sm text-ink-2">Nothing open for {selected}.</p>}
          <Group title="Overdue" items={overdue} tone="text-accent" today={today} />
          <Group title="Due in the next 7 days" items={soon} tone="text-ink" today={today} />
          <Group title="Later" items={later} tone="text-ink-2" today={today} />
        </>
      )}

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>Decisions that changed</h2>
        {changed.length === 0 ? (
          <p className="text-sm text-muted">No decisions have been replaced yet.</p>
        ) : (
          <ul className="space-y-3">
            {changed.map((d) => (
              <li key={d.id} className={`${card} px-5 py-3 text-sm`}>
                <p className="text-muted line-through decoration-accent decoration-2">{d.text}</p>
                {d.replaced_text && <p className="mt-1 font-medium">→ {d.replaced_text}</p>}
                <p className="mt-1 text-xs text-muted">
                  Originally decided in {d.meeting_title} on {d.held_on}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
