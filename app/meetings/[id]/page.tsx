import Link from "next/link";
import { notFound } from "next/navigation";
import TaskLink from "@/components/TaskLink";
import { sourceLabel } from "@/lib/format";
import { card, sectionLabel } from "@/lib/ui";
import { getActionsForMeeting, getDecisionsForMeeting, getMeeting } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meeting = getMeeting(Number(id));
  if (!meeting) notFound();

  const decisions = getDecisionsForMeeting(meeting.id);
  const actions = getActionsForMeeting(meeting.id);

  return (
    <div className="space-y-10">
      <div>
        <Link href="/meetings" className="text-sm text-slate-500 hover:text-slate-900">
          ← All meetings
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{meeting.title}</h1>
        <p className="text-sm text-slate-500">
          {meeting.held_on} · {sourceLabel(meeting.source)}
        </p>
      </div>

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>Decisions</h2>
        {decisions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No decisions were saved from this meeting (you may have kept the earlier ones instead).
          </p>
        ) : (
          <ul className="space-y-2">
            {decisions.map((d) => (
              <li key={d.id} className={`${card} px-5 py-3 text-sm`}>
                <p className={d.status === "superseded" ? "text-slate-400 line-through" : "text-slate-900"}>
                  {d.text}
                </p>
                {d.status === "superseded" && (
                  <p className="mt-1 text-xs text-amber-700">
                    Replaced by a later decision, so it no longer applies.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>Action items</h2>
        {actions.length === 0 ? (
          <p className="text-sm text-slate-500">No action items.</p>
        ) : (
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Task</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 font-semibold">Due</th>
                  <th className="px-5 py-3 font-semibold">Tracker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {actions.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3 text-slate-900">{a.text}</td>
                    <td className="px-5 py-3">{a.owner ?? "—"}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{a.due_on ?? "—"}</td>
                    <td className="px-5 py-3">
                      <TaskLink url={a.tracker_url} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>Original text</h2>
        <pre className={`${card} whitespace-pre-wrap p-5 font-sans text-sm leading-relaxed text-slate-700`}>
          {meeting.raw_text}
        </pre>
      </section>
    </div>
  );
}
