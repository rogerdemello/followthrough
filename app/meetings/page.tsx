import Link from "next/link";
import ResetDemoButton from "@/components/ResetDemoButton";
import StartDemoButton from "@/components/StartDemoButton";
import { sourceLabel } from "@/lib/format";
import { btn, card, sectionLabel } from "@/lib/ui";
import { getActiveDecisions, listMeetings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function MeetingsPage() {
  const meetings = listMeetings();
  const decisions = getActiveDecisions();

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Meetings</h1>
          <p className="mt-1 text-sm text-ink-2">Everything you’ve confirmed so far.</p>
        </div>
        <div className="flex gap-2">
          <ResetDemoButton />
          <Link href="/meetings/new" className={`${btn.primary} !px-3.5 !py-1.5`}>
            New meeting
          </Link>
        </div>
      </div>

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>All meetings</h2>
        {meetings.length === 0 ? (
          <div className={`${card} p-10 text-center`}>
            <p className="font-display text-xl font-semibold">No meetings yet</p>
            <p className="mt-1 text-sm text-ink-2">Try the demo, or add your own meeting.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <StartDemoButton />
              <Link href="/meetings/new" className={btn.secondary}>
                Add a meeting
              </Link>
            </div>
          </div>
        ) : (
          <ul className={`${card} divide-y divide-rule`}>
            {meetings.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/meetings/${m.id}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4 transition hover:bg-mark/30"
                >
                  <span className="font-display text-lg font-semibold">{m.title}</span>
                  <span className="text-sm text-muted">
                    {m.held_on} · {sourceLabel(m.source)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className={sectionLabel}>Active decisions</h2>
        <p className="mb-3 mt-1 text-sm text-ink-2">
          The team’s memory. Every new meeting is checked against this list.
        </p>
        {decisions.length === 0 ? (
          <p className="text-sm text-muted">None yet. Decisions appear here after you confirm a meeting.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {decisions.map((d) => (
              <li key={d.id} className={`${card} border-l-4 border-l-ink px-5 py-4`}>
                <p className="font-medium">{d.text}</p>
                <p className="mt-1 text-xs text-muted">
                  {d.meeting_title} · {d.held_on}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
