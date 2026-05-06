"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Zap, ClipboardList, FileText, Send, Briefcase } from "lucide-react";
import { ConfidenceBadge, RecoverabilityBadge } from "./ConfidenceBadge";
import { OutputDisplay } from "./OutputDisplay";
import { PatientChip } from "./PatientChip";
import { formatDollars, formatRelativeTime, cn } from "@/lib/utils";
import { getPatient } from "@/lib/patients";
import type { QueueItem as QueueItemType } from "@/lib/types";

interface QueueItemProps {
  item: QueueItemType;
  multiCasePatient?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string, newBody: string) => void;
}

const kindIcons = {
  "pre-auth": ClipboardList,
  appeal: FileText,
  referral: Send,
};

const kindLabels = {
  "pre-auth": "Pre-auth",
  appeal: "Appeal",
  referral: "Referral letter",
};

export function QueueItem({ item, multiCasePatient, onApprove, onReject, onEdit }: QueueItemProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = kindIcons[item.kind];
  const subtitle = item.kind === "referral" ? item.recipient : item.procedure;
  const isPeerComms = item.kind === "referral";
  const patient = item.patientId ? getPatient(item.patientId) : undefined;

  return (
    <div
      className={cn(
        "card overflow-hidden transition-shadow",
        item.confidence === "LOW" && "border-rose-200",
        // Visual differentiation: insurance gets a brand-color top accent,
        // peer comms (referrals) gets a slate-color top accent — same product
        // surface but different work category.
        isPeerComms ? "border-l-4 border-l-slate-300" : "border-l-4 border-l-brand-500"
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50"
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
            isPeerComms ? "bg-slate-100 text-slate-600" : "bg-brand-50 text-brand-700"
          )}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {kindLabels[item.kind]}
            </span>
            {isPeerComms && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Peer comms
              </span>
            )}
            {item.tooth && <><span className="text-xs text-slate-400">·</span><span className="text-xs text-slate-500">Tooth {item.tooth}</span></>}
            {item.carrier && <><span className="text-xs text-slate-400">·</span><span className="text-xs text-slate-500">{item.carrier}</span></>}
          </div>
          <div className="mt-1 truncate text-sm font-medium text-slate-900">{subtitle}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {patient && <PatientChip patient={patient} multiCase={multiCasePatient} />}
            {item.caseId && (
              <Link
                href={`/practice/cases/${item.caseId}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
              >
                <Briefcase size={10} />
                {item.caseId}
              </Link>
            )}
            {item.triggerSource && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Zap size={11} />
                {item.triggerSource}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {item.estimatedDollars !== undefined && item.estimatedDollars > 0 && (
            <span className="text-sm font-semibold text-slate-700">
              {formatDollars(item.estimatedDollars)}
            </span>
          )}
          <ConfidenceBadge value={item.confidence} />
          <span className="text-xs text-slate-400">{formatRelativeTime(item.createdAt)}</span>
          {expanded ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50/50 p-4">
          <OutputDisplay
            output={item}
            onApprove={() => onApprove(item.id)}
            onReject={() => onReject(item.id)}
            onEdit={(body) => onEdit(item.id, body)}
          />
        </div>
      )}
    </div>
  );
}
