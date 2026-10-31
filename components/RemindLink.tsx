import { googleCalendarUrl } from "@/lib/calendar";

/** Opens a pre-filled calendar event for the task's due date. */
export default function RemindLink({
  title,
  dueOn,
  details,
}: {
  title: string;
  dueOn: string | null;
  details: string;
}) {
  if (!dueOn) return null;
  return (
    <a
      href={googleCalendarUrl(title, dueOn, details)}
      target="_blank"
      rel="noreferrer"
      title="Opens a calendar event for the due date"
      className="whitespace-nowrap text-xs font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:bg-mark/50"
    >
      Add to calendar
    </a>
  );
}
