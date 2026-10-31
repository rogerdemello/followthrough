import Link from "next/link";
import GlowCard from "@/components/GlowCard";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import ReturningOnly from "@/components/ReturningOnly";
import RotatingWord from "@/components/RotatingWord";
import StartDemoButton from "@/components/StartDemoButton";
import WelcomeBack from "@/components/WelcomeBack";
import type { PhotoKey } from "@/lib/photos";
import { STEPS } from "@/lib/steps";
import { btn, glass } from "@/lib/ui";
import { getActiveDecisions, getAllOpenActions, listMeetings } from "@/lib/queries";

export const dynamic = "force-dynamic";

const STEP_PHOTOS: PhotoKey[] = ["speak", "review", "confirm"];

function Tile({ value, label, href }: { value: number; label: string; href: string }) {
  return (
    <Link href={href} className="block">
      <GlowCard className="p-5">
        <p className="bg-gradient-to-r from-indigo-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent">
          {value}
        </p>
        <p className="mt-1 text-sm text-slate-300">{label}</p>
      </GlowCard>
    </Link>
  );
}

function Chip({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div
      className={`absolute z-10 max-w-[15rem] rounded-xl border border-white/15 bg-[#0b1226]/80 px-3 py-2 text-xs font-medium text-white shadow-xl shadow-black/40 backdrop-blur-md sm:text-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const meetings = listMeetings().length;
  const decisions = getActiveDecisions().length;
  const open = getAllOpenActions();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <ReturningOnly>
        <WelcomeBack open={open} today={today} />
      </ReturningOnly>

      {/* Hero */}
      <section className="grid items-center gap-12 pb-20 pt-4 lg:grid-cols-[1.05fr_1fr] lg:pt-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-100 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Meeting-to-execution agent
          </p>
          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Never lose another <RotatingWord words={["decision", "promise", "deadline", "owner", "follow-up"]} />{" "}
            from a meeting
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            Speak a messy recap. Followthrough pulls out who does what by when, and warns you the moment a
            new meeting quietly reverses an old decision.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StartDemoButton large />
            <Link href="/meetings/new" className={`${btn.glass} ${btn.large}`}>
              Use your own meeting
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
            {["About 2 minutes to try", "Catches contradictions", "Nothing saved until you confirm"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div aria-hidden className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500/40 via-fuchsia-500/25 to-cyan-400/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/50">
            <Photo name="hero" width={1100} priority className="aspect-[4/3] w-full" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#060a18]/70 via-transparent to-indigo-900/20" />
          </div>
          <Chip className="float-a left-2 top-6 sm:-left-5">🎙 “Thursday… no wait, Friday”</Chip>
          <Chip className="float-b right-2 top-[38%] border-amber-300/40 sm:-right-5">
            ⚠ Conflict caught
            <span className="block text-xs font-normal text-amber-200">Stripe → Razorpay</span>
          </Chip>
          <Chip className="float-c bottom-4 left-4 border-emerald-300/40 sm:-bottom-5 sm:left-8">
            ✓ 3 tasks created
            <span className="block text-xs font-normal text-emerald-200">First due Nov 13</span>
          </Chip>
        </div>
      </section>

      {/* Guided path */}
      <section aria-labelledby="how" className="pb-20">
        <Reveal>
          <h2 id="how" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps from talk to done
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-300">
            A guided path takes you through it. No setup, no training.
          </p>
        </Reveal>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.n}>
              <Reveal delay={i * 120} className="h-full">
                <GlowCard className="h-full">
                  <div className="relative h-44 overflow-hidden">
                    <Photo name={STEP_PHOTOS[i]} width={700} className="h-full w-full" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1226] via-[#0b1226]/20 to-transparent" />
                    <span className="absolute left-5 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-sm font-bold text-white shadow-lg">
                      {s.n}
                    </span>
                  </div>
                  <div className="p-6 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Step {s.n}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.body}</p>
                  </div>
                </GlowCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Demo showcase */}
      <section className="pb-20">
        <Reveal>
          <div className={`${glass} overflow-hidden`}>
            <div className="grid md:grid-cols-2">
              <div className="p-8 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">The 2-minute demo</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Watch it catch a reversal</h2>
                <p className="mt-3 leading-relaxed text-slate-300">
                  Monday’s meeting is already saved: the beta launches on Nov 15 and payments use Stripe. You
                  then speak a messy Thursday recap. Followthrough cleans it up and flags both decisions it
                  reverses before anything is saved.
                </p>
                <div className="mt-6">
                  <StartDemoButton />
                </div>
              </div>
              <div className="border-t border-white/10 bg-black/20 p-8 sm:p-10 md:border-l md:border-t-0" aria-hidden>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">⚠ Conflict found</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-slate-400">Earlier · Product sync, Oct 26</p>
                    <p className="mt-1 text-white">Use Stripe as the payments provider</p>
                  </div>
                  <p className="text-center text-xs text-slate-500">is now contradicted by</p>
                  <div className="rounded-xl border border-amber-300/40 bg-amber-300/10 p-4">
                    <p className="text-xs text-amber-200">New · this recap</p>
                    <p className="mt-1 text-white">Payments provider switched from Stripe to Razorpay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {meetings > 0 && (
        <section aria-labelledby="ws">
          <Reveal>
            <h2 id="ws" className="mb-4 text-xs font-semibold uppercase tracking-wider text-indigo-200/80">
              Live snapshot of your workspace
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Tile value={meetings} label={meetings === 1 ? "meeting saved" : "meetings saved"} href="/meetings" />
              <Tile value={decisions} label="active decisions" href="/meetings" />
              <Tile value={open.length} label="open tasks" href="/digest" />
            </div>
          </Reveal>
        </section>
      )}
    </div>
  );
}
