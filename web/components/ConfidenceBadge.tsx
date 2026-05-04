import { cn } from "@/lib/utils";
import type { Confidence } from "@/lib/types";

const styles: Record<Confidence, string> = {
  HIGH: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  MEDIUM: "bg-amber-50 text-amber-700 ring-amber-600/20",
  LOW: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function ConfidenceBadge({ value, className }: { value: Confidence; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset",
        styles[value],
        className
      )}
    >
      {value} confidence
    </span>
  );
}

const recoverabilityStyles: Record<string, string> = {
  HIGH: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "MEDIUM-HIGH": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  MEDIUM: "bg-amber-50 text-amber-700 ring-amber-600/20",
  LOW: "bg-rose-50 text-rose-700 ring-rose-600/20",
  "DO NOT APPEAL": "bg-slate-100 text-slate-700 ring-slate-600/20",
};

export function RecoverabilityBadge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset",
        recoverabilityStyles[value] ?? "bg-slate-100 text-slate-700 ring-slate-600/20",
        className
      )}
    >
      Recoverability: {value}
    </span>
  );
}
