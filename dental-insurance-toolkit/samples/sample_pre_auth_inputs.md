# Sample Pre-Auth Inputs (Endodontics — for testing)

> 5 fully de-identified sample cases for testing the `pre_auth_narrative.md` skill. All patient identifiers are placeholders. Replace with real (de-identified) cases from the practice during refinement.

---

## Sample 1 — Routine RCT, molar (clean case)

**Procedure:** D3330 — Endodontic therapy, molar tooth
**Tooth:** #19
**DOS:** scheduled, [date]
**Carrier:** Delta Dental PPO

**Pulpal diagnosis:** Irreversible pulpitis
**Periapical diagnosis:** Symptomatic apical periodontitis

**Diagnostic test results:**
> Cold test: prolonged response (lingering >30 sec) on #19; normal response on adjacent teeth. EPT: not performed. Percussion: positive on #19. Palpation: WNL.

**Imaging available:** PA #19 dated [DOS-7], BWX dated [DOS-7]

**Restorability:** Restorable. Patient referred back to GP for cuspal coverage post-RCT.

**Prior treatment on tooth:** MOD composite, recent placement (~2 years per patient)

**Expected output:** HIGH confidence narrative. Cites pulpal + periapical diagnoses, cold test result, percussion finding, PA reference, restorability statement.

---

## Sample 2 — Retreatment with strong failure evidence

**Procedure:** D3348 — Retreatment of previous root canal therapy, molar
**Tooth:** #14
**DOS:** scheduled, [date]
**Carrier:** Cigna DPPO

**Pulpal diagnosis:** Previously treated
**Periapical diagnosis:** Asymptomatic apical periodontitis

**Diagnostic test results:**
> Percussion: mildly positive on #14. Palpation: WNL. Periodontal probing: WNL. Cold/EPT: N/A (previously treated).

**Imaging available:** PA #14 dated [DOS-14] showing 4mm periapical radiolucency at MB root, expanded from prior PA dated [DOS-3 years] showing 2mm radiolucency. CBCT dated [DOS-7] reveals untreated MB2 canal.

**Restorability:** Restorable. Existing crown intact; access can be made through crown.

**Prior treatment:** Original endo therapy approximately 4 years ago (outside provider). Patient reports intermittent discomfort starting 6 months ago.

**Expected output:** HIGH confidence. Strong failure evidence (expanding lesion + missed MB2 on CBCT). Narrative cites both radiographic progression and CBCT finding.

---

## Sample 3 — Apicoectomy with retreatment-contraindicated reasoning

**Procedure:** D3425 — Apicoectomy, molar (first root)
**Tooth:** #30
**DOS:** scheduled, [date]
**Carrier:** MetLife

**Pulpal diagnosis:** Previously treated
**Periapical diagnosis:** Symptomatic apical periodontitis (chronic)

**Diagnostic test results:**
> Percussion: positive on #30. Palpation: tenderness over distobuccal apex. Patient reports persistent throbbing discomfort over 8 months.

**Imaging available:** PA dated [DOS-7] showing 5mm periapical radiolucency at distal root. CBCT dated [DOS-7] confirms periapical lesion centered on distal root, no evidence of fracture, mental foramen 4mm inferior to surgical site.

**Restorability:** Restorable post-surgical. Existing crown and post-and-core intact.

**Prior treatment:**
- Original endo therapy 6 years ago (outside provider)
- Orthograde retreatment attempted 18 months ago at this practice — persistent symptoms and radiographic pathology
- Cast post and core in place; removal would compromise remaining tooth structure given thin distal wall observed on CBCT

**Expected output:** HIGH confidence. Letter explicitly cites prior retreatment attempt with persistent failure AND post-and-core that cannot be safely removed. CBCT findings on surgical anatomy. Strong narrative.

---

## Sample 4 — D3331 with separated instrument (bundling-prevention narrative)

**Procedure:** D3330 + D3331 — Endodontic therapy, molar + Treatment of root canal obstruction
**Tooth:** #3
**DOS:** scheduled, [date]
**Carrier:** Aetna

**Pulpal diagnosis:** Necrotic pulp
**Periapical diagnosis:** Chronic apical abscess

**Diagnostic test results:**
> Cold test: no response on #3. EPT: no response. Percussion: positive. Palpation: tenderness with sinus tract draining buccal to #3.

**Imaging available:** PA dated [DOS-7] showing 3mm periapical radiolucency at MB root with separated file fragment in mid-coronal third of MB canal (referred from outside provider after instrument separation during initial access). CBCT dated [DOS-7] confirms file location and periapical lesion.

**Restorability:** Restorable. Tooth has full coverage temporary; will need definitive crown post-RCT.

**Prior treatment:** Patient referred from outside provider after instrument separation during initial endo access ~3 weeks ago. Outside provider placed temporary, prescribed antibiotics, and referred for completion.

**Expected output:** HIGH confidence with strong bundling-prevention language. Narrative explicitly identifies the obstruction (separated file in MB canal mid-coronal third), the additional procedural requirement (ultrasonic removal under microscope), and ADA CDT support for separately reportable D3331.

---

## Sample 5 — Evidence gap (should flag, not generate)

**Procedure:** D3348 — Retreatment of previous root canal therapy, molar
**Tooth:** #18
**DOS:** scheduled, [date]
**Carrier:** Guardian

**Pulpal diagnosis:** Previously treated
**Periapical diagnosis:** [NOT PROVIDED in input]

**Diagnostic test results:** [NONE PROVIDED in input — only patient symptoms reported: "patient says it hurts"]

**Imaging available:** PA dated [DOS-30]

**Restorability:** [NOT ASSESSED]

**Prior treatment:** Patient reports prior endo "a long time ago" — no specific date or evidence of failure documented in chart.

**Expected output:** Evidence gap flagged. Skill should NOT generate the narrative — should return gap list:
- Missing periapical diagnosis (required for D3348)
- Missing diagnostic test results (need percussion, palpation at minimum)
- Missing failure-of-prior-treatment evidence (most critical for retreatment denials — radiographic comparison or CBCT findings needed)
- Missing restorability assessment
- Recommend chart review before submission

This is the expected behavior — a low-quality input should produce a "stop, please document more" response, NOT a fabricated narrative.

---

## Testing Protocol

For each sample:

1. Run the skill with the input
2. Capture the output (narrative, confidence, evidence gaps)
3. Score on:
   - **Accuracy** — Does it match the clinical findings? (no fabrication)
   - **Compliance** — Does it follow the carrier-specific guidance?
   - **Quality** — Is it tight, professional, evidence-led?
   - **Usability** — Would the office manager paste it directly, or need to edit it?
4. Refine the skill file based on observed gaps
5. Re-run all 5 samples to confirm refinements didn't regress earlier cases

**Pass criteria:** 4 of 5 samples produce HIGH-confidence narratives requiring no substantive edits, AND Sample 5 correctly flags evidence gaps without generating a narrative.

Once pass criteria met → graduate to live testing on real (de-identified) cases from mom's practice.
