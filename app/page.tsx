import Link from "next/link";
import Photo from "@/components/Photo";
import Print from "@/components/Print";
import Reveal from "@/components/Reveal";
import ReturningOnly from "@/components/ReturningOnly";
import StartDemoButton from "@/components/StartDemoButton";
import WelcomeBack from "@/components/WelcomeBack";
import type { PhotoKey } from "@/lib/photos";
import { STEPS } from "@/lib/steps";
import { card } from "@/lib/ui";
import { getActiveDecisions, getAllOpenActions, listMeetings } from "@/lib/queries";

export const dynamic = "force-dynamic";

const STEP_PHOTOS: PhotoKey[] = ["speak", "review", "confirm"];

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
      <section className="grid items-center gap-14 pb-24 pt-4 lg:grid-cols-[1.1fr_1fr] lg:pt-10">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-ink-2">
            <span aria-hidden className="inline-block h-2 w-2 bg-accent" />
            A follow-through tool for meetings
          </p>
          <h1 className="mt-4 text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            Meetings end. The <mark className="marker">promises</mark> shouldn’t.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            Talk through what happened, the way you’d tell a colleague. Followthrough writes down who’s doing
            what by when, and tells you when today’s meeting quietly undoes last week’s.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <StartDemoButton large />
            <Link href="/meetings/new" className="text-sm font-semibold underline decoration-accent decoration-2 underline-offset-4 hover:bg-mark/50">
              or use your own meeting →
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">Nothing is saved until you say so.</p>
        </div>

        <div className="relative mx-auto w-full max-w-md pb-16 lg:max-w-none">
          <Print name="hero" width={1000} priority caption="Planning, Monday morning" rotate="-2.5deg" className="relative max-w-lg" />
          <Print
            name="meeting"
            width={600}
            rotate="3deg"
            tape={false}
            className="absolute -bottom-6 right-0 hidden w-44 sm:block"
          />
          <div
            className="absolute -bottom-10 -left-2 w-52 rotate-[-4deg] bg-mark p-3 shadow-[0_10px_20px_-10px_rgba(27,26,23,0.5)] sm:-left-6"
            aria-hidden
          >
            <p className="font-hand text-xl leading-tight text-ink">“Thursday… no wait, Friday.”</p>
            <p className="mt-1 font-hand text-xl leading-tight text-accent">→ Fri 13 Nov. Got it.</p>
          </div>
        </div>
      </section>

      {/* Guided path */}
      <section aria-labelledby="how" className="border-t-2 border-ink pb-24 pt-10">
        <Reveal>
          <h2 id="how" className="font-display text-4xl font-semibold tracking-tight">
            How it works
          </h2>
          <p className="mt-2 max-w-xl text-ink-2">A guided path takes you through it. No setup, no training.</p>
        </Reveal>
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0">
          {STEPS.map((s, i) => (
            <li key={s.n} className={`md:px-6 ${i > 0 ? "md:border-l md:border-rule" : "md:pl-0"}`}>
              <Reveal delay={i * 120}>
                <div className="flex items-end gap-3">
                  <span className="font-display text-6xl font-semibold italic leading-none text-accent">{s.n}</span>
                  <span className="mb-1 text-sm font-medium text-muted">Step {s.n}</span>
                </div>
                <div className="relative mt-4 overflow-hidden border border-ink/15">
                  <Photo name={STEP_PHOTOS[i]} width={700} className="aspect-[4/3] w-full" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold leading-tight">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Demo showcase */}
      <section className="pb-24">
        <Reveal>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight">
                Watch it catch a reversal
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink-2">
                Monday’s meeting is already saved: the beta launches on Nov 15 and payments use Stripe. You then
                speak a messy Thursday recap. Followthrough cleans it up and flags both decisions it reverses,
                before anything is saved.
              </p>
              <div className="mt-6">
                <StartDemoButton />
              </div>
            </div>
            <div className={`${card} p-6 sm:p-8`} aria-hidden>
              <p className="text-sm font-medium text-muted">Product sync · Oct 26</p>
              <p className="mt-2 font-display text-2xl leading-snug">
                Use <span className="text-muted line-through decoration-accent decoration-2">Stripe</span>{" "}
                <span className="bg-mark px-1">Razorpay</span> as the payments provider
              </p>
              <p className="mt-5 border-l-2 border-accent bg-accent-soft py-2 pl-3 pr-2 text-sm text-ink">
                <span className="font-semibold">Conflict.</span> Thursday’s recap switches payments from Stripe to
                Razorpay. Which one should stand?
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {meetings > 0 && (
        <section aria-labelledby="ws" className="border-t border-rule pb-6 pt-8">
          <Reveal>
            <h2 id="ws" className="font-display text-xl font-semibold">
              Right now in this workspace
            </h2>
            <dl className="mt-4 grid max-w-xl grid-cols-3 gap-6">
              {[
                { v: meetings, l: meetings === 1 ? "meeting" : "meetings", href: "/meetings" },
                { v: decisions, l: "active decisions", href: "/meetings" },
                { v: open.length, l: "open tasks", href: "/digest" },
              ].map((t) => (
                <Link key={t.l} href={t.href} className="group block">
                  <dd className="font-display text-5xl font-semibold group-hover:text-accent">{t.v}</dd>
                  <dt className="text-sm text-ink-2 underline-offset-4 group-hover:underline">{t.l}</dt>
                </Link>
              ))}
            </dl>
          </Reveal>
        </section>
      )}
    </div>
  );
}
