# Practice Context — Endodontic Practice

> Shared context file used by the Pre-Auth Narrative Generator, Claim Appeal Letter, and Referral Letter skills. Update the values in `[BRACKETS]` during the discovery interview.

---

## 1. Practice Profile

- **Practice name:** [PRACTICE NAME]
- **Specialty:** Endodontics
- **State:** [STATE — affects state insurance commissioner appeals + state-specific dental board language]
- **Years in operation:** [YEARS]
- **Number of providers:** [# endodontists, # assistants]
- **Average monthly procedure volume:** [# RCTs, # retreatments, # apicoectomies, # CBCT scans]
- **Average monthly pre-auth volume:** [# pre-auths/month]
- **Average monthly referrals received:** [# referrals/month]
- **Practice management software:** PBS Endo (specialty-specific, by PBS Endo Inc.)
- **Imaging system integration:** [e.g., Carestream, Sirona/Schick, J. Morita CBCT — confirm during discovery]
- **In-network vs. out-of-network mix:** [% PPO / % FFS]
- **Referral base:** [# referring GPs, top referral sources]
- **Office manager / billing lead name:** [NAME] — primary user of this system

## 2. Carrier Mix (top 6 by claim volume)

Update during discovery. Each carrier has different narrative preferences; the system tunes language per carrier. Note: endo-specific denial patterns differ from GP — see `reference/carrier_intelligence.md`.

| Rank | Carrier | Approx % of claims | Notes |
|------|---------|--------------------|-------|
| 1 | [e.g., Delta Dental PPO] | [%] | [notes] |
| 2 | [e.g., MetLife] | [%] | [notes] |
| 3 | [e.g., Cigna DPPO] | [%] | [notes] |
| 4 | [e.g., Aetna] | [%] | [notes] |
| 5 | [e.g., UnitedHealthcare] | [%] | [notes] |
| 6 | [e.g., Guardian] | [%] | [notes] |

## 3. Common Procedures Submitted (Endodontic CDT codes)

The 15-20 codes this practice actually submits. Drives narrative templates. Endo has a dramatically narrower code set than GP — this is part of why endo is a strong AI niche.

### Diagnostic
- D0150 — Comprehensive oral evaluation
- D0220 — Periapical radiograph, first
- D0230 — Periapical radiograph, each additional
- D0367 — Cone beam CT, mandible & maxilla with both jaws ⭐ frequent denial; needs strong narrative
- D0140 — Limited oral evaluation, problem-focused (consultation/emergency)

### Endodontic Therapy (primary procedures)
- D3310 — Endodontic therapy, anterior tooth (excluding final restoration)
- D3320 — Endodontic therapy, premolar tooth (excluding final restoration)
- D3330 — Endodontic therapy, molar tooth (excluding final restoration) ⭐ highest volume
- D3331 — Treatment of root canal obstruction (separated instrument removal, ledge bypass, calcified canal) ⭐ frequent bundling denial
- D3332 — Incomplete endodontic therapy; inoperable, unrestorable, or fractured tooth
- D3333 — Internal root repair of perforation defects

### Endodontic Retreatment
- D3346 — Retreatment of previous root canal therapy, anterior ⭐ frequent denial
- D3347 — Retreatment of previous root canal therapy, premolar ⭐ frequent denial
- D3348 — Retreatment of previous root canal therapy, molar ⭐ frequent denial — needs strongest narrative

### Apexification / Apexogenesis
- D3351 — Apexification/recalcification, initial visit
- D3352 — Apexification/recalcification, interim medication replacement
- D3353 — Apexification/recalcification, final visit

### Surgical Endodontics (Apicoectomy)
- D3410 — Apicoectomy, anterior ⭐ frequent denial — "should attempt retreatment first"
- D3421 — Apicoectomy, premolar (first root)
- D3425 — Apicoectomy, molar (first root)
- D3426 — Apicoectomy, each additional root
- D3430 — Retrograde filling, per root
- D3450 — Root amputation, per root
- D3920 — Hemisection (including any root removal), not including endo

### Adjunctive
- D9230 — Inhalation of nitrous oxide
- D9248 — Non-IV conscious sedation (oral conscious)

### Restorative (sometimes done by endo before referral back)
- D2950 — Core buildup, including pins
- D2954 — Prefabricated post and core in addition to crown

## 4. Voice and Tone

- **Person:** Third person, clinical ("Tooth #19 presents with…")
- **Tense:** Present tense for findings, past tense for prior treatment
- **Tone:** Clinical, factual, evidence-based — never emotional, never patient-narrative
- **Avoid:** "Patient comfort," "patient prefers," "for cosmetic reasons," "patient wants"
- **Use:** "Functional necessity," "non-restorable without treatment," "medically indicated due to," "standard of endodontic care," "diagnostic findings consistent with"
- **Length:** 4-7 sentences for endo pre-auths (more clinical specificity required than GP), 3-4 paragraphs for appeals, 2-3 paragraphs for referral letters
- **Reading level:** Written for a dental insurance reviewer (DDS or trained claims reviewer; for endo cases, often the carrier's dental director given complexity)
- **Endo-specific terminology:** use ADA-standard pulpal and periapical diagnostic terminology — irreversible pulpitis, necrotic pulp, symptomatic apical periodontitis, asymptomatic apical periodontitis, acute apical abscess, chronic apical abscess

## 5. Quality Standards (the "good narrative" bar)

Every narrative must:
1. ✅ Reference the specific tooth + canal anatomy when relevant
2. ✅ State the pulpal diagnosis AND periapical diagnosis (endo-specific — both required)
3. ✅ State diagnostic test results (cold test, EPT, percussion, palpation, periodontal probing)
4. ✅ State diagnostic imaging evidence (PA dated, CBCT findings if obtained, working length film)
5. ✅ State restorability assessment (tooth must be restorable post-endo or pre-surgical case)
6. ✅ State prognosis without treatment
7. ✅ Match what is actually documented in the chart (no fabrication — flag gaps instead)

## 6. Compliance Guardrails (HARD RULES)

- **NEVER fabricate clinical findings.** If the chart doesn't say it, the narrative can't say it. Flag missing evidence to the user.
- **NEVER alter dates of service, codes, or tooth numbers.** Only narrative language is generated.
- **NEVER include PHI in outputs sent to non-BAA tools.** Patient names, DOBs, SSNs, full addresses are stripped before processing and only re-attached locally at the final document assembly step.
- **NEVER promise insurance approval.** The system improves the odds; it does not guarantee outcomes.
- **NEVER recommend treatment.** This is a documentation tool, not a clinical decision tool.
- **NEVER override the endodontist's clinical judgment.** If the chart and treatment plan disagree, halt and flag.

## 7. HIPAA Posture for This Engagement

- Anthropic API used under signed BAA (required before processing any PHI).
- Local de-identification step before any data leaves the office network.
- All outputs stored on practice-controlled storage (PBS Endo document attachments or local network drive).
- No outputs routed through Gmail, Slack, or other tools without separate BAA confirmation.
- Audit log maintained: every narrative generated has a record of inputs (de-identified) + output + user + timestamp.

## 8. PBS Endo-Specific Workflow Notes

> Verify these specifics during discovery — PBS Endo capabilities vary by version and configuration. Confirm with mom and (if needed) PBS Endo support.

- Treatment plans created within PBS Endo's TX planning module → export as PDF or printed report
- PBS Endo has integrated **eClaims** functionality for submission to clearinghouses
- Imaging integration: PBS Endo connects with most major sensor systems and CBCT (Carestream, Schick/Sirona, J. Morita) — radiograph references are typically by date/exam
- Document Center / attachments: narratives and appeal letters get uploaded back to the patient's record in PBS Endo
- Referral letters: PBS Endo has a referral letter template module, but most practices we've seen still write each one manually — high-leverage automation target
- EOBs: import via clearinghouse or scanned in; pulled for appeal processing
- Reporting: PBS Endo's reports module exports treatment, claim, and production data — useful for baseline metrics and ongoing measurement

## 9. Referral Network Context (endo-specific)

Endodontists work primarily on referral. Communication with referring GPs is high-volume and high-leverage:

- **Inbound:** patient is referred by GP for diagnosis, treatment, or both
- **Outbound communications expected:**
  1. Acknowledgment letter when referral received (within 24-48h)
  2. Diagnostic findings letter (after consultation)
  3. Post-treatment summary letter (after RCT/retreatment/apicoectomy)
  4. Follow-up letter at 6 months / 1 year (recall confirmation)
- **Volume:** roughly 2-4 letters per patient × patient volume = 20-40 referral letters per week for a typical solo endo practice
- **Tone for referral letters:** collegial, clinically detailed, brief — referring GPs are colleagues, not insurance reviewers. Different voice than insurance narratives.
