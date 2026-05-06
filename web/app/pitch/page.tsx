import Link from "next/link";
import {
  Stethoscope,
  ArrowLeft,
  FileText,
  Sparkles,
  Github,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restore — Investor pitch deck",
  description: "Restore. AI that wins dental claims back. 16-slide investor deck.",
};

/**
 * Web-rendered investor pitch deck. Mobile-first responsive layout —
 * each slide is a section, content reflows on phone, prints cleanly to PDF
 * via Playwright/Chrome.
 */
export default function PitchDeckPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 print:bg-white">
      {/* ─── HEADER (hidden on print) ───────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
              <Stethoscope size={16} />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900">Restore</span>
            <span className="hidden text-sm text-slate-400 sm:inline">· Pitch deck</span>
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
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={12} />
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 md:px-6 md:pt-12">
        {/* ─── SLIDE 1 — TITLE ─────────────────────────────────────────── */}
        <Slide num={1} total={16} eyebrow="Investor pitch · Seed round · 2026">
          <div className="flex min-h-[60vh] flex-col justify-center md:min-h-[70vh]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white">
                <Stethoscope size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Restore</span>
            </div>
            <h1 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              AI that wins dental claims back.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Pre-authorizations, claim appeals, and referral letters — drafted from your PMS, approved in one click. Carrier intelligence that gets smarter every week.
            </p>
            <div className="mt-10 text-xs text-slate-400">
              restore-demo.vercel.app · github.com/rrmethodco/rrmethodco
            </div>
          </div>
        </Slide>

        {/* ─── SLIDE 2 — PROBLEM A ─────────────────────────────────────── */}
        <Slide num={2} total={16} eyebrow="The bleed">
          <H2>Carriers deny 20-30% of valid claims. Most practices give up.</H2>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <Body>
              <p>
                An office manager bills at ~$40/hr. A 90-minute appeal letter for a claim that <em>might</em> get paid in three months is a losing bet — so it doesn't get written.
              </p>
              <p>
                Endo specifically: $5K-$15K claims routinely written off because no office manager has 90 minutes to fight a carrier.
              </p>
              <p>
                And generic AI text generators don't fix this. Every carrier wants a different narrative. Without per-carrier intelligence, generic appeals lose 60-70% of the time.
              </p>
            </Body>
            <div className="rounded-xl bg-slate-50 p-6">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">The math today</div>
              <ul className="mt-4 space-y-4 text-sm">
                {[
                  ["$500K–$2M", "annually written off per practice in justified revenue"],
                  ["90+ min", "of office-manager time per appeal — labor cost often exceeds expected recovery"],
                  ["35-50%", "success rate when practices draft appeals themselves"],
                  ["No learning loop", "every appeal a practice writes loses its lessons the moment the case closes"],
                ].map(([h, b]) => (
                  <li key={h} className="space-y-1">
                    <div className="text-base font-bold text-rose-600 md:text-lg">{h}</div>
                    <div className="text-slate-700">{b}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Slide>

        {/* ─── SLIDE 3 — PROBLEM B ─────────────────────────────────────── */}
        <Slide num={3} total={16} eyebrow="Problem">
          <H2>Why practices don't appeal — even when they should.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Time cost > revenue probability", "Office manager billable at ~$40/hr. 90 min appeal = $60 cost. 50% win × $500 avg = $250 EV. The practice breaks even at best."],
              ["Every carrier wants a different narrative", "Cigna wants anatomical specificity. Delta wants ADA-CDT-exact terminology. MetLife wants conservative-alternatives-considered language. Generic letters lose 60-70% of the time."],
              ["No learning loop", "This appeal lost? Next case gets the same flawed template. Practice has zero visibility into why denials cluster. Carrier intelligence dies with the person who drafted the letter."],
            ].map(([h, b]) => (
              <div key={h} className="rounded-xl border-l-4 border-brand-700 bg-slate-50 p-5">
                <div className="text-base font-bold text-slate-900">{h}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{b}</p>
              </div>
            ))}
          </div>
        </Slide>

        {/* ─── SLIDE 4 — WHY NOW ───────────────────────────────────────── */}
        <Slide num={4} total={16} eyebrow="Why now">
          <H2>Three converging shifts make this practical in 2026.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["01", "LLM reasoning extracts carrier patterns at scale", "Read 1,000 EOBs across one carrier, identify denial clusters. Inference cost <$0.10 per narrative. Vision models parse claim forms and clinical notes at speed."],
              ["02", "Dental PMS integrations have matured", "PBS Endo, TDO, Endovision, Dentrix, Open Dental all stream events in real time. New TX plans, EOBs, completed treatments — live webhooks. No new login friction for staff."],
              ["03", "Sophisticated buyers + BAA-grade AI", "DSO consolidation (16% → 32% of practices) creates RCM-aware buyers. Endo measures insurance leakage as a P&L line. Anthropic API ships BAA out of the box."],
            ].map(([n, h, b]) => (
              <div key={n} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-3xl font-bold text-brand-700">{n}</div>
                <div className="mt-3 text-base font-semibold text-slate-900">{h}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{b}</p>
              </div>
            ))}
          </div>
        </Slide>

        {/* ─── SLIDE 5 — SOLUTION ──────────────────────────────────────── */}
        <Slide num={5} total={16} eyebrow="Solution">
          <H2>Watch. Draft. Approve. Done.</H2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            Restore lives inside the practice's PMS. When something happens that needs a response, we draft it. The office manager reviews and submits in one click. Submission to clearinghouse + PMS document center is autonomous.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {[
              ["01", "Trigger", "PMS webhook fires. New TX plan, EOB with denial code, treatment complete."],
              ["02", "Draft", "Restore reads case context. Per-carrier intelligence applied. Confidence rationale shown. Sometimes the answer is DO NOT APPEAL."],
              ["03", "Review", "Office manager opens inbox. 60-90 second review. Approve, edit, or skip with reason."],
              ["04", "Submit", "Auto-submits to clearinghouse. Logs to PMS Doc Center. Audit trail captured."],
            ].map(([n, h, b]) => (
              <div key={n} className="rounded-xl bg-slate-50 p-5">
                <div className="text-2xl font-bold text-brand-700">{n}</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{h}</div>
                <p className="mt-2 text-sm text-slate-700">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 rounded-md border-l-4 border-brand-700 bg-brand-50 p-4 text-base font-semibold text-brand-800">
            Result: 90 minutes of work compressed to 90 seconds of review.
          </p>
        </Slide>

        {/* ─── SLIDE 6 — THE MOAT ──────────────────────────────────────── */}
        <Slide num={6} total={16} eyebrow="The moat">
          <H2>Carrier intelligence that compounds.</H2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            Every approved claim makes the next narrative smarter. Every denied claim teaches us not to make that mistake again — across the customer base.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Denial patterns", "Cigna: 75% of denials cluster on codes X, Y, Z. Delta: 41% on D3331 bundling. MetLife: 36% on apicoectomy 'try retreatment first.'"],
              ["Narrative preferences", "Cigna: lead with anatomical specificity. Delta: ADA-CDT-exact terminology. Aetna: front-load financial impact."],
              ["DO NOT APPEAL patterns", "Plan-level exclusions, exhausted caps, contractual limits. Appealing degrades carrier credibility for the cases that DO matter."],
              ["Escalation paths", "When peer-to-peer. When DOI complaint. Which carriers respond on first ask vs. require 3 attempts."],
            ].map(([h, b]) => (
              <div key={h} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-base font-bold text-brand-800">{h}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-base font-semibold text-brand-800">
            1 practice finds a pattern → 1,000 practices learn instantly. The intelligence isn't the AI; it's the feedback loop.
          </p>
        </Slide>

        {/* ─── SLIDE 7 — DIFFERENTIATION ───────────────────────────────── */}
        <Slide num={7} total={16} eyebrow="Differentiation">
          <H2>Three things no one else pairs together.</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-800 text-white">
                  <th className="p-3 text-left font-semibold">Capability</th>
                  <th className="p-3 text-center font-semibold">Restore</th>
                  <th className="p-3 text-center font-semibold">Vyne Dental</th>
                  <th className="p-3 text-center font-semibold">DentalRobot</th>
                  <th className="p-3 text-center font-semibold">Pearl AI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Carrier intelligence (per-carrier)", "✓", "Legacy rules", "Generic", "—"],
                  ["Case lifecycle threading", "✓", "Query-based", "Single doc", "—"],
                  ["DO NOT APPEAL discipline", "✓", "—", "—", "—"],
                  ["Real-time PMS integration", "✓", "Manual upload", "Manual upload", "Imaging only"],
                  ["Autonomous submission", "✓", "Draft only", "Draft only", "—"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-3 font-semibold text-slate-900">{row[0]}</td>
                    {row.slice(1).map((cell, j) => (
                      <td
                        key={j}
                        className={`p-3 text-center ${cell === "✓" ? "font-bold text-brand-800" : "text-slate-600"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-base font-semibold text-brand-800">
            The gap we fill: carrier intelligence that learns + case threading that doesn't break + the discipline to say "don't appeal."
          </p>
        </Slide>

        {/* ─── SLIDE 8 — MARKET ────────────────────────────────────────── */}
        <Slide num={8} total={16} eyebrow="Market size">
          <H2>$135M SOM. $870M SAM. $4.5B+ TAM.</H2>
          <p className="mt-4 text-base text-slate-600">
            Bottom-up. Endo first because density of pre-auth + appeal events per practice is 3-5× general dentistry.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { label: "SOM", desc: "Endodontic practices", count: "4,486", acv: "$30K ACV", dollars: "$135M", color: "bg-brand-800", body: "PBS Endo + TDO + Endovision coverage. Win endo, the carrier intelligence layer compounds." },
              { label: "SAM", desc: "Dental specialty (endo, OS, perio, ortho, pedo)", count: "29,015", acv: "$30K ACV", dollars: "$870M", color: "bg-brand-700", body: "All ADA-recognized specialties. Insurance-heavy workflows." },
              { label: "TAM", desc: "All US dental + DSO premium", count: "178,000+", acv: "$25K blended", dollars: "$4.5B+", color: "bg-slate-500", body: "GP at lower ACV. DSO contracts ($50-150K build + $5-15K/mo) lift blended ARPU." },
            ].map((m) => (
              <div key={m.label} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className={`${m.color} px-5 py-3 text-sm font-bold text-white`}>{m.label}</div>
                <div className="p-5">
                  <div className="text-xs text-slate-500">{m.desc}</div>
                  <div className={`mt-3 text-4xl font-bold ${m.color === "bg-slate-500" ? "text-slate-700" : "text-brand-700"}`}>{m.dollars}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-700">{m.count} practices · {m.acv}</div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Sources: ADA HPI 2025 · Becker's Dental 2026 · Grand View Research (DSO 2025) · Towards Healthcare 2025
          </p>
        </Slide>

        {/* ─── SLIDE 9 — UNIT ECONOMICS ────────────────────────────────── */}
        <Slide num={9} total={16} eyebrow="Unit economics">
          <H2>14-day customer payback. 86% gross margin.</H2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-6">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Customer ROI</div>
              <div className="mt-2 text-base font-bold text-slate-900">4-doc endo practice</div>
              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ["Subscription", "$18,000/yr", "text-slate-900"],
                  ["Revenue recovered", "$214,000/yr", "text-emerald-700"],
                  ["Hours saved (725 × $35)", "$25,375/yr", "text-emerald-700"],
                  ["Total annual value", "$239,000", "text-emerald-700"],
                  ["Payback period", "14 days", "text-brand-800"],
                  ["ROI multiple", "13.3×", "text-brand-800"],
                ].map(([l, v, color]) => (
                  <div key={l} className="flex items-baseline justify-between border-b border-slate-200 pb-1">
                    <dt className="text-slate-500">{l}</dt>
                    <dd className={`font-bold ${color}`}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-wide text-brand-800">SaaS economics</div>
              <div className="mt-2 text-base font-bold text-slate-900">Per practice</div>
              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ["ACV (sub + amortized build)", "$22,167"],
                  ["Gross margin", "86%"],
                  ["CAC (Year 1 blended)", "$9,500"],
                  ["CAC payback", "5.0 months"],
                  ["Logo churn (assumption)", "5% annual"],
                  ["Net dollar retention", "115%"],
                  ["LTV (4yr life)", "$74,500"],
                  ["LTV / CAC", "7.8×"],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-baseline justify-between border-b border-slate-200 pb-1">
                    <dt className="text-slate-500">{l}</dt>
                    <dd className="font-bold text-slate-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Slide>

        {/* ─── SLIDE 10 — 3-YEAR MODEL ─────────────────────────────────── */}
        <Slide num={10} total={16} eyebrow="Financial model">
          <H2>$0 → $5.4M ARR in 36 months.</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
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
                  ["Q4'26 pilot", "1", "$1.5", "$18", "$15", "$180", "($165)", false],
                  ["Q2'27", "8", "$13", "$156", "$134", "$310", "($176)", false],
                  ["Q4'27 — break-even", "28", "$50", "$600", "$516", "$475", "$41", true],
                  ["Q2'28", "65", "$128", "$1,536", "$1,321", "$640", "$681", false],
                  ["Q4'28", "130", "$260", "$3,120", "$2,683", "$880", "$1,803", false],
                  ["Q4'29", "240 + 4 DSOs", "$450", "$5,400", "$4,644", "$1,400", "$3,244", false],
                ].map((row, i) => {
                  const breakeven = row[7] as boolean;
                  return (
                    <tr key={i} className={breakeven ? "bg-brand-100 font-bold" : i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="p-3 text-slate-900">{row[0]}</td>
                      {row.slice(1, 7).map((cell, j) => {
                        const cellStr = cell as string;
                        const isNeg = cellStr.includes("(");
                        const isPos = j === 5 && cellStr.includes("$") && !isNeg;
                        return (
                          <td
                            key={j}
                            className={`p-3 text-right ${isNeg ? "text-rose-600" : isPos ? "text-emerald-700" : "text-slate-900"}`}
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
          <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Assumptions</div>
            <p className="mt-2 leading-relaxed text-slate-700">
              Logo churn 5% · NDR 115% (skill expansion + DSO upsell) · CAC $11K → $7.5K Y1→Y3 · Build fees deferred over 12mo · Cash break-even Q1'29 at ~$3M ARR · 4 DSO contracts in Y3 = $360K incremental ARR
            </p>
          </div>
        </Slide>

        {/* ─── SLIDE 11 — PRICING ──────────────────────────────────────── */}
        <Slide num={11} total={16} eyebrow="Pricing">
          <H2>Three tiers. Same engine. Different leverage.</H2>
          <p className="mt-4 text-base text-slate-600">We don't price per seat. We price per insurance complexity.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { name: "Solo Practice", desc: "1-2 doc endo / specialty", build: "$10,000", sub: "$1,250/mo", anchor: "$120K+ recovered/yr", feats: ["All 3 core skills", "1 PMS integration", "Standard support"], theme: "bg-slate-50 text-slate-900" },
              { name: "Group Practice", desc: "3-8 doc, multi-loc", build: "$15,000", sub: "$2,000/mo", anchor: "$250-500K recovered/yr", feats: ["All Solo features", "Multi-location dashboard", "Carrier benchmarking", "Priority queue"], theme: "bg-brand-100 text-brand-800 ring-2 ring-brand-500" },
              { name: "DSO / Enterprise", desc: "10+ practices", build: "$50K-$150K", sub: "$5K-$15K/mo", anchor: "$2M+ recovered/yr at 50 locations", feats: ["All Group features", "SSO + custom BAA", "Custom carrier playbooks", "API access", "Dedicated CSM"], theme: "bg-slate-900 text-white" },
            ].map((t) => (
              <div key={t.name} className={`rounded-xl p-6 ${t.theme}`}>
                <div className={`text-xl font-bold ${t.theme.includes("white") ? "text-white" : "text-slate-900"}`}>{t.name}</div>
                <div className={`mt-1 text-xs ${t.theme.includes("white") ? "text-slate-300" : "text-slate-500"}`}>{t.desc}</div>
                <div className="mt-4 text-sm font-bold">Build: {t.build}</div>
                <div className="mt-1 text-sm font-bold">Subscription: {t.sub}</div>
                <div className={`mt-3 text-sm font-bold ${t.theme.includes("white") ? "text-brand-300" : "text-emerald-700"}`}>→ {t.anchor}</div>
                <ul className="mt-5 space-y-1.5 text-sm">
                  {t.feats.map((f) => <li key={f} className="flex gap-2"><span>•</span><span>{f}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </Slide>

        {/* ─── SLIDE 12 — GTM ──────────────────────────────────────────── */}
        <Slide num={12} total={16} eyebrow="Go-to-market">
          <H2>From pilot to $5M ARR in three channels.</H2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-800 text-white">
                  <th className="p-3 text-left font-semibold">Channel</th>
                  <th className="p-3 text-center font-semibold">Y1-Y3 logos</th>
                  <th className="p-3 text-center font-semibold">CAC</th>
                  <th className="p-3 text-center font-semibold">Conversion</th>
                  <th className="p-3 text-left font-semibold">Logic</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AAE Annual + regional", "60", "$8K", "8% booth→close", "Endo's mecca · 8K members · we exhibit Y1, sponsor Y2"],
                  ["Study clubs / KOL referrals", "110", "$4K", "25% warm→close", "Endo is a small world · pilot becomes 4 case studies · NPS loop"],
                  ["Cold outbound (top-200 endo groups)", "50", "$14K", "6% BDR→close", "Apollo + ZoomInfo list · founder-led · high-ACV groups"],
                  ["DSO BD (Heartland, Pacific, MB2)", "4 DSOs / 20 logos", "$35K", "1 of 8 convs", "Long cycle (9-12mo) · founder-led · PE-friendly economics"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-3 font-bold text-slate-900">{row[0]}</td>
                    <td className="p-3 text-center text-slate-700">{row[1]}</td>
                    <td className="p-3 text-center text-slate-700">{row[2]}</td>
                    <td className="p-3 text-center text-slate-700">{row[3]}</td>
                    <td className="p-3 text-slate-600">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-xl bg-brand-100 p-5 text-base font-bold text-brand-800">
            Blended CAC $8.5K vs. ACV $22.2K = 2.6× first-year payback. 240 endo practices = 5.3% of addressable endo market.
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Funnel example (study club): 200 referred convos → 80 demos → 40 pilots → 28 paid (35% pilot-to-paid)
          </p>
        </Slide>

        {/* ─── SLIDE 13 — TRACTION ─────────────────────────────────────── */}
        <Slide num={13} total={16} eyebrow="Traction">
          <H2>From pilot to playbook to portfolio.</H2>
          <div className="mt-8 space-y-5">
            {[
              ["PILOT", "June 2026 → December 2026", [
                "Design partner: founder's mother's 4-doc endo practice (PBS Endo)",
                "Live: pre-auth narratives, claim appeals (with DO NOT APPEAL scoring), referrals",
                "Baseline appeal success: 40% → Target: 60%+ by month 4",
                "Expected outcome: $150-200K annual revenue impact (1 practice)",
              ]],
              ["YEAR 1", "Jan – Dec 2027", [
                "50 endo practices live",
                "10,000+ claims/mo flowing through carrier intelligence layer",
                "PBS Endo + TDO + Endovision integrations hardened",
                "Cohort avg appeal success rate: 55%",
              ]],
              ["YEAR 2+", "2028 onward", [
                "Specialty expansion: oral surgery (750), perio (1,200), ortho (2,500)",
                "DSO platform integrations: Heartland, Pacific Dental, MB2",
                "Network effects on carrier intelligence compound",
                "Long-term: carriers themselves licensing Restore for adjudication",
              ]],
            ].map(([label, period, bullets]) => (
              <div key={label as string} className="flex gap-4">
                <div className="w-1.5 shrink-0 rounded-full bg-brand-700" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <div className="text-base font-bold text-brand-800">{label}</div>
                    <div className="text-sm text-slate-500">{period}</div>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {(bullets as string[]).map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-brand-700">·</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Slide>

        {/* ─── SLIDE 14 — VISION ───────────────────────────────────────── */}
        <Slide num={14} total={16} eyebrow="Vision">
          <H2>Restore as infrastructure.</H2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            In five years, Restore is the operating system for dental insurance — inside practices and inside carrier networks.
          </p>
          <div className="mt-8 space-y-3">
            {[
              ["Y1-Y2", "Practice insurance operations", "Restore = the brain for appeal strategy + pre-auth management. Endo → Oral surgery → Perio → Ortho → Pedo → GP.", "bg-brand-800"],
              ["Y3-Y4", "DSO intelligence layer", "Heartland / Pacific / MB2 license Restore for portfolio intelligence. DSOs use it for portfolio-level insurance revenue optimization.", "bg-brand-700"],
              ["Y5+", "Carrier adjudication (the inverse market)", "Carriers license Restore to grade appeals. \"Should we approve or deny this?\" Restore becomes the industry standard.", "bg-slate-500"],
            ].map(([label, headline, body, color]) => (
              <div key={label as string} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:gap-5">
                <div className={`${color} flex h-14 w-full shrink-0 items-center justify-center rounded-lg text-base font-bold text-white sm:w-20`}>{label}</div>
                <div className="flex-1">
                  <div className="text-base font-bold text-slate-900">{headline}</div>
                  <p className="mt-1 text-sm text-slate-700">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-base font-bold text-brand-800">
            Same intelligence, compounding value at every layer. $150B dental market with $40B insurance friction.
          </p>
        </Slide>

        {/* ─── SLIDE 15 — TEAM ─────────────────────────────────────────── */}
        <Slide num={15} total={16} eyebrow="Team">
          <H2>Hospitality operator. Honest design partner. Financial discipline.</H2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["FOUNDER", "Ross Richardson", [
                "EVP Finance & Accounting, Method Co. (Philadelphia hospitality, 10 hotels + F&B)",
                "Led financial operations across 2,000+ employees",
                "Obsessed with: systems that scale, unit economics that don't lie, operator feedback loops",
                "Zero prior healthcare startup experience — zero dogma",
              ]],
              ["DESIGN PARTNER", "Allyson A. Abbott DMD PC", [
                "15+ years operating · multi-doc endodontic practice on PBS Endo",
                "Weekly product feedback (she tells me what doesn't work in 30 sec)",
                "Not a cheerleader — a customer who will switch if it's broken",
                "Product-market fit pressure-tests in real time",
              ]],
              ["ADVISORY THESIS", "Building", [
                "Insurance ops experts (RCM, appeal specialists)",
                "Dental PMS integration partners (PBS Endo, TDO, Dentrix)",
                "DSO executives (Heartland, Pacific, MB2)",
                "Carrier contacts for early intelligence loop",
              ]],
            ].map(([label, name, bullets]) => (
              <div key={label as string} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="bg-brand-700 px-5 py-2 text-xs font-bold text-white">{label}</div>
                <div className="p-5">
                  <div className="text-base font-bold text-slate-900">{name}</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {(bullets as string[]).map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-brand-700">·</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-base font-bold text-brand-800">
            Founder who ships · customer who keeps honest · unit-economics flywheel from day one.
          </p>
        </Slide>

        {/* ─── SLIDE 16 — THE ASK ──────────────────────────────────────── */}
        <Slide num={16} total={16} eyebrow="The ask">
          <H2>$2.5M seed → 18 months → $1.5M ARR.</H2>
          <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Use of funds ($2.5M)</div>
              <div className="mt-3 space-y-2">
                {[
                  ["42%", "Engineering & AI", "$1,050K", "3 engineers + 1 ML/eval · PMS integrations · carrier playbook tooling"],
                  ["25%", "GTM", "$625K", "Founder-led + 1 BDR + 1 CSM · AAE booth · study club sponsorships"],
                  ["8%", "Compliance", "$200K", "HIPAA audit · SOC 2 Type 1 · BAA legal · cyber insurance"],
                  ["16%", "Working capital", "$400K", "DSO contract bridge (long AR) · 6mo cash buffer"],
                  ["9%", "Founder + ops", "$225K", "Below-market through M18"],
                ].map(([pct, label, amt, body]) => (
                  <div key={label} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">{pct}</div>
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
            </div>
            <div className="rounded-xl bg-brand-100 p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-brand-800">18-month milestones</div>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["65 paying practices", "$1.5M ARR run-rate"],
                  ["86% gross margin", "Validated at scale"],
                  ["2 DSO LOIs signed", "Heartland-tier conversations"],
                  ["8,000+ resolved claims", "Carrier intelligence dataset across 25+ carriers"],
                  ["Series A target", "$8-12M at $40-60M post on $4M+ ARR (Q3'28)"],
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

        {/* ─── FOOTER ──────────────────────────────────────────────────── */}
        <footer className="mt-16 border-t border-slate-100 pt-8 text-center text-sm text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-brand-700" />
            <span>End of deck</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
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

/* ── building blocks ───────────────────────────────────────────────────── */

function Slide({ num, total, eyebrow, children }: { num: number; total: number; eyebrow: string; children: React.ReactNode }) {
  return (
    <section
      className="relative mb-10 break-after-page rounded-2xl border border-slate-100 bg-white p-6 md:mb-16 md:p-10 print:mb-0 print:border-0 print:p-12 print:shadow-none"
      style={{ breakAfter: "page" }}
    >
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
        <span className="text-brand-700">{eyebrow}</span>
        <span className="text-slate-400">{num} / {total}</span>
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">{children}</h2>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">{children}</div>;
}
