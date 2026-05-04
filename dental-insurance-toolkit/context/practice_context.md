# Practice Context — General Dental Practice

> Shared context file used by both the Pre-Auth Narrative Generator and the Claim Appeal Letter skills. Update the values in `[BRACKETS]` during the discovery interview.

---

## 1. Practice Profile

- **Practice name:** [PRACTICE NAME]
- **Specialty:** General Dentistry
- **State:** [STATE — affects state insurance commissioner appeals + state-specific dental board language]
- **Years in operation:** [YEARS]
- **Number of providers:** [# dentists, # hygienists]
- **Average monthly claim volume:** [# claims/month]
- **Average monthly pre-auth volume:** [# pre-auths/month]
- **Practice management software:** Denticon (Planet DDS, cloud-based)
- **In-network vs. out-of-network mix:** [% PPO / % FFS / % HMO]
- **Office manager / billing lead name:** [NAME] — primary user of this system

## 2. Carrier Mix (top 6 by claim volume)

Update during discovery. Each carrier has different narrative preferences; the system tunes language per carrier.

| Rank | Carrier | Approx % of claims | Notes |
|------|---------|--------------------|-------|
| 1 | [e.g., Delta Dental PPO] | [%] | [notes] |
| 2 | [e.g., MetLife] | [%] | [notes] |
| 3 | [e.g., Cigna DPPO] | [%] | [notes] |
| 4 | [e.g., Aetna] | [%] | [notes] |
| 5 | [e.g., UnitedHealthcare] | [%] | [notes] |
| 6 | [e.g., Guardian] | [%] | [notes] |

## 3. Common Procedures Submitted (GP-specific CDT codes)

The 30-50 codes this practice actually submits. Drives narrative templates.

### Diagnostic
- D0150 — Comprehensive oral evaluation (new/established)
- D0210 — Intraoral complete series radiographs
- D0220 / D0230 — Periapical radiographs
- D0274 — Bitewings, four films
- D0330 — Panoramic radiograph

### Preventive
- D1110 — Adult prophylaxis
- D1120 — Child prophylaxis
- D1206 / D1208 — Fluoride varnish / topical fluoride
- D1351 — Sealant per tooth

### Restorative
- D2140-D2161 — Amalgam restorations (1-4+ surfaces)
- D2330-D2394 — Composite restorations, anterior & posterior
- D2740 — Crown, porcelain/ceramic ⭐ high pre-auth volume
- D2750 — Crown, porcelain fused to high noble metal
- D2950 — Core buildup, including any pins ⭐ frequent denial
- D2954 — Prefabricated post and core
- D2980 — Crown repair

### Endodontics
- D3310 — Endodontic therapy, anterior
- D3320 — Endodontic therapy, bicuspid
- D3330 — Endodontic therapy, molar
- D3346 / D3347 / D3348 — Retreatment

### Periodontics
- D4341 — Periodontal scaling and root planing, 4+ teeth per quadrant ⭐ high pre-auth volume
- D4342 — Periodontal scaling and root planing, 1-3 teeth per quadrant
- D4910 — Periodontal maintenance ⭐ frequent frequency-limitation denial

### Prosthodontics (removable)
- D5110 / D5120 — Complete denture maxillary / mandibular
- D5213 / D5214 — Maxillary / mandibular partial denture
- D5410-D5422 — Adjustments
- D5750 / D5751 — Reline, complete denture

### Oral Surgery (GP-scope)
- D7140 — Extraction, erupted tooth or exposed root
- D7210 — Surgical removal of erupted tooth requiring removal of bone

### Adjunctive
- D9110 — Palliative emergency treatment
- D9223 — Deep sedation/general anesthesia, each 15-minute increment
- D9944 — Occlusal guard, hard appliance, full arch ⭐ medical-necessity narrative needed
- D9230 — Inhalation of nitrous oxide

## 4. Voice and Tone

- **Person:** Third person, clinical ("The patient presents with…")
- **Tense:** Present tense for findings, past tense for prior treatment
- **Tone:** Clinical, factual, evidence-based — never emotional, never patient-narrative
- **Avoid:** "Patient comfort," "patient prefers," "for cosmetic reasons," "patient wants" — these get denials
- **Use:** "Functional necessity," "structurally compromised," "non-restorable without," "medically indicated due to"
- **Length:** 3-6 sentences for pre-auths, 2-4 paragraphs for appeals
- **Reading level:** Written for a dental insurance reviewer (DDS or trained claims reviewer) — assume clinical literacy

## 5. Quality Standards (the "good narrative" bar)

Every narrative must:
1. ✅ Reference the specific tooth/quadrant/arch
2. ✅ State the clinical finding (decay extent, fracture, perio measurements, bone loss)
3. ✅ State the diagnostic evidence (radiograph type + finding, perio chart values, photo)
4. ✅ State the prognosis without treatment
5. ✅ State why the proposed code is the most conservative appropriate option
6. ✅ Match what is actually documented in the chart (no fabrication — flag gaps instead)

## 6. Compliance Guardrails (HARD RULES)

- **NEVER fabricate clinical findings.** If the chart doesn't say it, the narrative can't say it. Flag missing evidence to the user.
- **NEVER alter dates of service, codes, or tooth numbers.** Only narrative language is generated.
- **NEVER include PHI in outputs sent to non-BAA tools.** Patient names, DOBs, SSNs, full addresses are stripped before processing and only re-attached locally at the final document assembly step.
- **NEVER promise insurance approval.** The system improves the odds; it does not guarantee outcomes.
- **NEVER recommend treatment.** This is a documentation tool, not a clinical decision tool.

## 7. HIPAA Posture for This Engagement

- Anthropic API used under signed BAA (required before processing any PHI).
- Local de-identification step before any data leaves the office network.
- All outputs stored on practice-controlled storage (Denticon document attachments or local network drive).
- No outputs routed through Gmail, Slack, or other tools without separate BAA confirmation.
- Audit log maintained: every narrative generated has a record of inputs (de-identified) + output + user + timestamp.

## 8. Denticon-Specific Workflow Notes

- Treatment plans export from Denticon as PDF or via the **Treatment Plan report** → use as input
- EOBs arrive in Denticon's **eClaims** inbox → exported as PDF for appeal processing
- Final narratives and appeal letters get uploaded back to the patient's **Document Center** in Denticon
- Pre-auths submitted via Denticon's eClaims module with the narrative pasted into the "Remarks" field or attached as a separate document depending on carrier
