# Sample Referral Letter Inputs (for testing)

> 4 fully de-identified sample cases for testing the `referral_letter.md` skill — one for each letter type.

---

## Sample 1 — Acknowledgment Letter

**Letter type:** Acknowledgment
**Referring GP:** Dr. Sarah Chen, Cypress Dental Group
**Patient:** [placeholder]
**Tooth:** #19
**Referral received:** [date]
**Patient appointment scheduled:** [date+10]

**Expected output:**
- Brief 5-6 sentence letter
- Thanks Dr. Chen by name
- Confirms appointment date
- Promises diagnostic findings letter post-consultation
- Offers to receive additional clinical info if relevant
- Professional sign-off

---

## Sample 2 — Diagnostic Findings Letter

**Letter type:** Diagnostic Findings
**Referring GP:** Dr. Marcus Patel, Sunset Family Dentistry
**Patient:** [placeholder]
**Tooth:** #14
**Consultation date:** [date]

**Clinical inputs:**
> Chief complaint: lingering cold sensitivity x 3 weeks, exacerbation with chewing
> Cold test: prolonged response (>30 sec) on #14
> EPT: vital response, threshold elevated vs. control
> Percussion: positive on #14
> Palpation: WNL
> PA imaging dated [date]: widened PDL apical to MB root, no discrete radiolucency
> CBCT: not obtained
>
> Pulpal diagnosis: Irreversible pulpitis
> Periapical diagnosis: Symptomatic apical periodontitis
>
> Recommended treatment: D3330 endodontic therapy on #14
> Treatment scheduled: [date+7]
> Restorability: Restorable. Recommend cuspal coverage post-RCT given existing MOD restoration.

**Expected output:**
- 1-page, 3-paragraph collegial letter
- Para 1: Visit summary, diagnostic test results, both diagnoses
- Para 2: Treatment plan and date, restorability assessment with cuspal coverage recommendation for the GP
- Para 3: Promise of post-treatment summary, offer to discuss
- Tone: collegial, clinically substantive, brief
- NOT in insurance-narrative voice (different audience)

---

## Sample 3 — Post-Treatment Summary Letter

**Letter type:** Post-Treatment Summary
**Referring GP:** Dr. Marcus Patel, Sunset Family Dentistry (same patient as Sample 2)
**Patient:** [placeholder]
**Tooth:** #14
**Treatment date:** [date]

**Clinical inputs:**
> Procedure completed: D3330 endodontic therapy on #14
> Canals located and obturated:
>   - MB1: 21mm working length
>   - MB2: 20mm working length (located via ultrasonic troughing under microscope)
>   - DB: 21.5mm working length
>   - Palatal: 22mm working length
> Obturation technique: warm vertical compaction
> Sealer: AH Plus
> Working length film and post-op PA on file confirming length and density
> Immediate temporary placed (Cavit + IRM)
> Restoration recommendation: definitive cuspal-coverage restoration (onlay or crown) within 2-4 weeks
> Post-op instructions provided
> Recall scheduled: 6 months at this practice

**Expected output:**
- 1-page, 3-paragraph collegial letter
- Para 1: Treatment completed, canals located (4 — note MB2 specifically), obturation technique, films on file
- Para 2: Temporary placed, definitive restoration timing recommendation (2-4 weeks), post-op instructions given, recall scheduled
- Para 3: Thank-you, offer to discuss
- Notable: MB2 location is a quality marker — referring GPs note this as evidence of thorough endodontic treatment

---

## Sample 4 — Recall Summary Letter

**Letter type:** Recall Summary
**Referring GP:** Dr. Sarah Chen, Cypress Dental Group
**Patient:** [placeholder]
**Tooth:** #19
**Original treatment date:** [date-365]
**Recall date:** [date] (1-year follow-up)

**Clinical inputs:**
> Procedure originally completed: D3330 endodontic therapy on #19, 1 year ago
> Current radiograph (PA dated today) demonstrates: complete resolution of periapical radiolucency that was present pre-treatment; PDL appearance normal; no widening
> Patient symptoms: asymptomatic
> Patient reports no functional issues
> Healing assessment: fully healed
> Next steps: no further endodontic intervention indicated; routine recall with primary dentist

**Expected output:**
- ½ to 1-page, 2-3 paragraph letter
- Para 1: Recall visit, comparison of current PA to pre-treatment, asymptomatic
- Para 2: Healing assessment (fully healed), no further endo indicated, routine recall with primary dentist
- Para 3: Thank-you for original referral
- Tone: positive outcome documentation; this letter is also a marketing touchpoint for the GP relationship

---

## Edge Case Sample 5 — Treatment with Complication

**Letter type:** Post-Treatment Summary
**Referring GP:** Dr. Lin Wang, Bayshore Dental
**Patient:** [placeholder]
**Tooth:** #3
**Treatment date:** [date]

**Clinical inputs:**
> Procedure: attempted D3330 on #3
> Outcome: file separation in MB canal during initial instrumentation, mid-coronal third
> Management: file removal attempted with ultrasonic; unable to remove without significant tooth structure compromise
> Decision: completed obturation around separated file; informed patient of complication; long-term prognosis discussed
> Patient elected to proceed; informed consent on file
> Post-op PA on file showing obturation with file fragment in place
> Restorative recommendation: definitive crown within 2-4 weeks
> Long-term considerations discussed: monitoring for symptom development; potential future need for surgical intervention if symptoms develop

**Expected output:**
- Honest 1-page summary documenting the complication
- Does NOT minimize or hide the file separation
- Documents decision-making and patient consent
- Provides clear guidance for restorative timing and long-term monitoring
- Tone: professional, factual, complete
- This letter has both clinical and legal documentation function

---

## Testing Protocol

For each sample:

1. Run the skill
2. Score on:
   - **Tone** — collegial, not insurance-coded
   - **Length** — appropriate for letter type
   - **Clinical accuracy** — matches inputs exactly
   - **Brevity** — referring GPs are busy
   - **Honesty** — for Sample 5, complications must be documented clearly
3. Refine and re-run

**Pass criteria:** all 5 samples produce letters that mom (the endodontist) would sign without substantive edits.

This skill has the lowest stakes for the agent (referring GPs are forgiving) but the highest VOLUME — so quality + speed matters most. Target: <60 sec per letter, <5% edit rate.
