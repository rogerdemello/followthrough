export default function TaskLink({ url }: { url: string | null }) {
  if (!url) return <span className="text-xs text-slate-400">not created</span>;
  if (url.startsWith("mock:")) {
    return (
      <span
        title="Demo mode: no GitHub repo is connected, so this task lives in the demo tracker."
        className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
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
      className="whitespace-nowrap text-xs font-medium text-indigo-700 underline hover:text-indigo-900"
    >
      GitHub issue ↗
    </a>
  );
}
