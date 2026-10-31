import { STEPS } from "@/lib/steps";

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The guided path. Vertical beside the wizard on large screens, compact on small ones. */
export default function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const active = STEPS[current - 1];
  return (
    <>
      {/* Small screens */}
      <div className="lg:hidden" role="group" aria-label={`Step ${current} of 3`}>
        <div className="flex gap-1.5">
          {STEPS.map((s) => (
            <span
              key={s.n}
              className={`h-1.5 flex-1 rounded-full ${s.n <= current ? "bg-gradient-to-r from-indigo-400 to-violet-400" : "bg-white/15"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Step {current} of 3 · {active.title}
        </p>
      </div>

      {/* Large screens */}
      <ol className="hidden lg:block" aria-label="Guided steps">
        {STEPS.map((s, i) => {
          const state = s.n === current ? "current" : s.n < current ? "done" : "todo";
          return (
            <li
              key={s.n}
              className="relative flex gap-4 pb-8 last:pb-0"
              aria-current={state === "current" ? "step" : undefined}
            >
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-0.5 ${
                    state === "done" ? "bg-indigo-400" : "bg-white/15"
                  }`}
                />
              )}
              <span
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  state === "current"
                    ? "bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg shadow-indigo-500/50 ring-4 ring-indigo-400/20"
                    : state === "done"
                      ? "bg-indigo-500 text-white"
                      : "border-2 border-white/25 bg-transparent text-slate-400"
                }`}
              >
                {state === "done" ? <Check /> : s.n}
              </span>
              <div className={state === "todo" ? "opacity-60" : ""}>
                <p className={`font-semibold ${state === "current" ? "text-white" : "text-slate-200"}`}>
                  {s.title}
                </p>
                <p className="mt-0.5 text-sm text-slate-400">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
