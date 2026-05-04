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

export interface GenerationOutput {
  id: string;
  kind: GenerationKind;
  createdAt: string;
  procedure?: string;
  tooth?: string;
  carrier?: Carrier;
  recipient?: string;
  confidence: Confidence;
  body: string;
  evidence?: EvidenceItem[];
  attachments?: Attachment[];
  notes?: string[];
  status: "pending" | "approved" | "edited" | "rejected";
  recoverability?: "HIGH" | "MEDIUM-HIGH" | "MEDIUM" | "LOW" | "DO NOT APPEAL";
  recoverabilityReason?: string;
  letterType?: LetterType;
  estimatedDollars?: number;
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
}
