"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { OutputDisplay } from "@/components/OutputDisplay";
import { CDT_CODES } from "@/lib/cdt-codes";
import { CARRIERS, DENIAL_TYPES } from "@/lib/carriers";
import { generateAppeal } from "@/lib/mock-api";
import type { Carrier, GenerationOutput } from "@/lib/types";

export default function AppealPage() {
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const [procedure, setProcedure] = useState("D3331 — Treatment of root canal obstruction");
  const [tooth, setTooth] = useState("#3");
  const [carrier, setCarrier] = useState<Carrier>("Delta Dental PPO");
  const [dos, setDos] = useState("04/22/2026");
  const [billed, setBilled] = useState("385");
  const [paid, setPaid] = useState("0");
  const [denialType, setDenialType] = useState("d3331-bundled");
  const [denialReasonText, setDenialReasonText] = useState(
    "D3331 included in payment for D3330 — buildup considered part of primary endodontic therapy procedure."
  );
  const [clinicalEvidence, setClinicalEvidence] = useState(
    "During treatment of tooth #3 on 04/22/2026, a separated file fragment was located in the mid-coronal third of the MB canal, originating from a prior treatment attempt at an outside provider. Removal was performed using ultrasonic technique under 16x magnification, requiring approximately 35 minutes of additional procedural time beyond standard endodontic therapy. Pre-op and intra-op films documenting the separated file location and successful removal are on file. Standard endodontic therapy on all canals (D3330) was performed as a separate procedural step."
  );

  const selectedDenial = DENIAL_TYPES.find((d) => d.id === denialType);
  const isDoNotAppeal = selectedDenial?.recoverability === "DO NOT APPEAL";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    const result = await generateAppeal({
      procedure,
      tooth,
      carrier,
      dos,
      billed: parseFloat(billed) || 0,
      paid: parseFloat(paid) || 0,
      denialType,
      denialReasonText,
      clinicalEvidence,
    });
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Generate appeal letter</h1>
        <p className="mt-1 text-sm text-slate-500">
          Carrier-tuned, evidence-based appeal letter responding to a denied endodontic claim.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Original claim</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Procedure</label>
                <select
                  className="input"
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                >
                  {CDT_CODES.map((c) => (
                    <option key={c.code} value={`${c.code} — ${c.description}`}>
                      {c.code} — {c.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tooth #</label>
                  <input className="input" value={tooth} onChange={(e) => setTooth(e.target.value)} />
                </div>
                <div>
                  <label className="label">Date of service</label>
                  <input className="input" placeholder="MM/DD/YYYY" value={dos} onChange={(e) => setDos(e.target.value)} />
                </div>
                <div>
                  <label className="label">Billed amount ($)</label>
                  <input className="input" type="number" value={billed} onChange={(e) => setBilled(e.target.value)} />
                </div>
                <div>
                  <label className="label">Paid amount ($)</label>
                  <input className="input" type="number" value={paid} onChange={(e) => setPaid(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Carrier</label>
                <select className="input" value={carrier} onChange={(e) => setCarrier(e.target.value as Carrier)}>
                  {CARRIERS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Denial classification</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Denial type</label>
                <select className="input" value={denialType} onChange={(e) => setDenialType(e.target.value)}>
                  {DENIAL_TYPES.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
                {selectedDenial && (
                  <p className="mt-1 text-xs text-slate-500">
                    Default recoverability: <span className="font-medium">{selectedDenial.recoverability}</span> · {selectedDenial.description}
                  </p>
                )}
                {isDoNotAppeal && (
                  <p className="mt-1 flex items-start gap-1 text-xs text-amber-700">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    System will recommend NOT appealing this denial. Honest classification preserves credibility with carrier.
                  </p>
                )}
              </div>
              <div>
                <label className="label">Exact denial reason text from EOB</label>
                <textarea
                  className="input min-h-[80px]"
                  placeholder="Paste the carrier's exact wording from the EOB"
                  value={denialReasonText}
                  onChange={(e) => setDenialReasonText(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Clinical evidence</h2>
            <div>
              <label className="label">Original clinical evidence supporting the claim (de-identified)</label>
              <textarea
                className="input min-h-[160px]"
                placeholder="Paste the clinical findings, imaging results, treatment details that justified the original claim. Be specific — the appeal is only as strong as the evidence."
                value={clinicalEvidence}
                onChange={(e) => setClinicalEvidence(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">
                {clinicalEvidence.length} characters · minimum 100 recommended for HIGH confidence
              </p>
            </div>
          </section>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Generating…</>
            ) : (
              <><Sparkles size={16} /> Generate appeal letter</>
            )}
          </button>
        </form>

        <div className="lg:sticky lg:top-8 lg:self-start">
          {loading && (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <Loader2 size={28} className="mb-3 animate-spin text-brand-700" />
              <h3 className="text-sm font-semibold text-slate-900">Generating appeal letter…</h3>
              <p className="mt-1 max-w-xs text-xs text-slate-500">
                Classifying denial · selecting rebuttal framework · tuning to {carrier}
              </p>
            </div>
          )}
          {!loading && !output && (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Output appears here</h3>
              <p className="mt-1 max-w-xs text-xs text-slate-500">
                System will classify the denial, recommend recoverability, and generate (or decline to generate) the appeal.
              </p>
            </div>
          )}
          {!loading && output && <OutputDisplay output={output} onApprove={() => {}} onReject={() => {}} onEdit={() => {}} />}
        </div>
      </div>
    </div>
  );
}
