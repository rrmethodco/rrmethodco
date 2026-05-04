export interface CDTCode {
  code: string;
  description: string;
  category:
    | "diagnostic"
    | "endo-therapy"
    | "retreatment"
    | "surgical"
    | "obstruction"
    | "adjunctive"
    | "restorative";
  highDenialRisk?: boolean;
}

export const CDT_CODES: CDTCode[] = [
  // Diagnostic
  { code: "D0150", description: "Comprehensive oral evaluation", category: "diagnostic" },
  { code: "D0220", description: "Periapical radiograph, first", category: "diagnostic" },
  { code: "D0230", description: "Periapical radiograph, additional", category: "diagnostic" },
  { code: "D0367", description: "Cone beam CT, both jaws", category: "diagnostic", highDenialRisk: true },
  { code: "D0140", description: "Limited oral evaluation, problem-focused", category: "diagnostic" },

  // Endodontic Therapy
  { code: "D3310", description: "Endodontic therapy, anterior tooth", category: "endo-therapy" },
  { code: "D3320", description: "Endodontic therapy, premolar tooth", category: "endo-therapy" },
  { code: "D3330", description: "Endodontic therapy, molar tooth", category: "endo-therapy" },
  { code: "D3331", description: "Treatment of root canal obstruction", category: "obstruction", highDenialRisk: true },
  { code: "D3332", description: "Incomplete endodontic therapy", category: "endo-therapy" },
  { code: "D3333", description: "Internal root repair of perforation defects", category: "endo-therapy" },

  // Retreatment
  { code: "D3346", description: "Retreatment of previous root canal therapy, anterior", category: "retreatment", highDenialRisk: true },
  { code: "D3347", description: "Retreatment of previous root canal therapy, premolar", category: "retreatment", highDenialRisk: true },
  { code: "D3348", description: "Retreatment of previous root canal therapy, molar", category: "retreatment", highDenialRisk: true },

  // Apexification
  { code: "D3351", description: "Apexification/recalcification, initial visit", category: "endo-therapy" },
  { code: "D3352", description: "Apexification/recalcification, interim", category: "endo-therapy" },
  { code: "D3353", description: "Apexification/recalcification, final visit", category: "endo-therapy" },

  // Surgical Endodontics
  { code: "D3410", description: "Apicoectomy, anterior", category: "surgical", highDenialRisk: true },
  { code: "D3421", description: "Apicoectomy, premolar (first root)", category: "surgical", highDenialRisk: true },
  { code: "D3425", description: "Apicoectomy, molar (first root)", category: "surgical", highDenialRisk: true },
  { code: "D3426", description: "Apicoectomy, each additional root", category: "surgical", highDenialRisk: true },
  { code: "D3430", description: "Retrograde filling, per root", category: "surgical" },
  { code: "D3450", description: "Root amputation, per root", category: "surgical" },
  { code: "D3920", description: "Hemisection, not including endo", category: "surgical" },

  // Adjunctive
  { code: "D9230", description: "Inhalation of nitrous oxide", category: "adjunctive" },
  { code: "D9248", description: "Non-IV conscious sedation (oral)", category: "adjunctive", highDenialRisk: true },

  // Restorative
  { code: "D2950", description: "Core buildup, including pins", category: "restorative", highDenialRisk: true },
  { code: "D2954", description: "Prefabricated post and core", category: "restorative" },
];

export const PULPAL_DIAGNOSES = [
  "Normal pulp",
  "Reversible pulpitis",
  "Symptomatic irreversible pulpitis",
  "Asymptomatic irreversible pulpitis",
  "Pulp necrosis",
  "Previously treated",
  "Previously initiated therapy",
] as const;

export const PERIAPICAL_DIAGNOSES = [
  "Normal apical tissues",
  "Symptomatic apical periodontitis",
  "Asymptomatic apical periodontitis",
  "Acute apical abscess",
  "Chronic apical abscess",
  "Condensing osteitis",
] as const;

export const COLD_TEST_RESULTS = [
  "Normal response",
  "Prolonged response (>30 sec lingering)",
  "Heightened response",
  "No response",
  "Not performed (previously treated)",
] as const;

export const PERCUSSION_RESULTS = [
  "Negative",
  "Mildly positive",
  "Moderately positive",
  "Severely positive",
] as const;

export const PALPATION_RESULTS = [
  "WNL (within normal limits)",
  "Tenderness over apex",
  "Tenderness with swelling",
  "Sinus tract present",
] as const;

export const RESTORABILITY = [
  "Restorable",
  "Restorable with cuspal coverage required",
  "Questionable",
  "Non-restorable",
] as const;
