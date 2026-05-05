import type { Case, CaseEvent, CaseStatus } from "./types";

const day = 24 * 60 * 60 * 1000;
const ago = (d: number) => new Date(Date.now() - d * day).toISOString();

/**
 * Mock cases — the 90-day insurance arc that ties pre-auth → claim → EOB →
 * appeal → resolution into a single thread. This is the artifact that
 * differentiates Restore from a "form + AI text generator."
 */
export const MOCK_CASES: Case[] = [
  /* ── Case 1: clean win, currently in claim-paid ─────────────────────── */
  {
    id: "case_001",
    patientId: "pt_a31f",
    tooth: "#14",
    procedure: "Retreatment of previous root canal therapy, molar",
    procedureCode: "D3348",
    carrier: "Cigna DPPO",
    estimatedDollars: 1450,
    recoveredDollars: 1450,
    status: "claim-paid",
    openedAt: ago(34),
    closedAt: ago(2),
    ageDays: 32,
    events: [
      { id: "e_001a", type: "pre-auth-drafted", at: ago(34), detail: "Auto-triggered from PBS Endo: TX plan finalized.", byAgent: true },
      { id: "e_001b", type: "pre-auth-submitted", at: ago(34), detail: "Submitted to Cigna via clearinghouse.", byAgent: true },
      { id: "e_001c", type: "pre-auth-approved", at: ago(28), detail: "Cigna approved at $1,450. Reference #PA-CGN-26-7741.", amount: 1450 },
      { id: "e_001d", type: "treatment-scheduled", at: ago(26), detail: "Patient scheduled for retreatment." },
      { id: "e_001e", type: "treatment-completed", at: ago(7), detail: "D3348 completed by Dr. R." },
      { id: "e_001f", type: "claim-submitted", at: ago(7), detail: "Claim auto-submitted with pre-op + post-op imaging." },
      { id: "e_001g", type: "eob-received-paid", at: ago(2), detail: "Cigna paid $1,450 in full. EOB cleared.", amount: 1450 },
      { id: "e_001h", type: "case-closed", at: ago(2), detail: "Case closed — clean recovery." },
    ],
  },

  /* ── Case 2: appeal won, the headline-grabber ───────────────────────── */
  {
    id: "case_002",
    patientId: "pt_b72d",
    tooth: "#3",
    procedure: "Treatment of root canal obstruction",
    procedureCode: "D3331",
    carrier: "Delta Dental PPO",
    estimatedDollars: 385,
    recoveredDollars: 385,
    status: "appeal-won",
    openedAt: ago(58),
    closedAt: ago(12),
    ageDays: 46,
    events: [
      { id: "e_002a", type: "pre-auth-drafted", at: ago(58), detail: "D3331 bundled — Delta typically denies.", byAgent: true },
      { id: "e_002b", type: "pre-auth-submitted", at: ago(58), detail: "Submitted to Delta via clearinghouse.", byAgent: true },
      { id: "e_002c", type: "pre-auth-approved", at: ago(54), detail: "Delta approved D3330 base; D3331 to be re-evaluated post-treatment.", amount: 0 },
      { id: "e_002d", type: "treatment-completed", at: ago(36), detail: "Separated file removed. D3330 + D3331 billed." },
      { id: "e_002e", type: "claim-submitted", at: ago(36), detail: "Both codes submitted with intra-op films." },
      { id: "e_002f", type: "eob-received-denied", at: ago(28), detail: 'Delta denied D3331: "bundled into primary endodontic therapy."', amount: -385 },
      { id: "e_002g", type: "appeal-drafted", at: ago(28), detail: "Auto-triggered from EOB. Recoverability scored HIGH.", byAgent: true },
      { id: "e_002h", type: "appeal-submitted", at: ago(27), detail: "Appeal submitted with intra-op file-removal documentation." },
      { id: "e_002i", type: "appeal-approved", at: ago(12), detail: "Delta reversed denial. $385 paid.", amount: 385 },
      { id: "e_002j", type: "case-closed", at: ago(12), detail: "Case closed — appeal recovered $385." },
    ],
  },

  /* ── Case 3: in-progress, pre-auth out, awaiting Cigna ──────────────── */
  {
    id: "case_003",
    patientId: "pt_c19a",
    tooth: "#30",
    procedure: "Apicoectomy, molar (first root)",
    procedureCode: "D3425",
    carrier: "MetLife",
    estimatedDollars: 1675,
    recoveredDollars: 0,
    status: "in-progress",
    openedAt: ago(4),
    ageDays: 4,
    events: [
      { id: "e_003a", type: "pre-auth-drafted", at: ago(4), detail: "Auto-drafted, MEDIUM confidence: original endo date approximate.", byAgent: true },
      { id: "e_003b", type: "pre-auth-submitted", at: ago(3), detail: "Office manager approved with note. Submitted via Availity." },
    ],
  },

  /* ── Case 4: DO NOT APPEAL — the trust-builder ──────────────────────── */
  {
    id: "case_004",
    patientId: "pt_d04e",
    tooth: "—",
    procedure: "Non-IV conscious sedation",
    procedureCode: "D9248",
    carrier: "UnitedHealthcare Dental",
    estimatedDollars: 295,
    recoveredDollars: 0,
    status: "do-not-appeal",
    openedAt: ago(11),
    closedAt: ago(8),
    ageDays: 3,
    events: [
      { id: "e_004a", type: "claim-submitted", at: ago(11), detail: "D9248 sedation billed alongside D3330." },
      { id: "e_004b", type: "eob-received-denied", at: ago(9), detail: 'UHC denied D9248: contractual exclusion under employer plan.', amount: -295 },
      {
        id: "e_004c",
        type: "do-not-appeal-recommended",
        at: ago(9),
        detail: "Restore identified UHC plan-level exclusion. Appeal would lose carrier credibility for future claims. Recommend write-off and bill patient directly.",
        byAgent: true,
      },
      { id: "e_004d", type: "case-closed", at: ago(8), detail: "Closed: write-off processed; patient billed directly." },
    ],
  },

  /* ── Case 5: appeal in flight ───────────────────────────────────────── */
  {
    id: "case_005",
    patientId: "pt_e56b",
    tooth: "#19",
    procedure: "Endodontic therapy, molar",
    procedureCode: "D3330",
    carrier: "Aetna",
    estimatedDollars: 1250,
    recoveredDollars: 0,
    status: "appeal-in-flight",
    openedAt: ago(22),
    ageDays: 22,
    events: [
      { id: "e_005a", type: "treatment-completed", at: ago(22), detail: "D3330 completed." },
      { id: "e_005b", type: "claim-submitted", at: ago(22), detail: "Submitted with imaging." },
      { id: "e_005c", type: "eob-received-denied", at: ago(15), detail: 'Aetna: "insufficient documentation."', amount: -1250 },
      { id: "e_005d", type: "appeal-drafted", at: ago(15), detail: "Recoverability HIGH — Aetna boilerplate denial pattern.", byAgent: true },
      { id: "e_005e", type: "appeal-submitted", at: ago(14), detail: "Appeal submitted with full clinical documentation re-attached." },
    ],
  },

  /* ── Case 6: multi-event same patient — recurring pre-auth ──────────── */
  {
    id: "case_006",
    patientId: "pt_a31f", // SAME as case_001 — patient thread demo
    tooth: "#3",
    procedure: "Endodontic therapy, molar",
    procedureCode: "D3330",
    carrier: "Cigna DPPO",
    estimatedDollars: 1250,
    recoveredDollars: 1250,
    status: "claim-paid",
    openedAt: ago(67),
    closedAt: ago(40),
    ageDays: 27,
    events: [
      { id: "e_006a", type: "pre-auth-drafted", at: ago(67), detail: "Same patient as case_001 — pulled prior carrier patterns.", byAgent: true },
      { id: "e_006b", type: "pre-auth-submitted", at: ago(67), detail: "Submitted to Cigna." },
      { id: "e_006c", type: "pre-auth-approved", at: ago(60), detail: "Approved. Reference #PA-CGN-26-7299.", amount: 1250 },
      { id: "e_006d", type: "treatment-completed", at: ago(45), detail: "D3330 completed by Dr. R." },
      { id: "e_006e", type: "claim-submitted", at: ago(45), detail: "Submitted." },
      { id: "e_006f", type: "eob-received-paid", at: ago(40), detail: "Cigna paid $1,250.", amount: 1250 },
      { id: "e_006g", type: "case-closed", at: ago(40), detail: "Case closed." },
    ],
  },

  /* ── Case 7: peer-to-peer escalation in flight ──────────────────────── */
  {
    id: "case_007",
    patientId: "pt_f88c",
    tooth: "#18",
    procedure: "Apicoectomy, molar (first root)",
    procedureCode: "D3425",
    carrier: "MetLife",
    estimatedDollars: 1675,
    recoveredDollars: 0,
    status: "appeal-in-flight",
    openedAt: ago(41),
    ageDays: 41,
    events: [
      { id: "e_007a", type: "pre-auth-drafted", at: ago(41), detail: "MetLife — surgical endo pre-auth.", byAgent: true },
      { id: "e_007b", type: "pre-auth-submitted", at: ago(41), detail: "Submitted." },
      { id: "e_007c", type: "pre-auth-denied", at: ago(33), detail: '"Try retreatment first."', amount: -1675 },
      { id: "e_007d", type: "appeal-drafted", at: ago(33), detail: "Appeal cites prior failed retreatment from this practice.", byAgent: true },
      { id: "e_007e", type: "appeal-submitted", at: ago(32), detail: "Appeal submitted." },
      { id: "e_007f", type: "appeal-denied", at: ago(20), detail: "Initial appeal denied — same boilerplate." },
      { id: "e_007g", type: "peer-to-peer-requested", at: ago(20), detail: "Peer-to-peer requested with MetLife dental director.", byAgent: true },
    ],
  },

  /* ── Case 8: referral letter only (no insurance) ────────────────────── */
  {
    id: "case_008",
    patientId: "pt_g11h",
    tooth: "#7",
    procedure: "Endodontic consultation + diagnosis",
    procedureCode: "D9310",
    carrier: "UnitedHealthcare Dental",
    estimatedDollars: 0,
    recoveredDollars: 0,
    status: "in-progress",
    openedAt: ago(2),
    ageDays: 2,
    events: [
      { id: "e_008a", type: "treatment-completed", at: ago(2), detail: "Consultation completed (referred from Dr. Wang, Bayshore Dental)." },
      { id: "e_008b", type: "referral-letter-drafted", at: ago(2), detail: "Diagnostic-findings letter auto-drafted for Dr. Wang.", byAgent: true },
      { id: "e_008c", type: "referral-letter-sent", at: ago(2), detail: "Letter sent via email + saved to PBS Endo Doc Center.", byAgent: true },
    ],
  },
];

/* ── helpers ──────────────────────────────────────────────────────────── */

export function getCase(id: string): Case | undefined {
  return MOCK_CASES.find((c) => c.id === id);
}

export function activeCases(): Case[] {
  const open: CaseStatus[] = ["in-progress", "pre-auth-approved", "treatment-completed", "claim-submitted", "appeal-in-flight"];
  return MOCK_CASES.filter((c) => open.includes(c.status));
}

export function closedCases(): Case[] {
  const closed: CaseStatus[] = ["claim-paid", "appeal-won", "appeal-lost-final", "do-not-appeal", "closed-paid", "closed-write-off"];
  return MOCK_CASES.filter((c) => closed.includes(c.status));
}

export function casesByPatient(patientId: string): Case[] {
  return MOCK_CASES.filter((c) => c.patientId === patientId);
}

export function totalRecoveredAllTime(): number {
  return MOCK_CASES.reduce((sum, c) => sum + c.recoveredDollars, 0);
}

export function totalAtRiskInFlight(): number {
  return activeCases().reduce((sum, c) => sum + c.estimatedDollars, 0);
}

export function totalDoNotAppealAvoided(): number {
  return MOCK_CASES.filter((c) => c.status === "do-not-appeal").reduce((sum, c) => sum + c.estimatedDollars, 0);
}

const STATUS_LABELS: Record<CaseStatus, string> = {
  "in-progress": "In progress",
  "pre-auth-approved": "Pre-auth approved",
  "pre-auth-denied": "Pre-auth denied",
  "treatment-completed": "Treatment complete",
  "claim-submitted": "Claim submitted",
  "claim-paid": "Claim paid",
  "claim-denied": "Claim denied",
  "appeal-in-flight": "Appeal in flight",
  "appeal-won": "Appeal won",
  "appeal-lost-final": "Appeal lost",
  "do-not-appeal": "Do not appeal",
  "closed-paid": "Closed — paid",
  "closed-write-off": "Closed — write-off",
};

export function caseStatusLabel(status: CaseStatus): string {
  return STATUS_LABELS[status] ?? status;
}

const STATUS_TONE: Record<CaseStatus, "good" | "warn" | "bad" | "neutral"> = {
  "in-progress": "neutral",
  "pre-auth-approved": "good",
  "pre-auth-denied": "warn",
  "treatment-completed": "neutral",
  "claim-submitted": "neutral",
  "claim-paid": "good",
  "claim-denied": "warn",
  "appeal-in-flight": "warn",
  "appeal-won": "good",
  "appeal-lost-final": "bad",
  "do-not-appeal": "neutral",
  "closed-paid": "good",
  "closed-write-off": "bad",
};

export function caseStatusTone(status: CaseStatus): "good" | "warn" | "bad" | "neutral" {
  return STATUS_TONE[status] ?? "neutral";
}
