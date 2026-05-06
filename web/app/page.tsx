import Link from "next/link";
import {
  Stethoscope,
  ArrowRight,
  Sparkles,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Ban,
  Github,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ─── HEADER ───────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">
              <Stethoscope size={18} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">Restore</span>
          </Link>
          <nav className="flex items-center gap-2 md:gap-4">
            <a
              href="https://github.com/rrmethodco/rrmethodco"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline-flex"
            >
              <Github size={14} />
              GitHub
            </a>
            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 md:px-4"
            >
              My Practice
              <ArrowRight size={14} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl md:leading-[1.1]">
              AI that wins dental claims back.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Restore watches your PMS, drafts every pre-auth narrative, claim appeal, and referral letter — and queues it up for one-click approval. Carrier intelligence that gets smarter every week.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/practice"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-700 px-6 py-3 text-base font-semibold text-white hover:bg-brand-800"
              >
                Open My Practice
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                See how it works
              </a>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-600 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-700" />
                BAA-grade
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-700" />
                PMS-native
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-700" />
                One-click approval
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-700" />
                &lt;1 month payback
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── IMPACT BAR ───────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-slate-100 px-0 md:grid-cols-4">
          <div className="bg-slate-50 px-6 py-8 text-center md:py-10">
            <div className="text-3xl font-bold text-slate-900 md:text-4xl">14.5h</div>
            <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">saved per week</div>
          </div>
          <div className="bg-slate-50 px-6 py-8 text-center md:py-10">
            <div className="text-3xl font-bold text-emerald-700 md:text-4xl">$214K</div>
            <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">recovered annually</div>
          </div>
          <div className="bg-slate-50 px-6 py-8 text-center md:py-10">
            <div className="text-3xl font-bold text-slate-900 md:text-4xl">+15pp</div>
            <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">approval rate lift</div>
          </div>
          <div className="bg-slate-50 px-6 py-8 text-center md:py-10">
            <div className="text-3xl font-bold text-slate-900 md:text-4xl">+22pp</div>
            <div className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">appeal win rate lift</div>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-4 py-3 text-center text-xs text-slate-400 md:px-8">
          Pilot estimates · 4-endodontist group · validated against 90-day baseline
        </p>
      </section>

      {/* ─── PROBLEM ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">The bleed</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Carriers deny 20-30% of valid claims. Most practices give up.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              An office manager bills at $40/hr. A 90-minute appeal letter for a claim that <em>might</em> get paid in three months is a losing bet — so it doesn't get written. Five-figure endo claims get written off because no one has time to fight.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              And generic "AI text generators" don't fix this. Every carrier wants a different narrative. Cigna wants anatomical specificity. Delta wants ADA-standard CDT terminology. MetLife wants conservative-alternatives-considered language. Without per-carrier intelligence, generic appeals lose 60-70% of the time.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">The math today</div>
            <ul className="mt-4 space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span><strong className="text-slate-900">$500K–$2M</strong> annually written off per practice in justified revenue</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span><strong className="text-slate-900">90+ minutes</strong> of office-manager time per appeal letter — labor cost often exceeds expected recovery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span><strong className="text-slate-900">35-50%</strong> success rate when practices draft appeals themselves — without carrier intelligence the math doesn't work</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span><strong className="text-slate-900">No learning loop</strong> — every appeal a practice writes loses its lessons the moment the case closes</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">How it works</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Watch. Draft. Approve. Done.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Restore lives inside your PMS. When something happens that needs a response, we draft it. The office manager reviews and submits in one click. Submission to clearinghouse + PMS document center is autonomous.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Trigger",
                body: "PBS Endo / TDO / Endovision webhook fires. New TX plan ready for pre-auth, EOB lands with a denial code, treatment marked complete. Restore sees it in real time.",
              },
              {
                num: "02",
                title: "Draft",
                body: "Restore reads the case context — clinical notes, prior history, what we know about that carrier — and drafts the appropriate response with a confidence rationale. Sometimes the right answer is DO NOT APPEAL.",
              },
              {
                num: "03",
                title: "Approve & submit",
                body: "Office manager opens the inbox, reviews the draft, edits if needed, hits approve. Restore submits to the clearinghouse + saves a copy to the PMS document center. Audit logged.",
              },
            ].map((step) => (
              <div key={step.num} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="text-3xl font-bold text-brand-700">{step.num}</div>
                <div className="mt-3 text-lg font-semibold text-slate-900">{step.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIFFERENTIATION ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">The moat</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Three things no one else pairs together.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <BookOpen size={18} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Carrier intelligence</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Per-carrier playbooks: denial patterns, narrative preferences, escalation paths, notes from the field. Updated continuously across the customer base. Every approved claim makes the next narrative smarter.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <Briefcase size={18} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Case lifecycle threading</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Pre-auth → claim → EOB → appeal → resolution, threaded across the full 90-day arc. Same patient, three procedures, six months — Restore remembers. Nothing falls through.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <Ban size={18} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">DO NOT APPEAL discipline</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Most automation tools push <em>more</em> appeals. Restore is honest about which to skip. Plan exclusions, exhausted caps, contractual limits — chasing them costs time AND degrades carrier credibility for the appeals that DO matter.
            </p>
          </div>
        </div>
      </section>

      {/* ─── DEMO CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            See it running.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            The full prototype is live. Browse the inbox, follow a case across its 90-day arc, open the carrier playbook for Cigna or Delta. Mock data, real workflow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-3 text-base font-semibold text-white hover:bg-brand-800"
            >
              Open My Practice
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/practice/playbook"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse the Carrier Playbook
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-700 text-white">
              <Stethoscope size={14} />
            </div>
            <span className="font-semibold text-slate-700">Restore</span>
            <span className="text-slate-400">· Dental insurance &amp; communications</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rrmethodco/rrmethodco"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-slate-700"
            >
              <Github size={14} />
              GitHub
            </a>
            <Link href="/practice" className="hover:text-slate-700">My Practice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
