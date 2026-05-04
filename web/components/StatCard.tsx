import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: { direction: "up" | "down" | "flat"; text: string; positive?: boolean };
  hint?: string;
}

export function StatCard({ label, value, delta, hint }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-slate-900">{value}</div>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              delta.positive === false ? "text-rose-600" : delta.positive === true ? "text-emerald-600" : "text-slate-500"
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUp size={12} />
            ) : delta.direction === "down" ? (
              <ArrowDown size={12} />
            ) : (
              <Minus size={12} />
            )}
            {delta.text}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}
