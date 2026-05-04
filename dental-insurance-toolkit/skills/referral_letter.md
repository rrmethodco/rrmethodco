# Skill: Referral Letter Generator (Endodontics)

## Purpose

Generate clinically detailed, collegial letters from the endodontist back to the referring general dentist. This is the highest-volume communication workflow in an endodontic practice — typically 20-40 letters per week per endodontist (so 80-160/week for the 4-endo group practice).

Different voice from insurance narratives: **referring GPs are colleagues, not insurance reviewers**. Tone is collegial, clinically substantive, and brief. The goal is to maintain the referral relationship and keep the GP informed for continuity of care.

## When to Use

Run this skill at four points in the patient journey:

| Trigger | Letter type | Timing | Volume |
|---------|-------------|--------|--------|
| Patient referral received | **Acknowledgment** | Within 24-48h of receiving referral | 1× per patient |
| Consultation completed | **Diagnostic findings** | Within 24h of consult | 1× per patient |
| Treatment completed | **Post-treatment summary** | Within 48h of completed RCT/retreatment/apicoectomy | 1× per treatment |
| Follow-up exam | **Recall summary** | After 6-month or 1-year follow-up | 1× per follow-up |

For the 4-endo group: estimate ~3-4 letters per active patient × ~30-40 active patients per week = 90-160 letters/week. **This is the largest time-saver of the three skills.**

## Inputs (collected from user, often from PBS Endo chart export)

### Common to all letter types
1. **Letter type** — acknowledgment / diagnostic / post-treatment / recall
2. **Referring GP name + practice** — populated from PBS Endo referral source field
3. **Patient identifier** — placeholder for draft (de-identified during processing); re-attached locally at final assembly
4. **Tooth number(s)** — referral target
5. **Date** of relevant event (referral received, consult, treatment, follow-up)

### Type-specific inputs

**Acknowledgment letter:**
- Patient appointment date scheduled

**Diagnostic findings letter:**
- Chief complaint
- Pulpal diagnosis
- Periapical diagnosis
- Diagnostic test results (cold, EPT, percussion, palpation)
- Imaging findings (PA, CBCT)
- Recommended treatment + tentative schedule
- Restorability assessment + restorative recommendations for the GP

**Post-treatment summary:**
- Treatment performed (CDT codes + tooth #)
- Number of canals located + obturation length
- Materials used (sealer, obturation technique)
- Working length film + post-op PA references
- Restoration recommendations (immediate temporary placed, definitive crown timing — typically 2-4 weeks)
- Post-op instructions given
- Recall recommendation (6-month, 1-year)

**Recall summary:**
- Date of original treatment
- Current radiographic findings
- Symptom status
- Healing assessment (healed / healing / unhealed / non-healing)
- Next steps if applicable

## Process

### Step 1 — Verify inputs and pull GP profile
- Confirm letter type
- Look up referring GP from `reference/referral_network.md` (built over time — captures each referring GP's preferred salutation, practice name, communication style, prior letter history)
- If new GP not in reference, capture details for future reference

### Step 2 — Apply collegial-clinical voice
This voice is **different** from insurance narratives. Key shifts:
- Address the GP by name ("Dear Dr. Smith,")
- First-person plural for the practice ("We saw the patient on…")
- Clinical but not over-defensive (this is colleague-to-colleague)
- Brief — GPs are busy, they want the bottom line
- Professional sign-off with offer to discuss

### Step 3 — Generate letter
Use the type-specific template (see structures below).

### Step 4 — Generate output package
Return:
- The letter (PDF-ready, 1 page)
- A confidence rating (HIGH/MEDIUM/LOW)
- A note if any clinical info was missing or ambiguous
- Audit record

## Letter Templates

### Acknowledgment Letter (5-6 sentences)

```
[Date]

Dear Dr. [Referring GP],

Thank you for referring [Patient placeholder] to our practice. We have scheduled the patient for an evaluation on [Date]. We will follow up with our diagnostic findings and proposed treatment plan following that visit.

If you have additional clinical information you would like us to consider, please don't hesitate to share it.

Thank you for the kind referral.

Best regards,
[Endodontist Name], DDS / DMD
[Practice Name]
```

### Diagnostic Findings Letter (1 page, 3 paragraphs)

**Paragraph 1 — Visit summary + diagnosis**
> Thank you for referring [patient] for evaluation of tooth #[X]. We saw the patient on [date]. Chief complaint: [brief description]. Diagnostic testing revealed: [cold test result], [EPT result if performed], [percussion], [palpation]. Periapical radiograph dated [date] demonstrates [finding]. [If CBCT obtained: CBCT confirms [finding].] **Pulpal diagnosis: [diagnosis]. Periapical diagnosis: [diagnosis].**

**Paragraph 2 — Treatment plan**
> Recommended treatment: [procedure(s)]. Treatment is scheduled for [date]. The tooth is [restorable / questionable / non-restorable]; [if restorable, include any specific restorative recommendations such as cuspal coverage, post-and-core, immediate vs. delayed final restoration].

**Paragraph 3 — Closing**
> We will provide a post-treatment summary following completion. Please feel free to reach out with any questions or to discuss the case.

### Post-Treatment Summary Letter (1 page, 3 paragraphs)

**Paragraph 1 — Treatment completed**
> [Patient] returned for treatment on [date]. We completed [procedure: e.g., "endodontic therapy on tooth #19"]. [# canals] canals were located and obturated to working length: [list canals + lengths]. Obturation was performed using [technique] with [sealer]. Working length film and post-op PA on file confirm adequate length and density of obturation.

**Paragraph 2 — Restoration & follow-up**
> A [temporary restoration / immediate buildup with composite] has been placed. Recommend definitive [crown / onlay / restoration] within [2-4 weeks] to protect the tooth from coronal fracture. The patient has been provided with post-operative instructions and is scheduled for follow-up at [6 months / 1 year].

**Paragraph 3 — Closing**
> Thank you for the referral and for entrusting us with your patient's care. Please reach out with any questions.

### Recall Summary Letter (½-1 page, 2-3 paragraphs)

**Paragraph 1 — Recall visit**
> [Patient] returned on [date] for [6-month / 1-year] follow-up of endodontic treatment performed on tooth #[X] on [original treatment date]. Current periapical radiograph demonstrates [healed periapical lesion / continued healing / persistent radiolucency]. Patient reports [asymptomatic / mild discomfort / significant symptoms].

**Paragraph 2 — Assessment + next steps**
> Assessment: treatment is [healing as expected / fully healed / requires further evaluation]. [If concerns: recommended next step.] [If healed: no further endodontic intervention indicated; routine recall with primary dentist.]

**Paragraph 3 — Closing**
> Thank you again for the referral.

## Output Format

```
═══════════════════════════════════════════════════════
REFERRAL LETTER
═══════════════════════════════════════════════════════
Letter Type:    [acknowledgment / diagnostic / post-tx / recall]
Referring GP:   Dr. [Name], [Practice]
Tooth:          #[X]
Date:           [date]
Confidence:     [HIGH/MEDIUM/LOW]
═══════════════════════════════════════════════════════

[Full letter, 1 page, ready for letterhead]

═══════════════════════════════════════════════════════
NOTES:
- [Any input gaps or assumptions made]
- [Suggested attachments — e.g., post-op PA copy]
═══════════════════════════════════════════════════════
```

## Edge Case Handling

- **Treatment did not go as planned (e.g., separated instrument, perforation, non-completed therapy):** generate honest summary documenting what occurred, what was managed, and the plan forward. Do not minimize or hide complications — referring GPs need accurate info for follow-up care, and these letters become legal documentation.
- **Patient declined recommended treatment:** include this in the diagnostic letter ("patient elected to consider options and will follow up").
- **Failed prior endo (now retreatment case):** mention prior treatment respectfully — "patient presents with prior endodontic therapy on tooth #X demonstrating periapical pathology consistent with treatment failure." Avoid blame language toward the original treating dentist (often the GP themselves).
- **No referring GP (self-referred patient):** skip salutation; create chart note instead of letter.
- **Multiple teeth in same referral:** address each in the same letter, organized by tooth number.

## Quality Checks (run before returning output)

1. Is the GP addressed by name correctly?
2. Is the tooth number correct and consistent throughout?
3. Are pulpal and periapical diagnoses both stated (for diagnostic letters)?
4. Is the treatment description accurate to the chart?
5. Is the tone collegial, not defensive or insurance-coded?
6. Is the letter ≤1 page?
7. Is patient PHI properly placeholdered for the draft?
8. Is the sign-off professional with offer to discuss?

## Error Recovery

- **Missing GP name:** flag for manual lookup before sending.
- **Conflicting clinical info between chart and inputs:** halt and request clarification.
- **Suspected PHI in input:** halt, alert user, request de-identified version.

## Success Metrics (track per use)

- Time to generate (target: <60 seconds)
- User edits before sending (target: <5% need substantive edits)
- Office manager satisfaction (weekly check)
- Letters sent within target timing window (24-48h post-trigger)
- **Referral volume from each GP** — track over time. Practices with consistent post-treatment communication retain and grow their referral base. This is the long-term ROI metric — referral letters drive patient acquisition.
