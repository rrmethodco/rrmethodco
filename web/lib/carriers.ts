import type { Carrier } from "./types";

export const CARRIERS: Carrier[] = [
  "Delta Dental PPO",
  "MetLife",
  "Cigna DPPO",
  "Aetna",
  "UnitedHealthcare Dental",
  "Guardian",
  "Other",
];

export const DENIAL_TYPES = [
  {
    id: "retreatment-not-necessary",
    label: 'Retreatment "not medically necessary"',
    recoverability: "HIGH" as const,
    description: 'Carrier claims original treatment is still serviceable.',
  },
  {
    id: "apicoectomy-try-retreatment",
    label: 'Apicoectomy denied — "try retreatment first"',
    recoverability: "MEDIUM-HIGH" as const,
    description: "Carrier claims conservative options not exhausted.",
  },
  {
    id: "d3331-bundled",
    label: "D3331 bundled into primary endo therapy",
    recoverability: "HIGH" as const,
    description: "Carrier bundles obstruction treatment into RCT code.",
  },
  {
    id: "cbct-not-necessary",
    label: "CBCT (D0367) denied — not medically necessary",
    recoverability: "MEDIUM-HIGH" as const,
    description: "Carrier claims PA imaging adequate.",
  },
  {
    id: "sedation-not-necessary",
    label: "Sedation (D9248) denied — not medically necessary",
    recoverability: "MEDIUM" as const,
    description: "Carrier denies oral conscious sedation.",
  },
  {
    id: "buildup-bundled",
    label: "Buildup (D2950) bundled with crown",
    recoverability: "HIGH" as const,
    description: "Carrier bundles buildup into restorative payment.",
  },
  {
    id: "frequency-limitation",
    label: "Frequency limitation",
    recoverability: "MEDIUM" as const,
    description: "Service exceeds plan frequency maximum.",
  },
  {
    id: "coordination-of-benefits",
    label: "Coordination of benefits — primary needed",
    recoverability: "HIGH" as const,
    description: "Paperwork-only fix in most cases.",
  },
  {
    id: "insufficient-documentation",
    label: "Insufficient documentation",
    recoverability: "HIGH" as const,
    description: "Carrier requests additional X-rays or chart notes.",
  },
  {
    id: "contractual-exclusion",
    label: "Contractual exclusion",
    recoverability: "DO NOT APPEAL" as const,
    description: "Service is not covered under plan terms.",
  },
] as const;
