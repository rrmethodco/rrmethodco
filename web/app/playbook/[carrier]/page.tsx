import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, Clock, BookOpen, Ban, PhoneCall, Sparkles, AlertTriangle } from "lucide-react";
import { getCarrierPlaybook } from "@/lib/carrier-intelligence";
import { cn, formatRelativeTime } from "@/lib/utils";

const RECOVERABILITY_TONE: Record<string, string> = {
  HIGH: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "MEDIUM-HIGH": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  MEDIUM: "bg-amber-50 text-amber-700 ring-amber-600/20",
  LOW: "bg-rose-50 text-rose-700 ring-rose-600/20",
  "DO NOT APPEAL": "bg-slate-100 text-slate-700 ring-slate-600/20",
};

export default function CarrierDetailPage({ params }: { params: { carrier: string } }) {
  const carrier = decodeURIComponent(params.carrier);
  const intel = getCarrierPlaybook(carrier);
  if (!intel) notFound();

  const lift = intel.approvalRatePct - intel.approvalRateBaselinePct;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/playbook" className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700">
          <ArrowLeft size={12} />
          All carriers
        </Link>
      </div>

      <header className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <BookOpen size={14} />
              Carrier playbook
            </div>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">{intel.carrier}</h1>
            <p className="mt-1 text-xs text-slate-400">
              Last updated {formatRelativeTime(intel.lastUpdated)} · {intel.totalSubmissionsTracked} historical submissions tracked
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-500">Approval rate</div>
              <div className="text-2xl font-semibold text-slate-900">{intel.approvalRatePct}%</div>
              <div className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700">
                <TrendingUp size={10} />+{lift}pp
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Baseline (pre-Restore)</div>
              <div className="text-2xl font-semibold text-slate-700">{intel.approvalRateBaselinePct}%</div>
              <div className="text-[10px] text-slate-400">historical</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Avg processing</div>
              <div className="text-2xl font-semibold text-slate-900">{intel.avgProcessingDays}d</div>
              <div className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                <Clock size={10} />SLA
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Top denial patterns</h2>
        <p className="mt-1 text-xs text-slate-500">Ranked by share of total denials at this carrier across the customer base.</p>
        <div className="mt-4 space-y-3">
          {intel.topDenialPatterns.map((p, i) => (
            <div key={i} className="rounded-md border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{p.pattern}</div>
                  <div className="mt-1 text-xs text-slate-500">{p.pctOfDenials}% of {intel.carrier} denials</div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
                    RECOVERABILITY_TONE[p.recoverability] ?? "bg-slate-100 text-slate-700 ring-slate-600/20"
                  )}
                >
                  {p.recoverability === "DO NOT APPEAL" ? "DO NOT APPEAL" : `Recoverability: ${p.recoverability}`}
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-slate-400" style={{ width: `${p.pctOfDenials}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sparkles size={14} className="text-brand-700" />
            Narrative preferences
          </h2>
          <p className="mt-1 text-xs text-slate-500">How {intel.carrier}'s adjudicators score narratives. Restore tunes generation to match.</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {intel.narrativePreferences.map((n, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Ban size={14} className="text-slate-500" />
            DO NOT APPEAL patterns
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Denials Restore recommends writing off rather than appealing. Pursuing them costs office-manager time and degrades carrier credibility on appeals that DO matter.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {intel.doNotAppealPatterns.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <PhoneCall size={14} className="text-amber-600" />
            Escalation paths
          </h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-700">
            {intel.escalationPaths.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-mono text-xs text-amber-600">{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <AlertTriangle size={14} className="text-slate-500" />
            Notes from the field
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            What we've learned across the customer base that doesn't fit the categories above.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {intel.notesFromTheField.map((n, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
