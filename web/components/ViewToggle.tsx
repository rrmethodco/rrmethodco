"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type DashboardView = "office-manager" | "owner";

interface ViewToggleProps {
  value: DashboardView;
  onChange: (v: DashboardView) => void;
  className?: string;
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5", className)}>
      <button
        type="button"
        onClick={() => onChange("office-manager")}
        className={cn(
          "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
          value === "office-manager" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        )}
      >
        Office Manager
      </button>
      <button
        type="button"
        onClick={() => onChange("owner")}
        className={cn(
          "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
          value === "owner" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        )}
      >
        Owner
      </button>
    </div>
  );
}

/**
 * useDashboardView — small hook so any page can host the toggle without
 * threading state. Defaults to office-manager on mount.
 */
export function useDashboardView() {
  const [view, setView] = useState<DashboardView>("office-manager");
  return { view, setView };
}
