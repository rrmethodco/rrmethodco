import { BookOpen } from "lucide-react";
import { CarrierCard } from "@/components/CarrierCard";
import { CARRIER_PLAYBOOK } from "@/lib/carrier-intelligence";

// Practice carrier mix from settings page (mock — would be live in Phase 2).
const PRACTICE_MIX: Record<string, number> = {
  "Delta Dental PPO": 35,
  "Cigna DPPO": 20,
  "MetLife": 15,
  "Aetna": 12,
  "UnitedHealthcare Dental": 10,
  "Guardian": 5,
};

export default function PlaybookPage() {
  const sorted = [...CARRIER_PLAYBOOK].sort(
    (a, b) => (PRACTICE_MIX[b.carrier] ?? 0) - (PRACTICE_MIX[a.carrier] ?? 0)
  );

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <BookOpen size={14} />
          Carrier playbook
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">What we know about each carrier</h1>
        <p className="mt-1 max-w-prose text-sm text-slate-500">
          Restore's intelligence layer — denial patterns, narrative preferences, escalation paths, and field
          notes for the carriers in your mix. Updated continuously as approvals and denials flow in across the
          customer base. This is the moat: every approved claim makes the next narrative smarter.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((intel) => (
          <CarrierCard
            key={intel.carrier}
            intel={intel}
            practiceMixPct={PRACTICE_MIX[intel.carrier]}
          />
        ))}
      </section>
    </div>
  );
}
