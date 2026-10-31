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
            <span key={s.n} className={`h-1.5 flex-1 ${s.n <= current ? "bg-ink" : "bg-rule"}`} />
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold text-ink">
          Step {current} of 3 <span className="font-normal text-ink-2">· {active.title}</span>
        </p>
      </div>

      {/* Large screens */}
      <ol className="hidden lg:block" aria-label="Guided steps">
        {STEPS.map((s, i) => {
          const state = s.n === current ? "current" : s.n < current ? "done" : "todo";
          return (
            <li
              key={s.n}
              className="relative flex gap-4 pb-9 last:pb-0"
              aria-current={state === "current" ? "step" : undefined}
            >
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-[17px] top-10 h-[calc(100%-2.5rem)] w-px ${
                    state === "done" ? "bg-ink" : "bg-rule"
                  }`}
                />
              )}
              <span
                className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg font-semibold ${
                  state === "current"
                    ? "border-ink bg-ink text-paper shadow-[3px_3px_0_0_var(--color-accent)]"
                    : state === "done"
                      ? "border-ink bg-ink text-paper"
                      : "border-rule bg-paper text-muted"
                }`}
              >
                {state === "done" ? <Check /> : s.n}
              </span>
              <div className={state === "todo" ? "opacity-70" : ""}>
                <p className={`font-display text-lg font-semibold leading-tight ${state === "todo" ? "text-ink-2" : "text-ink"}`}>
                  {s.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
