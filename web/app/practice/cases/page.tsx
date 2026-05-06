"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Briefcase } from "lucide-react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { CaseTimeline } from "@/components/CaseTimeline";
import { PatientChip } from "@/components/PatientChip";
import { MOCK_CASES, activeCases, closedCases, caseStatusLabel, caseStatusTone } from "@/lib/cases";
import { getPatient, isMultiEventPatient } from "@/lib/patients";
import { cn, formatDollars, formatRelativeTime } from "@/lib/utils";

type Filter = "all" | "active" | "closed" | "do-not-appeal";

const TONE_PILL = {
  good: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  bad: "bg-rose-50 text-rose-700 ring-rose-600/20",
  warn: "bg-amber-50 text-amber-700 ring-amber-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-600/20",
} as const;

export default function CasesPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const allPatientIds = MOCK_CASES.map((c) => c.patientId);
  const cases =
    filter === "active"
      ? activeCases()
      : filter === "closed"
      ? closedCases()
      : filter === "do-not-appeal"
      ? MOCK_CASES.filter((c) => c.status === "do-not-appeal")
      : MOCK_CASES;

  const sorted = [...cases].sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());

  const totals = {
    inFlight: activeCases().reduce((s, c) => s + c.estimatedDollars, 0),
    recovered: MOCK_CASES.reduce((s, c) => s + c.recoveredDollars, 0),
    activeCount: activeCases().length,
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <Briefcase size={14} />
          Cases
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Insurance lifecycle</h1>
        <p className="mt-1 text-sm text-slate-500">
          Each case threads pre-auth → claim → EOB → appeal → resolution. The agent watches the arc; nothing falls through.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Active cases</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{totals.activeCount}</div>
          <div className="mt-0.5 text-xs text-slate-500">currently in flight</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">$ at risk in flight</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{formatDollars(totals.inFlight)}</div>
          <div className="mt-0.5 text-xs text-slate-500">across active cases</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">$ recovered all-time</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-700">{formatDollars(totals.recovered)}</div>
          <div className="mt-0.5 text-xs text-slate-500">closed cases, lifetime</div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "active", "closed", "do-not-appeal"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f
                ? "border-brand-500 bg-brand-50 text-brand-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            {f === "all"
              ? "All"
              : f === "active"
              ? "Active"
              : f === "closed"
              ? "Closed"
              : "DO NOT APPEAL"}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {sorted.map((c) => {
          const patient = getPatient(c.patientId);
          const multiCase = isMultiEventPatient(c.patientId, allPatientIds);
          const tone = caseStatusTone(c.status);
          return (
            <li key={c.id}>
              <Link
                href={`/practice/cases/${c.id}`}
                className="card group block p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                      <span className="font-mono">{c.id}</span>
                      <span className="text-slate-300">·</span>
                      <span>Tooth {c.tooth}</span>
                      <span className="text-slate-300">·</span>
                      <span>{c.carrier}</span>
                      <span className="text-slate-300">·</span>
                      <span>opened {formatRelativeTime(c.openedAt)}</span>
                    </div>
                    <div className="mt-1 text-base font-semibold text-slate-900">
                      <span className="font-mono text-slate-600">{c.procedureCode}</span> · {c.procedure}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <PatientChip patient={patient} multiCase={multiCase} />
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
                          TONE_PILL[tone]
                        )}
                      >
                        {caseStatusLabel(c.status)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <CaseTimeline events={c.events} variant="pips" />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <div className="text-xs text-slate-400">at stake</div>
                    <div className="text-lg font-semibold text-slate-900">{formatDollars(c.estimatedDollars)}</div>
                    {c.recoveredDollars > 0 && (
                      <div className="text-xs font-semibold text-emerald-700">
                        {formatDollars(c.recoveredDollars)} recovered
                      </div>
                    )}
                    <ArrowRight size={14} className="mt-2 text-slate-300 group-hover:text-brand-700" />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
