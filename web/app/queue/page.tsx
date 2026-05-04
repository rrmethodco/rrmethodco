"use client";

import { useMemo, useState } from "react";
import { Filter, CheckCheck, Inbox } from "lucide-react";
import { QueueItem } from "@/components/QueueItem";
import { MOCK_QUEUE } from "@/lib/mock-data";
import type { GenerationKind, QueueItem as QueueItemType } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function QueuePage() {
  const [items, setItems] = useState<QueueItemType[]>(MOCK_QUEUE);
  const [filter, setFilter] = useState<GenerationKind | "all">("all");
  const [confidenceFilter, setConfidenceFilter] = useState<"all" | "HIGH-only">("all");

  const filtered = useMemo(() => {
    return items
      .filter((i) => i.status === "pending")
      .filter((i) => filter === "all" || i.kind === filter)
      .filter((i) => confidenceFilter === "all" || i.confidence === "HIGH");
  }, [items, filter, confidenceFilter]);

  const handleApprove = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "approved" } : i)));
  };

  const handleReject = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: "rejected" } : i)));
  };

  const handleEdit = (id: string, body: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, body, status: "edited" } : i)));
  };

  const handleBulkApprove = () => {
    const highIds = filtered.filter((i) => i.confidence === "HIGH").map((i) => i.id);
    setItems((prev) =>
      prev.map((i) => (highIds.includes(i.id) ? { ...i, status: "approved" } : i))
    );
  };

  const highCount = filtered.filter((i) => i.confidence === "HIGH").length;

  const filterButtons: { value: typeof filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pre-auth", label: "Pre-auths" },
    { value: "appeal", label: "Appeals" },
    { value: "referral", label: "Referral letters" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Review queue</h1>
          <p className="mt-1 text-sm text-slate-500">
            {filtered.length} pending · auto-triggered from PBS Endo events · awaiting approval
          </p>
        </div>
        {highCount > 1 && (
          <button onClick={handleBulkApprove} className="btn-primary">
            <CheckCheck size={16} />
            Approve all HIGH-confidence ({highCount})
          </button>
        )}
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1">
          {filterButtons.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded px-3 py-1 text-xs font-medium transition-colors",
                filter === f.value ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:text-slate-900"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter size={12} className="text-slate-400" />
          <label className="flex items-center gap-1.5 text-slate-600">
            <input
              type="checkbox"
              checked={confidenceFilter === "HIGH-only"}
              onChange={(e) => setConfidenceFilter(e.target.checked ? "HIGH-only" : "all")}
              className="h-3.5 w-3.5 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
            />
            HIGH-confidence only
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Inbox size={20} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Queue is empty</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Auto-triggered items appear here when new TX plans, EOBs, or completed treatments are detected in PBS Endo.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <QueueItem
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
