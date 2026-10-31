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
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="mt-1 text-sm text-slate-600">Everything you’ve confirmed so far.</p>
        </div>
        <div className="flex gap-2">
          <ResetDemoButton />
          <Link href="/meetings/new" className={`${btn.primary} !px-3 !py-1.5`}>
            New meeting
          </Link>
        </div>
      </div>

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>All meetings</h2>
        {meetings.length === 0 ? (
          <div className={`${card} p-8 text-center`}>
            <p className="font-medium text-slate-900">No meetings yet</p>
            <p className="mt-1 text-sm text-slate-600">
              Start the guided demo, or add your own meeting.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <StartDemoButton />
              <Link href="/meetings/new" className={btn.secondary}>
                Add a meeting
              </Link>
            </div>
          </div>
        ) : (
          <ul className={`${card} divide-y divide-slate-100`}>
            {meetings.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/meetings/${m.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-4 transition hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-900">{m.title}</span>
                  <span className="text-sm text-slate-500">
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
        <p className="mb-3 mt-1 text-sm text-slate-600">
          The team’s memory. Every new meeting is checked against this list.
        </p>
        {decisions.length === 0 ? (
          <p className="text-sm text-slate-500">None yet. Decisions appear here after you confirm a meeting.</p>
        ) : (
          <ul className="space-y-2">
            {decisions.map((d) => (
              <li key={d.id} className={`${card} px-5 py-3`}>
                <p className="text-sm text-slate-900">{d.text}</p>
                <p className="mt-0.5 text-xs text-slate-500">
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
