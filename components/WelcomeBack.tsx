import Link from "next/link";
import RemindLink from "@/components/RemindLink";
import { relativeDue } from "@/lib/format";
import type { ActionRow } from "@/lib/queries";
import { btn, glass } from "@/lib/ui";

const GRADIENTS = [
  "from-indigo-400 to-violet-500",
  "from-cyan-400 to-blue-500",
  "from-fuchsia-400 to-pink-500",
  "from-amber-300 to-orange-500",
  "from-emerald-300 to-teal-500",
];

function Avatar({ name }: { name: string | null }) {
  const label = name?.trim() || "?";
  const hash = [...label].reduce((n, c) => n + c.charCodeAt(0), 0);
  return (
    <span
      aria-hidden
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${GRADIENTS[hash % GRADIENTS.length]} text-sm font-bold text-white shadow-md`}
    >
      {label[0].toUpperCase()}
    </span>
  );
}

const TONE: Record<string, string> = {
  overdue: "text-red-300",
  soon: "text-amber-200",
  later: "text-slate-300",
  none: "text-slate-400",
};

/** Shown to returning visitors: what needs attention this week, and a nudge to add today's recap. */
export default function WelcomeBack({ open, today }: { open: ActionRow[]; today: string }) {
  const rows = open.map((a) => ({ a, due: relativeDue(a.due_on, today) }));
  const overdue = rows.filter((r) => r.due.tone === "overdue").length;
  const soon = rows.filter((r) => r.due.tone === "soon").length;
  const next = rows.slice(0, 4);

  return (
    <section className={`${glass} mb-12 p-6 sm:p-8`} aria-labelledby="welcome">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="welcome" className="text-2xl font-bold tracking-tight">
            Welcome back 👋
          </h2>
          <p className="mt-1 text-slate-300">
            {open.length === 0
              ? "You’re all caught up. Add today’s recap to keep it that way."
              : overdue > 0
                ? `${overdue} task${overdue === 1 ? " is" : "s are"} overdue and ${soon} more ${soon === 1 ? "is" : "are"} due this week.`
                : `${soon} task${soon === 1 ? " is" : "s are"} due this week.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/meetings/new" className={btn.primary}>
            Add today’s recap
          </Link>
          <Link href="/digest" className={btn.glass}>
            Open digest
          </Link>
        </div>
      </div>

      {next.length > 0 && (
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {next.map(({ a, due }) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <Avatar name={a.owner} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{a.text}</p>
                <p className="text-xs text-slate-400">
                  {a.owner ?? "Unassigned"} · <span className={TONE[due.tone]}>{due.label}</span>
                </p>
              </div>
              <RemindLink
                tone="dark"
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
