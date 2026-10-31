import Link from "next/link";
import RemindLink from "@/components/RemindLink";
import { relativeDue } from "@/lib/format";
import type { ActionRow } from "@/lib/queries";
import { btn } from "@/lib/ui";

const TONE: Record<string, string> = {
  overdue: "font-semibold text-accent",
  soon: "font-semibold text-ink",
  later: "text-ink-2",
  none: "text-muted",
};

/** Shown to returning visitors: what needs attention, and a nudge to add today's recap. */
export default function WelcomeBack({ open, today }: { open: ActionRow[]; today: string }) {
  const rows = open.map((a) => ({ a, due: relativeDue(a.due_on, today) }));
  const overdue = rows.filter((r) => r.due.tone === "overdue").length;
  const soon = rows.filter((r) => r.due.tone === "soon").length;
  const next = rows.slice(0, 4);

  const summary =
    open.length === 0
      ? "You’re all caught up. Add today’s recap to keep it that way."
      : overdue > 0
        ? `${overdue} ${overdue === 1 ? "task is" : "tasks are"} overdue, and ${soon} more ${soon === 1 ? "is" : "are"} due this week.`
        : soon > 0
          ? `${soon} ${soon === 1 ? "task is" : "tasks are"} due this week.`
          : "Nothing is due this week. Here’s what’s coming up.";

  return (
    <section className="mb-14 border-y-2 border-ink py-6" aria-labelledby="welcome">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="welcome" className="font-display text-3xl font-semibold tracking-tight">
            Welcome back.
          </h2>
          <p className="mt-1 text-ink-2">{summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/meetings/new" className={btn.primary}>
            Add today’s recap
          </Link>
          <Link href="/digest" className={btn.secondary}>
            Open digest
          </Link>
        </div>
      </div>

      {next.length > 0 && (
        <ul className="mt-5 divide-y divide-rule border-t border-rule">
          {next.map(({ a, due }) => (
            <li key={a.id} className="grid grid-cols-[2rem_1fr_auto] items-center gap-x-4 gap-y-1 py-3 sm:grid-cols-[2rem_1fr_9rem_auto]">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink font-display text-sm font-semibold"
              >
                {(a.owner ?? "?")[0].toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{a.text}</p>
                <p className="text-xs text-muted">{a.owner ?? "Unassigned"}</p>
              </div>
              <p className={`hidden text-sm sm:block ${TONE[due.tone]}`}>{due.label}</p>
              <RemindLink
                title={a.text}
                dueOn={a.due_on}
                details={`From ${a.meeting_title}. Owner: ${a.owner ?? "unassigned"}.`}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
