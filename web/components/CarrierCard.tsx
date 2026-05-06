import Link from "next/link";
import { ArrowRight, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CarrierIntelligence } from "@/lib/types";

interface CarrierCardProps {
  intel: CarrierIntelligence;
  practiceMixPct?: number;
  className?: string;
}

export function CarrierCard({ intel, practiceMixPct, className }: CarrierCardProps) {
  const lift = intel.approvalRatePct - intel.approvalRateBaselinePct;
  return (
    <Link
      href={`/practice/playbook/${encodeURIComponent(intel.carrier)}`}
      className={cn("card group block p-5 transition-shadow hover:shadow-md", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{intel.carrier}</h3>
          {practiceMixPct !== undefined && (
            <p className="mt-0.5 text-xs text-slate-500">{practiceMixPct}% of your carrier mix</p>
          )}
        </div>
        <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-700" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div>
          <div className="text-slate-500">Approval rate</div>
          <div className="mt-0.5 text-lg font-semibold text-slate-900">{intel.approvalRatePct}%</div>
          <div className="text-[10px] font-medium text-emerald-700 inline-flex items-center gap-0.5">
            <TrendingUp size={10} />+{lift}pp vs baseline
          </div>
        </div>
        <div>
          <div className="text-slate-500">Processing</div>
          <div className="mt-0.5 text-lg font-semibold text-slate-900">{intel.avgProcessingDays}d</div>
          <div className="text-[10px] text-slate-400 inline-flex items-center gap-0.5">
            <Clock size={10} />avg turnaround
          </div>
        </div>
        <div>
          <div className="text-slate-500">Tracked</div>
          <div className="mt-0.5 text-lg font-semibold text-slate-900">{intel.totalSubmissionsTracked}</div>
          <div className="text-[10px] text-slate-400">historical claims</div>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Top denial pattern</div>
        <div className="mt-1 line-clamp-2 text-xs text-slate-700">{intel.topDenialPatterns[0]?.pattern}</div>
      </div>
    </Link>
  );
}
