import Link from "next/link";
import StartDemoButton from "@/components/StartDemoButton";
import { STEPS } from "@/lib/steps";
import { btn, card } from "@/lib/ui";
import { countOpenActions, getActiveDecisions, listMeetings } from "@/lib/queries";

export const dynamic = "force-dynamic";

function Tile({ value, label, href }: { value: number; label: string; href: string }) {
  return (
    <Link href={href} className={`${card} block p-4 transition hover:border-indigo-300 hover:shadow`}>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </Link>
  );
}

export default function Home() {
  const meetings = listMeetings().length;
  const decisions = getActiveDecisions().length;
  const openTasks = countOpenActions();

  return (
    <div className="space-y-14">
      <section className="text-center sm:pt-4">
        <p className="mx-auto inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Meeting-to-execution agent
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Turn what was said in a meeting into work that gets done
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          Decisions get forgotten. Promises slip. A new meeting quietly reverses an old one.
          Followthrough catches all three.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <StartDemoButton large />
          <Link href="/meetings/new" className={`${btn.secondary} ${btn.large}`}>
            Use your own meeting
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-500">The guided demo takes about 2 minutes.</p>
      </section>

      <section aria-labelledby="how">
        <h2 id="how" className="sr-only">
          How it works
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className={`${card} relative p-6`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {s.n}
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Step {s.n}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${card} overflow-hidden`}>
        <div className="grid gap-0 md:grid-cols-2">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">What the demo shows</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Monday’s meeting is already saved: the beta launches on Nov 15 and payments use
              Stripe. Then you speak a messy Thursday recap, “Thursday, no wait, Friday” and all.
              Followthrough cleans it up and flags the two decisions it reverses before anything is
              saved.
            </p>
            <div className="mt-5">
              <StartDemoButton />
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 md:border-l md:border-t-0" aria-hidden>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Conflict found</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">Earlier · Product sync, Oct 26</p>
                <p className="mt-0.5 text-slate-900">Use Stripe as the payments provider</p>
              </div>
              <p className="text-center text-xs text-slate-400">is now contradicted by</p>
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
                <p className="text-xs text-amber-700">New · this recap</p>
                <p className="mt-0.5 text-slate-900">Payments provider switched from Stripe to Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {meetings > 0 && (
        <section aria-labelledby="ws">
          <h2 id="ws" className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Your workspace
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Tile value={meetings} label={meetings === 1 ? "meeting saved" : "meetings saved"} href="/meetings" />
            <Tile value={decisions} label="active decisions" href="/meetings" />
            <Tile value={openTasks} label="open tasks" href="/digest" />
          </div>
        </section>
      )}
    </div>
  );
}
