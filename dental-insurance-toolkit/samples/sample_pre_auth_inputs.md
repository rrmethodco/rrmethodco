# Sample Pre-Auth Inputs (for testing)

> 5 fully de-identified sample cases for testing the `pre_auth_narrative.md` skill. All patient identifiers are placeholders. Replace with real (de-identified) cases from the practice during refinement.

---

## Sample 1 — Crown on fractured molar (clean case)

**Procedure:** D2740 — Crown, porcelain/ceramic
**Tooth:** #19
**DOS:** scheduled, [date]
**Carrier:** Delta Dental PPO

**Clinical findings (pasted from chart, de-identified):**
> 35yo patient presents for evaluation of #19 following lingering cold sensitivity x 2 weeks. Clinical exam reveals visible mesiodistal craze line on occlusal surface of #19. Bite-stick testing on mesiolingual cusp reproduces patient symptoms. Tooth has existing MOD amalgam restoration covering approximately 60% of coronal surface, placed >10 years ago per patient. Cold test +/normal, percussion negative, palpation negative, periodontal probing WNL.

**Diagnostic evidence:** PA radiograph of #19 dated [DOS-7], BWX dated [DOS-7]
**Prior treatment on tooth:** MOD amalgam, date unknown, >10 years per patient

**Expected output:** HIGH confidence narrative; references craze line, bite-stick reproduction, large existing restoration, prognosis of cuspal fracture without crown coverage.

---

## Sample 2 — Crown with evidence gap (should flag)

**Procedure:** D2740 — Crown, porcelain/ceramic
**Tooth:** #14
**DOS:** scheduled, [date]
**Carrier:** Cigna DPPO

**Clinical findings:**
> Patient requests crown on #14 due to old filling. Tooth is asymptomatic. DO composite present.

**Diagnostic evidence:** PA radiograph dated [DOS-30]
**Prior treatment on tooth:** DO composite, date unknown

**Expected output:** Evidence gap flagged. Missing: extent of structural compromise, fracture documentation, justification for crown over replacement composite. Skill should NOT generate the narrative — should return gap list with guidance: "Document remaining tooth structure %, presence/absence of fracture or craze line, prior endo or post status, occlusal load considerations."

---

## Sample 3 — Buildup + crown on endo-treated tooth

**Procedures:** D2950 + D2740
**Tooth:** #30
**DOS:** scheduled, [date]
**Carrier:** MetLife

**Clinical findings:**
> Patient presents for definitive restoration of #30 following completion of endodontic therapy on [DOS-21]. Access opening sealed with temporary restoration. Clinical exam: less than 40% of coronal tooth structure remains following caries excavation and access preparation. Walls intact on M, L, D; B wall absent. Tooth restorable with buildup and crown coverage.

**Diagnostic evidence:** Post-endo PA dated [DOS-21], pre-treatment PA dated [DOS-45]
**Prior treatment on tooth:** Endo therapy [DOS-21]; multi-surface amalgam, history of recurrent decay

**Expected output:** Single narrative covering both procedures. Justifies buildup as separate from crown (insufficient retentive structure for crown alone). References post-endo restorability, missing buccal wall, structural compromise. Notes attached: post-endo PA, pre-treatment PA.

---

## Sample 4 — Periodontal SRP, 4 teeth UR quadrant

**Procedure:** D4341 — Periodontal scaling and root planing, 4+ teeth UR quadrant
**Quadrant:** Upper Right (teeth #2, #3, #4, #5)
**DOS:** scheduled, [date]
**Carrier:** Aetna

**Clinical findings:**
> Patient presents for periodontal evaluation. Periodontal charting reveals: #2: 5,6,4 / 5,6,5; #3: 5,6,5 / 5,7,5; #4: 4,5,4 / 4,5,4; #5: 5,5,4 / 4,5,4. BOP +at all sites listed. Generalized moderate plaque and supragingival calculus, heavy subgingival calculus on facial and lingual aspects of #2 and #3. BWX [DOS-14] demonstrates horizontal bone loss approximately 20-30% of root length on #2-#5. Patient reports no prior periodontal treatment. Diagnosis: Generalized periodontitis, Stage II, Grade B.

**Diagnostic evidence:** Periodontal chart dated [DOS-7], BWX series dated [DOS-14]
**Prior treatment on quadrant:** None

**Expected output:** HIGH confidence. Strong narrative with pocket depths, BOP, radiographic bone loss, ADA staging, and clear distinction from prophylaxis.

---

## Sample 5 — Occlusal guard, medical necessity

**Procedure:** D9944 — Occlusal guard, hard appliance, full arch
**Arch:** Maxillary
**DOS:** scheduled, [date]
**Carrier:** Guardian

**Clinical findings:**
> Patient reports nocturnal bruxism, witnessed by partner, ongoing >2 years. Clinical exam reveals significant attritional wear on incisal edges of #6-#11 and occlusal cusp tips of #2, #3, #14, #15. Recent fracture of mesial-lingual cusp of #15 attributed to parafunctional load (occurred 3 weeks prior, restored with onlay). Masseter palpation reveals hypertrophy bilaterally with mild tenderness. No TMJ clicking or limited opening noted. Hard appliance indicated for protection of restored dentition and to mitigate risk of further fractures.

**Diagnostic evidence:** Intraoral photos of wear facets [DOS-14], clinical exam findings
**Prior treatment:** Recent restoration of #15 fracture [DOS-21]

**Expected output:** HIGH confidence with medical necessity framing. Cites specific wear evidence, recent attributable fracture, masseter findings. Avoids "patient comfort" language; leads with protection of dentition from documented parafunctional damage.

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

**Pass criteria:** 4 of 5 samples produce HIGH-confidence narratives requiring no substantive edits, AND Sample 2 correctly flags evidence gaps without generating a narrative.

Once pass criteria met → graduate to live testing on real (de-identified) cases from the practice.
