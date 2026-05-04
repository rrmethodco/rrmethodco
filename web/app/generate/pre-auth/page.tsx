"use client";

import { useState } from "react";
import { Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { OutputDisplay } from "@/components/OutputDisplay";
import {
  CDT_CODES,
  PULPAL_DIAGNOSES,
  PERIAPICAL_DIAGNOSES,
  COLD_TEST_RESULTS,
  PERCUSSION_RESULTS,
  PALPATION_RESULTS,
  RESTORABILITY,
} from "@/lib/cdt-codes";
import { CARRIERS } from "@/lib/carriers";
import { generatePreAuth } from "@/lib/mock-api";
import type { Carrier, GenerationOutput } from "@/lib/types";

const PRE_AUTH_CODES = CDT_CODES.filter(
  (c) =>
    c.category === "endo-therapy" ||
    c.category === "retreatment" ||
    c.category === "surgical" ||
    c.category === "obstruction" ||
    c.category === "diagnostic" ||
    c.category === "adjunctive"
);

export default function PreAuthPage() {
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const [procedure, setProcedure] = useState("D3348 — Retreatment of previous root canal therapy, molar");
  const [tooth, setTooth] = useState("#14");
  const [carrier, setCarrier] = useState<Carrier>("Cigna DPPO");
  const [pulpalDiagnosis, setPulpalDiagnosis] = useState("Previously treated");
  const [periapicalDiagnosis, setPeriapicalDiagnosis] = useState("Asymptomatic apical periodontitis");
  const [coldTest, setColdTest] = useState("Not performed (previously treated)");
  const [ept, setEpt] = useState("");
  const [percussion, setPercussion] = useState("Mildly positive");
  const [palpation, setPalpation] = useState("WNL (within normal limits)");
  const [imagingPA, setImagingPA] = useState(true);
  const [imagingBWX, setImagingBWX] = useState(false);
  const [imagingCBCT, setImagingCBCT] = useState(true);
  const [imagingWorkingLength, setImagingWorkingLength] = useState(false);
  const [restorability, setRestorability] = useState("Restorable");
  const [priorTreatment, setPriorTreatment] = useState(
    "Original endo therapy approximately 4 years ago (outside provider). Patient reports intermittent discomfort starting 6 months ago. PA from 3 years ago shows 2mm radiolucency at MB root; current PA shows 4mm radiolucency. CBCT reveals untreated MB2 canal."
  );

  const selectedCode = PRE_AUTH_CODES.find((c) => procedure.startsWith(c.code));
  const isHighDenialRisk = selectedCode?.highDenialRisk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    const result = await generatePreAuth({
      procedure,
      tooth,
      carrier,
      pulpalDiagnosis,
      periapicalDiagnosis,
      coldTest,
      ept,
      percussion,
      palpation,
      imagingPA,
      imagingBWX,
      imagingCBCT,
      imagingWorkingLength,
      restorability,
      priorTreatment,
    });
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Generate pre-auth narrative</h1>
        <p className="mt-1 text-sm text-slate-500">
          Carrier-tuned, code-compliant clinical narrative for endodontic procedures requiring pre-authorization.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Procedure & carrier</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Procedure</label>
                <select
                  className="input"
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                >
                  {PRE_AUTH_CODES.map((c) => (
                    <option key={c.code} value={`${c.code} — ${c.description}`}>
                      {c.code} — {c.description}
                      {c.highDenialRisk ? " ⚠" : ""}
                    </option>
                  ))}
                </select>
                {isHighDenialRisk && (
                  <p className="mt-1 flex items-start gap-1 text-xs text-amber-700">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    High-denial-risk code. Strong narrative + complete evidence required.
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tooth #</label>
                  <input className="input" value={tooth} onChange={(e) => setTooth(e.target.value)} />
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
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Diagnoses</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Pulpal diagnosis</label>
                <select className="input" value={pulpalDiagnosis} onChange={(e) => setPulpalDiagnosis(e.target.value)}>
                  {PULPAL_DIAGNOSES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Periapical diagnosis</label>
                <select className="input" value={periapicalDiagnosis} onChange={(e) => setPeriapicalDiagnosis(e.target.value)}>
                  {PERIAPICAL_DIAGNOSES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Diagnostic tests</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Cold test</label>
                <select className="input" value={coldTest} onChange={(e) => setColdTest(e.target.value)}>
                  {COLD_TEST_RESULTS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">EPT (optional)</label>
                <input className="input" placeholder="e.g., elevated threshold" value={ept} onChange={(e) => setEpt(e.target.value)} />
              </div>
              <div>
                <label className="label">Percussion</label>
                <select className="input" value={percussion} onChange={(e) => setPercussion(e.target.value)}>
                  {PERCUSSION_RESULTS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Palpation</label>
                <select className="input" value={palpation} onChange={(e) => setPalpation(e.target.value)}>
                  {PALPATION_RESULTS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Imaging available</h2>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={imagingPA} onChange={(e) => setImagingPA(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
                Periapical (PA)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={imagingBWX} onChange={(e) => setImagingBWX(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
                Bitewing (BWX)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={imagingCBCT} onChange={(e) => setImagingCBCT(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
                CBCT
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={imagingWorkingLength} onChange={(e) => setImagingWorkingLength(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500" />
                Working length film
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Restorability & history</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Restorability assessment</label>
                <select className="input" value={restorability} onChange={(e) => setRestorability(e.target.value)}>
                  {RESTORABILITY.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Prior treatment / clinical context (de-identified)</label>
                <textarea
                  className="input min-h-[110px]"
                  placeholder="For retreatment: prior endo date, evidence of failure (radiographic progression, missed canal, etc.). For surgical: prior orthograde attempts, retreatment-contraindicated reasons."
                  value={priorTreatment}
                  onChange={(e) => setPriorTreatment(e.target.value)}
                />
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Generating…</>
            ) : (
              <><Sparkles size={16} /> Generate narrative</>
            )}
          </button>
        </form>

        <div className="lg:sticky lg:top-8 lg:self-start">
          {loading && (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <Loader2 size={28} className="mb-3 animate-spin text-brand-700" />
              <h3 className="text-sm font-semibold text-slate-900">Generating narrative…</h3>
              <p className="mt-1 max-w-xs text-xs text-slate-500">
                Carrier-tuning narrative for {carrier} · validating evidence checklist · stripping PHI
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
                Fill out the form and click Generate. Narrative ready in &lt;90 seconds.
              </p>
            </div>
          )}
          {!loading && output && <OutputDisplay output={output} onApprove={() => {}} onReject={() => {}} onEdit={() => {}} />}
        </div>
      </div>
    </div>
  );
}
