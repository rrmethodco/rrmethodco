import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Patient } from "@/lib/types";

interface PatientChipProps {
  patient: Patient | undefined;
  multiCase?: boolean;
  className?: string;
}

/**
 * Displays a de-identified patient handle: hash + initials + age range.
 * `multiCase` highlights when the same patient appears in multiple cases —
 * a longitudinal-thread signal for the office manager.
 */
export function PatientChip({ patient, multiCase, className }: PatientChipProps) {
  if (!patient) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        multiCase
          ? "bg-brand-50 text-brand-800 ring-brand-600/30"
          : "bg-slate-50 text-slate-600 ring-slate-300",
        className
      )}
      title={multiCase ? "Same patient appears in multiple cases" : "Patient identifier (de-identified)"}
    >
      <User size={11} className={multiCase ? "text-brand-700" : "text-slate-400"} />
      <span className="font-mono">{patient.id}</span>
      <span className="text-slate-400">·</span>
      <span>{patient.initials}</span>
      {patient.ageRange && <><span className="text-slate-400">·</span><span>{patient.ageRange}</span></>}
      {multiCase && <span className="ml-1 rounded bg-brand-700 px-1 py-0.5 text-[9px] font-bold text-white">RECURRING</span>}
    </span>
  );
}
