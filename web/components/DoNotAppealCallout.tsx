import { Ban } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoNotAppealCalloutProps {
  count: number;
  dollarsAvoided: number;
  hint?: string;
  className?: string;
}

/**
 * Recurring trust pattern: surfaces the value of NOT chasing dead-end appeals.
 * One of Restore's flagship differentiators — most automation tools generate
 * MORE appeals; Restore is honest about which ones to skip, preserving
 * carrier credibility for the appeals that actually matter.
 */
export function DoNotAppealCallout({ count, dollarsAvoided, hint, className }: DoNotAppealCalloutProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
          <Ban size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Restore knows when NOT to fight</h3>
            <span className="text-xs uppercase tracking-wide text-slate-400">this week</span>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <div>
              <div className="text-2xl font-semibold text-slate-900">{count}</div>
              <div className="text-xs text-slate-500">denials flagged DO NOT APPEAL</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-emerald-700">
                ${dollarsAvoided.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">in dead-end work avoided</div>
            </div>
          </div>
          <p className="mt-3 max-w-prose text-xs text-slate-600">
            {hint ?? "Plan-level exclusions and exhausted benefit caps don't reverse on appeal — chasing them costs office-manager time AND degrades carrier credibility for the appeals that DO matter. Restore identifies these patterns and recommends write-off + patient billing instead."}
          </p>
        </div>
      </div>
    </div>
  );
}
