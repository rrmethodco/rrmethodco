"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { MOCK_HISTORY } from "@/lib/mock-data";
import { formatDollars, formatRelativeTime, cn } from "@/lib/utils";
import type { GenerationKind } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
  edited: "bg-amber-50 text-amber-700 ring-amber-600/20",
  pending: "bg-slate-100 text-slate-700 ring-slate-600/20",
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<GenerationKind | "all">("all");

  const filtered = MOCK_HISTORY.filter(
    (i) =>
      (kindFilter === "all" || i.kind === kindFilter) &&
      (search === "" ||
        i.procedure?.toLowerCase().includes(search.toLowerCase()) ||
        i.recipient?.toLowerCase().includes(search.toLowerCase()) ||
        i.tooth?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">History</h1>
          <p className="mt-1 text-sm text-slate-500">
            Audit log of all generations · HIPAA-compliant retention · de-identified
          </p>
        </div>
        <button className="btn-secondary">
          <Download size={16} />
          Export audit log
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search by procedure, recipient, or tooth…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1">
          {[
            { value: "all" as const, label: "All" },
            { value: "pre-auth" as const, label: "Pre-auths" },
            { value: "appeal" as const, label: "Appeals" },
            { value: "referral" as const, label: "Referrals" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setKindFilter(f.value)}
              className={cn(
                "rounded px-3 py-1 text-xs font-medium",
                kindFilter === f.value ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:text-slate-900"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Detail</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Value</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.kind === "pre-auth" ? "Pre-auth" : item.kind === "appeal" ? "Appeal" : "Referral"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="text-sm font-medium text-slate-900">
                    {item.kind === "referral" ? item.recipient : item.procedure}
                  </div>
                  {item.tooth && item.tooth !== "—" && (
                    <div className="text-xs text-slate-500">Tooth {item.tooth} · {item.carrier ?? ""}</div>
                  )}
                </td>
                <td className="px-5 py-3">
                  <ConfidenceBadge value={item.confidence} className="text-[10px]" />
                </td>
                <td className="px-5 py-3">
                  <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset capitalize", STATUS_STYLES[item.status])}>
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-slate-600">
                  {item.estimatedDollars !== undefined ? formatDollars(item.estimatedDollars) : "—"}
                </td>
                <td className="px-5 py-3 text-xs text-slate-500">{formatRelativeTime(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No records match your search.
          </div>
        )}
      </div>
    </div>
  );
}
