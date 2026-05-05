import type { Patient, Carrier } from "./types";

/**
 * De-identified patient threading. The `id` is an opaque hash; the system
 * never stores names, DOBs, or other PHI. Initials and age range are display
 * helpers only and are stripped before any data leaves the practice infra.
 */
export const MOCK_PATIENTS: Patient[] = [
  { id: "pt_a31f", initials: "M.K.", ageRange: "30-39", primaryCarrier: "Cigna DPPO" },
  { id: "pt_b72d", initials: "J.R.", ageRange: "50-59", primaryCarrier: "Delta Dental PPO" },
  { id: "pt_c19a", initials: "S.T.", ageRange: "40-49", primaryCarrier: "MetLife" },
  { id: "pt_d04e", initials: "R.B.", ageRange: "60-69", primaryCarrier: "Aetna" },
  { id: "pt_e56b", initials: "K.L.", ageRange: "30-39", primaryCarrier: "Delta Dental PPO" },
  { id: "pt_f88c", initials: "A.W.", ageRange: "20-29", primaryCarrier: "Cigna DPPO" },
  { id: "pt_g11h", initials: "P.N.", ageRange: "50-59", primaryCarrier: "UnitedHealthcare Dental" },
  { id: "pt_h27k", initials: "C.G.", ageRange: "40-49", primaryCarrier: "MetLife" },
];

export function getPatient(id: string): Patient | undefined {
  return MOCK_PATIENTS.find((p) => p.id === id);
}

export function patientLabel(patient: Patient | undefined): string {
  if (!patient) return "Unknown patient";
  return `${patient.initials} · ${patient.ageRange ?? "—"} · ${patient.id}`;
}

/**
 * Find any patient who appears in more than one case/event — useful for the
 * "same patient" chip indicator on the inbox.
 */
export function isMultiEventPatient(patientId: string, allPatientIds: string[]): boolean {
  return allPatientIds.filter((id) => id === patientId).length > 1;
}
