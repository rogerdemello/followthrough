import { googleCalendarUrl } from "@/lib/calendar";

/** "Remind me" link that opens a pre-filled calendar event for the task's due date. */
export default function RemindLink({
  title,
  dueOn,
  details,
  tone = "light",
}: {
  title: string;
  dueOn: string | null;
  details: string;
  tone?: "light" | "dark";
}) {
  if (!dueOn) return null;
  return (
    <a
      href={googleCalendarUrl(title, dueOn, details)}
      target="_blank"
      rel="noreferrer"
      title="Add a calendar reminder for the due date"
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition ${
        tone === "dark"
          ? "border border-white/15 bg-white/10 text-slate-100 hover:bg-white/20"
          : "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
      }`}
    >
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="4.5" width="14" height="12" rx="2" />
        <path d="M3 8.5h14M7 3v3M13 3v3" strokeLinecap="round" />
      </svg>
      Remind me
    </a>
  );
}
