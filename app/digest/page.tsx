import Link from "next/link";
import TaskLink from "@/components/TaskLink";
import { card, sectionLabel } from "@/lib/ui";
import { getOpenActionsFor, getPeople, getSupersededDecisions, type ActionRow } from "@/lib/queries";

export const dynamic = "force-dynamic";

function daysBetween(fromISO: string, toISO: string): number {
  const ms = new Date(`${toISO}T00:00:00Z`).getTime() - new Date(`${fromISO}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

function Group({ title, items, tone }: { title: string; items: ActionRow[]; tone: string }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${tone}`}>
        {title} ({items.length})
      </h2>
      <ul className="space-y-2">
        {items.map((a) => (
          <li key={a.id} className={`${card} flex items-center justify-between gap-4 px-5 py-3 text-sm`}>
            <div>
              <p className="text-slate-900">{a.text}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {a.meeting_title} · due {a.due_on ?? "no date"}
              </p>
            </div>
            <TaskLink url={a.tracker_url} />
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
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Weekly digest</h1>
        <p className="mt-1 text-sm text-slate-600">
          Each person’s open tasks, grouped by urgency, plus the decisions that changed. Today is {today}.
        </p>
      </div>

      {people.length === 0 ? (
        <div className={`${card} p-8 text-center`}>
          <p className="font-medium text-slate-900">No tasks yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Confirm a meeting and each owner’s tasks will show up here.
          </p>
          <Link
            href="/meetings/new"
            className="mt-4 inline-block text-sm font-medium text-indigo-700 underline"
          >
            Add a meeting
          </Link>
        </div>
      ) : (
        <>
          <div>
            <p className={`mb-2 ${sectionLabel}`}>Choose a person</p>
            <div className="flex flex-wrap gap-2">
              {people.map((p) => (
                <Link
                  key={p}
                  href={`/digest?person=${encodeURIComponent(p)}`}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    p === selected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {open.length === 0 && <p className="text-sm text-slate-500">Nothing open for {selected}.</p>}
          <Group title="Overdue" items={overdue} tone="text-red-700" />
          <Group title="Due in the next 7 days" items={soon} tone="text-amber-700" />
          <Group title="Later" items={later} tone="text-slate-500" />
        </>
      )}

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>Decisions that changed</h2>
        {changed.length === 0 ? (
          <p className="text-sm text-slate-500">No decisions have been replaced yet.</p>
        ) : (
          <ul className="space-y-2">
            {changed.map((d) => (
              <li key={d.id} className={`${card} px-5 py-3 text-sm`}>
                <p className="text-slate-400 line-through">{d.text}</p>
                {d.replaced_text && <p className="mt-1 text-slate-900">→ {d.replaced_text}</p>}
                <p className="mt-1 text-xs text-slate-500">
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
