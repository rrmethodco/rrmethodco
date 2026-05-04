import { Check, AlertCircle } from "lucide-react";
import type { EvidenceItem } from "@/lib/types";

export function EvidenceChecklist({ items }: { items: EvidenceItem[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-slate-900">Evidence checklist</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                item.present
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {item.present ? <Check size={12} /> : <AlertCircle size={12} />}
            </span>
            <div className="flex-1 text-sm">
              <div className={item.present ? "text-slate-700" : "text-rose-900 font-medium"}>
                {item.label}
              </div>
              {!item.present && item.guidance && (
                <div className="mt-0.5 text-xs text-rose-700">{item.guidance}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
