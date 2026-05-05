"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Edit2,
  X,
  Paperclip,
  Info,
  Send,
  Copy,
  CheckCheck,
  Briefcase,
} from "lucide-react";
import { ConfidenceBadge, RecoverabilityBadge } from "./ConfidenceBadge";
import { ConfidenceRationale } from "./ConfidenceRationale";
import { EvidenceChecklist } from "./EvidenceChecklist";
import { PatientChip } from "./PatientChip";
import { formatDollars } from "@/lib/utils";
import { getPatient } from "@/lib/patients";
import type { GenerationOutput } from "@/lib/types";

interface OutputDisplayProps {
  output: GenerationOutput;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: (newBody: string) => void;
  layout?: "wide" | "compact";
}

export function OutputDisplay({ output, onApprove, onReject, onEdit, layout = "wide" }: OutputDisplayProps) {
  const [editing, setEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(output.body);
  const [copied, setCopied] = useState(false);
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(output.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isInsurance = output.kind === "pre-auth" || output.kind === "appeal";
  const heading =
    output.kind === "pre-auth"
      ? "Pre-Authorization Narrative"
      : output.kind === "appeal"
      ? "Claim Appeal Letter"
      : "Referral Letter";

  if (decision) {
    return (
      <div className="card p-8 text-center">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            decision === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {decision === "approved" ? <CheckCheck size={24} /> : <X size={24} />}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          {decision === "approved" ? "Approved & queued for submission" : "Output rejected"}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {decision === "approved"
            ? `Saved to PBS Endo Document Center · ${
                output.kind === "referral" ? "Email/fax to recipient" : "Submitted via clearinghouse"
              } · Audit log updated`
            : "Audit log updated. Generate again with adjustments if needed."}
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{heading}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            {output.procedure && <span>Procedure: <span className="font-medium text-slate-700">{output.procedure}</span></span>}
            {output.tooth && <span>Tooth: <span className="font-medium text-slate-700">{output.tooth}</span></span>}
            {output.carrier && <span>Carrier: <span className="font-medium text-slate-700">{output.carrier}</span></span>}
            {output.recipient && <span>To: <span className="font-medium text-slate-700">{output.recipient}</span></span>}
            {output.estimatedDollars !== undefined && (
              <span>Value: <span className="font-medium text-slate-700">{formatDollars(output.estimatedDollars)}</span></span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <ConfidenceBadge value={output.confidence} />
          {output.recoverability && <RecoverabilityBadge value={output.recoverability} />}
          {output.patientId && (
            <PatientChip patient={getPatient(output.patientId)} className="mt-1" />
          )}
          {output.caseId && (
            <Link
              href={`/cases/${output.caseId}`}
              className="mt-1 inline-flex items-center gap-1 rounded bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
            >
              <Briefcase size={10} />
              {output.caseId}
            </Link>
          )}
        </div>
      </div>

      {output.confidenceRationale && (
        <div className="border-b border-slate-200 px-6 pb-4 pt-3">
          <ConfidenceRationale
            confidence={output.confidence}
            rationale={output.confidenceRationale}
          />
        </div>
      )}

      <div className={layout === "compact" ? "space-y-6 p-6" : "grid gap-6 p-6 lg:grid-cols-[1fr_280px]"}>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              {output.kind === "appeal" ? "Letter draft" : output.kind === "referral" ? "Letter draft" : "Narrative draft"}
            </h4>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700">
                {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              {onEdit && (
                <button
                  onClick={() => setEditing(!editing)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  <Edit2 size={14} />
                  {editing ? "Cancel edit" : "Edit"}
                </button>
              )}
            </div>
          </div>
          {editing ? (
            <textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={Math.max(8, Math.ceil(draftBody.length / 80))}
              className="input font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
              {draftBody}
            </div>
          )}

          {output.notes && output.notes.length > 0 && (
            <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-900">
                <Info size={12} />
                Notes
              </div>
              <ul className="space-y-1 text-xs text-blue-900/80">
                {output.notes.map((n, i) => (
                  <li key={i}>· {n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={layout === "compact" ? "grid gap-6 sm:grid-cols-2" : "space-y-6"}>
          {output.evidence && output.evidence.length > 0 && (
            <EvidenceChecklist items={output.evidence} />
          )}

          {output.attachments && output.attachments.length > 0 && (
            <div>
              <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <Paperclip size={14} />
                Attachments
              </h4>
              <ul className="space-y-1.5">
                {output.attachments.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                    {a.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="text-xs text-slate-500">
          Patient identifiers stripped during processing. Will be re-attached on approval at final document assembly.
        </div>
        <div className="flex gap-2">
          {onReject && (
            <button
              onClick={() => {
                onReject();
                setDecision("rejected");
              }}
              className="btn-danger"
            >
              <X size={16} />
              Reject
            </button>
          )}
          {editing && onEdit && (
            <button
              onClick={() => {
                onEdit(draftBody);
                setEditing(false);
              }}
              className="btn-secondary"
            >
              <Check size={16} />
              Save edit
            </button>
          )}
          {onApprove && !editing && (
            <button
              onClick={() => {
                onApprove();
                setDecision("approved");
              }}
              className="btn-primary"
            >
              <Send size={16} />
              {output.kind === "referral" ? "Approve & send to GP" : "Approve & submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
