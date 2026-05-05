export type Confidence = "HIGH" | "MEDIUM" | "LOW";

export type GenerationKind = "pre-auth" | "appeal" | "referral";

export type Carrier =
  | "Delta Dental PPO"
  | "MetLife"
  | "Cigna DPPO"
  | "Aetna"
  | "UnitedHealthcare Dental"
  | "Guardian"
  | "Other";

export type LetterType =
  | "acknowledgment"
  | "diagnostic"
  | "post-treatment"
  | "recall";

export interface EvidenceItem {
  label: string;
  present: boolean;
  guidance?: string;
}

export interface Attachment {
  label: string;
}

/**
 * Structured rationale for why a generation was scored at a given confidence level.
 * Surfaced to the office manager so the HIGH/MEDIUM/LOW pill is attributed, not magic.
 */
export interface ConfidenceRationale {
  evidenceCompletePct: number; // 0..1
  carrierPattern?: {
    carrier: Carrier;
    procedureCode: string;
    matchingHistoricalCases: number;
    historicalApprovalRatePct: number; // 0..100
  };
  practiceHistory?: {
    similarCasesWon: number;
    similarCasesLost: number;
  };
  redFlags?: string[];
  positiveSignals?: string[];
}

export interface GenerationOutput {
  id: string;
  kind: GenerationKind;
  createdAt: string;
  procedure?: string;
  tooth?: string;
  carrier?: Carrier;
  recipient?: string;
  confidence: Confidence;
  confidenceRationale?: ConfidenceRationale;
  body: string;
  evidence?: EvidenceItem[];
  attachments?: Attachment[];
  notes?: string[];
  status: "pending" | "approved" | "edited" | "rejected";
  recoverability?: "HIGH" | "MEDIUM-HIGH" | "MEDIUM" | "LOW" | "DO NOT APPEAL";
  recoverabilityReason?: string;
  letterType?: LetterType;
  estimatedDollars?: number;
  patientId?: string; // hash, never PHI
  caseId?: string;
}

export interface QueueItem extends GenerationOutput {
  triggeredBy: "manual" | "auto-trigger";
  triggerSource?: string;
}

export interface KPIWindow {
  preAuthsRun: number;
  appealsRun: number;
  lettersRun: number;
  hoursSaved: number;
  dollarsRecovered: number;
  approvalRate: number;
  appealWinRate: number;
  doNotAppealCount?: number;
  doNotAppealDollarsAvoided?: number;
}

/* ----------------- Patients (de-identified threading) ----------------- */

export interface Patient {
  id: string; // opaque hash, e.g. "pt_a31f"
  initials: string; // for display only, e.g. "M.K."
  ageRange?: string; // never specific, e.g. "30-39"
  primaryCarrier?: Carrier;
}

/* ----------------- Cases (the 90-day insurance arc) ----------------- */

export type CaseStatus =
  | "in-progress" // pre-auth submitted, awaiting decision
  | "pre-auth-approved"
  | "pre-auth-denied"
  | "treatment-completed"
  | "claim-submitted"
  | "claim-paid"
  | "claim-denied"
  | "appeal-in-flight"
  | "appeal-won"
  | "appeal-lost-final"
  | "do-not-appeal"
  | "closed-paid"
  | "closed-write-off";

export type CaseEventType =
  | "pre-auth-drafted"
  | "pre-auth-submitted"
  | "pre-auth-approved"
  | "pre-auth-denied"
  | "treatment-scheduled"
  | "treatment-completed"
  | "claim-submitted"
  | "eob-received-paid"
  | "eob-received-denied"
  | "appeal-drafted"
  | "appeal-submitted"
  | "appeal-approved"
  | "appeal-denied"
  | "do-not-appeal-recommended"
  | "peer-to-peer-requested"
  | "referral-letter-drafted"
  | "referral-letter-sent"
  | "case-closed";

export interface CaseEvent {
  id: string;
  type: CaseEventType;
  at: string;
  detail: string;
  generationId?: string; // links to a GenerationOutput
  amount?: number; // dollars associated with this event
  byAgent?: boolean; // true if the agent did it autonomously
}

export interface Case {
  id: string;
  patientId: string;
  tooth: string;
  procedure: string;
  procedureCode: string;
  carrier: Carrier;
  estimatedDollars: number;
  recoveredDollars: number; // running tally of $ recovered through this case
  status: CaseStatus;
  events: CaseEvent[];
  openedAt: string;
  closedAt?: string;
  ageDays: number; // computed
}

/* ----------------- Carrier Intelligence (Playbook) ----------------- */

export interface CarrierIntelligence {
  carrier: Carrier;
  approvalRatePct: number;
  approvalRateBaselinePct: number;
  avgProcessingDays: number;
  totalSubmissionsTracked: number;
  topDenialPatterns: { pattern: string; pctOfDenials: number; recoverability: string }[];
  narrativePreferences: string[];
  doNotAppealPatterns: string[];
  escalationPaths: string[];
  notesFromTheField: string[];
  lastUpdated: string;
}
