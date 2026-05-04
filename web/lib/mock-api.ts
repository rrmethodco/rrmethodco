import type {
  Confidence,
  GenerationOutput,
  GenerationKind,
  Carrier,
  LetterType,
  EvidenceItem,
} from "./types";
import { generateId } from "./utils";

interface PreAuthInput {
  procedure: string;
  tooth: string;
  carrier: Carrier;
  pulpalDiagnosis: string;
  periapicalDiagnosis: string;
  coldTest: string;
  ept?: string;
  percussion: string;
  palpation: string;
  imagingPA: boolean;
  imagingBWX: boolean;
  imagingCBCT: boolean;
  imagingWorkingLength: boolean;
  restorability: string;
  priorTreatment?: string;
  additionalContext?: string;
}

interface AppealInput {
  procedure: string;
  tooth: string;
  carrier: Carrier;
  dos: string;
  billed: number;
  paid: number;
  denialType: string;
  denialReasonText: string;
  clinicalEvidence: string;
}

interface ReferralInput {
  letterType: LetterType;
  referringGPName: string;
  referringPractice: string;
  tooth: string;
  date: string;
  clinicalContent: string;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generatePreAuth(
  input: PreAuthInput
): Promise<GenerationOutput> {
  await wait(1800 + Math.random() * 700);

  const evidence: EvidenceItem[] = [
    { label: "Pulpal diagnosis", present: !!input.pulpalDiagnosis },
    { label: "Periapical diagnosis", present: !!input.periapicalDiagnosis },
    {
      label: "Pre-op radiograph (PA or BWX)",
      present: input.imagingPA || input.imagingBWX,
      guidance:
        !input.imagingPA && !input.imagingBWX
          ? "At least one PA or BWX is required for endodontic narrative."
          : undefined,
    },
    { label: "Restorability assessment", present: !!input.restorability },
  ];

  const isRetreatment = /D334[678]/.test(input.procedure);
  const isSurgical = /D34[12][056]|D3426/.test(input.procedure);

  if (isRetreatment) {
    evidence.push({
      label: "Evidence of failure of prior treatment",
      present: !!input.priorTreatment && input.priorTreatment.length > 50,
      guidance:
        !input.priorTreatment || input.priorTreatment.length <= 50
          ? "Retreatment narratives require explicit failure documentation: radiographic progression, missed canal anatomy on CBCT, or persistent symptoms with timeline."
          : undefined,
    });
    evidence.push({
      label: "CBCT (recommended for retreatment)",
      present: input.imagingCBCT,
      guidance: !input.imagingCBCT
        ? "CBCT findings significantly strengthen retreatment narratives, especially for missed canal anatomy."
        : undefined,
    });
  }

  if (isSurgical) {
    evidence.push({
      label: "Retreatment-contraindicated reasoning",
      present: !!input.priorTreatment && /post|core|attempt|orthograde|fracture|curvature|separated/i.test(input.priorTreatment),
      guidance: "Surgical endo narratives require explicit reason orthograde retreatment is contraindicated.",
    });
    evidence.push({
      label: "CBCT for surgical planning",
      present: input.imagingCBCT,
      guidance: !input.imagingCBCT
        ? "CBCT essentially required for D3410-D3426 surgical planning narratives."
        : undefined,
    });
  }

  const presentCount = evidence.filter((e) => e.present).length;
  const totalCount = evidence.length;
  const ratio = presentCount / totalCount;

  let confidence: Confidence;
  if (ratio >= 0.85) confidence = "HIGH";
  else if (ratio >= 0.65) confidence = "MEDIUM";
  else confidence = "LOW";

  const tooth = input.tooth;
  const procedureCode = input.procedure.split(" ")[0];

  let body = "";

  if (confidence === "LOW") {
    body = `Insufficient documentation to generate a high-quality narrative for ${procedureCode} on tooth ${tooth}. Please review the evidence gaps below and update the chart before resubmitting. Generating the narrative with current information would risk a denial and waste a pre-auth submission window.`;
  } else {
    const carrierTone =
      input.carrier === "Cigna DPPO"
        ? "Cigna-tuned (anatomical specificity, restorability front-loaded)"
        : input.carrier === "Delta Dental PPO"
        ? "Delta-tuned (quantified findings, ADA-standard terminology)"
        : input.carrier === "MetLife"
        ? "MetLife-tuned (prose narrative, conservative-alternative-considered language)"
        : "Carrier-tuned narrative";

    body = `Tooth ${tooth} presents with clinical findings consistent with the documented pulpal and periapical diagnoses. Pulpal diagnosis: ${input.pulpalDiagnosis}. Periapical diagnosis: ${input.periapicalDiagnosis}. Diagnostic testing reveals cold test result of ${input.coldTest.toLowerCase()}, ${input.percussion.toLowerCase()} percussion, and ${input.palpation.toLowerCase()} palpation. ${
      input.imagingPA ? "Periapical radiograph " : ""
    }${input.imagingCBCT ? (input.imagingPA ? "and CBCT " : "CBCT ") : ""}imaging supports the diagnosis. ${
      isRetreatment
        ? `Tooth was previously treated endodontically; current findings demonstrate evidence of treatment failure as documented above. `
        : ""
    }${
      isSurgical
        ? `Surgical intervention is indicated based on documented retreatment-contraindicated factors. `
        : ""
    }The tooth is ${input.restorability.toLowerCase()}. ${procedureCode} is the standard of endodontic care for this presentation.\n\n[${carrierTone}]\n\n[Patient identifiers stripped during processing; will be re-attached locally at final document assembly.]`;
  }

  return {
    id: generateId(),
    kind: "pre-auth",
    createdAt: new Date().toISOString(),
    procedure: input.procedure,
    tooth: input.tooth,
    carrier: input.carrier,
    confidence,
    body,
    evidence,
    attachments: [
      input.imagingPA ? { label: `Pre-op periapical radiograph ${tooth}` } : null,
      input.imagingBWX ? { label: "Bitewing radiograph" } : null,
      input.imagingCBCT ? { label: "CBCT screenshots / report" } : null,
      input.imagingWorkingLength ? { label: "Working length film" } : null,
    ].filter((x): x is { label: string } => x !== null),
    notes: confidence === "MEDIUM"
      ? ["MEDIUM confidence — review evidence gaps before submitting. Consider adding noted documentation."]
      : confidence === "LOW"
      ? ["LOW confidence — system declined to generate. Resolve evidence gaps and retry."]
      : [`${input.carrier} typically processes endo pre-auths in 7-15 business days.`],
    status: "pending",
  };
}

export async function generateAppeal(
  input: AppealInput
): Promise<GenerationOutput> {
  await wait(1800 + Math.random() * 700);

  const denialClassMap: Record<string, { recoverability: GenerationOutput["recoverability"]; confidence: Confidence }> = {
    "retreatment-not-necessary": { recoverability: "HIGH", confidence: "HIGH" },
    "apicoectomy-try-retreatment": { recoverability: "MEDIUM-HIGH", confidence: "HIGH" },
    "d3331-bundled": { recoverability: "HIGH", confidence: "HIGH" },
    "cbct-not-necessary": { recoverability: "MEDIUM-HIGH", confidence: "HIGH" },
    "sedation-not-necessary": { recoverability: "MEDIUM", confidence: "MEDIUM" },
    "buildup-bundled": { recoverability: "HIGH", confidence: "HIGH" },
    "frequency-limitation": { recoverability: "MEDIUM", confidence: "MEDIUM" },
    "coordination-of-benefits": { recoverability: "HIGH", confidence: "HIGH" },
    "insufficient-documentation": { recoverability: "HIGH", confidence: "HIGH" },
    "contractual-exclusion": { recoverability: "DO NOT APPEAL", confidence: "HIGH" },
  };

  const classification = denialClassMap[input.denialType] || { recoverability: "MEDIUM" as const, confidence: "MEDIUM" as const };

  const evidenceLength = input.clinicalEvidence.trim().length;
  if (evidenceLength < 100 && classification.recoverability !== "DO NOT APPEAL") {
    classification.confidence = "LOW";
  }

  let body = "";

  if (classification.recoverability === "DO NOT APPEAL") {
    body = `**Recommendation: DO NOT APPEAL**\n\nThis denial reflects a contractual exclusion under the patient's plan terms. Pursuing this appeal would not be successful and risks degrading the practice's standing with ${input.carrier} for future appeals.\n\nRecommended next steps:\n- Notify the patient that this service is not covered under their plan.\n- Bill the patient directly for the procedure, or write off as appropriate per practice policy.\n- Track this pattern for future plan-comparison conversations with patients during treatment planning.`;
  } else if (classification.confidence === "LOW") {
    body = `Insufficient clinical evidence provided to generate a strong appeal letter. Please paste the clinical notes, imaging findings, and other supporting documentation that justified the original claim. Without specific clinical evidence, the appeal will not address the carrier's stated reason for denial and is unlikely to succeed.`;
  } else {
    body = `Re: Claim for ${input.procedure}\nDate of Service: ${input.dos}\nPatient: [Patient ID redacted in draft]\nProvider: [Endodontist], DDS\n\nDear ${input.carrier} Claims Review,\n\nWe respectfully request reconsideration of the denial of the above-referenced claim.\n\nThe denial states: "${input.denialReasonText.slice(0, 200)}${input.denialReasonText.length > 200 ? "..." : ""}" We disagree with this determination based on the clinical evidence on file.\n\n${input.clinicalEvidence.slice(0, 600)}${input.clinicalEvidence.length > 600 ? "..." : ""}\n\nGiven the documented clinical findings and standard of endodontic care, we believe ${input.procedure} was appropriately performed and billed. Please review the attached documentation and reprocess this claim. If the denial is upheld, please advise of the peer-to-peer review process and timeline.\n\nSincerely,\n[Endodontist], DDS\n\n[Carrier-specific tuning applied for ${input.carrier}.]`;
  }

  return {
    id: generateId(),
    kind: "appeal",
    createdAt: new Date().toISOString(),
    procedure: input.procedure,
    tooth: input.tooth,
    carrier: input.carrier,
    confidence: classification.confidence,
    body,
    recoverability: classification.recoverability,
    estimatedDollars: input.billed - input.paid,
    attachments: classification.recoverability !== "DO NOT APPEAL" ? [
      { label: "Original EOB" },
      { label: "Original claim form" },
      { label: "Pre-op periapical radiograph" },
      { label: "Post-op periapical radiograph" },
      { label: "Clinical notes excerpt (de-identified)" },
    ] : [],
    notes: classification.recoverability === "DO NOT APPEAL"
      ? ["Honest classification: this denial is not recoverable. Trust > one-time win."]
      : [
          `Recovery probability: ${classification.recoverability}.`,
          "For endo specifically, peer-to-peer review (endodontist to carrier dental director) is the highest-success escalation path. Consider requesting if first appeal is denied.",
        ],
    status: "pending",
  };
}

export async function generateReferral(
  input: ReferralInput
): Promise<GenerationOutput> {
  await wait(1200 + Math.random() * 600);

  const contentLength = input.clinicalContent.trim().length;
  const confidence: Confidence = contentLength >= 100 ? "HIGH" : contentLength >= 30 ? "MEDIUM" : "LOW";

  let body = "";

  if (confidence === "LOW") {
    body = `Insufficient clinical content to generate a quality referral letter. Please paste chart notes, treatment details, or diagnostic findings as appropriate for this letter type.`;
  } else {
    const greeting = `Dear Dr. ${input.referringGPName.replace(/^Dr\.?\s*/i, "")},`;
    const closing = `\n\nThank you for the kind referral.\n\nBest regards,\n[Endodontist], DDS\n[Practice Name]`;

    if (input.letterType === "acknowledgment") {
      body = `${greeting}\n\nThank you for referring the patient to our practice for evaluation of tooth ${input.tooth}. We have scheduled the patient for an evaluation on ${input.date}. We will follow up with our diagnostic findings and proposed treatment plan following that visit.\n\nIf you have additional clinical information you would like us to consider, please don't hesitate to share it.${closing}`;
    } else if (input.letterType === "diagnostic") {
      body = `${greeting}\n\nThank you for referring the patient for evaluation of tooth ${input.tooth}. We saw the patient on ${input.date}.\n\n${input.clinicalContent}\n\nWe will provide a post-treatment summary following completion. Please feel free to reach out with any questions or to discuss the case.${closing}`;
    } else if (input.letterType === "post-treatment") {
      body = `${greeting}\n\nThe patient returned for treatment on ${input.date}. We completed treatment on tooth ${input.tooth}.\n\n${input.clinicalContent}\n\nThe patient has been provided with post-operative instructions and is scheduled for follow-up as appropriate. Please feel free to reach out with any questions.${closing}`;
    } else {
      body = `${greeting}\n\nThe patient returned on ${input.date} for follow-up of endodontic treatment performed on tooth ${input.tooth}.\n\n${input.clinicalContent}${closing}`;
    }
  }

  return {
    id: generateId(),
    kind: "referral",
    createdAt: new Date().toISOString(),
    tooth: input.tooth,
    recipient: `Dr. ${input.referringGPName}, ${input.referringPractice}`,
    letterType: input.letterType,
    confidence,
    body,
    notes: confidence === "HIGH"
      ? ["Letter ready to send. Will be emailed/faxed to referring GP and saved to PBS Endo Document Center on approval."]
      : confidence === "MEDIUM"
      ? ["MEDIUM confidence — letter generated but consider expanding clinical detail before sending."]
      : ["LOW confidence — system declined to generate. Add more clinical content and retry."],
    status: "pending",
  };
}
