"use client";

import Link from "next/link";
import {
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  Home,
  LayoutGrid,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL = 18;

/* ──────────────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────────────── */

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  /* Goto without breaking scroll-snap on touch */
  const goto = useCallback((i: number) => {
    const target = Math.max(0, Math.min(TOTAL - 1, i));
    setCurrent(target);
    setTocOpen(false);
    slideRefs.current[target]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "start" });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#s${target + 1}`);
    }
  }, []);

  /* Keyboard nav */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goto(current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goto(current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goto(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goto(TOTAL - 1);
      } else if (e.key === "Escape") {
        setTocOpen(false);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "g" || e.key === "G") {
        setTocOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, goto]);

  /* URL hash on mount */
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash.startsWith("#s")) {
      const n = parseInt(hash.slice(2), 10);
      if (!Number.isNaN(n) && n >= 1 && n <= TOTAL) {
        // jump without animation on initial load
        setCurrent(n - 1);
        setTimeout(() => slideRefs.current[n - 1]?.scrollIntoView({ inline: "start" }), 50);
      }
    }
  }, []);

  /* Detect which slide is in view (for scroll-snap nav consistency) */
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const onScroll = () => {
      const i = Math.round(c.scrollLeft / c.clientWidth);
      if (i !== current && i >= 0 && i < TOTAL) {
        setCurrent(i);
        window.history.replaceState(null, "", `#s${i + 1}`);
      }
    };
    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
  }, [current]);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 text-slate-900 print:static print:bg-white">
      {/* ─── DECK CONTAINER ──────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth print:block print:h-auto print:overflow-visible"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {[
          <S01 key={1} />, <S02 key={2} />, <S03 key={3} />, <S04 key={4} />,
          <S05 key={5} />, <S06 key={6} />, <S07 key={7} />, <S08 key={8} />,
          <S09 key={9} />, <S10 key={10} />, <S11 key={11} />, <S12 key={12} />,
          <S13 key={13} />, <S14 key={14} />, <S15 key={15} />, <S16 key={16} />,
          <S17 key={17} />, <S18 key={18} />,
        ].map((Slide, i) => (
          <section
            key={i}
            ref={(el) => { slideRefs.current[i] = el; }}
            id={`s${i + 1}`}
            className="relative h-full w-screen shrink-0 snap-start overflow-y-auto print:h-auto print:w-full print:break-after-page print:overflow-visible"
          >
            {Slide}
          </section>
        ))}
      </div>

      {/* ─── TOOLBAR (hidden in print + fullscreen) ─────────────────── */}
      <div className="fixed bottom-3 left-1/2 z-30 -translate-x-1/2 print:hidden">
        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur">
          <Link
            href="/"
            className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Home"
            title="Home"
          >
            <Home size={14} />
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <button
            type="button"
            onClick={() => goto(current - 1)}
            disabled={current === 0}
            className="rounded-full p-1.5 text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="rounded-full px-3 py-1 text-xs font-semibold tabular-nums text-slate-700 transition-colors hover:bg-slate-100"
            title="All slides (G)"
          >
            {String(current + 1).padStart(2, "0")} <span className="text-slate-400">/ {String(TOTAL).padStart(2, "0")}</span>
          </button>
          <button
            type="button"
            onClick={() => goto(current + 1)}
            disabled={current === TOTAL - 1}
            className="rounded-full p-1.5 text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Slide overview"
            title="Slide overview (G)"
          >
            <LayoutGrid size={14} />
          </button>
          <a
            href="/restore-pitch-deck-v2.pdf"
            download
            className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Download PDF"
            title="Download PDF"
          >
            <FileText size={14} />
          </a>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Fullscreen"
            title="Fullscreen (F)"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* ─── PROGRESS BAR ─────────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 z-20 h-0.5 w-full bg-transparent print:hidden">
        <div
          className="h-full bg-brand-700 transition-all duration-300"
          style={{ width: `${((current + 1) / TOTAL) * 100}%` }}
        />
      </div>

      {/* ─── TOC OVERLAY ──────────────────────────────────────────────── */}
      {tocOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/80 p-6 backdrop-blur print:hidden">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setTocOpen(false)}
            className="absolute inset-0"
          />
          <div className="relative max-h-full w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setTocOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
            <div className="text-xs font-bold uppercase tracking-wide text-brand-700">All slides</div>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Restore — investor pitch</h2>
            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SLIDE_INDEX.map((title, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goto(i)}
                  className={`flex items-baseline gap-3 rounded-md border p-3 text-left text-sm transition-colors ${
                    i === current
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-mono text-xs text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-semibold text-slate-900">{title}</span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-xs text-slate-400">
              Tip: <span className="font-mono">←</span> / <span className="font-mono">→</span> nav · <span className="font-mono">G</span> grid · <span className="font-mono">F</span> fullscreen · <span className="font-mono">Esc</span> close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const SLIDE_INDEX = [
  "Title",
  "Executive summary",
  "Market — TAM/SAM/SOM",
  "Problem",
  "Why now",
  "Product",
  "The moat",
  "Competitive landscape",
  "Comparables",
  "Go-to-market",
  "Unit economics",
  "Financial model",
  "Risks + mitigations",
  "Traction — honest",
  "Team",
  "Round structure",
  "Use of proceeds",
  "Closing",
];

/* ──────────────────────────────────────────────────────────────────────
   Slide chrome — every slide uses this wrapper for consistent layout.
   ────────────────────────────────────────────────────────────────────── */

function SlideFrame({
  num,
  eyebrow,
  bg = "bg-white",
  children,
}: {
  num: number;
  eyebrow: string;
  bg?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative flex h-full w-full flex-col ${bg} px-6 py-8 md:px-12 md:py-12 lg:px-20 lg:py-16`}>
      {/* slide chrome — eyebrow + slide number */}
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] md:text-xs">
        <span className="text-brand-700">{eyebrow}</span>
        <span className="text-slate-400 tabular-nums">
          {String(num).padStart(2, "0")} <span className="text-slate-300">/ {TOTAL}</span>
        </span>
      </div>
      {/* content */}
      <div className="mt-3 flex-1 overflow-y-auto md:mt-5 lg:mt-6">{children}</div>
      {/* footer brand */}
      <div className="pt-4 text-[10px] uppercase tracking-[0.2em] text-slate-400 md:text-xs">
        Restore · Insurance ops infrastructure for dental specialty
      </div>
    </div>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
      {children}
    </h1>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold leading-[1.15] tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
      {children}
    </h2>
  );
}

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-relaxed text-slate-600 md:text-lg lg:text-xl">{children}</p>
  );
}

function Sources({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 border-t border-slate-200 pt-2 text-[10px] leading-relaxed text-slate-400">
      <span className="font-bold uppercase tracking-wide text-slate-500">Sources: </span>
      {children}
    </p>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   01 — TITLE
   ────────────────────────────────────────────────────────────────────── */
function S01() {
  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-br from-brand-800 via-brand-700 to-slate-900 px-6 py-8 text-white md:px-12 md:py-12 lg:px-20 lg:py-16">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] md:text-xs">
        <span className="text-brand-200">Investor pitch · Seed · 2026</span>
        <span className="tabular-nums text-brand-200/60">01 / 18</span>
      </div>
      <div className="mt-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur md:h-14 md:w-14">
            <Stethoscope size={26} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight md:text-3xl">Restore</span>
        </div>
        <h1 className="mt-8 max-w-5xl text-4xl font-bold leading-[1.05] tracking-tight md:mt-12 md:text-6xl lg:text-7xl xl:text-8xl">
          Insurance operations<br />infrastructure for dental specialty.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-brand-100 md:mt-8 md:text-xl lg:text-2xl">
          AI agent that watches the PMS, drafts the carrier-tuned response, and submits autonomously after a one-click human review.
        </p>
      </div>
      <div className="mt-auto grid gap-2 border-t border-white/10 pt-6 text-sm md:grid-cols-3 md:gap-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Stage</div>
          <div className="mt-0.5 font-semibold">Pre-seed → seed</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Round</div>
          <div className="mt-0.5 font-semibold">$2.5M · milestone-tranched</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Target close</div>
          <div className="mt-0.5 font-semibold">Q3 2026</div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   02 — EXECUTIVE SUMMARY
   ────────────────────────────────────────────────────────────────────── */
function S02() {
  return (
    <SlideFrame num={2} eyebrow="Executive summary">
      <H1>The thesis in five lines.</H1>
      <ol className="mt-6 grid gap-3 md:mt-8 md:gap-4">
        {[
          ["Market", "Dental insurance is structurally adversarial. ~20-30% of valid claims denied on first pass. Avg specialty practice writes off $500K-$2M/yr because office-manager economics of fighting back don't work."],
          ["Wedge", "Endo first — 4,486 practices, 5-figure claims, sophisticated owners. Carrier intelligence layer compounds → expand to 30K+ specialty + 178K GP + DSO tier."],
          ["Product", "Agent watches PMS for events, drafts the carrier-tuned response, queues a one-click approval. Three skills shipping at pilot. Live demo at restore-demo.vercel.app."],
          ["Moat", "Per-carrier intelligence (denial patterns, narrative preferences, escalation paths) updated continuously across the customer base. 1 practice finds a Cigna pattern → 1,000 practices benefit."],
          ["Ask", "$2.5M seed in 3 tranches ($1.25M close / $750K at pilot validation / $500K at 10 paying logos). 18-month runway to $1.5M ARR · Series A trigger at $4M+ ARR / Q3'28."],
        ].map(([h, b], i) => (
          <li key={i} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-3 md:p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white md:h-10 md:w-10 md:text-base">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-slate-900 md:text-lg">{h}</div>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-700 md:text-base">{b}</p>
            </div>
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   03 — MARKET
   ────────────────────────────────────────────────────────────────────── */
function S03() {
  return (
    <SlideFrame num={3} eyebrow="Market">
      <H2>$135M SOM. $870M SAM. $4.5B+ TAM. Bottom-up.</H2>
      <div className="mt-6 grid flex-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
        {[
          { label: "SOM (Y1-3)", desc: "Endodontic", count: "4,486", acv: "$30K", dollars: "$135M", color: "bg-brand-800", body: "PBS Endo + TDO + Endovision coverage. Pre-auth + appeal density 3-5× general dentistry." },
          { label: "SAM", desc: "Dental specialty", count: "29,015", acv: "$30K", dollars: "$870M", color: "bg-brand-700", body: "Endo + OS + perio + ortho + pedo. ADA-recognized specialties only." },
          { label: "TAM", desc: "All US dental + DSO", count: "178,000+", acv: "$25K", dollars: "$4.5B+", color: "bg-slate-600", body: "GP at lower ACV; DSO contracts ($50-150K build) lift blended ARPU." },
        ].map((m) => (
          <div key={m.label} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className={`${m.color} px-4 py-2 text-xs font-bold text-white`}>{m.label}</div>
            <div className="flex flex-1 flex-col p-4 md:p-5">
              <div className="text-xs text-slate-500">{m.desc}</div>
              <div className={`mt-2 text-3xl font-bold md:text-4xl lg:text-5xl ${m.color === "bg-slate-600" ? "text-slate-700" : "text-brand-700"}`}>
                {m.dollars}
              </div>
              <div className="mt-1 text-xs font-bold text-slate-700">
                {m.count} practices · {m.acv} ACV
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">{m.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm md:text-base">
        <span className="font-bold text-slate-900">Top-down sanity check: </span>
        <span className="text-slate-700">
          $162B US dental services revenue (ADA 2025) → ~$80B insurance flow → 20-30% denial rate = $16-24B denied/underpaid annually. Restore captures &lt;1% of that = $96-144M ARR opportunity.
        </span>
      </div>
      <Sources>ADA HPI 2025 · Becker's Dental 2026 · Grand View Research DSO 2025</Sources>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   04 — PROBLEM
   ────────────────────────────────────────────────────────────────────── */
function S04() {
  return (
    <SlideFrame num={4} eyebrow="Problem">
      <H2>Practices write off insurance dollars because the labor math doesn't work.</H2>
      <div className="mt-6 grid flex-1 gap-4 md:mt-8 md:grid-cols-2">
        <div className="rounded-xl bg-rose-50 p-5 md:p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-rose-700">The bleed (per practice)</div>
          <div className="mt-3 grid gap-2.5 text-sm md:text-base">
            {[
              ["First-pass denial rate", "20-30%"],
              ["Avg appeal labor", "90 min"],
              ["Office manager fully-loaded", "$40/hr"],
              ["Avg endo claim denied", "$385-$1,675"],
              ["Practice-drafted appeal win rate", "35-50%"],
              ["Specialty practices that don't appeal regularly", "~60%"],
              ["Annual revenue lost / specialty practice", "$500K-$2M"],
            ].map(([l, v]) => (
              <div key={l} className="flex items-baseline justify-between border-b border-rose-200/60 pb-1.5">
                <div className="text-slate-700">{l}</div>
                <div className="font-bold text-rose-700">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <div className="text-base font-bold text-slate-900 md:text-lg">Why generic AI doesn't fix this</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">
              Each carrier scores narratives differently. Cigna rewards anatomical specificity; Delta requires ADA-CDT-exact terminology; MetLife needs conservative-alternatives-considered framing. Untuned LLM output loses 60-70%.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <div className="text-base font-bold text-slate-900 md:text-lg">Why incumbents don't fix this</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">
              Vyne (1990s clearinghouse) routes claims, doesn't draft. DentalRobot has templates, no carrier intelligence. Pearl/Overjet operate at the imaging diagnosis layer. Nobody's in the insurance ops layer with intelligence.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <div className="text-base font-bold text-slate-900 md:text-lg">Why this isn't fixed already</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">
              BAA-grade LLMs at sub-$0.10/inference + dental PMS event APIs co-existed for the first time in 2024-2025. Both shipped in the last 18 months.
            </p>
          </div>
        </div>
      </div>
      <Sources>ADA HPI Practice Survey 2024 · CMS NHE 2024 · field interviews (founder, 2025-26)</Sources>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   05 — WHY NOW
   ────────────────────────────────────────────────────────────────────── */
function S05() {
  return (
    <SlideFrame num={5} eyebrow="Why now">
      <H2>Three independent technology curves crossed in the last 18 months.</H2>
      <div className="mt-6 grid flex-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
        {[
          ["LLM cost & quality", "Anthropic Claude 3.5 Sonnet (Q3'24): reasoning quality + sub-$0.10/inference for dense narratives. 10× drop vs. GPT-4 launch (Q1'23). Carrier-specific tuning now economically viable.", "Anthropic API pricing 2024-26 · Stanford AI Index 2025"],
          ["PMS event APIs", "PBS Endo opened webhook events Q4'24. TDO + Endovision live with stable webhook infrastructure for treatment-plan + EOB events. No more polling, no more fragile RPA.", "PBS Endo developer docs 2024 · TDO API release notes 2025"],
          ["BAA-grade infra", "Anthropic, OpenAI, AWS Bedrock all ship BAA out of the box (post-2024). Compliance friction that blocked AI in healthcare 2019-23 has collapsed.", "Anthropic BAA terms 2024 · HIPAA Journal 2025"],
        ].map(([h, b, src], i) => (
          <div key={i} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <div className="text-3xl font-bold text-brand-700 md:text-4xl">{String(i + 1).padStart(2, "0")}</div>
            <div className="mt-3 text-base font-bold text-slate-900 md:text-lg">{h}</div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">{b}</p>
            <p className="mt-3 text-[10px] text-slate-400">{src}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-brand-700 p-4 text-sm text-white md:p-5 md:text-base">
        <span className="font-bold">The window: </span>
        this configuration of capabilities did not exist 18 months ago. It will exist for everyone in 24 months. The wedge is the head-start to lock in the pilot cohort and accumulate carrier-pattern data.
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   06 — PRODUCT
   ────────────────────────────────────────────────────────────────────── */
function S06() {
  return (
    <SlideFrame num={6} eyebrow="Product">
      <H2>Watch. Draft. Approve. Submit.</H2>
      <Lede>Live at <span className="font-mono text-brand-700">restore-demo.vercel.app/practice</span>. Every component below is shipping.</Lede>
      <div className="mt-6 grid gap-3 md:grid-cols-4 md:gap-4">
        {[
          ["Watch", "PMS webhook fires on TX plan, EOB, treatment complete."],
          ["Draft", "Per-carrier intelligence applied. 'Why HIGH? 92% historical approval' rationale."],
          ["Approve", "60-90 sec office-manager review. Approve / edit / reject (with reason captured for training)."],
          ["Submit", "Autonomous to clearinghouse + PMS Doc Center. Audit logged."],
        ].map(([h, b], i) => (
          <div key={i} className="rounded-xl bg-slate-50 p-4 md:p-5">
            <div className="text-2xl font-bold text-brand-700 md:text-3xl">{String(i + 1).padStart(2, "0")}</div>
            <div className="mt-2 text-base font-bold text-slate-900 md:text-lg">{h}</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:mt-6 md:grid-cols-3 md:gap-4">
        <Panel title="Skills shipping at pilot" items={[
          "Pre-auth narrative (15-25/wk/practice)",
          "Claim appeal letter (8-15/wk/practice)",
          "Referral letter (80-160/wk/practice)",
        ]} />
        <Panel title="PMS integrations" items={[
          "PBS Endo (live)",
          "TDO (Q1'27)",
          "Endovision (Q2'27)",
          "Dentrix / Open Dental (Y2)",
        ]} />
        <Panel title="Compliance posture" items={[
          "Anthropic BAA executed",
          "Practice BAA per customer",
          "Local de-id before inference",
          "Full audit log per output",
        ]} />
      </div>
    </SlideFrame>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 md:text-xs">{title}</div>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {items.map((it) => <li key={it}>· {it}</li>)}
      </ul>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   07 — THE MOAT
   ────────────────────────────────────────────────────────────────────── */
function S07() {
  return (
    <SlideFrame num={7} eyebrow="The moat" bg="bg-slate-50">
      <H2>Per-carrier intelligence at scale = irreplicable from a cold start.</H2>
      <div className="mt-6 grid flex-1 gap-4 md:mt-8 md:grid-cols-2">
        <div className="space-y-3 text-sm md:text-base">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Defensibility math</div>
          <p className="rounded-lg border border-slate-200 bg-white p-4 leading-relaxed text-slate-700">
            Each practice generates <Bold>~1,200 carrier-claim events / yr</Bold> (pre-auths, EOBs, appeals across ~6 active carriers). At 50 paying practices: <Bold>60K events/yr</Bold>; at 240: <Bold>288K events/yr</Bold>.
          </p>
          <p className="rounded-lg border border-slate-200 bg-white p-4 leading-relaxed text-slate-700">
            Per-carrier intelligence layer requires <Bold>~5,000 resolved arcs per major carrier</Bold> to lock narrative tuning + DO-NOT-APPEAL pattern recognition (industry-standard SaaS-grade LLM fine-tuning threshold).
          </p>
          <p className="rounded-lg border border-slate-200 bg-white p-4 leading-relaxed text-slate-700">
            At 240 practices: each major carrier yields ~30-40K arcs/yr — <Bold>6-8× the threshold</Bold>. A new entrant starts at zero and needs 18-24 months of paying customers + GTM spend to catch up.
          </p>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Three reinforcing layers</div>
          {[
            ["1. Carrier intelligence (data moat)", "Compounds with usage. Cost-to-replicate scales with N customers × T years."],
            ["2. Workflow embedding (switching cost)", "Inbox replaces manual triage. Switching = retraining staff + losing case-lifecycle history."],
            ["3. DO NOT APPEAL discipline (positioning moat)", "Restore is the only product willing to recommend NOT appealing. Earns carrier-relations credibility for the 70% of appeals worth pursuing."],
          ].map(([h, b]) => (
            <div key={h} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-base font-bold text-slate-900">{h}</div>
              <p className="mt-1 text-sm text-slate-700">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <span className="font-bold text-slate-900">{children}</span>;
}

/* ──────────────────────────────────────────────────────────────────────
   08 — COMPETITIVE LANDSCAPE
   ────────────────────────────────────────────────────────────────────── */
function S08() {
  return (
    <SlideFrame num={8} eyebrow="Competitive landscape">
      <H2>Adjacent players. None in our exact lane.</H2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-brand-800 text-white">
              <th className="p-2.5 text-left font-semibold">Company</th>
              <th className="p-2.5 text-left font-semibold">Layer</th>
              <th className="p-2.5 text-center font-semibold">Carrier intel</th>
              <th className="p-2.5 text-center font-semibold">Case threading</th>
              <th className="p-2.5 text-center font-semibold">DO NOT APPEAL</th>
              <th className="p-2.5 text-center font-semibold">Real-time PMS</th>
              <th className="p-2.5 text-center font-semibold">Auto-submit</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Restore", "Specialty insurance ops", "✓", "✓", "✓", "✓", "✓"],
              ["Vyne Dental", "Clearinghouse", "Legacy rules", "Query-based", "—", "Manual", "Routing"],
              ["DentalRobot", "Insurance verification", "Templates", "Single doc", "—", "Manual", "Draft only"],
              ["Toothy AI", "Insurance verification", "—", "—", "—", "—", "—"],
              ["Zentist", "Payment posting", "—", "Partial", "—", "Manual", "—"],
              ["Pearl AI", "Clinical imaging", "—", "—", "—", "—", "—"],
              ["Overjet", "Clinical imaging", "—", "—", "—", "—", "—"],
              ["Akasa (broader)", "Healthcare RCM", "Healthcare-wide", "Partial", "—", "Limited", "Limited"],
              ["Cohere Health (broader)", "Medical prior auth", "Medical-side", "—", "—", "—", "—"],
            ].map((row, i) => {
              const isUs = i === 0;
              return (
                <tr key={i} className={isUs ? "bg-brand-100" : i % 2 === 1 ? "bg-white" : "bg-slate-50"}>
                  <td className={`p-2.5 font-bold ${isUs ? "text-brand-800" : "text-slate-900"}`}>{row[0]}</td>
                  <td className="p-2.5 text-slate-700">{row[1]}</td>
                  {row.slice(2).map((cell, j) => (
                    <td key={j} className={`p-2.5 text-center ${cell === "✓" ? "font-bold text-brand-800" : "text-slate-500"}`}>{cell}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
        <Bold>The white space:</Bold> No incumbent or recent entrant pairs per-carrier intelligence + case-lifecycle threading + DO-NOT-APPEAL discipline + real-time PMS event triggering.
      </p>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   09 — COMPARABLES
   ────────────────────────────────────────────────────────────────────── */
function S09() {
  return (
    <SlideFrame num={9} eyebrow="Comparables">
      <H2>Recent dental + healthcare-AI / RCM transactions.</H2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-brand-800 text-white">
              <th className="p-2 text-left font-semibold">Company</th>
              <th className="p-2 text-left font-semibold">Year</th>
              <th className="p-2 text-left font-semibold">Event</th>
              <th className="p-2 text-right font-semibold">Amount</th>
              <th className="p-2 text-right font-semibold">Valuation</th>
              <th className="p-2 text-right font-semibold">Rev mult</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Overjet", "2024", "Series C", "$53.2M", "$550M post", "~25-35×"],
              ["Pearl AI", "2024", "Series B", "$58M", "$400M post", "n/d"],
              ["VideaHealth", "2025", "Series B", "$40M", "n/d", "n/d"],
              ["Cohere Health", "2025", "Series C", "$90M", "n/d ($200M total)", "n/d"],
              ["AKASA", "2024", "Series C ext", "n/d", "$205M raised total", "n/d"],
              ["Weave (IPO)", "2021", "IPO", "$120M", "$1.5B IPO", "~15×"],
              ["Weave (current)", "2025", "Public", "—", "~$700M-$1B mkt cap", "~3.5-5×"],
              ["Dental Intelligence", "2025", "Series C", "$85M", "n/d", "n/d"],
              ["Vyne (parent)", "2022", "PE acquisition", "n/d", "Jordan Co. PE", "n/d"],
              ["Modento", "2024", "Acquired (HSO)", "n/d", "n/d", "—"],
              ["Archy", "2024", "Series A", "$15M", "n/d", "n/d"],
              ["Cofactor AI (appeals)", "2024", "Seed", "$4M", "n/d", "n/a"],
              ["Toothy AI (YC W25)", "2025", "Seed", "~$500K", "n/d", "n/a"],
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="p-2 font-bold text-slate-900">{row[0]}</td>
                <td className="p-2 text-slate-700">{row[1]}</td>
                <td className="p-2 text-slate-700">{row[2]}</td>
                <td className="p-2 text-right text-slate-900">{row[3]}</td>
                <td className="p-2 text-right text-slate-900">{row[4]}</td>
                <td className="p-2 text-right font-bold text-brand-800">{row[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-rose-50 p-3 md:p-4">
          <div className="text-[10px] font-bold uppercase tracking-wide text-rose-700">Bear (3-5× ARR)</div>
          <p className="mt-1.5 text-sm text-slate-700">Public-software floor. <Bold>$12-20M post on $4M ARR.</Bold> Avoid.</p>
        </div>
        <div className="rounded-lg bg-brand-100 p-3 md:p-4">
          <div className="text-[10px] font-bold uppercase tracking-wide text-brand-800">Base (8-12× ARR)</div>
          <p className="mt-1.5 text-sm text-slate-700">Vertical healthcare-AI median. <Bold>$32-48M post on $4M ARR.</Bold> Our target.</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 md:p-4">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Bull (15-25× ARR)</div>
          <p className="mt-1.5 text-sm text-slate-700">Premium (Overjet-like). <Bold>$60-100M post on $4M ARR.</Bold> Stretch.</p>
        </div>
      </div>
      <Sources>Crunchbase + PitchBook 2025; press releases. n/d = not disclosed. Strategic M&amp;A targets: Henry Schein One, Patterson Dental, Vyne (Jordan Co.), Overjet, Waystar, R1.</Sources>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   10 — GO-TO-MARKET
   ────────────────────────────────────────────────────────────────────── */
function S10() {
  return (
    <SlideFrame num={10} eyebrow="Go-to-market">
      <H2>From 1 logo (mom) to 65 in 18 months.</H2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-brand-800 text-white">
              <th className="p-2 text-left font-semibold">Channel</th>
              <th className="p-2 text-center font-semibold">Y1-3 logos</th>
              <th className="p-2 text-center font-semibold">CAC</th>
              <th className="p-2 text-center font-semibold">Payback</th>
              <th className="p-2 text-center font-semibold">Conv.</th>
              <th className="p-2 text-left font-semibold">Mechanics</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["AAE Annual + regional", "60", "$8K", "5.3 mo", "8% booth→close", "Endo's mecca · 8K members"],
              ["Study clubs / KOL referrals", "110", "$4K", "2.7 mo", "25% warm→close", "Endo small world · NPS loop drives 65% of Y2"],
              ["Cold outbound (top-200 endo)", "50", "$14K", "9.3 mo", "6% BDR→close", "Apollo + ZoomInfo · founder-led until M9"],
              ["DSO BD (Heartland, Pacific, MB2)", "4 DSOs / 20 logos", "$35K", "8 mo", "12.5%", "Long cycle 9-12mo · founder-led"],
              ["Blended", "240 + 4 DSOs", "$8.5K", "4.4 mo", "—", "Y1 weighted to study clubs"],
            ].map((row, i) => {
              const isLast = i === 4;
              return (
                <tr key={i} className={isLast ? "bg-brand-100 font-bold" : i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-2 text-slate-900">{row[0]}</td>
                  <td className="p-2 text-center text-slate-700">{row[1]}</td>
                  <td className="p-2 text-center text-slate-900">{row[2]}</td>
                  <td className="p-2 text-center text-slate-900">{row[3]}</td>
                  <td className="p-2 text-center text-slate-700">{row[4]}</td>
                  <td className="p-2 text-xs text-slate-600">{row[5]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
        <SmallTable title="Cohort acquisition (logos / quarter)" rows={[
          ["Q3'26 pilot", "1 (mom)"],
          ["Q4'26", "2"],
          ["Q1'27 — AAE Annual", "5"],
          ["Q2'27", "8"],
          ["Q3'27 — BDR hire", "12"],
          ["Q4'27", "18"],
        ]} />
        <SmallTable title="GTM team build" rows={[
          ["M0 Founder", "Sales + demo + support"],
          ["M6 CSM", "Onboarding + retention"],
          ["M9 BDR", "Outbound to top-200 endo"],
          ["M15 AE / GTM", "Founder offloads sales"],
          ["M24 Director GTM", "Channel + DSO motion"],
        ]} />
      </div>
    </SlideFrame>
  );
}

function SmallTable({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{title}</div>
      <table className="mt-2 w-full text-xs md:text-sm">
        <tbody>
          {rows.map(([l, r]) => (
            <tr key={l} className="border-b border-slate-200">
              <td className="py-1.5 font-bold text-slate-900">{l}</td>
              <td className="py-1.5 text-right text-slate-700">{r}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   11 — UNIT ECONOMICS
   ────────────────────────────────────────────────────────────────────── */
function S11() {
  return (
    <SlideFrame num={11} eyebrow="Unit economics">
      <H2>14-day customer payback. 75-86% gross margin.</H2>
      <div className="mt-6 grid flex-1 gap-3 md:grid-cols-2 md:gap-4">
        <div className="rounded-xl bg-slate-50 p-4 md:p-5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 md:text-xs">Customer ROI (4-doc endo, $1.5K/mo)</div>
          <table className="mt-3 w-full text-xs md:text-sm">
            <tbody>
              {[
                ["Annual subscription", "$18,000", "text-slate-900"],
                ["Revenue recovered (modeled)", "$214,000", "text-emerald-700"],
                ["Hours saved × $35", "$25,375", "text-emerald-700"],
                ["Total annual value", "$239,000", "text-emerald-700"],
                ["Payback period", "14 days", "text-brand-800"],
                ["ROI multiple", "13.3×", "text-brand-800"],
              ].map(([l, v, color]) => (
                <tr key={l} className="border-b border-slate-200">
                  <td className="py-1 text-slate-500">{l}</td>
                  <td className={`py-1 text-right font-bold ${color}`}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[10px] text-slate-400">Pilot-modeled, not pilot-proven. Q3'26 pilot validates against same 4-doc baseline.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-brand-800 md:text-xs">SaaS economics (per logo)</div>
          <table className="mt-3 w-full text-xs md:text-sm">
            <tbody>
              {[
                ["ACV", "$22,167"],
                ["Gross margin (steady-state)", "75%"],
                ["Gross margin (peak, at scale)", "86%"],
                ["CAC (Y1 blended)", "$9,500"],
                ["CAC payback", "~10 months"],
                ["Logo churn (base, defensible)", "10-12%"],
                ["NDR", "115%"],
                ["LTV (4yr life, 12% churn)", "$58K"],
                ["LTV / CAC", "6.1×"],
              ].map(([l, v]) => (
                <tr key={l} className="border-b border-slate-200">
                  <td className="py-1 text-slate-500">{l}</td>
                  <td className="py-1 text-right font-bold text-slate-900">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white md:p-5">
        <div className="text-[10px] font-bold uppercase tracking-wide text-brand-300 md:text-xs">Sensitivity (Y3 ARR — base $4.5M)</div>
        <table className="mt-2 w-full text-xs md:text-sm">
          <thead>
            <tr className="text-slate-300">
              <th className="py-1 text-left">Variable</th>
              <th className="py-1 text-right">Bear</th>
              <th className="py-1 text-right font-bold text-white">Base</th>
              <th className="py-1 text-right">Bull</th>
              <th className="py-1 text-right text-brand-300">Y3 ARR (bear / base / bull)</th>
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
                <td className="py-1 font-bold text-white">{row[0]}</td>
                <td className="py-1 text-right text-slate-300">{row[1]}</td>
                <td className="py-1 text-right font-bold text-brand-300">{row[2]}</td>
                <td className="py-1 text-right text-slate-300">{row[3]}</td>
                <td className="py-1 text-right text-slate-300">{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[10px] text-slate-400">
          <Bold>Logo churn is the most sensitive variable.</Bold> 1,000bps churn deterioration costs more ARR than 50% CAC blow-out.
        </p>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   12 — FINANCIAL MODEL
   ────────────────────────────────────────────────────────────────────── */
function S12() {
  return (
    <SlideFrame num={12} eyebrow="Financial model">
      <H2>$0 → $4.5M ARR · break-even Q4'27 · cash break-even Q1'29.</H2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-brand-800 text-white">
              <th className="p-2 text-left font-semibold">Period</th>
              <th className="p-2 text-right font-semibold">Practices</th>
              <th className="p-2 text-right font-semibold">MRR</th>
              <th className="p-2 text-right font-semibold">ARR</th>
              <th className="p-2 text-right font-semibold">GP</th>
              <th className="p-2 text-right font-semibold">Opex</th>
              <th className="p-2 text-right font-semibold">EBITDA</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Q4'26 pilot", "1", "$1.5K", "$18K", "$15K", "$180K", "($165K)"],
              ["Q2'27", "8", "$13K", "$156K", "$134K", "$310K", "($176K)"],
              ["Q4'27 — break-even", "28", "$50K", "$600K", "$516K", "$475K", "$41K"],
              ["Q2'28", "65", "$128K", "$1.5M", "$1.3M", "$640K", "$681K"],
              ["Q4'28", "130", "$260K", "$3.1M", "$2.7M", "$880K", "$1.8M"],
              ["Q4'29", "240 + 4 DSOs", "$375K", "$4.5M", "$3.9M", "$1.4M", "$2.5M"],
            ].map((row, i) => {
              const breakeven = row[0].includes("break-even");
              return (
                <tr key={i} className={breakeven ? "bg-brand-100 font-bold" : i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-2 text-slate-900">{row[0]}</td>
                  {row.slice(1).map((cell, j) => {
                    const cellStr = cell as string;
                    const isNeg = cellStr.includes("(");
                    const isLastCol = j === 5;
                    return (
                      <td key={j} className={`p-2 text-right ${isNeg ? "text-rose-600" : isLastCol && cellStr.includes("$") ? "text-emerald-700" : "text-slate-900"}`}>
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
      <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
        <div className="rounded-lg bg-slate-50 p-4 text-xs md:text-sm">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Key assumptions</div>
          <ul className="mt-2 space-y-0.5 text-slate-700">
            <li>· Logo churn 10-12% annual</li>
            <li>· NDR 115% (skill expansion + DSO upsell)</li>
            <li>· CAC $11K → $7.5K Y1→Y3 as referrals scale</li>
            <li>· COGS at scale ~25%</li>
            <li>· DSO contracts: 4 in Y3 = $360K incremental</li>
          </ul>
        </div>
        <div className="rounded-lg bg-slate-50 p-4 text-xs md:text-sm">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Cohort retention</div>
          <table className="mt-2 w-full">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left text-[10px] text-slate-500">Month</th>
                <th className="text-right text-[10px] text-slate-500">Industry median</th>
                <th className="text-right text-[10px] text-brand-800">Restore base</th>
              </tr>
            </thead>
            <tbody>
              {[["M6","92%","93%"],["M12","85%","88%"],["M18","80%","84%"],["M24","76%","80%"],["M36","68%","72%"]].map(([m,ind,ours]) => (
                <tr key={m}>
                  <td className="py-0.5 text-slate-500">{m}</td>
                  <td className="py-0.5 text-right text-slate-700">{ind}</td>
                  <td className="py-0.5 text-right font-bold text-brand-800">{ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[10px] text-slate-400">Industry: Bessemer State of Health AI 2026.</p>
        </div>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   13 — RISKS
   ────────────────────────────────────────────────────────────────────── */
function S13() {
  return (
    <SlideFrame num={13} eyebrow="Risks + mitigations">
      <H2>What could go wrong, and what we'll do about it.</H2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-brand-800 text-white">
              <th className="p-2 text-left font-semibold">Risk</th>
              <th className="p-2 text-center font-semibold">L</th>
              <th className="p-2 text-center font-semibold">I</th>
              <th className="p-2 text-left font-semibold">Mitigation</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["HIPAA / data breach", "Low", "High", "Local de-id before inference; Anthropic BAA; SOC 2 Type II by M18; cyber insurance from Day 1; full audit log."],
              ["PMS API blocking", "Med", "Med", "Multi-PMS strategy (PBS/TDO/Endovision); no single dependency >40%; clearinghouse fallback."],
              ["Carrier pushback on AI appeals", "Med", "Med", "Office manager always in the loop; carrier-relations team M18; DO NOT APPEAL discipline preserves credibility."],
              ["Slow PMS adoption (specialist)", "Med", "Med", "PBS Endo ~33% of endo today; TDO + Endovision brings coverage to ~85% by Y2; manual upload fallback."],
              ["Key-person dependency on founder", "High (early)", "High", "Method Co. resignation as closing condition. $150-250K founder cash at close. CTO pre-funded in Tranche 1. Key-person life insurance $2M."],
              ["AI infra (Anthropic)", "Med", "Low-med", "Provider-agnostic prompt layer; OpenAI + Bedrock fallback tested; 3-month inference reserve."],
              ["Large incumbent builds this", "Med", "Med-high", "18-month head-start; defensibility math compounds with usage; founder-DSO relationships make incumbents acquirers, not competitors."],
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="p-2 font-bold text-slate-900">{row[0]}</td>
                <td className="p-2 text-center text-slate-700">{row[1]}</td>
                <td className="p-2 text-center text-slate-700">{row[2]}</td>
                <td className="p-2 text-xs text-slate-700">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">L = likelihood · I = impact · scale: Low / Med / High</p>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   14 — TRACTION
   ────────────────────────────────────────────────────────────────────── */
function S14() {
  return (
    <SlideFrame num={14} eyebrow="Traction — honest">
      <H2>Today: 1 design partner, 0 paid logos. Here's the 365-day plan.</H2>
      <div className="mt-6 grid flex-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
        <div className="rounded-xl border-2 border-brand-700 bg-brand-50 p-4 md:p-5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-brand-800 md:text-xs">Today (May 2026)</div>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            <li>· <Bold>1 design partner:</Bold> Allyson A. Abbott DMD PC (4-doc endo, PBS Endo)</li>
            <li>· <Bold>0 paid logos</Bold> outside design partner</li>
            <li>· <Bold>0 LOIs</Bold> from non-mom prospects</li>
            <li>· <Bold>Live demo</Bold> at restore-demo.vercel.app</li>
            <li>· <Bold>Discovery interview</Bold> next month</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 md:text-xs">90-day plan (Aug 2026)</div>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            <li>· Pilot live with design partner</li>
            <li>· First non-mom paid logo</li>
            <li>· 3 LOIs in active conversation</li>
            <li>· Pilot metrics validated: appeal-success baseline → measured</li>
            <li>· Anthropic BAA executed; SOC 2 audit kicked off</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 md:text-xs">365-day plan (May 2027)</div>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            <li>· 25 paying practices · ~$750K ARR run-rate</li>
            <li>· Cohort M3 retention &gt;95%</li>
            <li>· 1 DSO conversation in late stage</li>
            <li>· AAE Annual exhibit drives 30% of Y2 logos</li>
            <li>· Carrier intelligence: 30K+ resolved arcs</li>
          </ul>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white md:p-5">
        <div className="text-[10px] font-bold uppercase tracking-wide text-brand-300 md:text-xs">Why we're confident in 90-day milestone</div>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Founder has 6 specialty practice owners in study-club / professional network who have informally said yes to a paid pilot once design partner is live. Conversion of warm-intro to paid pilot historically runs 30-40% (per Pearl AI / Modento founder interviews). Plan assumes 1 of 6 closes in 90 days — base case.
        </p>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   15 — TEAM
   ────────────────────────────────────────────────────────────────────── */
function S15() {
  return (
    <SlideFrame num={15} eyebrow="Team">
      <H2>Operator-founder. Honest design partner. Compounding advisory.</H2>
      <div className="mt-6 grid flex-1 gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
        {[
          {
            label: "FOUNDER · CEO",
            name: "Ross Richardson",
            bullets: [
              "EVP Finance & Accounting, Method Co. (Philadelphia hospitality, 10 hotels + F&B; ~$200M+ revenue)",
              "Led financial operations across 2,000+ employees; built automation tooling, vendor unit economics",
              "Method Co. resignation conditional on round close. Personal cash injection: $150-250K common at close",
              "0 prior healthcare startup experience = 0 dogma",
            ],
          },
          {
            label: "DESIGN PARTNER",
            name: "Allyson A. Abbott DMD PC",
            bullets: [
              "15+ years operating · multi-doc endodontic practice on PBS Endo",
              "Weekly product feedback; the customer who keeps the founder honest",
              "Has switched dental software vendors 3× in 10 years when products didn't deliver",
              "Pilot kickoff next month; full PMS integration access",
            ],
          },
          {
            label: "ADVISORY · BUILDING",
            name: "TBD by close",
            bullets: [
              "Insurance ops experts (former RCM directors, dental specialty appeal specialists)",
              "Dental PMS integration partners (PBS Endo, TDO, Dentrix engineering)",
              "DSO operators (Heartland, Pacific Dental, MB2 — at least one C-level by close)",
              "Carrier-relations veteran (former Cigna or Delta dental) for early intelligence loop",
            ],
          },
        ].map((p) => (
          <div key={p.label} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="bg-brand-700 px-4 py-2 text-[10px] font-bold text-white md:text-xs">{p.label}</div>
            <div className="p-4 md:p-5">
              <div className="text-base font-bold text-slate-900 md:text-lg">{p.name}</div>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {p.bullets.map((b) => <li key={b} className="flex gap-2"><span className="text-brand-700">·</span><span>{b}</span></li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   16 — ROUND STRUCTURE
   ────────────────────────────────────────────────────────────────────── */
function S16() {
  return (
    <SlideFrame num={16} eyebrow="The round">
      <H2>$2.5M seed. Three milestone-gated tranches.</H2>
      <div className="mt-6 grid flex-1 gap-3 md:mt-8 md:grid-cols-2 md:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 md:text-xs">Round structure</div>
          <table className="mt-3 w-full text-xs md:text-sm">
            <tbody>
              {[
                ["Round size", "$2.5M total"],
                ["Tranche 1 — close", "$1.25M"],
                ["Tranche 2 — pilot validates (M6)", "$750K"],
                ["Tranche 3 — paying scale (M12)", "$500K"],
                ["Instrument", "Priced round, $10M post"],
                ["Alternative", "Post-money SAFE, $10M cap, 20% disc"],
                ["Option pool (post-close)", "10% pre-money"],
                ["Founder cash injection", "$150-250K common at close"],
                ["Founder commitment", "FT M3+ (Method resignation = condition)"],
              ].map(([l, v]) => (
                <tr key={l} className="border-b border-slate-200">
                  <td className="py-1 text-slate-500">{l}</td>
                  <td className="py-1 text-right font-bold text-slate-900">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 md:p-5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 md:text-xs">Cap table (illustrative, post-close)</div>
          <table className="mt-3 w-full text-xs md:text-sm">
            <tbody>
              {[
                ["Founder", "70%", "Common"],
                ["Seed investors", "20%", "Preferred / SAFE conversion"],
                ["Option pool", "10%", "First 5-7 hires"],
                ["Total", "100%", ""],
              ].map(([who, pct, instr], i) => (
                <tr key={who} className={`border-b border-slate-200 ${i === 3 ? "font-bold" : ""}`}>
                  <td className="py-1 text-slate-700">{who}</td>
                  <td className="py-1 text-right text-slate-900">{pct}</td>
                  <td className="py-1 pl-2 text-[10px] text-slate-500 md:text-xs">{instr}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[10px] text-slate-400">Final structure subject to lead preference. Founder retains majority.</p>
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-brand-100 p-4 md:p-5">
        <div className="text-[10px] font-bold uppercase tracking-wide text-brand-800 md:text-xs">Series A trigger (hit 7+ of 10 → Series A opens)</div>
        <div className="mt-2 grid gap-x-4 gap-y-1 text-[11px] sm:grid-cols-2 md:text-xs">
          {[
            ["1", "ARR ≥$4M"],
            ["2", "Logo count ≥150"],
            ["3", "NDR ≥115%"],
            ["4", "Logo churn <12%"],
            ["5", "CAC payback <12mo"],
            ["6", "Gross margin ≥75% at scale"],
            ["7", "≥2 of 3 skills shipped"],
            ["8", "≥3 PMS integrations"],
            ["9", "SOC 2 Type II in progress"],
            ["10", "Pipeline coverage ≥3×"],
          ].map(([n, h]) => (
            <div key={n} className="flex gap-1.5">
              <span className="font-mono text-brand-700">{n}.</span>
              <span className="text-slate-700">{h}</span>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   17 — USE OF PROCEEDS
   ────────────────────────────────────────────────────────────────────── */
function S17() {
  return (
    <SlideFrame num={17} eyebrow="Use of proceeds">
      <H2>Every dollar tied to a milestone.</H2>
      <div className="mt-6 grid flex-1 gap-3 md:mt-8 md:grid-cols-[1.3fr_1fr] md:gap-4">
        <div className="space-y-2">
          {[
            ["42%", "Engineering & AI", "$1,050K", "3 engineers + 1 ML/eval. PMS integrations, carrier playbook, evals, BAA infra."],
            ["25%", "GTM", "$625K", "AAE booth + sponsorships, study clubs, BDR M9, CSM M6, AE M15."],
            ["8%", "Compliance & legal", "$200K", "HIPAA + SOC 2 Type I, BAA counsel, cyber insurance, IP."],
            ["16%", "Working capital", "$400K", "DSO contract bridge, 6mo cash buffer, OpEx pre-revenue."],
            ["9%", "Founder + ops", "$225K", "Below-market through M18. Founder $100K, COO M18 ($125K)."],
          ].map(([pct, label, amt, body]) => (
            <div key={label} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 md:p-4">
              <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white md:h-14 md:w-16 md:text-base">
                {pct}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-bold text-slate-900 md:text-base">{label}</div>
                  <div className="text-sm font-bold text-brand-800 md:text-base">{amt}</div>
                </div>
                <div className="mt-0.5 text-xs text-slate-500">{body}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-brand-100 p-4 md:p-5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-brand-800 md:text-xs">Milestone gates</div>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["Tranche 1 closes (M0)", "$1.25M deployed"],
              ["Pilot validates (M3)", "20+ pre-auths/mo, 80%+ acceptance"],
              ["First non-mom logo (M3-6)", "1-2 paid pilots"],
              ["Tranche 2 unlocks (M6)", "$750K · 2 paid LOIs"],
              ["10 paying logos (M9-12)", "Cohort M3 retention validated"],
              ["Tranche 3 unlocks (M12)", "$500K · $200K ARR"],
              ["25 paying logos (M15)", "AAE-driven cohort lands"],
              ["Series A (M18)", "$1.5M ARR · 65 logos · 3× pipeline"],
            ].map(([h, b]) => (
              <li key={h}>
                <div className="font-bold text-slate-900">✓ {h}</div>
                <div className="ml-5 text-xs text-slate-600">{b}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideFrame>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   18 — CLOSING
   ────────────────────────────────────────────────────────────────────── */
function S18() {
  return (
    <div className="relative flex h-full w-full flex-col bg-gradient-to-br from-slate-900 via-brand-800 to-brand-700 px-6 py-8 text-white md:px-12 md:py-12 lg:px-20 lg:py-16">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] md:text-xs">
        <span className="text-brand-200">Closing</span>
        <span className="tabular-nums text-brand-200/60">18 / 18</span>
      </div>
      <div className="mt-auto">
        <h2 className="max-w-4xl text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          The ask, in one paragraph.
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-brand-100 md:mt-8 md:space-y-5 md:text-lg lg:text-xl">
          <p>
            Restore is the operator-built infrastructure layer for dental specialty insurance. The wedge is endo. The moat is per-carrier intelligence that compounds with usage. The unfair advantage is a hospitality operator-founder with a 4-doc design partner who keeps him honest weekly.
          </p>
          <p>
            We are raising <span className="font-bold text-white">$2.5M seed</span> in three milestone-gated tranches to deploy 18-month runway against <span className="font-bold text-white">$1.5M ARR</span> and <span className="font-bold text-white">65 paying practices</span>, triggering a Series A at <span className="font-bold text-white">$4M+ ARR / Q3'28</span>.
          </p>
          <p>
            Comparables imply <span className="font-bold text-white">$40-60M post-money</span> at Series A. Strategic exit candidates: Henry Schein One, Patterson Dental, Vyne (Jordan Co.), Overjet, Waystar, R1.
          </p>
        </div>
      </div>
      <div className="mt-auto grid gap-3 border-t border-white/10 pt-6 text-sm md:grid-cols-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Live product</div>
          <div className="mt-0.5 font-mono">restore-demo.vercel.app</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Code</div>
          <div className="mt-0.5 font-mono">github.com/rrmethodco/rrmethodco</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-200/70">Founder</div>
          <div className="mt-0.5 font-mono">richardson112288@gmail.com</div>
        </div>
      </div>
    </div>
  );
}
