export default function TaskLink({ url }: { url: string | null }) {
  if (!url) return <span className="text-xs text-muted">not created</span>;
  if (url.startsWith("mock:")) {
    return (
      <span
        title="Demo mode: no GitHub repo is connected, so this task lives in the demo tracker."
        className="whitespace-nowrap rounded border border-ink/25 px-1.5 py-0.5 text-xs text-ink-2"
      >
        Demo tracker
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="whitespace-nowrap text-xs font-medium text-accent underline underline-offset-4 hover:text-ink"
    >
      GitHub issue ↗
    </a>
  );
}
