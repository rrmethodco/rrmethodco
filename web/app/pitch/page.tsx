import Link from "next/link";
import {
  Stethoscope,
  ArrowLeft,
  FileText,
  Github,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restore — Investor pitch deck (PE-grade)",
  description: "Restore. AI for dental specialty insurance. Seed round, $2.5M, milestone-gated.",
};

const TOTAL_SLIDES = 18;

export default function PitchDeckPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 print:bg-white">
      {/* HEADER (suppressed in print) */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
              <Stethoscope size={16} />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900">Restore</span>
            <span className="hidden text-sm text-slate-400 sm:inline">· Pitch deck · Seed</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="/restore-pitch-deck-v1.pdf"
              download
              className="hidden items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
            >
              <FileText size={12} />
              Download PDF
            </a>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
              <ArrowLeft size={12} />
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 md:px-6 md:pt-10">

        {/* ───────────────────────────────────────────────────────────────
            01 — TITLE
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={1} eyebrow="Investor pitch · Seed · 2026">
          <div className="flex min-h-[60vh] flex-col justify-center md:min-h-[68vh]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white">
                <Stethoscope size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Restore</span>
            </div>
            <h1 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
              Insurance operations infrastructure for dental specialty practices.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              AI agent that watches the PMS, drafts the insurance response, and submits autonomously after a one-click human review. Carrier intelligence layer compounds with every claim.
            </p>
            <div className="mt-10 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
              <div><span className="font-semibold text-slate-900">Stage:</span> Pre-seed → seed</div>
              <div><span className="font-semibold text-slate-900">Round size:</span> $2.5M (milestone-tranched)</div>
              <div><span className="font-semibold text-slate-900">Target close:</span> Q3 2026</div>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Ross Richardson, founder · richardson112288@gmail.com · restore-demo.vercel.app
            </div>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            02 — EXECUTIVE SUMMARY
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={2} eyebrow="Executive summary">
          <H2>The thesis in five lines.</H2>
          <ol className="mt-8 space-y-5">
            {[
              ["Market", "Dental insurance is structurally adversarial. ~20-30% of valid claims are denied on first pass. Average dental specialty practice writes off $500K-$2M/yr because the office manager economics of fighting back don't work."],
              ["Wedge", "Endo is the smallest, highest-density specialty (4,486 practices, 5-figure claims, sophisticated owners). Win endo first → carrier intelligence layer compounds → expand to 30K+ specialty + 178K GP + DSO tier."],
              ["Product", "Agent watches PMS for events, drafts the carrier-tuned response, queues a one-click approval. Three skills shipping at pilot: pre-auth narratives, claim appeals (with 'DO NOT APPEAL' discipline), referral letters. Live demo: restore-demo.vercel.app."],
              ["Moat", "Per-carrier intelligence (denial patterns, narrative preferences, escalation paths) updated continuously across the customer base. 1 practice finds a Cigna pattern → 1,000 practices benefit. Replicating this from scratch requires the claim volume we're already accumulating."],
              ["Ask", "$2.5M seed in two tranches ($1.5M close / $1.0M at 25 paying logos). 18-month runway to $1.5M ARR, 65 paying practices, and a Series A conversation at $4M+ ARR / Q3'28."],
            ].map(([h, b], i) => (
              <li key={i} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">{String(i + 1).padStart(2, "0")}</div>
                <div className="flex-1">
                  <div className="text-base font-bold text-slate-900">{h}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            03 — MARKET (TAM/SAM/SOM, defensible)
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={3} eyebrow="Market">
          <H2>$135M SOM, $870M SAM, $4.5B+ TAM. Bottom-up, source-cited.</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-800 text-white">
                  <th className="p-3 text-left font-semibold">Layer</th>
                  <th className="p-3 text-right font-semibold">Practices</th>
                  <th className="p-3 text-right font-semibold">Avg ACV</th>
                  <th className="p-3 text-right font-semibold">Market</th>
                  <th className="p-3 text-left font-semibold">Logic + source</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-3 font-bold text-slate-900">SOM (Y1-3)<br /><span className="text-xs font-normal text-slate-500">Endodontic</span></td>
                  <td className="p-3 text-right">4,486</td>
                  <td className="p-3 text-right">$30K</td>
                  <td className="p-3 text-right text-base font-bold text-brand-700">$135M</td>
                  <td className="p-3 text-xs text-slate-600">PBS Endo + TDO + Endovision coverage. 5,500 endo specialists per ADA HPI 2025; net of partial-time / DSO-affiliated.<sup>[1]</sup></td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">SAM<br /><span className="text-xs font-normal text-slate-500">Dental specialty</span></td>
                  <td className="p-3 text-right">29,015</td>
                  <td className="p-3 text-right">$30K</td>
                  <td className="p-3 text-right text-base font-bold text-brand-700">$870M</td>
                  <td className="p-3 text-xs text-slate-600">Endo + oral surgery + perio + ortho + pedo. ADA-recognized specialties only.<sup>[2]</sup></td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 font-bold text-slate-900">TAM<br /><span className="text-xs font-normal text-slate-500">All US dental + DSO</span></td>
                  <td className="p-3 text-right">178,000+</td>
                  <td className="p-3 text-right">$25K</td>
                  <td className="p-3 text-right text-base font-bold text-slate-700">$4.5B+</td>
                  <td className="p-3 text-xs text-slate-600">GP at lower ACV; DSO contracts ($50-150K build + $5-15K/mo) lift blended ARPU. 32% of practices DSO-affiliated and growing 17% CAGR.<sup>[3]</sup></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Top-down sanity check</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                US dental services revenue: ~$162B (2025 ADA). Insurance pays ~50% of patient-side revenue → ~$80B of dental insurance flow. Industry-wide denial rate 20-30% → ~$16-24B of denied / underpaid claims annually. Capturing 0.6% as Restore's recovered-revenue cut (at our ~10% take of recovery) ≈ $96M-144M ARR opportunity for Restore alone.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Why endo first</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Pre-auth + appeal events per practice: <span className="font-semibold">3-5× general dentistry</span>. Average claim size: <span className="font-semibold">2-4× general dentistry</span> ($800-$1,800 vs. $250-$600). Customer payback dynamics work hardest where denial-recovery $$ are largest. Endo is the wedge; specialty + GP is the wave.
              </p>
            </div>
          </div>
          <Sources>
            [1] ADA HPI Workforce 2025 · [2] ADA HPI Specialty Distribution 2025; Becker's Dental 2026 ·
            [3] Grand View Research DSO 2025; Towards Healthcare 2025
          </Sources>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            04 — PROBLEM (data-rich)
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={4} eyebrow="Problem">
          <H2>Practices write off insurance dollars because the labor math doesn't work.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-6">
              <div className="text-xs font-bold uppercase tracking-wide text-rose-600">The bleed (per practice)</div>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["First-pass denial rate", "20-30%", "Industry, all dental"],
                  ["Avg appeal labor", "90 min", "Office manager time"],
                  ["Office manager fully-loaded", "~$40/hr", "Labor cost = $60/appeal"],
                  ["Avg claim denied (specialty)", "$800-$1,800", "Endo: $385-$1,675"],
                  ["Practice-drafted appeal win rate", "35-50%", "Without carrier intel"],
                  ["Expected value of appeal", "$280-$900", "Labor exceeds EV at low end"],
                  ["Specialty practices that don't appeal regularly", "~60%", "Industry surveys"],
                  ["Annual revenue lost / specialty practice", "$500K-$2M", "Aggregate bleed"],
                ].map(([l, v, src]) => (
                  <div key={l} className="flex flex-col gap-0.5 border-b border-slate-200 pb-2">
                    <div className="flex items-baseline justify-between">
                      <dt className="text-slate-500">{l}</dt>
                      <dd className="font-bold text-slate-900">{v}</dd>
                    </div>
                    <div className="text-xs text-slate-400">{src}</div>
                  </div>
                ))}
              </dl>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-base font-bold text-slate-900">Why generic AI doesn't fix this</div>
                <p className="mt-2 text-sm text-slate-700">
                  Each carrier scores narratives differently. <span className="font-semibold">Cigna</span> rewards anatomical specificity; <span className="font-semibold">Delta</span> requires ADA-CDT-exact terminology; <span className="font-semibold">MetLife</span> needs conservative-alternatives-considered framing. Untuned LLM output loses 60-70% of the time.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-base font-bold text-slate-900">Why incumbent RCM tools don't fix this</div>
                <p className="mt-2 text-sm text-slate-700">
                  Vyne Dental (clearinghouse, ~1990s tech) routes claims but doesn't draft narratives. DentalRobot generates templated text but lacks per-carrier intelligence and case-lifecycle threading. Pearl AI / Overjet operate at a different layer entirely (clinical imaging, not insurance ops).
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-base font-bold text-slate-900">Why this isn't fixed already</div>
                <p className="mt-2 text-sm text-slate-700">
                  Until 2024, BAA-grade LLMs at sub-$0.10/inference + dental PMS event APIs at the maturity to support real-time triggering didn't co-exist. Both shipped in the last 18 months.
                </p>
              </div>
            </div>
          </div>
          <Sources>
            ADA Health Policy Institute Practice Survey 2024 · CMS NHE 2024 · Towards Healthcare RCM 2025 ·
            DentalIntel benchmarks 2024 · Field interviews with 6 specialty practice owners (founder, 2025-2026)
          </Sources>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            05 — WHY NOW
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={5} eyebrow="Why now">
          <H2>Three independent technology curves crossed in the last 18 months.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["LLM cost & quality", "Anthropic Claude 3.5 Sonnet (Q3 2024) reasoning quality + sub-$0.10/inference for dense narratives. 10× drop in cost vs. GPT-4 launch (Q1 2023). Carrier-specific tuning is now economically viable.", "Sources: Anthropic API pricing 2024-2026; Stanford AI Index 2025"],
              ["PMS event APIs", "PBS Endo opened webhook events Q4 2024. TDO + Endovision live with stable webhook infrastructure for treatment-plan + EOB events. No more polling, no more fragile RPA.", "Sources: PBS Endo developer docs 2024; TDO API release notes 2025"],
              ["BAA-grade infrastructure", "Anthropic, OpenAI, AWS Bedrock all ship BAA out of the box (post-2024). Compliance friction that blocked AI in healthcare 2019-2023 has collapsed.", "Sources: Anthropic BAA terms 2024; HIPAA Journal 2025"],
            ].map(([h, b, src], i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-3xl font-bold text-brand-700">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-3 text-base font-bold text-slate-900">{h}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{b}</p>
                <p className="mt-3 text-[10px] text-slate-400">{src}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-brand-100 p-5">
            <div className="text-sm font-bold text-brand-800">
              The window: this configuration of capabilities did not exist 18 months ago. It will exist for everyone in 24 months. The wedge is the 18-month head-start to lock in the pilot cohort and accumulate the carrier-pattern data.
            </div>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            06 — PRODUCT (compact)
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={6} eyebrow="Product">
          <H2>Watch. Draft. Approve. Submit.</H2>
          <p className="mt-3 text-base text-slate-600">
            Live at <span className="font-mono text-brand-700">restore-demo.vercel.app/practice</span>. Every component below is shipping.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {[
              ["Watch", "PMS webhook fires on TX plan, EOB, treatment complete."],
              ["Draft", "Per-carrier intelligence applied. Confidence rationale shown ('Why HIGH? 92% historical approval')."],
              ["Approve", "60-90 sec office-manager review. Approve / edit / reject (with reason capture for training)."],
              ["Submit", "Autonomous to clearinghouse + PMS Doc Center. Audit logged."],
            ].map(([h, b], i) => (
              <div key={i} className="rounded-xl bg-slate-50 p-5">
                <div className="text-2xl font-bold text-brand-700">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2 text-base font-bold text-slate-900">{h}</div>
                <p className="mt-2 text-sm text-slate-700">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Skills shipping at pilot</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>· Pre-auth narrative (15-25/wk/practice)</li>
                <li>· Claim appeal letter (8-15/wk/practice)</li>
                <li>· Referral letter (80-160/wk/practice)</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">PMS integrations</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>· PBS Endo (live)</li>
                <li>· TDO (Q1'27)</li>
                <li>· Endovision (Q2'27)</li>
                <li>· Dentrix / Open Dental (Y2)</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Compliance posture</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>· Anthropic BAA executed</li>
                <li>· Practice BAA per customer</li>
                <li>· Local de-identification before inference</li>
                <li>· Full audit log per output</li>
              </ul>
            </div>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            07 — THE MOAT (defensibility math)
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={7} eyebrow="The moat">
          <H2>Per-carrier intelligence at scale = irreplicable from a cold start.</H2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Defensibility math</div>
              <div className="mt-3 space-y-3 text-sm">
                <p className="text-slate-700">
                  Each practice generates <span className="font-bold text-slate-900">~1,200 carrier-claim events / yr</span> (pre-auths, EOBs, appeals across ~6 active carriers). At 50 paying practices: <span className="font-bold text-slate-900">60,000 events/yr</span>; at 240: <span className="font-bold text-slate-900">288,000 events/yr</span>.
                </p>
                <p className="text-slate-700">
                  Per-carrier intelligence layer requires <span className="font-bold text-slate-900">~5,000 resolved claim arcs per major carrier</span> to lock in narrative-tuning accuracy and DO-NOT-APPEAL pattern recognition (industry-standard threshold for SaaS-grade LLM fine-tuning).
                </p>
                <p className="text-slate-700">
                  At 240 practices: each major carrier yields ~30,000-40,000 arcs/yr — <span className="font-bold text-slate-900">6-8× the threshold</span>. A new entrant starts at zero and would need 18-24 months of paying customers + corresponding GTM spend to catch up.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Three reinforcing layers</div>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <div className="font-bold text-slate-900">1. Carrier intelligence (data moat)</div>
                  <p className="text-slate-700">Compounds with usage; cost-to-replicate scales with N customers × T years.</p>
                </div>
                <div>
                  <div className="font-bold text-slate-900">2. Workflow embedding (switching cost)</div>
                  <p className="text-slate-700">Inbox replaces existing manual triage. Once embedded, switching cost = retraining the office manager + losing case-lifecycle history.</p>
                </div>
                <div>
                  <div className="font-bold text-slate-900">3. Brand on DO NOT APPEAL discipline (positioning moat)</div>
                  <p className="text-slate-700">Restore is the only product willing to recommend NOT appealing. This earns carrier-relations credibility for the 70% of appeals worth pursuing — a positioning a generic appeal-generator can't credibly claim.</p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            08 — COMPETITIVE LANDSCAPE
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={8} eyebrow="Competitive landscape">
          <H2>Adjacent players, none in our exact lane.</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-800 text-white">
                  <th className="p-3 text-left font-semibold">Company</th>
                  <th className="p-3 text-left font-semibold">Layer</th>
                  <th className="p-3 text-center font-semibold">Carrier intel</th>
                  <th className="p-3 text-center font-semibold">Case threading</th>
                  <th className="p-3 text-center font-semibold">DO NOT APPEAL</th>
                  <th className="p-3 text-center font-semibold">Real-time PMS</th>
                  <th className="p-3 text-center font-semibold">Auto-submit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Restore", "Specialty insurance ops", "✓", "✓", "✓", "✓", "✓"],
                  ["Vyne Dental", "Clearinghouse", "Legacy rules", "Query-based", "—", "Manual upload", "Routing only"],
                  ["DentalRobot", "Insurance verification", "Generic templates", "Single doc", "—", "Manual upload", "Draft only"],
                  ["Toothy AI", "Insurance verification", "—", "—", "—", "—", "—"],
                  ["Zentist", "Payment posting + denial mgmt", "—", "Partial", "—", "Manual", "—"],
                  ["Pearl AI", "Clinical imaging diagnosis", "—", "—", "—", "—", "—"],
                  ["Overjet", "Clinical imaging + claim analytics", "—", "—", "—", "—", "—"],
                  ["Akasa (broader healthcare)", "Healthcare RCM", "Healthcare-wide", "Partial", "—", "Limited", "Limited"],
                  ["Cohere Health (broader)", "Healthcare prior auth", "Medical-side", "—", "—", "—", "—"],
                ].map((row, i) => {
                  const isUs = i === 0;
                  return (
                    <tr key={i} className={isUs ? "bg-brand-100" : i % 2 === 1 ? "bg-white" : "bg-slate-50"}>
                      <td className={`p-3 font-bold ${isUs ? "text-brand-800" : "text-slate-900"}`}>{row[0]}</td>
                      <td className="p-3 text-slate-700">{row[1]}</td>
                      {row.slice(2).map((cell, j) => (
                        <td key={j} className={`p-3 text-center text-xs ${cell === "✓" ? "font-bold text-brand-800" : "text-slate-500"}`}>{cell}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-slate-700">
            <span className="font-bold text-slate-900">The white space:</span> No incumbent or recent entrant pairs per-carrier intelligence + case-lifecycle threading + DO-NOT-APPEAL discipline + real-time PMS event triggering. Vyne owns the clearinghouse layer (different category); imaging-AI players (Pearl/Overjet) operate at the diagnosis layer (different category). Generic insurance-automation tools (DentalRobot, Toothy AI) lack the carrier intelligence data and the lifecycle thread that distinguishes a tool from infrastructure.
          </p>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            09 — COMPARABLES (placeholder for agent content)
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={9} eyebrow="Comparables">
          <H2>Recent dental + healthcare AI / RCM transactions.</H2>
          <p className="mt-4 text-sm text-slate-600">
            Public + announced transactions in the adjacent space. Multiples anchor our exit thesis at $4M+ ARR / Series A.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-800 text-white">
                  <th className="p-3 text-left font-semibold">Company</th>
                  <th className="p-3 text-left font-semibold">Year</th>
                  <th className="p-3 text-left font-semibold">Event</th>
                  <th className="p-3 text-right font-semibold">Amount</th>
                  <th className="p-3 text-right font-semibold">Valuation</th>
                  <th className="p-3 text-right font-semibold">Rev mult</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Overjet", "2024", "Series C", "$53.2M", "$550M post", "~25-35×"],
                  ["Pearl AI", "2024", "Series B", "$58M", "$400M post", "n/d"],
                  ["VideaHealth", "2025", "Series B", "$40M", "n/d ($65M raised total)", "n/d"],
                  ["Cohere Health", "2025", "Series C", "$90M", "n/d ($200M raised total)", "n/d"],
                  ["AKASA", "2024", "Series C ext", "n/d", "$205M raised total", "n/d"],
                  ["Weave (IPO)", "2021", "IPO", "$120M", "$1.5B IPO", "~15×"],
                  ["Weave (current)", "2025", "Public", "—", "~$700M-$1B mkt cap", "~3.5-5×"],
                  ["Dental Intelligence", "2024", "Series A", "$34M", "n/d ($50M rev)", "~3-5×"],
                  ["Dental Intelligence", "2025", "Series C", "$85M", "n/d", "n/d"],
                  ["Vyne (parent)", "2022", "PE acquisition (Jordan Co.)", "n/d", "n/d", "n/d"],
                  ["Modento", "2024", "Acquired (Henry Schein One)", "n/d", "n/d", "—"],
                  ["Archy", "2024", "Series A", "$15M", "n/d", "n/d"],
                  ["Cofactor AI (claim appeals)", "2024", "Seed", "$4M", "n/d", "n/a"],
                  ["Toothy AI (YC W25)", "2025", "Seed", "~$500K", "n/d", "n/a"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-3 font-bold text-slate-900">{row[0]}</td>
                    <td className="p-3 text-slate-700">{row[1]}</td>
                    <td className="p-3 text-slate-700">{row[2]}</td>
                    <td className="p-3 text-right text-slate-900">{row[3]}</td>
                    <td className="p-3 text-right text-slate-900">{row[4]}</td>
                    <td className="p-3 text-right font-bold text-brand-800">{row[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-rose-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-rose-700">Bear (3-5× ARR)</div>
              <p className="mt-2 text-sm text-slate-700">
                Public-software floor (Weave 2025). At $4M ARR → <span className="font-bold">$12-20M post</span>. Insufficient to clear preferences. Avoid.
              </p>
            </div>
            <div className="rounded-xl bg-brand-100 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-brand-800">Base (8-12× ARR)</div>
              <p className="mt-2 text-sm text-slate-700">
                Vertical healthcare-AI median. At $4M ARR → <span className="font-bold">$32-48M post</span>. Defensible if NDR &gt;115% and CAC payback intact. Aligned with our target.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Bull (15-25× ARR)</div>
              <p className="mt-2 text-sm text-slate-700">
                Premium (Overjet-like category lead). At $4M ARR → <span className="font-bold">$60-100M post</span>. Requires payer-data integration + category-leadership narrative. Stretch.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            <span className="font-bold text-slate-900">Restore exit framing:</span> $40-60M post at Series A sits at the <span className="font-bold">median of the right comp set, not the top</span>. Strategic M&amp;A candidates: Henry Schein One, Patterson Dental, Vyne Medical parent (Jordan Co.), Overjet (logical tuck-in), Waystar, R1.
          </p>
          <Sources>
            [Overjet Series C](https://www.overjet.com/blog/overjet-raises-53-million-the-largest-investment-in-the-history-of-dental-ai) ·
            [Pearl AI Series B](https://www.hellopearl.com/press-release/pearl-raises-largest-ever-investment-in-dental-ai-with-58-million-round) ·
            [VideaHealth Series B](https://www.videa.ai/news/videahealth-raises-40m-in-oversubscribed-series-b-funding) ·
            [Cohere Health Series C](https://www.coherehealth.com/news/cohere-health-90m-series-c-ai-platform-expansion) ·
            [Weave IPO](https://blossomstreetventures.medium.com/learnings-from-a-saas-ipo-weave-b6d244a18c7b) ·
            [Vyne PE acquisition](https://vynemedical.com/in-the-news/healthcare-information-technology-leader-vyne-acquired-by-the-jordan-company/) ·
            Dental Intelligence, Archy, Modento, Cofactor AI, Toothy AI per Crunchbase + press releases. n/d = not disclosed.
          </Sources>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            10 — GO-TO-MARKET (cohort math)
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={10} eyebrow="Go-to-market">
          <H2>From 1 logo (mom) to 65 logos in 18 months. Channel by channel.</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-800 text-white">
                  <th className="p-3 text-left font-semibold">Channel</th>
                  <th className="p-3 text-center font-semibold">Y1-3 logos</th>
                  <th className="p-3 text-center font-semibold">CAC</th>
                  <th className="p-3 text-center font-semibold">Payback</th>
                  <th className="p-3 text-center font-semibold">Conv.</th>
                  <th className="p-3 text-left font-semibold">Mechanics</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AAE Annual + regional", "60", "$8K", "5.3 mo", "8% booth→close", "Endo's mecca · 8K members · exhibit Y1, sponsor Y2"],
                  ["Study clubs / KOL referrals", "110", "$4K", "2.7 mo", "25% warm→close", "Endo is small · pilot becomes 4 case studies · NPS loop drives 65% of Y2 logos"],
                  ["Cold outbound (top-200 endo groups)", "50", "$14K", "9.3 mo", "6% BDR→close", "Apollo + ZoomInfo · founder-led until M9 · BDR hire M9"],
                  ["DSO BD (Heartland, Pacific, MB2)", "4 DSOs / 20 logos", "$35K", "8 mo", "12.5% (1 of 8 convs)", "Long cycle 9-12mo · founder-led · PE-friendly framing"],
                  ["Blended", "240 + 4 DSOs", "$8.5K", "4.4 mo", "—", "All channels combined; Y1 weighted to study clubs"],
                ].map((row, i) => {
                  const isLast = i === 4;
                  return (
                    <tr key={i} className={isLast ? "bg-brand-100 font-bold" : i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="p-3 text-slate-900">{row[0]}</td>
                      <td className="p-3 text-center text-slate-700">{row[1]}</td>
                      <td className="p-3 text-center text-slate-900">{row[2]}</td>
                      <td className="p-3 text-center text-slate-900">{row[3]}</td>
                      <td className="p-3 text-center text-slate-700">{row[4]}</td>
                      <td className="p-3 text-xs text-slate-600">{row[5]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Cohort acquisition plan (logos / month)</div>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {[
                    ["Q3'26 pilot", "1 (mom)", "Design partner"],
                    ["Q4'26", "2", "Founder-led, AAE prep"],
                    ["Q1'27", "5", "AAE Annual exhibit"],
                    ["Q2'27", "8", "Study club word-of-mouth begins"],
                    ["Q3'27", "12", "BDR hires M9; first DSO LOI"],
                    ["Q4'27", "18", "Cohort M3 retention validates"],
                  ].map(([p, n, note]) => (
                    <tr key={p} className="border-b border-slate-200">
                      <td className="py-2 font-bold text-slate-900">{p}</td>
                      <td className="py-2 text-right font-bold text-brand-800">{n}</td>
                      <td className="py-2 pl-4 text-xs text-slate-500">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">GTM team build</div>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {[
                    ["M0", "Founder", "GTM lead, sales, demo, customer support"],
                    ["M6", "CSM (1)", "Onboarding + retention; $90-110K"],
                    ["M9", "BDR (1)", "Outbound to top-200 endo + AAE list; $70-90K + comm"],
                    ["M15", "AE / GTM hire (1)", "Founder begins offloading sales; $130-160K"],
                    ["M24", "Director GTM", "Build channel + DSO motion; $180-220K"],
                  ].map(([when, who, note]) => (
                    <tr key={when} className="border-b border-slate-200">
                      <td className="py-2 font-mono font-bold text-slate-900">{when}</td>
                      <td className="py-2 font-bold text-slate-900">{who}</td>
                      <td className="py-2 pl-3 text-xs text-slate-500">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            11 — UNIT ECONOMICS
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={11} eyebrow="Unit economics">
          <H2>14-day customer payback. 86% gross margin. 7.8× LTV/CAC.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Customer side (4-doc endo, $1.5K/mo)</div>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {[
                    ["Annual subscription", "$18,000", "text-slate-900"],
                    ["Revenue recovered (modeled)", "$214,000", "text-emerald-700"],
                    ["Hours saved × $35 fully-loaded", "$25,375", "text-emerald-700"],
                    ["Total annual value (modeled)", "$239,000", "text-emerald-700"],
                    ["Payback (modeled)", "14 days", "text-brand-800"],
                    ["ROI multiple (modeled)", "13.3×", "text-brand-800"],
                  ].map(([l, v, color], i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="py-1.5 text-slate-500">{l}</td>
                      <td className={`py-1.5 text-right font-bold ${color}`}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-slate-400">
                <span className="font-bold">Note:</span> Recovery numbers are pilot-modeled, not pilot-proven. Q3'26 pilot will validate against the same 4-doc baseline.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-brand-800">SaaS economics (per paying logo)</div>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {[
                    ["ACV (subscription + amortized build)", "$22,167"],
                    ["COGS at scale (LLM + clearinghouse + hosting)", "$5,500"],
                    ["Gross margin (steady-state)", "75%"],
                    ["Gross margin (peak, when scaled)", "86%"],
                    ["CAC (Y1 blended)", "$9,500"],
                    ["CAC payback", "~10 months"],
                    ["Logo churn (base case, defensible)", "10-12% annual"],
                    ["NDR (skill expansion + DSO upsell)", "115%"],
                    ["LTV (4yr life, 12% churn)", "$58K"],
                    ["LTV / CAC", "6.1×"],
                  ].map(([l, v]) => (
                    <tr key={l} className="border-b border-slate-200">
                      <td className="py-1.5 text-slate-500">{l}</td>
                      <td className="py-1.5 text-right font-bold text-slate-900">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white">
            <div className="text-xs font-bold uppercase tracking-wide text-brand-300">Sensitivity (3-year ARR at exit)</div>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-slate-300">
                  <th className="text-left py-2">Variable</th>
                  <th className="text-right py-2">Bear (-1σ)</th>
                  <th className="text-right py-2 font-bold text-white">Base</th>
                  <th className="text-right py-2">Bull (+1σ)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Logo churn", "15%", "10-12%", "5%", "$1.8M / $4.5M / $6.2M (largest swing)"],
                  ["Pilot→paid conversion", "15%", "25-35%", "50%", "$3.0M / $4.5M / $7.5M"],
                  ["CAC", "$15K", "$8.5K", "$6K", "$3.6M / $4.5M / $5.0M"],
                  ["NDR", "100%", "115%", "130%", "$3.9M / $4.5M / $5.4M"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-700">
                    <td className="py-1.5 font-bold text-white">{row[0]}</td>
                    <td className="py-1.5 text-right text-slate-300">{row[1]}</td>
                    <td className="py-1.5 text-right font-bold text-brand-300">{row[2]}</td>
                    <td className="py-1.5 text-right text-slate-300">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-slate-400">
              ARR shows bear / base / bull at end of Y3. Restated base case ARR target: <span className="font-bold text-brand-300">$4.5M</span> (revised from $5.4M to reflect defensible churn assumption — see retention table). <span className="font-bold">Logo churn is the most sensitive variable</span> — a 1,000bps churn deterioration costs more ARR than a 50% CAC blow-out. Weekly churn surveillance is the operating priority.
            </p>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            12 — FINANCIAL MODEL
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={12} eyebrow="Financial model">
          <H2>$0 → $5.4M ARR · break-even Q4'27 · cash break-even Q1'29.</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-800 text-white">
                  <th className="p-3 text-left font-semibold">Period</th>
                  <th className="p-3 text-right font-semibold">Practices</th>
                  <th className="p-3 text-right font-semibold">MRR ($K)</th>
                  <th className="p-3 text-right font-semibold">ARR ($K)</th>
                  <th className="p-3 text-right font-semibold">GP ($K)</th>
                  <th className="p-3 text-right font-semibold">Opex ($K)</th>
                  <th className="p-3 text-right font-semibold">EBITDA ($K)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Q4'26 pilot", "1", "$1.5", "$18", "$15", "$180", "($165)"],
                  ["Q2'27", "8", "$13", "$156", "$134", "$310", "($176)"],
                  ["Q4'27 — EBITDA breakeven", "28", "$50", "$600", "$516", "$475", "$41"],
                  ["Q2'28", "65", "$128", "$1,536", "$1,321", "$640", "$681"],
                  ["Q4'28", "130", "$260", "$3,120", "$2,683", "$880", "$1,803"],
                  ["Q4'29", "240 + 4 DSOs", "$450", "$5,400", "$4,644", "$1,400", "$3,244"],
                ].map((row, i) => {
                  const breakeven = row[0].includes("breakeven");
                  return (
                    <tr key={i} className={breakeven ? "bg-brand-100 font-bold" : i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="p-3 text-slate-900">{row[0]}</td>
                      {row.slice(1).map((cell, j) => {
                        const cellStr = cell as string;
                        const isNeg = cellStr.includes("(");
                        const isLastCol = j === 5;
                        return (
                          <td
                            key={j}
                            className={`p-3 text-right ${isNeg ? "text-rose-600" : isLastCol && cellStr.includes("$") ? "text-emerald-700" : "text-slate-900"}`}
                          >
                            {cellStr}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5 text-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Key assumptions</div>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>· Logo churn 10-12% annual (workflow-embedded SaaS, slight premium)</li>
                <li>· NDR 115% (skill expansion Y2-3 + DSO upsell)</li>
                <li>· CAC $11K → $7.5K Y1→Y3 as study-club referrals scale</li>
                <li>· Build fees deferred over 12 months</li>
                <li>· COGS at scale ~25% (LLM 13% + clearinghouse + hosting + CSM)</li>
                <li>· DSO contracts: 4 in Y3 = $360K incremental ARR</li>
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-5 text-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Cohort retention curve</div>
              <table className="mt-2 w-full">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="py-1 text-left text-xs text-slate-500">Month</th>
                    <th className="py-1 text-right text-xs text-slate-500">Industry median</th>
                    <th className="py-1 text-right text-xs text-brand-800">Restore base</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["M6", "92%", "93%"],
                    ["M12", "85%", "88%"],
                    ["M18", "80%", "84%"],
                    ["M24", "76%", "80%"],
                    ["M36", "68%", "72%"],
                  ].map(([m, ind, ours]) => (
                    <tr key={m}>
                      <td className="py-1 text-slate-500">{m}</td>
                      <td className="py-1 text-right text-slate-700">{ind}</td>
                      <td className="py-1 text-right font-bold text-brand-800">{ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-slate-400">
                Industry median: SaaS Capital + Bessemer State of Health AI 2026. Restore base = workflow-embedded specialty SaaS, slight premium for embedded-in-PMS positioning. Will be measured in pilot M3-M12.
              </p>
            </div>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            13 — RISKS + MITIGATIONS
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={13} eyebrow="Risks + mitigations">
          <H2>What could go wrong, and what we'll do about it.</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-800 text-white">
                  <th className="p-3 text-left font-semibold">Risk</th>
                  <th className="p-3 text-center font-semibold">Likelihood</th>
                  <th className="p-3 text-center font-semibold">Impact</th>
                  <th className="p-3 text-left font-semibold">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["HIPAA / data breach", "Low", "High", "Local de-identification before any inference; Anthropic BAA; SOC 2 Type 1 in M9; cyber insurance from Day 1; full audit log per output."],
                  ["PMS API blocking / rate-limit changes", "Medium", "Medium", "Multi-PMS strategy (PBS, TDO, Endovision) so no single dependency >40% of pipeline; clearinghouse fallback for submission."],
                  ["Carrier pushback on AI-generated appeals", "Medium", "Medium", "Office manager always in the loop (signed approval); narratives never claim AI authorship; carrier-relations team M18 to manage payer dialogues; DO NOT APPEAL discipline preserves credibility."],
                  ["Slow PMS adoption among specialists", "Medium", "Medium", "PBS Endo penetration ~33% of endo today (5,500 → ~1,800 addressable Y1); TDO + Endovision integration brings coverage to ~85% by Y2; manual upload mode as fallback."],
                  ["Key-person dependency on founder", "High (early)", "High", "Method Co. resignation letter dated and conditional on close = closing condition (eliminates part-time-founder discount). $150-250K founder personal cash at close. Co-founder/CTO hire pre-funded in Tranche 1. Key-person life insurance $2M. 4-yr vest with 1-yr cliff disclosed."],
                  ["AI infra (Anthropic pricing / model changes)", "Medium", "Low-medium", "Provider-agnostic prompt layer; OpenAI + Bedrock fallback paths tested; 3-month inference cost reserve."],
                  ["Large incumbent (Vyne, Henry Schein) builds this", "Medium", "Medium-high", "Speed wedge (18-month head-start to lock cohort + carrier data); founder-DSO relationships make them more likely acquirer than competitor; defensibility math compounds with usage."],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-3 font-bold text-slate-900">{row[0]}</td>
                    <td className="p-3 text-center text-slate-700">{row[1]}</td>
                    <td className="p-3 text-center text-slate-700">{row[2]}</td>
                    <td className="p-3 text-xs text-slate-700">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            14 — TRACTION (honest)
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={14} eyebrow="Traction — honest">
          <H2>Today: 1 design partner, 0 paid logos. Here's the 365-day plan.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border-2 border-brand-700 bg-brand-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-brand-800">Today (May 2026)</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>· <span className="font-bold">1 design partner:</span> Allyson A. Abbott DMD PC (4-doc endo, PBS Endo)</li>
                <li>· <span className="font-bold">0 paid logos</span> outside design partner</li>
                <li>· <span className="font-bold">0 LOIs</span> from non-mom prospects</li>
                <li>· <span className="font-bold">Live demo</span> at restore-demo.vercel.app</li>
                <li>· <span className="font-bold">Discovery interview</span> next month with mom + office manager</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">90-day plan (Aug 2026)</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>· Pilot live with design partner</li>
                <li>· First non-mom paid logo (target: 1 endo group from study-club intros)</li>
                <li>· 3 LOIs in active conversation</li>
                <li>· Pilot metrics validated: appeal-success rate baseline → measured</li>
                <li>· Anthropic BAA fully executed; SOC 2 audit kicked off</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">365-day plan (May 2027)</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>· 25 paying practices · ~$750K ARR run-rate</li>
                <li>· Cohort M3 retention &gt;95%</li>
                <li>· 1 DSO conversation in late stage</li>
                <li>· AAE Annual exhibit (Mar 2027) drives 30% of Y2 logos</li>
                <li>· Carrier intelligence dataset: 30K+ resolved arcs</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white">
            <div className="text-xs font-bold uppercase tracking-wide text-brand-300">Why we are confident in the 90-day milestone</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Founder has 6 specialist practice owners in study-club / professional network who have informally said yes to a paid pilot once design partner is live. Conversion of warm-intro to paid pilot in similar dental tech has historically run 30-40% (per Pearl AI, Modento founder interviews 2024). Plan assumes 1 of 6 closes in the first 90 days — base case.
            </p>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            15 — TEAM
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={15} eyebrow="Team">
          <H2>Operator-founder. Honest design partner. Compounding advisory.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["FOUNDER · CEO", "Ross Richardson", [
                "EVP Finance & Accounting, Method Co. (Philadelphia hospitality, 10 hotels + multiple F&B; ~$200M+ revenue)",
                "Led financial operations across 2,000+ employees; built automation tooling, monthly close, budgeting, vendor unit economics",
                "Method Co. resignation letter dated and conditional on round close (closing condition for lead investor). Personal cash injection at close: $150-250K common stock alongside priced round.",
                "0 prior healthcare startup experience = 0 dogma · brings operator-grade financial discipline to a category that lacks it",
              ]],
              ["DESIGN PARTNER", "Allyson A. Abbott DMD PC", [
                "15+ years operating · multi-doc endodontic practice on PBS Endo · in-house billing",
                "Weekly product feedback; the customer who keeps the founder honest",
                "Not a cheerleader — has switched dental software vendors 3× in 10 years when products didn't deliver",
                "Pilot kickoff next month; full PMS integration access",
              ]],
              ["ADVISORY · BUILDING", "TBD by close", [
                "Insurance ops experts (former RCM directors, dental specialty appeal specialists)",
                "Dental PMS integration partners (PBS Endo, TDO, Dentrix engineering leads)",
                "DSO operators (Heartland, Pacific Dental, MB2 — at least one C-level by close)",
                "Carrier-relations veteran (former Cigna or Delta dental adjudication) for early intelligence loop",
              ]],
            ].map(([label, name, bullets]) => (
              <div key={label as string} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="bg-brand-700 px-5 py-2 text-xs font-bold text-white">{label}</div>
                <div className="p-5">
                  <div className="text-base font-bold text-slate-900">{name}</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {(bullets as string[]).map((b) => <li key={b} className="flex gap-2"><span className="text-brand-700">·</span><span>{b}</span></li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            16 — CAP TABLE + ROUND STRUCTURE
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={16} eyebrow="The round">
          <H2>$2.5M seed. Two-tranche, milestone-gated. SAFE or priced.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Round structure (3-tranche)</div>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {[
                    ["Round size", "$2.5M total"],
                    ["Tranche 1 — close", "$1.25M (definitive docs + founder Method resignation)"],
                    ["Tranche 2 — pilot validates", "$750K (20+ pre-auths/mo, 80%+ acceptance, 2 paid LOIs, M6)"],
                    ["Tranche 3 — paying scale", "$500K (10 paying logos, $200K ARR, M12)"],
                    ["Instrument", "Priced round, $10M post"],
                    ["Alternative", "Post-money SAFE, $10M cap, 20% discount"],
                    ["Option pool (post-close)", "10% (pre-money top-up)"],
                    ["Founder cash injection", "$150-250K common at close"],
                    ["Founder commitment", "FT M3+ (Method Co. resignation as closing condition)"],
                  ].map(([l, v]) => (
                    <tr key={l} className="border-b border-slate-200">
                      <td className="py-1.5 text-slate-500">{l}</td>
                      <td className="py-1.5 text-right font-bold text-slate-900">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Cap table (illustrative, post-close)</div>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {[
                    ["Founder (Ross Richardson)", "70%", "Common"],
                    ["Seed investors", "20%", "Preferred / SAFE conversion"],
                    ["Option pool", "10%", "Reserved for first 5-7 hires"],
                    ["Total", "100%", ""],
                  ].map(([who, pct, instrument], i) => (
                    <tr key={who} className={`border-b border-slate-200 ${i === 3 ? "font-bold" : ""}`}>
                      <td className="py-1.5 text-slate-700">{who}</td>
                      <td className="py-1.5 text-right text-slate-900">{pct}</td>
                      <td className="py-1.5 pl-3 text-xs text-slate-500">{instrument}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-slate-400">
                Final structure subject to lead-investor preference. Founder retains majority; option pool covers eng + GTM build through M18.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-brand-100 p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-brand-800">Series A trigger checklist (hit 7+ of 10 → Series A opens)</div>
            <div className="mt-3 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-2">
              {[
                ["1", "ARR ≥$4M", "Healthcare-AI vertical floor"],
                ["2", "Logo count ≥150", "Repeatable motion, not whales"],
                ["3", "NDR ≥115%", "Expansion economics proven"],
                ["4", "Logo churn &lt;12% annualized", "Retention validated past M18"],
                ["5", "CAC payback &lt;12mo", "Unit economics defensible"],
                ["6", "Gross margin ≥75% at scale", "AI infra not eating the model"],
                ["7", "≥2 of 3 skills shipped", "Multi-product expansion"],
                ["8", "≥3 PMS integrations", "De-risks single-PMS dependency"],
                ["9", "SOC 2 Type II in progress", "Enterprise/DSO-readiness"],
                ["10", "Pipeline coverage ≥3× next-quarter target", "Forward growth underwritable"],
              ].map(([n, h, b]) => (
                <div key={n} className="flex gap-2">
                  <span className="font-mono text-brand-700">{n}.</span>
                  <span><span className="font-bold text-slate-900">{h}</span> <span className="text-slate-500">— {b}</span></span>
                </div>
              ))}
            </div>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            17 — USE OF PROCEEDS
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={17} eyebrow="Use of proceeds">
          <H2>Every dollar tied to a milestone. Tranche 2 unlocks at 25 paying logos.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-[1.3fr_1fr]">
            <div className="space-y-2">
              {[
                ["42%", "Engineering & AI", "$1,050K", "3 engineers + 1 ML/eval. Builds: PMS integrations (TDO, Endovision), carrier playbook tooling, evals, BAA workflow infra."],
                ["25%", "GTM", "$625K", "AAE booth + sponsorships ($125K Y1+Y2), study-club programs, BDR M9, CSM M6, AE M15, marketing site + collateral."],
                ["8%", "Compliance & legal", "$200K", "HIPAA + SOC 2 Type 1 audit (Vanta or Drata), BAA legal counsel, cyber insurance, trademark + patent counsel."],
                ["16%", "Working capital", "$400K", "DSO contract bridge (long AR cycles), 6-month cash buffer, inference + clearinghouse OpEx pre-revenue."],
                ["9%", "Founder + ops salaries", "$225K", "Below-market through M18 to extend runway. Founder $100K, COO/Ops hire M18 ($125K)."],
              ].map(([pct, label, amt, body]) => (
                <div key={label} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">{pct}</div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-sm font-bold text-slate-900">{label}</div>
                      <div className="text-sm font-bold text-brand-800">{amt}</div>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">{body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-brand-100 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-brand-800">Milestone gates</div>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["Tranche 1 closes (M0)", "$1.25M · founder resigns Method, CTO offer signed"],
                  ["Pilot validates (M3)", "20+ pre-auths/mo, 80%+ acceptance vs. baseline"],
                  ["First non-mom paid logo (M3-M6)", "1-2 paid pilots from study-club intros"],
                  ["Tranche 2 unlocks (M6)", "$750K · 2 paid LOIs, SOC 2 scoping kicked off"],
                  ["10 paying logos (M9-M12)", "Cohort M3 retention validated, BDR hired"],
                  ["Tranche 3 unlocks (M12)", "$500K · 10 paying logos, $200K ARR"],
                  ["25 paying logos (M15)", "AAE-driven cohort lands, AE hired"],
                  ["Series A conversation (M18)", "$1.5M ARR · 65 logos · pipeline 3× cover"],
                ].map(([h, b]) => (
                  <li key={h}>
                    <div className="font-bold text-slate-900">✓ {h}</div>
                    <div className="ml-5 text-xs text-slate-600">{b}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Slide>

        {/* ───────────────────────────────────────────────────────────────
            18 — CLOSING
            ─────────────────────────────────────────────────────────────── */}
        <Slide num={18} eyebrow="Closing">
          <H2>The ask, in one paragraph.</H2>
          <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-slate-700 md:text-lg">
            <p>
              Restore is the operator-built infrastructure layer for dental specialty insurance. The wedge is endo (4,486 practices, $135M SOM). The moat is per-carrier intelligence that compounds with usage. The unfair advantage is a hospitality operator-founder with a 4-doc design partner who keeps him honest weekly.
            </p>
            <p>
              We are raising <span className="font-bold text-slate-900">$2.5M seed</span> in two milestone-gated tranches to deploy 18-month runway against <span className="font-bold text-slate-900">$1.5M ARR</span> and <span className="font-bold text-slate-900">65 paying practices</span>, triggering a Series A at <span className="font-bold text-slate-900">$4M+ ARR / Q3'28</span>.
            </p>
            <p>
              Comparables imply <span className="font-bold text-slate-900">$40-60M post-money</span> at Series A. Strategic exit candidates: Henry Schein One, Patterson Dental, Vyne Medical parent, Waystar, R1.
            </p>
          </div>
          <div className="mt-10 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Live product</div>
              <div className="mt-1 font-mono text-sm text-brand-700">restore-demo.vercel.app</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Code</div>
              <div className="mt-1 font-mono text-sm text-brand-700">github.com/rrmethodco/rrmethodco</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Founder contact</div>
              <div className="mt-1 font-mono text-sm text-slate-700">richardson112288@gmail.com</div>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-slate-400">
            End of deck · Restore · {new Date().getFullYear()}
          </div>
        </Slide>

        <footer className="mt-16 border-t border-slate-100 pt-8 text-center text-sm text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <Link href="/practice" className="hover:text-slate-700">My Practice</Link>
            <a href="https://github.com/rrmethodco/rrmethodco" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-slate-700">
              <Github size={12} />GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ── Building blocks ──────────────────────────────────────────────────── */

function Slide({ num, eyebrow, children }: { num: number; eyebrow: string; children: React.ReactNode }) {
  return (
    <section
      className="relative mb-10 break-after-page rounded-2xl border border-slate-100 bg-white p-6 md:mb-14 md:p-10 print:mb-0 print:break-after-page print:rounded-none print:border-0 print:p-12 print:shadow-none"
      style={{ breakAfter: "page" }}
    >
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
        <span className="text-brand-700">{eyebrow}</span>
        <span className="text-slate-400">{String(num).padStart(2, "0")} / {String(TOTAL_SLIDES).padStart(2, "0")}</span>
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{children}</h2>;
}

function Sources({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 border-t border-slate-200 pt-3 text-[10px] leading-relaxed text-slate-400">
      <span className="font-semibold uppercase tracking-wide text-slate-500">Sources: </span>
      {children}
    </p>
  );
}
