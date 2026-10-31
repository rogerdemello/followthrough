import Link from "next/link";
import Photo from "@/components/Photo";
import ResetDemoButton from "@/components/ResetDemoButton";
import StartDemoButton from "@/components/StartDemoButton";
import { sourceLabel } from "@/lib/format";
import { btn, card, sectionLabelDark } from "@/lib/ui";
import { getActiveDecisions, listMeetings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function MeetingsPage() {
  const meetings = listMeetings();
  const decisions = getActiveDecisions();

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Meetings</h1>
          <p className="mt-1 text-sm text-slate-300">Everything you’ve confirmed so far.</p>
        </div>
        <div className="flex gap-2">
          <ResetDemoButton />
          <Link href="/meetings/new" className={`${btn.primary} !px-3.5 !py-1.5`}>
            New meeting
          </Link>
        </div>
      </div>

      <section>
        <h2 className={`mb-3 ${sectionLabelDark}`}>All meetings</h2>
        {meetings.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <Photo name="meeting" width={1000} className="absolute inset-0 h-full w-full opacity-40" />
            <div className="relative bg-gradient-to-t from-[#060a18]/90 to-[#060a18]/50 p-10 text-center">
              <p className="text-lg font-semibold text-white">No meetings yet</p>
              <p className="mt-1 text-sm text-slate-300">Start the guided demo, or add your own meeting.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <StartDemoButton />
                <Link href="/meetings/new" className={btn.glass}>
                  Add a meeting
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <ul className={`${card} divide-y divide-slate-100`}>
            {meetings.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/meetings/${m.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-4 transition hover:bg-indigo-50"
                >
                  <span className="font-semibold text-slate-900">{m.title}</span>
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
        <h2 className={sectionLabelDark}>Active decisions</h2>
        <p className="mb-3 mt-1 text-sm text-slate-300">
          The team’s memory. Every new meeting is checked against this list.
        </p>
        {decisions.length === 0 ? (
          <p className="text-sm text-slate-400">None yet. Decisions appear here after you confirm a meeting.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {decisions.map((d) => (
              <li key={d.id} className={`${card} px-5 py-4`}>
                <p className="text-sm font-medium text-slate-900">{d.text}</p>
                <p className="mt-1 text-xs text-slate-500">
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
