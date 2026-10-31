import Link from "next/link";
import { notFound } from "next/navigation";
import RemindLink from "@/components/RemindLink";
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
    <div className="space-y-12">
      <div className="border-b-2 border-ink pb-4">
        <Link href="/meetings" className="text-sm text-ink-2 underline-offset-4 hover:underline">
          ← All meetings
        </Link>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{meeting.title}</h1>
        <p className="text-sm text-muted">
          {meeting.held_on} · {sourceLabel(meeting.source)}
        </p>
      </div>

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>Decisions</h2>
        {decisions.length === 0 ? (
          <p className="text-sm text-muted">
            No decisions were saved from this meeting (you may have kept the earlier ones instead).
          </p>
        ) : (
          <ul className="space-y-3">
            {decisions.map((d) => (
              <li key={d.id} className={`${card} px-5 py-3 text-sm`}>
                <p className={d.status === "superseded" ? "text-muted line-through decoration-accent decoration-2" : "font-medium"}>
                  {d.text}
                </p>
                {d.status === "superseded" && (
                  <p className="mt-1 text-xs text-accent">Replaced by a later decision, so it no longer applies.</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className={`mb-3 ${sectionLabel}`}>Action items</h2>
        {actions.length === 0 ? (
          <p className="text-sm text-muted">No action items.</p>
        ) : (
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-ink/20 text-xs text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Task</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 font-semibold">Due</th>
                  <th className="px-5 py-3 font-semibold">Tracker</th>
                  <th className="px-5 py-3 font-semibold">
                    <span className="sr-only">Reminder</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {actions.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3 font-medium">{a.text}</td>
                    <td className="px-5 py-3">{a.owner ?? "—"}</td>
                    <td className="whitespace-nowrap px-5 py-3">{a.due_on ?? "—"}</td>
                    <td className="px-5 py-3">
                      <TaskLink url={a.tracker_url} />
                    </td>
                    <td className="px-5 py-3">
                      <RemindLink
                        title={a.text}
                        dueOn={a.due_on}
                        details={`From ${meeting.title}. Owner: ${a.owner ?? "unassigned"}.`}
                      />
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
        <pre className={`${card} whitespace-pre-wrap p-5 font-sans text-sm leading-relaxed text-ink-2`}>
          {meeting.raw_text}
        </pre>
      </section>
    </div>
  );
}
