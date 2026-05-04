"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Zap, ClipboardList, FileText, Send } from "lucide-react";
import { ConfidenceBadge, RecoverabilityBadge } from "./ConfidenceBadge";
import { OutputDisplay } from "./OutputDisplay";
import { formatDollars, formatRelativeTime, cn } from "@/lib/utils";
import type { QueueItem as QueueItemType } from "@/lib/types";

interface QueueItemProps {
  item: QueueItemType;
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

export function QueueItem({ item, onApprove, onReject, onEdit }: QueueItemProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = kindIcons[item.kind];
  const subtitle =
    item.kind === "referral" ? item.recipient : item.procedure;

  return (
    <div className={cn("card overflow-hidden", item.confidence === "LOW" && "border-rose-200")}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {kindLabels[item.kind]}
            </span>
            {item.tooth && <span className="text-xs text-slate-400">·</span>}
            {item.tooth && <span className="text-xs text-slate-500">Tooth {item.tooth}</span>}
            {item.carrier && <span className="text-xs text-slate-400">·</span>}
            {item.carrier && <span className="text-xs text-slate-500">{item.carrier}</span>}
          </div>
          <div className="mt-1 truncate text-sm font-medium text-slate-900">{subtitle}</div>
          {item.triggerSource && (
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <Zap size={11} />
              {item.triggerSource}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {item.estimatedDollars !== undefined && (
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
