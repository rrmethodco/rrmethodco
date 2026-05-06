import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, BookOpen } from "lucide-react";
import { CaseTimeline } from "@/components/CaseTimeline";
import { PatientChip } from "@/components/PatientChip";
import { getCase, casesByPatient, caseStatusLabel, caseStatusTone } from "@/lib/cases";
import { getPatient } from "@/lib/patients";
import { getCarrierPlaybook } from "@/lib/carrier-intelligence";
import { cn, formatDollars, formatRelativeTime } from "@/lib/utils";

const TONE_PILL = {
  good: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  bad: "bg-rose-50 text-rose-700 ring-rose-600/20",
  warn: "bg-amber-50 text-amber-700 ring-amber-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-600/20",
} as const;

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCase(id);
  if (!c) notFound();

  const patient = getPatient(c.patientId);
  const otherCases = casesByPatient(c.patientId).filter((x) => x.id !== c.id);
  const playbook = getCarrierPlaybook(c.carrier);
  const tone = caseStatusTone(c.status);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/practice/cases" className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700">
          <ArrowLeft size={12} />
          All cases
        </Link>
      </div>

      <header className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Briefcase size={14} />
              <span className="font-mono">{c.id}</span>
              <span>·</span>
              <span>opened {formatRelativeTime(c.openedAt)}</span>
              <span>·</span>
              <span>{c.ageDays} days old</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              <span className="font-mono text-slate-600">{c.procedureCode}</span> · {c.procedure}
            </h1>
            <div className="mt-1 text-sm text-slate-500">
              Tooth {c.tooth} · {c.carrier}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <PatientChip patient={patient} multiCase={otherCases.length > 0} />
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
                  TONE_PILL[tone]
                )}
              >
                {caseStatusLabel(c.status)}
              </span>
              {playbook && (
                <Link
                  href={`/practice/playbook/${encodeURIComponent(c.carrier)}`}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                >
                  <BookOpen size={11} />
                  Carrier playbook
                </Link>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div>
              <div className="text-xs text-slate-400">at stake</div>
              <div className="text-2xl font-semibold text-slate-900">{formatDollars(c.estimatedDollars)}</div>
            </div>
            {c.recoveredDollars > 0 && (
              <div>
                <div className="text-xs text-emerald-600">recovered</div>
                <div className="text-lg font-semibold text-emerald-700">
                  {formatDollars(c.recoveredDollars)}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Timeline</h2>
          <CaseTimeline events={c.events} />
        </div>

        <aside className="space-y-4">
          {otherCases.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-900">Same patient</h3>
              <p className="mt-1 text-xs text-slate-500">
                {otherCases.length} other case{otherCases.length !== 1 ? "s" : ""} thread{otherCases.length === 1 ? "s" : ""} to this patient.
              </p>
              <ul className="mt-3 space-y-2">
                {otherCases.map((x) => (
                  <li key={x.id}>
                    <Link
                      href={`/practice/cases/${x.id}`}
                      className="block rounded-md border border-slate-200 p-3 text-xs hover:bg-slate-50"
                    >
                      <div className="font-mono text-slate-500">{x.id}</div>
                      <div className="mt-0.5 font-medium text-slate-800">
                        {x.procedureCode} · Tooth {x.tooth}
                      </div>
                      <div className="mt-0.5 text-slate-500">
                        {x.carrier} · {caseStatusLabel(x.status)}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {playbook && (
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">{c.carrier}</h3>
                <Link
                  href={`/practice/playbook/${encodeURIComponent(c.carrier)}`}
                  className="text-xs font-medium text-brand-700 hover:text-brand-800"
                >
                  Playbook →
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-500">Approval rate</div>
                  <div className="font-semibold text-slate-900">{playbook.approvalRatePct}%</div>
                </div>
                <div>
                  <div className="text-slate-500">Avg processing</div>
                  <div className="font-semibold text-slate-900">{playbook.avgProcessingDays}d</div>
                </div>
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div className="font-semibold text-slate-700">Top denial pattern</div>
                <p className="mt-0.5">{playbook.topDenialPatterns[0]?.pattern}</p>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
