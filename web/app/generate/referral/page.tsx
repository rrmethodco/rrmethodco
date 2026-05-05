"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { OutputDisplay } from "@/components/OutputDisplay";
import { generateReferral } from "@/lib/mock-api";
import type { GenerationOutput, LetterType } from "@/lib/types";
import { cn } from "@/lib/utils";

const LETTER_TYPES: { value: LetterType; label: string; helper: string }[] = [
  { value: "acknowledgment", label: "Acknowledgment", helper: "Sent within 24-48h of receiving referral" },
  { value: "diagnostic", label: "Diagnostic findings", helper: "Sent within 24h of consultation" },
  { value: "post-treatment", label: "Post-treatment", helper: "Sent within 48h of completed treatment" },
  { value: "recall", label: "Recall summary", helper: "Sent after 6-month or 1-year follow-up" },
];

const SAMPLE_CONTENT: Record<LetterType, string> = {
  acknowledgment: "",
  diagnostic:
    "Chief complaint: lingering cold sensitivity x 3 weeks, exacerbation with chewing. Cold test: prolonged response (>30 sec) on #14. EPT: vital response, threshold elevated vs. control. Percussion: positive on #14. Palpation: WNL. PA imaging dated 05/04/2026 demonstrates widened PDL apical to MB root, no discrete radiolucency. Pulpal diagnosis: irreversible pulpitis. Periapical diagnosis: symptomatic apical periodontitis. Recommended treatment: D3330 endodontic therapy on #14, scheduled for 05/11/2026. Restorability: restorable; recommend cuspal coverage post-RCT given existing MOD restoration.",
  "post-treatment":
    "Procedure completed: D3330 endodontic therapy on #14. Four canals located and obturated to working length: MB1 (21mm), MB2 (20mm, located via ultrasonic troughing under microscope), DB (21.5mm), and palatal (22mm). Obturation: warm vertical compaction with AH Plus sealer. Working length film and post-op PA on file. Immediate temporary placed (Cavit + IRM). Recommend definitive cuspal-coverage restoration (onlay or crown) within 2-4 weeks. Patient provided post-operative instructions; recall scheduled at 6 months.",
  recall:
    "Recall: 1-year follow-up of D3330 endodontic therapy completed 05/04/2025. Current PA dated 05/04/2026 demonstrates complete resolution of pre-treatment periapical radiolucency; PDL appearance normal. Patient asymptomatic; no functional issues reported. Healing assessment: fully healed. No further endodontic intervention indicated; routine recall with primary dentist.",
};

export default function ReferralPage() {
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const [letterType, setLetterType] = useState<LetterType>("post-treatment");
  const [referringGPName, setReferringGPName] = useState("Marcus Patel");
  const [referringPractice, setReferringPractice] = useState("Sunset Family Dentistry");
  const [tooth, setTooth] = useState("#14");
  const [date, setDate] = useState("05/04/2026");
  const [clinicalContent, setClinicalContent] = useState(SAMPLE_CONTENT["post-treatment"]);

  const handleLetterTypeChange = (type: LetterType) => {
    setLetterType(type);
    setClinicalContent(SAMPLE_CONTENT[type]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    const result = await generateReferral({
      letterType,
      referringGPName,
      referringPractice,
      tooth,
      date,
      clinicalContent,
    });
    setOutput(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Generate referral letter</h1>
        <p className="mt-1 text-sm text-slate-500">
          Collegial-clinical letter to referring GP. Different voice from insurance narratives — colleague-to-colleague, brief, clinically substantive.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Letter type</h2>
            <div className="grid grid-cols-2 gap-2">
              {LETTER_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => handleLetterTypeChange(t.value)}
                  className={cn(
                    "rounded-md border p-3 text-left transition-colors",
                    letterType === t.value
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className={cn("text-sm font-medium", letterType === t.value ? "text-brand-900" : "text-slate-900")}>
                    {t.label}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">{t.helper}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Referring GP</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">GP name</label>
                  <input className="input" placeholder="e.g., Marcus Patel" value={referringGPName} onChange={(e) => setReferringGPName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Practice</label>
                  <input className="input" value={referringPractice} onChange={(e) => setReferringPractice(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tooth #</label>
                  <input className="input" value={tooth} onChange={(e) => setTooth(e.target.value)} />
                </div>
                <div>
                  <label className="label">Date</label>
                  <input className="input" placeholder="MM/DD/YYYY" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Clinical content</h2>
            <div>
              <label className="label">
                {letterType === "acknowledgment"
                  ? "No clinical content needed for acknowledgment letters"
                  : "Paste chart notes / treatment details (de-identified)"}
              </label>
              <textarea
                className="input min-h-[200px]"
                placeholder={
                  letterType === "diagnostic"
                    ? "Diagnostic test results, imaging findings, pulpal & periapical diagnoses, treatment plan, restorability"
                    : letterType === "post-treatment"
                    ? "Procedure completed, canals located, obturation technique, films on file, restoration recommendations, recall schedule"
                    : letterType === "recall"
                    ? "Original treatment date, current PA findings, symptom status, healing assessment"
                    : "Acknowledgment letters auto-generate from referral details — no clinical content needed"
                }
                value={clinicalContent}
                onChange={(e) => setClinicalContent(e.target.value)}
                disabled={letterType === "acknowledgment"}
              />
              <p className="mt-1 text-xs text-slate-500">
                {clinicalContent.length} characters · {letterType !== "acknowledgment" && "minimum 100 recommended for HIGH confidence"}
              </p>
            </div>
          </section>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Generating…</>
            ) : (
              <><Sparkles size={16} /> Generate letter</>
            )}
          </button>
        </form>

        <div className="lg:sticky lg:top-8 lg:self-start">
          {loading && (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <Loader2 size={28} className="mb-3 animate-spin text-brand-700" />
              <h3 className="text-sm font-semibold text-slate-900">Generating letter…</h3>
              <p className="mt-1 max-w-xs text-xs text-slate-500">
                Collegial-clinical voice · ready in under 60 seconds
              </p>
            </div>
          )}
          {!loading && !output && (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Letter appears here</h3>
              <p className="mt-1 max-w-xs text-xs text-slate-500">
                {`Highest-volume workflow for the practice · ~80-160 letters/week across 4 endodontists.`}
              </p>
            </div>
          )}
          {!loading && output && <OutputDisplay output={output} onApprove={() => {}} onReject={() => {}} onEdit={() => {}} layout="compact" />}
        </div>
      </div>
    </div>
  );
}
