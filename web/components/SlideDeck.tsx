"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  Home,
  LayoutGrid,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Reusable horizontal slide-deck engine.
 * - Scroll-snap horizontal navigation (touch + trackpad)
 * - Keyboard: ←/→/Space/PageUp/PageDown · Home/End · F (fullscreen) · G (grid)
 * - URL hash sync (#s5 deep-links to slide 5)
 * - Floating bottom toolbar
 * - Slide grid (TOC) overlay
 * - Print-mode reverts each slide to a doc page
 */
export function SlideDeck({
  slides,
  titles,
  pdfUrl,
  brandName = "Restore",
}: {
  slides: React.ReactNode[];
  titles: string[];
  pdfUrl?: string;
  brandName?: string;
}) {
  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  const goto = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(total - 1, i));
      setCurrent(target);
      setTocOpen(false);
      slideRefs.current[target]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "start" });
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#s${target + 1}`);
      }
    },
    [total]
  );

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
        goto(total - 1);
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
  }, [current, goto, total]);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash.startsWith("#s")) {
      const n = parseInt(hash.slice(2), 10);
      if (!Number.isNaN(n) && n >= 1 && n <= total) {
        setCurrent(n - 1);
        setTimeout(() => slideRefs.current[n - 1]?.scrollIntoView({ inline: "start" }), 50);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const onScroll = () => {
      const i = Math.round(c.scrollLeft / c.clientWidth);
      if (i !== current && i >= 0 && i < total) {
        setCurrent(i);
        window.history.replaceState(null, "", `#s${i + 1}`);
      }
    };
    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
  }, [current, total]);

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
      {/* DECK CONTAINER */}
      <div
        ref={containerRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth print:block print:h-auto print:overflow-visible"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {slides.map((Slide, i) => (
          <section
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            id={`s${i + 1}`}
            className="relative h-full w-screen shrink-0 snap-start overflow-y-auto print:h-auto print:w-full print:break-after-page print:overflow-visible"
          >
            {Slide}
          </section>
        ))}
      </div>

      {/* TOOLBAR */}
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
            {String(current + 1).padStart(2, "0")} <span className="text-slate-400">/ {String(total).padStart(2, "0")}</span>
          </button>
          <button
            type="button"
            onClick={() => goto(current + 1)}
            disabled={current === total - 1}
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
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Download PDF"
              title="Download PDF"
            >
              <FileText size={14} />
            </a>
          )}
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

      {/* PROGRESS BAR */}
      <div className="fixed left-0 top-0 z-20 h-0.5 w-full bg-transparent print:hidden">
        <div
          className="h-full bg-brand-700 transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* TOC OVERLAY */}
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
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{brandName} — pitch deck</h2>
            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {titles.map((title, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goto(i)}
                  className={`flex items-baseline gap-3 rounded-md border p-3 text-left text-sm transition-colors ${
                    i === current ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:bg-slate-50"
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

/* ─── shared slide building blocks ────────────────────────────────────── */

export function SlideFrame({
  num,
  total,
  eyebrow,
  bg = "bg-white",
  children,
  brandFooter = "Restore · Insurance ops infrastructure for dental specialty",
}: {
  num: number;
  total: number;
  eyebrow: string;
  bg?: string;
  children: React.ReactNode;
  brandFooter?: string;
}) {
  return (
    <div className={`relative flex h-full w-full flex-col ${bg} px-6 py-8 md:px-12 md:py-12 lg:px-20 lg:py-16`}>
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] md:text-xs">
        <span className="text-brand-700">{eyebrow}</span>
        <span className="text-slate-400 tabular-nums">
          {String(num).padStart(2, "0")} <span className="text-slate-300">/ {String(total).padStart(2, "0")}</span>
        </span>
      </div>
      <div className="mt-3 flex-1 overflow-y-auto md:mt-5 lg:mt-6">{children}</div>
      <div className="pt-4 text-[10px] uppercase tracking-[0.2em] text-slate-400 md:text-xs">
        {brandFooter}
      </div>
    </div>
  );
}

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold leading-[1.15] tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
      {children}
    </h2>
  );
}

export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-relaxed text-slate-600 md:text-lg lg:text-xl">{children}</p>
  );
}

export function Bold({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className ?? "font-bold text-slate-900"}>{className ? <span className="font-bold">{children}</span> : children}</span>;
}
