"use client";

import { Stethoscope, Sparkles, Heart, Mail, Briefcase, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import { SlideDeck, SlideFrame, H1, H2, Lede, Bold } from "@/components/SlideDeck";

const TOTAL = 10;
const BRAND_FOOTER = "Restore · Friends & Family round · 2026";

const TITLES = [
  "Title",
  "The story",
  "The problem",
  "What we built",
  "How it works",
  "What it looks like",
  "Why it gets smarter",
  "Where we are",
  "The ask",
  "Thanks",
];

export default function PitchFF() {
  const slides = [
    <S01 key={1} />,
    <S02 key={2} />,
    <S03 key={3} />,
    <S04 key={4} />,
    <S05 key={5} />,
    <S06 key={6} />,
    <S07 key={7} />,
    <S08 key={8} />,
    <S09 key={9} />,
    <S10 key={10} />,
  ];

  return <SlideDeck slides={slides} titles={TITLES} pdfUrl="/restore-pitch-deck-ff.pdf" />;
}

/* ──────────────────────────────────────────────────────────────────────
   01 — TITLE
   ────────────────────────────────────────────────────────────────────── */
function S01() {
  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-br from-brand-800 via-brand-700 to-slate-900 px-6 py-8 text-white md:px-12 md:py-12 lg:px-20 lg:py-16">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] md:text-xs">
        <span className="text-brand-200">Friends &amp; Family · 2026</span>
        <span className="tabular-nums text-brand-200/60">01 / 10</span>
      </div>
      <div className="mt-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur md:h-14 md:w-14">
            <Stethoscope size={26} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight md:text-3xl">Restore</span>
        </div>
        <h1 className="mt-8 max-w-5xl text-4xl font-bold leading-[1.05] tracking-tight md:mt-12 md:text-6xl lg:text-7xl xl:text-8xl">
          AI that wins<br />dental claims back.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-brand-100 md:mt-8 md:text-xl lg:text-2xl">
          The thing I'm building, in plain English — and how you can be part of it.
        </p>
      </div>
      <div className="mt-auto grid gap-2 border-t border-white/10 pt-6 text-sm md:grid-cols-3 md:gap-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Founder</div>
          <div className="mt-0.5 font-semibold">Ross Richardson</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Stage</div>
          <div className="mt-0.5 font-semibold">Pre-seed · pilot launching</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Live demo</div>
          <div className="mt-0.5 font-mono text-sm">restore-demo.vercel.app</div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   02 — THE STORY
   ────────────────────────────────────────────────────────────────────── */
function S02() {
  return (
    <SlideFrame num={2} total={TOTAL} eyebrow="The story" brandFooter={BRAND_FOOTER}>
      <H1>I started this because of my mom.</H1>
      <div className="mt-6 grid flex-1 gap-6 md:mt-10 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5 text-base leading-relaxed text-slate-700 md:text-lg">
          <p>
            Mom runs a 4-doctor endodontic practice. Endodontists are the dental specialists who do root canals. The work is technical, the cases are big, and the insurance side is brutal.
          </p>
          <p>
            Carriers deny <Bold>20-30% of valid claims</Bold> on first pass. Mom's office manager spends 90 minutes drafting a single appeal letter. When you do the math — $40/hr labor, 50% chance of winning — most appeals don't even break even. So practices write the money off. <Bold>$500K-$2M a year, gone.</Bold>
          </p>
          <p>
            I spent 7 years running financial operations at Method Co. (10 hotels, restaurants, ~$200M revenue). I'm an operator, not a healthcare insider. That's the unfair advantage: I see the workflow, not the medicine.
          </p>
          <p className="text-slate-900">
            <Bold>I'm building the tool I'd want if I were running mom's office.</Bold> An AI that watches the practice's software, writes the insurance correspondence, and queues it up for a one-click approval.
          </p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-800">
            <Heart size={14} />
            Design partner
          </div>
          <div className="mt-3 text-xl font-bold text-slate-900 md:text-2xl">
            Allyson A. Abbott DMD PC
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
            Mom's practice is the design partner. She tells me in 30 seconds whether what I built actually works. She's not a cheerleader — she's switched dental software vendors three times in ten years when products didn't deliver.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
            The pilot kicks off next month.
          </p>
        </div>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   03 — THE PROBLEM
   ────────────────────────────────────────────────────────────────────── */
function S03() {
  return (
    <SlideFrame num={3} total={TOTAL} eyebrow="The problem" brandFooter={BRAND_FOOTER}>
      <H2>Insurance is a math problem the practice loses.</H2>
      <Lede>The reason claims get written off isn't that the practice doesn't care. It's that fighting insurance is a labor-cost game the practice can't win.</Lede>
      <div className="mt-8 grid flex-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-rose-50 p-5 md:p-6">
          <div className="text-3xl font-bold text-rose-700 md:text-4xl">90 min</div>
          <div className="mt-2 text-sm font-bold text-slate-900">to write one appeal letter</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
            Office manager has to know each carrier's narrative preferences. Cigna wants anatomical specificity. Delta wants exact CDT terminology. MetLife wants conservative-alternatives language.
          </p>
        </div>
        <div className="rounded-xl bg-rose-50 p-5 md:p-6">
          <div className="text-3xl font-bold text-rose-700 md:text-4xl">35-50%</div>
          <div className="mt-2 text-sm font-bold text-slate-900">success rate without carrier intel</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
            A practice-drafted appeal wins about half the time. Combined with the 90 minutes of labor, the expected value of a single appeal is barely break-even.
          </p>
        </div>
        <div className="rounded-xl bg-rose-50 p-5 md:p-6">
          <div className="text-3xl font-bold text-rose-700 md:text-4xl">$500K-$2M</div>
          <div className="mt-2 text-sm font-bold text-slate-900">written off per practice / year</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
            That's revenue the practice earned, treatment they delivered. The carrier said "denied," the office manager said "I don't have 90 minutes," and the money disappeared.
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white md:p-6">
        <p className="text-base leading-relaxed text-slate-200 md:text-lg">
          Generic AI text generators don't fix this either. Each carrier scores narratives differently. <Bold className="text-white">Generic appeals lose 60-70% of the time.</Bold> What you need is per-carrier intelligence — and that's what Restore is.
        </p>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   04 — WHAT WE BUILT
   ────────────────────────────────────────────────────────────────────── */
function S04() {
  return (
    <SlideFrame num={4} total={TOTAL} eyebrow="What we built" brandFooter={BRAND_FOOTER}>
      <H2>An AI agent that lives inside the practice's software.</H2>
      <Lede>It does three things — three documents the office manager would otherwise write by hand. They're the highest-volume, highest-friction parts of the day.</Lede>
      <div className="mt-8 grid flex-1 gap-4 md:grid-cols-3">
        {[
          {
            title: "Pre-authorization narratives",
            volume: "15-25 / week",
            body: "Before a procedure happens, the carrier needs a clinical narrative explaining why it's medically necessary. Restore drafts it from the chart, tuned to the specific carrier's preferences.",
          },
          {
            title: "Claim appeal letters",
            volume: "8-15 / week",
            body: "When a claim gets denied, Restore reads the EOB, identifies the denial pattern, and drafts the appeal. Sometimes Restore says 'don't appeal — this is a contractual exclusion.' That discipline is unique.",
          },
          {
            title: "Referral letters",
            volume: "80-160 / week",
            body: "Endodontists get most patients from general dentists. After treatment, the office sends a letter back to the referring GP. Restore drafts it in collegial-clinical voice.",
          },
        ].map((s) => (
          <div key={s.title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-base font-bold text-slate-900 md:text-lg">{s.title}</div>
              <div className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-800 md:text-xs">
                {s.volume}
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 md:text-base">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-xl bg-brand-50 p-4 text-sm md:p-5 md:text-base">
        <Sparkles size={18} className="shrink-0 text-brand-700" />
        <div className="text-slate-700">
          The agent watches for events in the practice management system (PBS Endo, the software mom uses). When something happens — a treatment plan finalized, an EOB landing, a procedure completed — Restore drafts the right document and queues it for review.
        </div>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   05 — HOW IT WORKS (workflow)
   ────────────────────────────────────────────────────────────────────── */
function S05() {
  return (
    <SlideFrame num={5} total={TOTAL} eyebrow="How it works" brandFooter={BRAND_FOOTER}>
      <H2>Watch. Draft. Approve. Submit.</H2>
      <Lede>The whole thing takes <Bold>60-90 seconds</Bold> per item. The same work used to take <Bold>90 minutes</Bold>. That's a 60× compression — and the office manager is still in control of every output.</Lede>
      <div className="mt-8 grid flex-1 gap-3 md:grid-cols-4 md:gap-4">
        {[
          {
            num: "01",
            title: "Watch",
            body: "Restore listens to the practice's software for triggers. New treatment plan? EOB landed with a denial code? Treatment marked complete? Restore sees it the moment it happens.",
          },
          {
            num: "02",
            title: "Draft",
            body: "Restore reads the case context — chart notes, prior history, what we know about that specific carrier's preferences — and drafts the appropriate document. It also tells the office manager why it's confident: '92% historical approval rate on this evidence pattern.'",
          },
          {
            num: "03",
            title: "Approve",
            body: "Office manager opens the inbox, reviews the draft (60-90 seconds), and either approves it, edits it, or rejects with a reason. The office manager is always in the loop. Nothing goes out without human sign-off.",
          },
          {
            num: "04",
            title: "Submit",
            body: "Once approved, Restore submits to the insurance clearinghouse + saves a copy to the practice's document center. Audit trail captured. The whole arc is logged for the carrier intelligence layer to learn from.",
          },
        ].map((s) => (
          <div key={s.num} className="flex flex-col rounded-xl bg-slate-50 p-5 md:p-6">
            <div className="text-3xl font-bold text-brand-700 md:text-4xl">{s.num}</div>
            <div className="mt-2 text-base font-bold text-slate-900 md:text-lg">{s.title}</div>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-700 md:text-sm">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border-2 border-brand-700 bg-white p-5 text-center md:p-6">
        <div className="text-base font-bold text-slate-900 md:text-lg">
          The office manager keeps full control. The AI does the typing.
        </div>
        <p className="mt-2 text-sm text-slate-600">
          That distinction is critical — for compliance, for trust, and for the practice owner who's accountable for what gets sent.
        </p>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   06 — WHAT IT LOOKS LIKE (live demo, case lifecycle)
   ────────────────────────────────────────────────────────────────────── */
function S06() {
  return (
    <SlideFrame num={6} total={TOTAL} eyebrow="What it looks like" brandFooter={BRAND_FOOTER}>
      <H2>The whole thing is built. You can see it now.</H2>
      <Lede>The demo at <Bold>restore-demo.vercel.app</Bold> is the actual product. Real workflows, real interactions, real carrier intelligence. Mock data only for the patient side (since the real pilot hasn't started yet).</Lede>
      <div className="mt-8 grid flex-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <Sparkles size={14} className="text-brand-700" />
            Inbox — the daily workflow
          </div>
          <div className="mt-4 space-y-2.5">
            {[
              ["PRE-AUTH", "D3348 retreatment · Tooth #14 · Cigna DPPO", "$1,450", "HIGH"],
              ["REFERRAL", "Dr. Marcus Patel · Sunset Family Dentistry", "—", "HIGH"],
              ["APPEAL", "D3331 obstruction · Tooth #3 · Delta Dental", "$385", "HIGH"],
              ["PRE-AUTH", "D3425 apicoectomy · Tooth #30 · MetLife", "$1,675", "MED"],
            ].map(([kind, body, amt, conf], i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{kind}</div>
                <div className="flex-1 text-xs text-slate-700 md:text-sm">{body}</div>
                <div className="hidden text-xs font-bold text-slate-700 sm:block">{amt}</div>
                <div className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  conf === "HIGH" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>{conf}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Each item expands to show the full draft + carrier-specific reasoning. Approve / edit / reject — done in one tap.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <Briefcase size={14} className="text-brand-700" />
            The 90-day insurance lifecycle
          </div>
          <p className="mt-3 text-sm text-slate-700 md:text-base">
            Most "AI for dental" tools generate one document and forget it. Restore threads the whole arc together so nothing falls through:
          </p>
          <ol className="mt-4 space-y-2 text-sm">
            {[
              ["Pre-auth drafted + submitted", "by Restore"],
              ["Carrier approves or denies", "tracked"],
              ["Treatment happens", "claim auto-submitted"],
              ["EOB lands", "if denied → appeal drafted"],
              ["Appeal submitted", "by Restore (or 'DO NOT APPEAL')"],
              ["Resolution", "case closed, money recovered or written off"],
            ].map(([step, note], i) => (
              <li key={i} className="flex items-baseline gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-slate-900">{step}</span>
                  <span className="ml-1.5 text-xs text-slate-500">— {note}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   07 — THE MOAT (in plain English)
   ────────────────────────────────────────────────────────────────────── */
function S07() {
  return (
    <SlideFrame num={7} total={TOTAL} eyebrow="The hard part" bg="bg-slate-50" brandFooter={BRAND_FOOTER}>
      <H2>Restore gets smarter every week.</H2>
      <Lede>The product isn't the AI — anyone can call an AI. The product is the per-carrier playbook that compounds with every claim that flows through.</Lede>
      <div className="mt-8 grid flex-1 gap-5 md:grid-cols-3">
        {[
          {
            num: "01",
            title: "Each carrier has quirks",
            body: "Cigna wants anatomical specificity. Delta wants exact CDT terminology. MetLife wants conservative-alternatives-considered framing. UnitedHealthcare's bar on sedation is the highest in the industry. We've already mapped these.",
          },
          {
            num: "02",
            title: "We learn what wins and what loses",
            body: "Every claim that gets approved or denied feeds back. After enough volume, we know exactly which narrative pattern Cigna approves on D3348 retreatments. After more volume, we know which sub-pattern wins at 92% vs. 67%.",
          },
          {
            num: "03",
            title: "1 practice's lesson → 1,000 practices' edge",
            body: "When mom's practice discovers that Cigna is bundling D3331 codes more aggressively than usual, every practice on Restore knows by tomorrow. That network effect is what no individual practice (and no generic AI) can replicate.",
          },
        ].map((s) => (
          <div key={s.num} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="text-3xl font-bold text-brand-700 md:text-4xl">{s.num}</div>
            <div className="mt-2 text-base font-bold text-slate-900 md:text-lg">{s.title}</div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-xl bg-brand-700 p-5 text-white md:p-6">
        <BookOpen size={20} className="shrink-0" />
        <div className="text-sm leading-relaxed md:text-base">
          A new entrant who tries to compete on day one has zero carrier data. Even with the same AI tech, they'd start at <Bold className="text-white">35-50% appeal win rate</Bold> while Restore is at <Bold className="text-white">73%+ and climbing</Bold>. Catching up takes years of paying customers — that's the moat.
        </div>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   08 — WHERE WE ARE
   ────────────────────────────────────────────────────────────────────── */
function S08() {
  return (
    <SlideFrame num={8} total={TOTAL} eyebrow="Where we are" brandFooter={BRAND_FOOTER}>
      <H2>The product works. The pilot starts next month.</H2>
      <div className="mt-8 grid flex-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-brand-700 bg-brand-50 p-5 md:p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-brand-800">Today (May 2026)</div>
          <h3 className="mt-2 text-lg font-bold text-slate-900 md:text-xl">Built &amp; live</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>Full prototype shipped at restore-demo.vercel.app</span></li>
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>3 skills working: pre-auth, appeals, referrals</span></li>
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>Carrier playbook for top 6 carriers</span></li>
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>Mom's practice signed as design partner</span></li>
            <li className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>Anthropic BAA executed (HIPAA cover)</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Next 90 days</div>
          <h3 className="mt-2 text-lg font-bold text-slate-900 md:text-xl">Pilot live</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>Pilot live at mom's 4-doc practice</span></li>
            <li className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>First non-mom paying customer</span></li>
            <li className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>Quantified pilot metrics (success rate vs. baseline)</span></li>
            <li className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>3 LOIs in active conversation</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Next 12 months</div>
          <h3 className="mt-2 text-lg font-bold text-slate-900 md:text-xl">Real revenue</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>25 paying practices</span></li>
            <li className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>~$750K annual recurring revenue</span></li>
            <li className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>First DSO conversation in late stage</span></li>
            <li className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-brand-700" /><span>Institutional seed round (Q3 2026)</span></li>
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white md:p-6">
        <p className="text-sm leading-relaxed text-slate-200 md:text-base">
          The market is real (~5,500 endodontic practices in the US, expanding to 30,000+ specialty + 178,000 GP + DSO consolidation). But we're not chasing the whole market on day one. <Bold className="text-white">We're winning endo first because the math works hardest there.</Bold>
        </p>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   09 — THE ASK
   ────────────────────────────────────────────────────────────────────── */
function S09() {
  return (
    <SlideFrame num={9} total={TOTAL} eyebrow="The ask" brandFooter={BRAND_FOOTER}>
      <H2>$250K from friends &amp; family. SAFE. 6-month bridge.</H2>
      <Lede>Friends-and-family rounds exist because the people who know you best want to back you before the institutional capital arrives. This is the cheapest price the company will ever raise at.</Lede>
      <div className="mt-8 grid flex-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Round structure</div>
          <table className="mt-3 w-full text-sm md:text-base">
            <tbody>
              {[
                ["Round size", "$250K target"],
                ["Instrument", "Post-money SAFE"],
                ["Valuation cap", "$5M post-money"],
                ["Discount", "20%"],
                ["Minimum check", "$10K"],
                ["Maximum check", "$50K (preserves seed for institutional)"],
                ["Founder commitment", "Full-time at seed close · $150K personal cash"],
              ].map(([l, v]) => (
                <tr key={l} className="border-b border-slate-200">
                  <td className="py-2 text-slate-500">{l}</td>
                  <td className="py-2 text-right font-bold text-slate-900">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-400">
            SAFE converts at the institutional seed round. F&amp;F gets a 50% discount to that round's $10M cap (so $5M effective price), plus an additional 20% conversion discount. You're paying ~half what the seed investors will pay.
          </p>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div className="rounded-2xl bg-brand-50 p-5 md:p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-brand-800">What it funds (next 6 months)</div>
            <ul className="mt-3 space-y-1.5 text-sm md:text-base">
              <li className="flex gap-2"><span className="text-brand-700">·</span><span><Bold>Pilot scale-up</Bold> — engineering contractor for PMS hardening, deeper carrier playbook</span></li>
              <li className="flex gap-2"><span className="text-brand-700">·</span><span><Bold>Customer acquisition</Bold> — first 5 paid customers via study clubs + referrals</span></li>
              <li className="flex gap-2"><span className="text-brand-700">·</span><span><Bold>Compliance setup</Bold> — HIPAA audit, BAA legal, SOC 2 scoping</span></li>
              <li className="flex gap-2"><span className="text-brand-700">·</span><span><Bold>Founder transition</Bold> — bridge cost while resigning Method Co. role</span></li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-900 p-5 text-white md:p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-brand-300">Why this round, why now</div>
            <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-base">
              The institutional seed conversation is Q3 2026. Between now and then I need 6 months of runway to get from "1 design partner" to "5 paying customers." That milestone is what unlocks the seed round at a meaningfully higher valuation. F&amp;F money is the bridge.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   10 — THANKS
   ────────────────────────────────────────────────────────────────────── */
function S10() {
  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-br from-slate-900 via-brand-800 to-brand-700 px-6 py-8 text-white md:px-12 md:py-12 lg:px-20 lg:py-16">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] md:text-xs">
        <span className="text-brand-200">Thanks</span>
        <span className="tabular-nums text-brand-200/60">10 / 10</span>
      </div>
      <div className="mt-auto">
        <h2 className="max-w-4xl text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          A short, honest ask.
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-brand-100 md:mt-8 md:space-y-5 md:text-lg lg:text-xl">
          <p>
            If you want to invest, talk to me. <Bold className="text-white">Minimum $10K, maximum $50K</Bold>, post-money SAFE at a $5M cap. Documents and process will be clean, simple, and lawyer-reviewed.
          </p>
          <p>
            If you can't or don't want to invest — that's totally fine. <Bold className="text-white">Please refer me to the next 5 endodontists or specialty practice owners you know.</Bold> The practices we close in the next 90 days determine the institutional valuation.
          </p>
          <p>
            Either way, I appreciate you being here. Mom appreciates you being here. The endodontists who'll get paid faster because of this product appreciate you being here.
          </p>
        </div>
      </div>
      <div className="mt-auto grid gap-3 border-t border-white/10 pt-6 text-sm md:grid-cols-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Founder</div>
          <div className="mt-0.5 font-semibold">Ross Richardson</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Get in touch</div>
          <div className="mt-0.5 flex flex-col gap-1 font-mono text-xs md:flex-row md:gap-4 md:text-sm">
            <span className="inline-flex items-center gap-1.5"><Mail size={12} />richardson112288@gmail.com</span>
            <span>restore-demo.vercel.app</span>
          </div>
        </div>
      </div>
    </div>
  );
}
