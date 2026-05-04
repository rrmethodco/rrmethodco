# Sample Appeal Inputs (Endodontics — for testing)

> 5 fully de-identified denial scenarios for testing the `claim_appeal_letter.md` skill. Covers the most common endo-practice denial types.

---

## Sample 1 — Retreatment denied as "original treatment serviceable"

**Original claim:** D3348 — Retreatment of previous root canal therapy, molar — tooth #14
**DOS:** [date]
**Billed:** $1,450
**Paid:** $0
**Carrier:** Delta Dental PPO
**Denial code/text:** "Original endodontic treatment determined to be serviceable. Retreatment not medically necessary."

**Original clinical evidence:**
> Pulpal diagnosis: previously treated. Periapical diagnosis: chronic apical abscess. PA #14 dated [DOS-7] demonstrates 5mm periapical radiolucency at MB root, expanded from prior PA dated 3 years ago showing 1mm radiolucency. CBCT dated [DOS-7] confirms periapical lesion AND identifies untreated MB2 canal. Patient reports persistent intermittent swelling over 8 months. Tooth is restorable; existing crown intact, access made through crown.

**Expected output:** HIGH recoverability. Letter cites:
- Radiographic progression (1mm → 5mm)
- Missed MB2 canal on CBCT (the critical finding)
- Persistent symptoms with timeline
- Restorability
Recommend peer-to-peer as escalation if denied.

---

## Sample 2 — Apicoectomy denied as "conservative options not exhausted"

**Original claim:** D3425 — Apicoectomy, molar (first root) — tooth #30
**DOS:** [date]
**Billed:** $1,675
**Paid:** $0
**Carrier:** MetLife
**Denial code/text:** "Conservative options not exhausted. Recommend retreatment prior to surgical intervention."

**Original clinical evidence:**
> Pulpal diagnosis: previously treated. Periapical diagnosis: symptomatic apical periodontitis. Patient has had two prior orthograde retreatments on #30 (dated 2 years ago at this practice, and 4 years ago at outside provider) with persistent radiographic pathology and intermittent symptoms. Cast post and core cementation cannot be safely removed without compromising remaining root structure (thin distal wall on CBCT, ~1mm). CBCT dated [DOS-7] shows periapical lesion centered on distal root, no fracture, mental foramen 5mm inferior to surgical site. Tooth restorable post-surgical.

**Expected output:** HIGH recoverability. Letter cites:
- Two prior orthograde retreatment attempts (specific dates)
- Post-and-core that cannot be safely removed (with CBCT evidence)
- CBCT findings
- Restorability
Strong peer-to-peer recommendation given carrier reviewer is likely a generalist.

---

## Sample 3 — D3331 bundled into D3330

**Original claims:**
- D3330 — Endodontic therapy, molar — tooth #3
- D3331 — Treatment of root canal obstruction — tooth #3, MB canal

**DOS:** [date]
**Billed:** $1,250 (D3330) + $385 (D3331) = $1,635 total
**Paid:** $1,250 (D3330 only; D3331 denied as inclusive)
**Carrier:** Cigna DPPO
**Denial code/text:** "D3331 included in D3330. Procedure considered part of primary endodontic therapy."

**Original clinical evidence:**
> Patient referred from outside provider after instrument separation during initial endo access. Separated file fragment located in mid-coronal third of MB canal of #3 confirmed on PA and CBCT. Removal performed using ultrasonic technique under 16x magnification, approximately 35 minutes additional procedural time. Endodontic therapy then completed on all canals to working length. Pre-op and intra-op films on file documenting separated file location and removal.

**Expected output:** HIGH recoverability. Letter cites ADA CDT distinction between D3330 and D3331, the specific obstruction (separated file in MB canal, mid-coronal third), the additional procedural time and skill required, and references the imaging documentation.

---

## Sample 4 — CBCT (D0367) denied as "not medically necessary"

**Original claim:** D0367 — Cone beam CT, both jaws — for evaluation of #14
**DOS:** [date]
**Billed:** $375
**Paid:** $0
**Carrier:** Aetna
**Denial code/text:** "Imaging not medically necessary. PA imaging adequate for endodontic diagnosis."

**Original clinical evidence:**
> Patient referred for evaluation of tooth #14 with persistent symptoms 18 months post-original endodontic therapy. PA imaging dated [DOS-7] demonstrated periapical radiolucency at MB root but was inconclusive for cause of treatment failure (could not visualize potential missed canal anatomy or fracture). CBCT was indicated to evaluate (1) presence of missed MB2 canal anatomy not visible on PA, (2) differentiation of periapical lesion vs. potential vertical root fracture, and (3) pre-retreatment surgical planning. CBCT findings directly impacted treatment plan: confirmed untreated MB2 canal as cause of failure, ruled out fracture, supported orthograde retreatment over surgical intervention.

**Expected output:** HIGH recoverability. Letter cites the specific clinical questions PA imaging could not answer, references the CBCT findings, and demonstrates direct treatment-planning impact.

---

## Sample 5 — Sedation (D9248) denied without medical necessity

**Original claim:** D9248 — Non-IV conscious sedation
**DOS:** [date]
**Billed:** $295
**Paid:** $0
**Carrier:** UnitedHealthcare Dental
**Denial code/text:** "Conscious sedation not medically necessary for routine procedure."

**Patient context:**
> Patient with documented severe dental anxiety; prior endodontic appointment at outside provider terminated incomplete due to patient inability to tolerate procedure (chart note from referring provider on file). Procedure performed: D3425 apicoectomy on #30, ~95 minutes total chair time. Pre-op evaluation: ASA Class II. Triazolam 0.25mg administered orally 1 hour pre-op. Continuous monitoring (BP, HR, SpO2) throughout procedure. No adverse events.

**Expected output:** MEDIUM-HIGH recoverability. Letter cites:
- Documented severe anxiety with prior failed appointment
- Long/complex procedure (apicoectomy, 95 min)
- Pre-op evaluation, drug/dose, monitoring
- Successful completion attributed to sedation enabling tolerance
Recommend peer-to-peer if initial appeal denied.

---

## Testing Protocol

For each sample:

1. Run the skill with the inputs
2. Capture the output (recoverability classification, letter, attachments checklist)
3. Score on:
   - **Classification accuracy** — Did it correctly identify recoverability?
   - **Letter quality** — Is the rebuttal directly responsive to the denial reason?
   - **Evidence usage** — Does it cite specific findings from the clinical evidence input?
   - **Tone** — Professional, no frustration, requests clear action
   - **Completeness** — Attachments checklist accurate, escalation path included (especially peer-to-peer for endo)
4. Refine and re-run

**Pass criteria:**
- All 5 samples correctly classified
- 4 of 5 letters require no substantive edits
- All letters average ≤1 page when formatted
- Peer-to-peer recommended where appropriate (samples 1, 2, 5)

Once pass criteria met → graduate to live denials at mom's practice.
