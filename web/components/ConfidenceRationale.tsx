"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, History, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Confidence, ConfidenceRationale as RationaleType } from "@/lib/types";

interface ConfidenceRationaleProps {
  confidence: Confidence;
  rationale: RationaleType;
  startOpen?: boolean;
  className?: string;
}

const headerStyles: Record<Confidence, string> = {
  HIGH: "border-emerald-200 bg-emerald-50/40",
  MEDIUM: "border-amber-200 bg-amber-50/40",
  LOW: "border-rose-200 bg-rose-50/40",
};

const accentText: Record<Confidence, string> = {
  HIGH: "text-emerald-800",
  MEDIUM: "text-amber-800",
  LOW: "text-rose-800",
};

/**
 * Attributed confidence — replaces the opaque HIGH/MEDIUM/LOW pill with a
 * structured "why" panel. Surfaces evidence completeness, carrier-pattern
 * match (the moat), and red flags.
 */
export function ConfidenceRationale({ confidence, rationale, startOpen = false, className }: ConfidenceRationaleProps) {
  const [open, setOpen] = useState(startOpen);
  const evidencePct = Math.round(rationale.evidenceCompletePct * 100);

  return (
    <div className={cn("rounded-md border", headerStyles[confidence], className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className={accentText[confidence]} />
          <span className={cn("text-xs font-semibold", accentText[confidence])}>
            Why {confidence}?
          </span>
          <span className="text-xs text-slate-500">
            {evidencePct}% evidence complete
            {rationale.carrierPattern && (
              <> · {rationale.carrierPattern.historicalApprovalRatePct}% historical approval</>
            )}
          </span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>

      {open && (
        <div className="space-y-3 border-t border-current/10 px-3 py-3 text-xs">
          {/* Evidence completeness bar */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Evidence completeness</span>
              <span className="text-slate-600">{evidencePct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className={cn(
                  "h-full transition-all",
                  evidencePct >= 85 ? "bg-emerald-500" : evidencePct >= 65 ? "bg-amber-500" : "bg-rose-500"
                )}
                style={{ width: `${evidencePct}%` }}
              />
            </div>
          </div>

          {/* Carrier pattern (the moat) */}
          {rationale.carrierPattern && (
            <div className="rounded border border-slate-200 bg-white p-2.5">
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-slate-700">
                <BarChart3 size={12} className="text-slate-400" />
                Carrier pattern match
              </div>
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">{rationale.carrierPattern.carrier}</span> has approved
                <span className="font-mono"> {rationale.carrierPattern.procedureCode}</span> at{" "}
                <span className="font-semibold text-slate-800">{rationale.carrierPattern.historicalApprovalRatePct}%</span>{" "}
                across <span className="font-medium">{rationale.carrierPattern.matchingHistoricalCases} matching historical cases</span> with this evidence pattern.
              </p>
            </div>
          )}

          {/* Practice history */}
          {rationale.practiceHistory && (
            <div className="rounded border border-slate-200 bg-white p-2.5">
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-slate-700">
                <History size={12} className="text-slate-400" />
                This practice's history
              </div>
              <p className="text-slate-600">
                <span className="font-semibold text-emerald-700">{rationale.practiceHistory.similarCasesWon} won</span>
                {" / "}
                <span className="font-semibold text-rose-700">{rationale.practiceHistory.similarCasesLost} lost</span>
                {" "}on similar prior cases.
              </p>
            </div>
          )}

          {/* Positive signals */}
          {rationale.positiveSignals && rationale.positiveSignals.length > 0 && (
            <div>
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-emerald-800">
                <CheckCircle2 size={12} />
                Positive signals
              </div>
              <ul className="space-y-1 pl-4">
                {rationale.positiveSignals.map((s, i) => (
                  <li key={i} className="list-disc text-slate-600 marker:text-emerald-500">{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Red flags */}
          {rationale.redFlags && rationale.redFlags.length > 0 && (
            <div>
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-amber-800">
                <AlertTriangle size={12} />
                Red flags
              </div>
              <ul className="space-y-1 pl-4">
                {rationale.redFlags.map((s, i) => (
                  <li key={i} className="list-disc text-slate-600 marker:text-amber-500">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
