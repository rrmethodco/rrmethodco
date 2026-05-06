import { Building2, Shield, Users, Zap, FileCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Practice context · carrier mix · HIPAA configuration · trigger watchers
        </p>
      </header>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <Building2 size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Practice profile</h2>
        </div>
        <dl className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-500">Specialty</dt>
            <dd className="mt-0.5 text-sm text-slate-900">Endodontics</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Group size</dt>
            <dd className="mt-0.5 text-sm text-slate-900">4 endodontists</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Practice management software</dt>
            <dd className="mt-0.5 text-sm text-slate-900">PBS Endo</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Clearinghouse</dt>
            <dd className="mt-0.5 text-sm text-slate-500">— to confirm during discovery —</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Imaging integration</dt>
            <dd className="mt-0.5 text-sm text-slate-500">— to confirm during discovery —</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">In-network mix</dt>
            <dd className="mt-0.5 text-sm text-slate-500">— to capture during baseline —</dd>
          </div>
        </dl>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <Users size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Carrier mix</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {[
            { name: "Delta Dental PPO", share: "35%" },
            { name: "Cigna DPPO", share: "20%" },
            { name: "MetLife", share: "15%" },
            { name: "Aetna", share: "12%" },
            { name: "UnitedHealthcare Dental", share: "10%" },
            { name: "Guardian", share: "5%" },
            { name: "Other", share: "3%" },
          ].map((c) => (
            <li key={c.name} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-slate-900">{c.name}</span>
              <span className="text-sm font-medium text-slate-500">{c.share}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          Distribution shown is illustrative — confirm during discovery interview.
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <Shield size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">HIPAA configuration</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          <li className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="text-sm text-slate-900">Anthropic BAA</div>
              <div className="text-xs text-slate-500">Required before any PHI processing</div>
            </div>
            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
              In progress
            </span>
          </li>
          <li className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="text-sm text-slate-900">Practice BAA</div>
              <div className="text-xs text-slate-500">Signed agreement with mom&apos;s practice</div>
            </div>
            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
              Pending
            </span>
          </li>
          <li className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="text-sm text-slate-900">Local de-identification</div>
              <div className="text-xs text-slate-500">PHI stripped before processing, re-attached locally</div>
            </div>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Active
            </span>
          </li>
          <li className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="text-sm text-slate-900">Audit logging</div>
              <div className="text-xs text-slate-500">Every generation logged: timestamp, user, inputs, output, confidence</div>
            </div>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Active
            </span>
          </li>
        </ul>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <Zap size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Auto-trigger watchers</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          <li className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="text-sm text-slate-900">PBS Endo: new TX plan with pre-auth code</div>
              <div className="text-xs text-slate-500">Drafts pre-auth narrative automatically</div>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20">
              Phase 3
            </span>
          </li>
          <li className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="text-sm text-slate-900">PBS Endo: new EOB with denial code</div>
              <div className="text-xs text-slate-500">Drafts appeal letter or DO NOT APPEAL recommendation</div>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20">
              Phase 3
            </span>
          </li>
          <li className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="text-sm text-slate-900">PBS Endo: treatment marked complete</div>
              <div className="text-xs text-slate-500">Drafts post-treatment summary letter to referring GP</div>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20">
              Phase 3
            </span>
          </li>
          <li className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="text-sm text-slate-900">PBS Endo: new referral received</div>
              <div className="text-xs text-slate-500">Drafts acknowledgment letter to referring GP</div>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20">
              Phase 3
            </span>
          </li>
        </ul>
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          Auto-triggers go live in Phase 3 once PBS Endo integration approach is confirmed (API / scheduled exports / RPA).
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <FileCheck size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Knowledge layer</h2>
        </div>
        <div className="space-y-2 p-5">
          <p className="text-sm text-slate-700">
            Skills, references, and samples live in the <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">dental-insurance-toolkit/</code> directory.
          </p>
          <ul className="ml-4 list-disc space-y-1 text-xs text-slate-500">
            <li><code>context/practice_context.md</code> · 4-endo group profile, voice, HIPAA</li>
            <li><code>skills/pre_auth_narrative.md</code></li>
            <li><code>skills/claim_appeal_letter.md</code></li>
            <li><code>skills/referral_letter.md</code></li>
            <li><code>reference/cdt_narrative_requirements.md</code> · per-code evidence requirements</li>
            <li><code>reference/carrier_intelligence.md</code> · carrier-specific patterns</li>
            <li><code>reference/denial_playbook.md</code> · classification + rebuttal frameworks</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Updates to these files get loaded by the agent on next request — no rebuild required.
          </p>
        </div>
      </section>
    </div>
  );
}
