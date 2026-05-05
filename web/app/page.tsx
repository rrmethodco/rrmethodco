"use client";

import Link from "next/link";
import { ArrowRight, Inbox, Zap, Clock, DollarSign, Briefcase, BookOpen, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { DoNotAppealCallout } from "@/components/DoNotAppealCallout";
import { ViewToggle, useDashboardView } from "@/components/ViewToggle";
import { MOCK_KPI_THIS_WEEK, MOCK_KPI_BASELINE, MOCK_QUEUE, MOCK_HISTORY } from "@/lib/mock-data";
import { activeCases, totalRecoveredAllTime, totalAtRiskInFlight, totalDoNotAppealAvoided, MOCK_CASES } from "@/lib/cases";
import { CARRIER_PLAYBOOK } from "@/lib/carrier-intelligence";
import { formatDollars, formatRelativeTime, cn } from "@/lib/utils";

export default function DashboardPage() {
  const { view, setView } = useDashboardView();
  const kpi = MOCK_KPI_THIS_WEEK;
  const baseline = MOCK_KPI_BASELINE;
  const pendingCount = MOCK_QUEUE.filter((q) => q.status === "pending").length;
  const recent = [...MOCK_HISTORY].slice(0, 5);

  const approvalDelta = ((kpi.approvalRate - baseline.approvalRate) * 100).toFixed(1);
  const winDelta = ((kpi.appealWinRate - baseline.appealWinRate) * 100).toFixed(1);

  const lifetimeRecovered = totalRecoveredAllTime();
  const inFlight = totalAtRiskInFlight();
  const doNotAppealAvoided = totalDoNotAppealAvoided();
  const activeCount = activeCases().length;

  // Owner view: pull a 6-month projection (mock) and per-carrier breakdown
  const monthlyRecovered = Math.round(kpi.dollarsRecovered * 4.33); // ~weeks/month
  const annualRecovered = kpi.dollarsRecovered * 50;
  const monthlySpend = 1500; // mock monthly subscription
  const paybackDays = (monthlySpend / monthlyRecovered) * 30;

  // Per-carrier wins (mock — in production this would aggregate from cases.ts)
  const topCarriers = [...CARRIER_PLAYBOOK]
    .sort((a, b) => b.totalSubmissionsTracked - a.totalSubmissionsTracked)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            This week · 4-endodontist group · PBS Endo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={view} onChange={setView} />
          <Link href="/inbox" className="btn-secondary">
            <Inbox size={16} />
            Inbox
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">
                {pendingCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {view === "office-manager" ? (
        /* ─── OFFICE MANAGER VIEW ───────────────────────────────────────── */
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Your week</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Hours saved"
                value={`${kpi.hoursSaved}h`}
                delta={{ direction: "up", text: "vs. baseline", positive: true }}
                hint="Across pre-auths, appeals, and referral letters"
              />
              <StatCard label="Pre-auths drafted" value={String(kpi.preAuthsRun)} hint="Avg 90 sec per generation" />
              <StatCard label="Appeals drafted" value={String(kpi.appealsRun)} hint="Avg 2 min per generation" />
              <StatCard label="Referral letters" value={String(kpi.lettersRun)} hint="Avg 60 sec per generation" />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-brand-700" />
                  <h3 className="text-sm font-semibold text-slate-900">In your inbox now</h3>
                </div>
                <Link href="/inbox" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800">
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

          <DoNotAppealCallout count={kpi.doNotAppealCount ?? 0} dollarsAvoided={kpi.doNotAppealDollarsAvoided ?? 0} />

          <section className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Active cases</h3>
              </div>
              <Link href="/cases" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800">
                See all cases
                <ArrowRight size={12} />
              </Link>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {activeCount} cases currently in flight · {formatDollars(inFlight)} at stake
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {activeCases().slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="rounded-md border border-slate-200 p-3 text-xs hover:bg-slate-50"
                >
                  <div className="font-mono text-[10px] text-slate-500">{c.id}</div>
                  <div className="mt-1 truncate font-medium text-slate-800">{c.procedureCode} · Tooth {c.tooth}</div>
                  <div className="mt-0.5 truncate text-slate-500">{c.carrier}</div>
                  <div className="mt-1 font-semibold text-slate-900">{formatDollars(c.estimatedDollars)}</div>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* ─── OWNER VIEW ────────────────────────────────────────────────── */
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">ROI snapshot</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Recovered all-time"
                value={formatDollars(lifetimeRecovered)}
                delta={{ direction: "up", text: "lifetime", positive: true }}
                hint={`Across ${MOCK_CASES.length} closed/active cases`}
              />
              <StatCard
                label="Annualized recovery"
                value={formatDollars(annualRecovered)}
                hint="This week's pace × 50 weeks"
              />
              <StatCard
                label="Approval rate"
                value={`${(kpi.approvalRate * 100).toFixed(0)}%`}
                delta={{
                  direction: "up",
                  text: `+${approvalDelta}pp vs baseline`,
                  positive: true,
                }}
                hint={`Baseline ${(baseline.approvalRate * 100).toFixed(0)}%`}
              />
              <StatCard
                label="Appeal win rate"
                value={`${(kpi.appealWinRate * 100).toFixed(0)}%`}
                delta={{
                  direction: "up",
                  text: `+${winDelta}pp vs baseline`,
                  positive: true,
                }}
                hint={`Baseline ${(baseline.appealWinRate * 100).toFixed(0)}%`}
              />
            </div>
          </section>

          <section className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <DollarSign size={16} className="text-emerald-600" />
                  Payback math
                </h2>
                <p className="mt-1 text-xs text-slate-500">Restore subscription vs. new revenue recovered.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <div className="text-xs font-medium text-slate-500">Monthly recovered</div>
                <div className="text-2xl font-semibold text-emerald-700">{formatDollars(monthlyRecovered)}</div>
                <div className="text-xs text-slate-400">From appeals + reduced write-offs</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Monthly subscription</div>
                <div className="text-2xl font-semibold text-slate-900">${monthlySpend.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Restore platform fee</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Payback</div>
                <div className="text-2xl font-semibold text-emerald-700">{paybackDays.toFixed(1)} days</div>
                <div className="text-xs text-slate-400">Time to recover the monthly subscription</div>
              </div>
            </div>
          </section>

          <DoNotAppealCallout
            count={kpi.doNotAppealCount ?? 0}
            dollarsAvoided={kpi.doNotAppealDollarsAvoided ?? 0}
            hint="Owners care about preserving carrier credibility — denying a frivolous appeal is a long-term asset. Restore tracks every avoided dead-end so the team's appeal credibility stays high for the cases that matter."
          />

          <section className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Top carriers in your mix</h3>
              </div>
              <Link href="/playbook" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800">
                Open playbook
                <ArrowRight size={12} />
              </Link>
            </div>
            <p className="mt-1 text-xs text-slate-500">By approval rate lift since Restore went live.</p>
            <div className="mt-3 space-y-2">
              {topCarriers.map((c) => {
                const lift = c.approvalRatePct - c.approvalRateBaselinePct;
                return (
                  <Link
                    key={c.carrier}
                    href={`/playbook/${encodeURIComponent(c.carrier)}`}
                    className="flex items-center gap-4 rounded-md border border-slate-200 p-3 text-sm hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-900">{c.carrier}</div>
                      <div className="text-xs text-slate-500">
                        {c.approvalRatePct}% approved · {c.avgProcessingDays}d avg processing · {c.totalSubmissionsTracked} tracked
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                        <TrendingUp size={12} />
                        +{lift}pp
                      </div>
                      <div className="text-xs text-slate-400">vs. baseline</div>
                    </div>
                    <ArrowRight size={14} className="text-slate-300" />
                  </Link>
                );
              })}
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
                <div className="text-xl font-semibold text-emerald-700">{formatDollars(annualRecovered)}</div>
                <div className="text-xs text-slate-400">From appeals + reduced write-offs</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Approval rate lift</div>
                <div className="text-xl font-semibold text-slate-900">+{approvalDelta}pp</div>
                <div className="text-xs text-slate-400">{baseline.approvalRate * 100}% → {(kpi.approvalRate * 100).toFixed(0)}%</div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
