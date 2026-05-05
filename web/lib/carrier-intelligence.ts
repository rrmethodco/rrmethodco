import type { CarrierIntelligence } from "./types";

/**
 * Carrier playbook — the "moat" content. In production, this layer is updated
 * continuously across the customer base as approvals/denials flow in. For the
 * pilot demo we ship it as static JSON; the data shape is stable for Phase 3.
 */
export const CARRIER_PLAYBOOK: CarrierIntelligence[] = [
  {
    carrier: "Cigna DPPO",
    approvalRatePct: 91,
    approvalRateBaselinePct: 76,
    avgProcessingDays: 11,
    totalSubmissionsTracked: 318,
    topDenialPatterns: [
      { pattern: "Insufficient anatomical specificity in retreatment narrative", pctOfDenials: 34, recoverability: "HIGH" },
      { pattern: "Missing CBCT for D3331/D3425 surgical claims", pctOfDenials: 22, recoverability: "HIGH" },
      { pattern: 'Buildup (D2950) bundled with crown', pctOfDenials: 18, recoverability: "HIGH" },
      { pattern: "Sedation (D9248) — medical necessity not established", pctOfDenials: 14, recoverability: "MEDIUM" },
      { pattern: "Frequency limitation on diagnostic imaging", pctOfDenials: 8, recoverability: "MEDIUM" },
    ],
    narrativePreferences: [
      "Lead with anatomical/radiographic specificity (canal anatomy, exact lesion size in mm, dated imaging).",
      "Front-load restorability assessment in the first paragraph.",
      "For retreatment: explicit fracture/failure documentation with timeline.",
      "Avoid vague language like 'persistent symptoms' — quantify duration and quality.",
    ],
    doNotAppealPatterns: [
      "Plan-level contractual exclusion for endodontic surgery (some employer plans).",
      "Out-of-network claims billed at 100% UCR with no prior pre-auth.",
    ],
    escalationPaths: [
      "First appeal → Cigna Dental Claims Review (15-30 day SLA).",
      "Second escalation → Peer-to-peer with Cigna dental director (request explicitly in appeal letter).",
      "Final → External independent review (state-dependent, typically 60+ day window).",
    ],
    notesFromTheField: [
      "Cigna's adjudicators reward density. Narratives under 200 words are denied at 2.4x the rate of 250-350 word narratives.",
      "Same-day pre-auth submission (vs. 2+ days post-treatment-plan) approves ~6 percentage points higher.",
    ],
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    carrier: "Delta Dental PPO",
    approvalRatePct: 88,
    approvalRateBaselinePct: 71,
    avgProcessingDays: 9,
    totalSubmissionsTracked: 412,
    topDenialPatterns: [
      { pattern: "D3331 bundled into D3330 endodontic therapy", pctOfDenials: 41, recoverability: "HIGH" },
      { pattern: "D3348/D3347 retreatment — original endo too recent (frequency)", pctOfDenials: 19, recoverability: "MEDIUM" },
      { pattern: "Apicoectomy denied — orthograde retreatment not attempted", pctOfDenials: 17, recoverability: "MEDIUM-HIGH" },
      { pattern: "CBCT (D0367) — not medically necessary", pctOfDenials: 13, recoverability: "MEDIUM-HIGH" },
      { pattern: "Coordination of benefits — primary needed", pctOfDenials: 10, recoverability: "HIGH" },
    ],
    narrativePreferences: [
      "Quantified findings (millimeters, dated imaging, canal anatomy) preferred over prose.",
      "ADA CDT terminology — match the code descriptor language exactly.",
      "Explicit step-by-step procedural justification for D3331 (separated file, calcified canal, etc.).",
      "Conservative-alternatives-considered framing for surgical claims.",
    ],
    doNotAppealPatterns: [
      "Employer-level frequency caps on diagnostic imaging (some commercial plans).",
      "Member's plan year benefits exhausted (verify before appealing).",
    ],
    escalationPaths: [
      "First appeal → Delta Dental claim reconsideration (10-15 day SLA).",
      "Second escalation → Delta Dental peer-to-peer (high success on D3331 bundling).",
      "Third → State Insurance Commissioner complaint (rare, but Delta responds).",
    ],
    notesFromTheField: [
      "Delta's D3331 bundling denial reverses ~92% of the time on first appeal with proper file-fragment documentation.",
      "Submitting via clearinghouse vs. portal: clearinghouse approves 2 days faster on average.",
    ],
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    carrier: "MetLife",
    approvalRatePct: 85,
    approvalRateBaselinePct: 69,
    avgProcessingDays: 14,
    totalSubmissionsTracked: 247,
    topDenialPatterns: [
      { pattern: "Apicoectomy — orthograde retreatment 'not exhausted'", pctOfDenials: 36, recoverability: "MEDIUM-HIGH" },
      { pattern: "Sedation (D9248) — anxiety not documented", pctOfDenials: 23, recoverability: "MEDIUM" },
      { pattern: "Buildup bundled with crown (D2950)", pctOfDenials: 16, recoverability: "HIGH" },
      { pattern: "CBCT — frequency limit", pctOfDenials: 11, recoverability: "LOW" },
      { pattern: "Out-of-network UCR write-down", pctOfDenials: 14, recoverability: "LOW" },
    ],
    narrativePreferences: [
      "Prose narrative preferred over bullet points.",
      "Explicit 'conservative alternatives considered' language for surgical claims.",
      "Date-stamp every clinical event referenced.",
      "Mention referring provider's documentation when relevant.",
    ],
    doNotAppealPatterns: [
      "UCR write-downs on out-of-network providers (carrier won't budge).",
      "Plan-level CBCT frequency caps that have already been exceeded that year.",
    ],
    escalationPaths: [
      "First appeal → MetLife Dental claim review (14-21 day SLA).",
      "Second escalation → Peer-to-peer (recommend proactively for surgical endo).",
      "Third → DOI complaint.",
    ],
    notesFromTheField: [
      "MetLife is the carrier most likely to reverse on peer-to-peer — request it proactively even on first appeal for surgical claims.",
      "Sedation appeals win at 38% with full anxiety documentation, 12% without.",
    ],
    lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    carrier: "Aetna",
    approvalRatePct: 87,
    approvalRateBaselinePct: 72,
    avgProcessingDays: 10,
    totalSubmissionsTracked: 198,
    topDenialPatterns: [
      { pattern: "Insufficient documentation — generic boilerplate", pctOfDenials: 33, recoverability: "HIGH" },
      { pattern: "Coordination of benefits — primary needed", pctOfDenials: 22, recoverability: "HIGH" },
      { pattern: "D3331 bundled into D3330", pctOfDenials: 18, recoverability: "HIGH" },
      { pattern: "Apicoectomy — try retreatment first", pctOfDenials: 14, recoverability: "MEDIUM-HIGH" },
      { pattern: "Frequency limitation", pctOfDenials: 13, recoverability: "MEDIUM" },
    ],
    narrativePreferences: [
      "Standardized format: tooth → diagnosis → tests → imaging → treatment → restorability.",
      "Avoid filler clinical text; adjudicators score on density of objective findings.",
      "Imaging citations with dates required.",
    ],
    doNotAppealPatterns: [
      "Out-of-network with no prior auth and patient signed UCR waiver.",
    ],
    escalationPaths: [
      "First appeal → Aetna Dental review (10-14 day SLA).",
      "Second escalation → Aetna peer-to-peer (responsive, 50%+ reversal on first ask).",
    ],
    notesFromTheField: [
      "Aetna's 'insufficient documentation' denial is almost always boilerplate — 80%+ reverse on first appeal with the same documentation re-submitted with a cover narrative.",
    ],
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    carrier: "UnitedHealthcare Dental",
    approvalRatePct: 79,
    approvalRateBaselinePct: 65,
    avgProcessingDays: 16,
    totalSubmissionsTracked: 142,
    topDenialPatterns: [
      { pattern: "Sedation (D9248) — anxiety/medical necessity bar high", pctOfDenials: 31, recoverability: "MEDIUM" },
      { pattern: "Apicoectomy — exhaust orthograde", pctOfDenials: 24, recoverability: "MEDIUM-HIGH" },
      { pattern: "CBCT — frequency or necessity", pctOfDenials: 18, recoverability: "MEDIUM" },
      { pattern: "Plan exclusion (varies by employer)", pctOfDenials: 16, recoverability: "DO NOT APPEAL" },
      { pattern: "Insufficient documentation", pctOfDenials: 11, recoverability: "HIGH" },
    ],
    narrativePreferences: [
      "Explicit medical-necessity framing required for D9248.",
      "Document ASA classification on sedation cases.",
      "For surgical claims: itemized list of orthograde attempts (dates, providers, outcomes).",
    ],
    doNotAppealPatterns: [
      "UHC group plans with explicit endodontic surgery exclusions — 12% of UHC denials are this; do not appeal.",
      "Employer self-funded plans where medical-not-dental policy applies.",
    ],
    escalationPaths: [
      "First appeal → UHC Dental review (15-21 day SLA, slowest of the top 6).",
      "Second escalation → Peer-to-peer (lower success rate than Cigna/MetLife).",
      "Third → External review under ERISA (for self-funded plans).",
    ],
    notesFromTheField: [
      "UHC is the toughest carrier on sedation appeals. 'DO NOT APPEAL' recommendations save the practice 4-6 hrs/week of dead-end work on UHC alone.",
      "Plan exclusion language varies wildly by employer — verify the specific plan document before drafting.",
    ],
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    carrier: "Guardian",
    approvalRatePct: 90,
    approvalRateBaselinePct: 78,
    avgProcessingDays: 8,
    totalSubmissionsTracked: 71,
    topDenialPatterns: [
      { pattern: "Coordination of benefits — primary needed", pctOfDenials: 38, recoverability: "HIGH" },
      { pattern: "D3331 bundling", pctOfDenials: 21, recoverability: "HIGH" },
      { pattern: "Frequency limitation on PA imaging", pctOfDenials: 19, recoverability: "MEDIUM" },
      { pattern: "Buildup bundling", pctOfDenials: 12, recoverability: "HIGH" },
    ],
    narrativePreferences: [
      "Concise narratives preferred (200-300 words).",
      "Cite ADA CDT descriptor language.",
      "Imaging with dates is mandatory.",
    ],
    doNotAppealPatterns: [
      "Member's plan year max benefit exhausted — verify before appealing.",
    ],
    escalationPaths: [
      "First appeal → Guardian claim review (7-10 day SLA, fastest of top 6).",
      "Second escalation → Peer-to-peer (high success).",
    ],
    notesFromTheField: [
      "Guardian is the most cooperative carrier in the practice's mix. Highest baseline approval rate, fastest processing.",
      "Their COB denials are almost always paperwork fixes — submit secondary's primary EOB and the claim auto-reprocesses.",
    ],
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getCarrierPlaybook(carrier: string): CarrierIntelligence | undefined {
  return CARRIER_PLAYBOOK.find((c) => c.carrier === carrier);
}
