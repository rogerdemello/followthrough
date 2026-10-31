/** A Google Calendar "add event" link for an all-day reminder on the due date. No sign-in needed to build it. */
export function googleCalendarUrl(title: string, dueOn: string, details: string): string {
  const start = dueOn.replaceAll("-", "");
  const next = new Date(`${dueOn}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const end = next.toISOString().slice(0, 10).replaceAll("-", "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Due: ${title}`,
    dates: `${start}/${end}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
