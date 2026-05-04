# Sample Appeal Inputs (for testing)

> 5 fully de-identified denial scenarios for testing the `claim_appeal_letter.md` skill. Covers the most common GP-practice denial types.

---

## Sample 1 — Posterior composite downgraded to amalgam

**Original claim:** D2392 — Resin-based composite, two surfaces, posterior — tooth #19, MO
**DOS:** [date]
**Billed:** $245
**Paid:** $145 (alternate benefit at D2150 amalgam rate)
**Carrier:** Cigna DPPO
**Denial code/text:** "Alternate benefit applied — service paid at D2150 rate per plan provisions."

**Original clinical evidence:**
> #19 MO carious lesion. Patient has documented amalgam allergy (reported on medical history; consultation with PCP confirmed mercury sensitivity in 2019). Composite material used was the only clinically appropriate option for this restoration. Adjacent #18 was previously restored with composite; mixed-metal contact contraindicated.

**Expected output:** HIGH recoverability. Letter cites documented metal allergy as clinical reason composite was required, not preference. Requests reprocessing at D2392 rate.

---

## Sample 2 — Buildup bundled with crown

**Original claims:**
- D2950 — Core buildup, including pins — tooth #14
- D2740 — Crown, porcelain/ceramic — tooth #14

**DOS:** [date]
**Billed:** $290 (D2950) + $1,450 (D2740) = $1,740 total
**Paid:** $1,160 (D2740 only; D2950 denied as inclusive)
**Carrier:** Delta Dental PPO
**Denial code/text:** "D2950 included in payment for D2740 — buildup considered part of crown procedure."

**Original clinical evidence:**
> #14 presented with extensive recurrent caries beneath existing MOD amalgam restoration. Following caries excavation, less than 40% of coronal tooth structure remained, with M and D walls absent. Buildup with composite material and 1 pin placed to restore tooth contour and provide retentive structure for crown. Clinical photos and pre-op PA on file demonstrate extent of structural loss.

**Expected output:** HIGH recoverability. Letter cites ADA CDT distinction between D2740 and D2950, references the specific finding (<40% remaining structure), and requests reprocessing of D2950 as a separately reportable procedure.

---

## Sample 3 — Frequency limitation on perio maintenance (legitimately deniable)

**Original claim:** D4910 — Periodontal maintenance — DOS [date]
**Billed:** $135
**Paid:** $0
**Carrier:** MetLife
**Denial code/text:** "Frequency limitation — service exceeds plan maximum of 2 per calendar year."

**Patient context:**
> Patient had D4910 visits on Jan 15, May 20, and current claim is for Sept 12. This is the third visit in calendar year. Patient is not in active periodontal therapy. Last D4341/D4342 was 4 years ago. Current pocket depths within normal limits, no recent active periodontal episode.

**Expected output:** **DO NOT APPEAL** classification. Honest reasoning: legitimate frequency limit, no clinical exception applies. Recommend write-off or patient billing. Flag for practice as scheduling improvement opportunity (limit recall to 2x/year for non-active perio patients to avoid future write-offs).

---

## Sample 4 — Surgical extraction downgraded to simple

**Original claim:** D7210 — Surgical removal of erupted tooth requiring removal of bone
**Tooth:** #17
**DOS:** [date]
**Billed:** $385
**Paid:** $185 (downgraded to D7140)
**Carrier:** UnitedHealthcare Dental
**Denial code/text:** "Service paid at D7140 rate — documentation does not support surgical extraction."

**Original clinical evidence:**
> #17 partially erupted, mesioangular impaction. Mucoperiosteal flap reflected to expose distobuccal bone. Bone removal performed with surgical handpiece to expose distal aspect of crown. Tooth sectioned mesiodistally with surgical handpiece prior to elevation. Crown and root segments delivered separately. Site irrigated, primary closure with 4-0 chromic gut suture x 2.

**Expected output:** HIGH recoverability. Letter explicitly cites the bone removal and tooth sectioning steps that distinguish D7210 from D7140. References the specific operative note language.

---

## Sample 5 — Coordination of benefits paperwork denial

**Original claim:** D1110 — Adult prophylaxis — DOS [date]
**Billed:** $115
**Paid:** $0
**Carrier:** Aetna (secondary)
**Denial code/text:** "Primary insurance information required prior to processing."

**Patient context:**
> Patient has Delta Dental as primary; Aetna as secondary through spouse. Delta paid $92 on the original claim. Primary EOB available.

**Expected output:** HIGH recoverability — paperwork-only fix. Letter is brief; primary attached, secondary status confirmed, request for reprocessing.

---

## Testing Protocol

For each sample:

1. Run the skill with the inputs
2. Capture the output (recoverability classification, letter, attachments checklist)
3. Score on:
   - **Classification accuracy** — Did it correctly identify recoverability? (Sample 3 should be flagged DO NOT APPEAL)
   - **Letter quality** — Is the rebuttal directly responsive to the denial reason?
   - **Evidence usage** — Does it cite specific findings from the clinical evidence input?
   - **Tone** — Professional, no frustration, requests clear action
   - **Completeness** — Attachments checklist accurate, escalation path included
4. Refine and re-run

**Pass criteria:**
- All 5 samples correctly classified (Sample 3 must trigger DO NOT APPEAL)
- 4 of 5 letters require no substantive edits
- Letters average ≤1 page when formatted

Once pass criteria met → graduate to live denials at the practice.
