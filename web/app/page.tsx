import Link from "next/link";
import { ArrowRight, Inbox, Zap, Clock, DollarSign } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { MOCK_KPI_THIS_WEEK, MOCK_KPI_BASELINE, MOCK_QUEUE, MOCK_HISTORY } from "@/lib/mock-data";
import { formatDollars, formatRelativeTime } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

export default function DashboardPage() {
  const kpi = MOCK_KPI_THIS_WEEK;
  const baseline = MOCK_KPI_BASELINE;
  const pendingCount = MOCK_QUEUE.filter((q) => q.status === "pending").length;
  const recent = [...MOCK_HISTORY].slice(0, 5);

  const approvalDelta = ((kpi.approvalRate - baseline.approvalRate) * 100).toFixed(1);
  const winDelta = ((kpi.appealWinRate - baseline.appealWinRate) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            This week · 4-endodontist group · PBS Endo
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/queue" className="btn-secondary">
            <Inbox size={16} />
            Review queue
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">
                {pendingCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">This week</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Hours saved"
            value={`${kpi.hoursSaved}h`}
            delta={{ direction: "up", text: "vs. baseline", positive: true }}
            hint="Across pre-auths, appeals, and referral letters"
          />
          <StatCard
            label="Revenue recovered"
            value={formatDollars(kpi.dollarsRecovered)}
            delta={{ direction: "up", text: "from appeals", positive: true }}
            hint="Successful appeals + reduced write-offs"
          />
          <StatCard
            label="Pre-auth approval rate"
            value={`${(kpi.approvalRate * 100).toFixed(0)}%`}
            delta={{
              direction: kpi.approvalRate > baseline.approvalRate ? "up" : "down",
              text: `${approvalDelta}pp vs. baseline`,
              positive: kpi.approvalRate > baseline.approvalRate,
            }}
            hint={`Baseline ${(baseline.approvalRate * 100).toFixed(0)}%`}
          />
          <StatCard
            label="Appeal win rate"
            value={`${(kpi.appealWinRate * 100).toFixed(0)}%`}
            delta={{
              direction: kpi.appealWinRate > baseline.appealWinRate ? "up" : "down",
              text: `${winDelta}pp vs. baseline`,
              positive: kpi.appealWinRate > baseline.appealWinRate,
            }}
            hint={`Baseline ${(baseline.appealWinRate * 100).toFixed(0)}%`}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Volume</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Pre-auths" value={String(kpi.preAuthsRun)} hint="Avg 90 sec per generation" />
          <StatCard label="Appeals" value={String(kpi.appealsRun)} hint="Avg 2 min per generation" />
          <StatCard label="Referral letters" value={String(kpi.lettersRun)} hint="Avg 60 sec per generation" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-brand-700" />
              <h3 className="text-sm font-semibold text-slate-900">Pending in queue</h3>
            </div>
            <Link href="/queue" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800">
              Review all
              <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {MOCK_QUEUE.slice(0, 4).map((item) => {
              const subtitle = item.kind === "referral" ? item.recipient : item.procedure;
              return (
                <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      {item.kind === "pre-auth" ? "Pre-auth" : item.kind === "appeal" ? "Appeal" : "Referral letter"}
                    </div>
                    <div className="mt-0.5 truncate text-sm text-slate-700">{subtitle}</div>
                  </div>
                  <ConfidenceBadge value={item.confidence} className="text-[10px]" />
                  <span className="shrink-0 text-xs text-slate-400">{formatRelativeTime(item.createdAt)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
            </div>
            <Link href="/history" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800">
              View history
              <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {recent.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    {item.kind === "pre-auth" ? "Pre-auth" : item.kind === "appeal" ? "Appeal" : "Referral"} ·{" "}
                    <span
                      className={
                        item.status === "approved"
                          ? "text-emerald-600"
                          : item.status === "rejected"
                          ? "text-rose-600"
                          : item.status === "edited"
                          ? "text-amber-600"
                          : "text-slate-500"
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-sm text-slate-700">
                    {item.kind === "referral" ? item.recipient : item.procedure}
                  </div>
                </div>
                {item.estimatedDollars !== undefined && (
                  <span className="text-xs font-medium text-slate-500">{formatDollars(item.estimatedDollars)}</span>
                )}
                <span className="shrink-0 text-xs text-slate-400">{formatRelativeTime(item.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-900">Annualized impact (projected)</h3>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Based on this week&apos;s pace, scaled to 50 weeks/year.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs font-medium text-slate-500">Time saved</div>
            <div className="text-xl font-semibold text-slate-900">{Math.round(kpi.hoursSaved * 50)}h</div>
            <div className="text-xs text-slate-400">≈ {(kpi.hoursSaved * 50 / 40).toFixed(1)} FTE-weeks</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Revenue recovered</div>
            <div className="text-xl font-semibold text-emerald-700">{formatDollars(kpi.dollarsRecovered * 50)}</div>
            <div className="text-xs text-slate-400">From appeals + reduced write-offs</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Approval rate lift</div>
            <div className="text-xl font-semibold text-slate-900">+{approvalDelta}pp</div>
            <div className="text-xs text-slate-400">{baseline.approvalRate * 100}% → {(kpi.approvalRate * 100).toFixed(0)}%</div>
          </div>
        </div>
      </section>
    </div>
  );
}
