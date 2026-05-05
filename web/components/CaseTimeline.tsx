import {
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Mail,
  MessageSquare,
  Ban,
  PhoneCall,
  CircleDot,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDollars, formatRelativeTime } from "@/lib/utils";
import type { CaseEvent, CaseEventType } from "@/lib/types";

const EVENT_META: Record<
  CaseEventType,
  { label: string; icon: any; tone: "good" | "bad" | "neutral" | "warn" | "info" }
> = {
  "pre-auth-drafted": { label: "Pre-auth drafted", icon: Sparkles, tone: "info" },
  "pre-auth-submitted": { label: "Pre-auth submitted", icon: Send, tone: "neutral" },
  "pre-auth-approved": { label: "Pre-auth approved", icon: CheckCircle2, tone: "good" },
  "pre-auth-denied": { label: "Pre-auth denied", icon: XCircle, tone: "bad" },
  "treatment-scheduled": { label: "Treatment scheduled", icon: Calendar, tone: "neutral" },
  "treatment-completed": { label: "Treatment completed", icon: CheckCircle2, tone: "neutral" },
  "claim-submitted": { label: "Claim submitted", icon: Send, tone: "neutral" },
  "eob-received-paid": { label: "EOB received — PAID", icon: CheckCircle2, tone: "good" },
  "eob-received-denied": { label: "EOB received — DENIED", icon: XCircle, tone: "bad" },
  "appeal-drafted": { label: "Appeal drafted", icon: FileText, tone: "info" },
  "appeal-submitted": { label: "Appeal submitted", icon: Send, tone: "warn" },
  "appeal-approved": { label: "Appeal approved", icon: CheckCircle2, tone: "good" },
  "appeal-denied": { label: "Appeal denied", icon: XCircle, tone: "bad" },
  "do-not-appeal-recommended": { label: "DO NOT APPEAL — Restore advised", icon: Ban, tone: "warn" },
  "peer-to-peer-requested": { label: "Peer-to-peer requested", icon: PhoneCall, tone: "warn" },
  "referral-letter-drafted": { label: "Referral letter drafted", icon: Mail, tone: "info" },
  "referral-letter-sent": { label: "Referral letter sent", icon: MessageSquare, tone: "neutral" },
  "case-closed": { label: "Case closed", icon: Lock, tone: "neutral" },
};

const TONE_CLASSES = {
  good: { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200" },
  bad: { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-200" },
  warn: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
  info: { bg: "bg-brand-50", text: "text-brand-700", ring: "ring-brand-200" },
  neutral: { bg: "bg-slate-100", text: "text-slate-600", ring: "ring-slate-200" },
} as const;

interface CaseTimelineProps {
  events: CaseEvent[];
  /** Visual: full vertical timeline (default) vs. compact horizontal pip strip. */
  variant?: "full" | "pips";
  className?: string;
}

export function CaseTimeline({ events, variant = "full", className }: CaseTimelineProps) {
  const sorted = [...events].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  if (variant === "pips") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {sorted.map((e, i) => {
          const meta = EVENT_META[e.type];
          const tone = TONE_CLASSES[meta.tone];
          return (
            <div
              key={e.id}
              className={cn("h-2 w-2 shrink-0 rounded-full ring-2", tone.bg, tone.ring)}
              title={`${meta.label} · ${formatRelativeTime(e.at)}`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <ol className={cn("space-y-4", className)}>
      {sorted.map((e, i) => {
        const meta = EVENT_META[e.type];
        const tone = TONE_CLASSES[meta.tone];
        const Icon = meta.icon;
        const isLast = i === sorted.length - 1;
        return (
          <li key={e.id} className="flex gap-3">
            {/* spine */}
            <div className="flex flex-col items-center">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-full ring-2", tone.bg, tone.ring, tone.text)}>
                <Icon size={14} />
              </div>
              {!isLast && <div className="mt-1 w-0.5 flex-1 bg-slate-200" style={{ minHeight: 18 }} />}
            </div>
            {/* body */}
            <div className="flex-1 pb-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <div className={cn("text-sm font-semibold", tone.text)}>
                  {meta.label}
                </div>
                {e.byAgent && (
                  <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700 ring-1 ring-brand-600/20">
                    by Restore
                  </span>
                )}
                <span className="text-xs text-slate-400">{formatRelativeTime(e.at)}</span>
                {e.amount !== undefined && e.amount !== 0 && (
                  <span className={cn("text-xs font-semibold", e.amount > 0 ? "text-emerald-700" : "text-rose-600")}>
                    {e.amount > 0 ? "+" : ""}
                    {formatDollars(Math.abs(e.amount))}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{e.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
