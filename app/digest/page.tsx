import Link from "next/link";
import RemindLink from "@/components/RemindLink";
import TaskLink from "@/components/TaskLink";
import { daysBetween, relativeDue } from "@/lib/format";
import { btn, card, sectionLabelDark } from "@/lib/ui";
import { getOpenActionsFor, getPeople, getSupersededDecisions, type ActionRow } from "@/lib/queries";

export const dynamic = "force-dynamic";

function Group({ title, items, tone, today }: { title: string; items: ActionRow[]; tone: string; today: string }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${tone}`}>
        {title} ({items.length})
      </h2>
      <ul className="space-y-2">
        {items.map((a) => (
          <li key={a.id} className={`${card} flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm`}>
            <div>
              <p className="font-medium text-slate-900">{a.text}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {a.meeting_title} · {a.due_on ? `${a.due_on} (${relativeDue(a.due_on, today).label})` : "no date"}
              </p>
            </div>
            <div className="flex items-center gap-2">
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Weekly digest</h1>
        <p className="mt-1 text-sm text-slate-300">
          Each person’s open tasks, grouped by urgency, plus the decisions that changed. Today is {today}.
        </p>
      </div>

      {people.length === 0 ? (
        <div className={`${card} p-8 text-center`}>
          <p className="font-semibold text-slate-900">No tasks yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Confirm a meeting and each owner’s tasks will show up here.
          </p>
          <Link href="/meetings/new" className={`${btn.primary} mt-4`}>
            Add a meeting
          </Link>
        </div>
      ) : (
        <>
          <div>
            <p className={`mb-2 ${sectionLabelDark}`}>Choose a person</p>
            <div className="flex flex-wrap gap-2">
              {people.map((p) => (
                <Link
                  key={p}
                  href={`/digest?person=${encodeURIComponent(p)}`}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    p === selected
                      ? "border-transparent bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30"
                      : "border-white/20 bg-white/10 text-slate-100 hover:bg-white/20"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {open.length === 0 && <p className="text-sm text-slate-300">Nothing open for {selected}. 🎉</p>}
          <Group title="Overdue" items={overdue} tone="text-red-300" today={today} />
          <Group title="Due in the next 7 days" items={soon} tone="text-amber-200" today={today} />
          <Group title="Later" items={later} tone="text-slate-300" today={today} />
        </>
      )}

      <section>
        <h2 className={`mb-3 ${sectionLabelDark}`}>Decisions that changed</h2>
        {changed.length === 0 ? (
          <p className="text-sm text-slate-400">No decisions have been replaced yet.</p>
        ) : (
          <ul className="space-y-2">
            {changed.map((d) => (
              <li key={d.id} className={`${card} px-5 py-3 text-sm`}>
                <p className="text-slate-400 line-through">{d.text}</p>
                {d.replaced_text && <p className="mt-1 font-medium text-slate-900">→ {d.replaced_text}</p>}
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
