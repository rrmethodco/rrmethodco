# CDT Narrative Evidence Requirements

> Required clinical evidence elements per high-pre-auth-volume CDT code. Used by `pre_auth_narrative.md` Step 2 (required-evidence checklist).

---

## D2740 — Crown, Porcelain/Ceramic

**Required elements:**
- Tooth number
- Extent of structural compromise (one or more of: decay involving ≥2 surfaces + cusp, fracture/craze line documented, prior restoration covering >50% of tooth, post-endodontic)
- Diagnostic radiograph reference (PA or BWX dated)
- Remaining tooth structure description
- Prognosis without crown (e.g., "tooth at risk of cuspal fracture under occlusal load")

**Common denial trigger:** crown on tooth with only moderate decay and no fracture/endo history — must show structural necessity, not just decay.

**Replacement crown additional requirements:**
- Date of original crown placement
- Reason for failure (recurrent decay at margin, fracture, open margin, esthetic failure with documented function loss)
- Most carriers require 5+ years since original placement

---

## D2750 — Crown, Porcelain Fused to High Noble Metal

Same as D2740, plus:
- Justification for material choice (typically posterior tooth with heavy occlusal forces, or patient with documented metal allergy precluding non-noble alternatives)

---

## D2950 — Core Buildup, Including Pins

**Required elements:**
- Tooth number
- Amount of remaining tooth structure (e.g., "less than 50% of coronal tooth structure remains following caries excavation")
- Necessity for retention of subsequent restoration
- Reference to companion crown procedure (D2740/D2750) if applicable

**Common denial trigger:** carriers frequently bundle D2950 into the crown payment, claiming buildup is included. Narrative must explicitly state that the buildup is a separate procedure required for crown retention, not merely filling a small defect.

---

## D3310 / D3320 / D3330 — Endodontic Therapy

**Required elements:**
- Tooth number
- Pulpal diagnosis (irreversible pulpitis, necrotic pulp, previously treated)
- Periapical diagnosis (normal apical tissues, symptomatic apical periodontitis, asymptomatic apical periodontitis, acute apical abscess, chronic apical abscess)
- Diagnostic test results (cold test, percussion, palpation, EPT if performed)
- Periapical radiograph reference, dated
- Restorability assessment (tooth must be restorable post-endo)

---

## D4341 — Periodontal Scaling and Root Planing, 4+ teeth per quadrant

**Required elements:**
- Quadrant designation (UR, UL, LR, LL)
- List of teeth involved (must be ≥4)
- Pocket depths for each involved tooth (must show ≥4mm pockets for most carriers; ≥5mm for stricter carriers like Delta in some states)
- Bleeding on probing status
- Radiographic evidence of bone loss (BWX or PA showing horizontal or vertical bone loss)
- Periodontal diagnosis (ADA staging if available — Stage I-IV)

**Common denial trigger:** insufficient pocket depths documented. Some carriers also require radiographs taken within 12 months.

---

## D4342 — Periodontal Scaling and Root Planing, 1-3 teeth per quadrant

Same as D4341 but for limited involvement. Often denied if carrier deems prophy (D1110) more appropriate. Narrative must distinguish: "Patient presents with localized periodontitis at teeth #X, #Y with [pocket depths] and bone loss; D1110 prophylaxis is insufficient because [specific reason]."

---

## D4910 — Periodontal Maintenance

**Required elements:**
- Date of completion of active periodontal therapy (D4341/D4342/D4260/D4261)
- Current periodontal status (pocket depths maintained or improved)
- Frequency justification if more than 2x/year (typical carrier maximum)

**Common denial trigger:** carriers default to allowing 2x/year and downgrading additional visits to D1110. Narrative for 3-4x/year must cite ongoing pocket depth concerns or systemic risk factors (diabetes, smoking, immunocompromise) requiring closer monitoring.

---

## D5110 / D5120 — Complete Denture (Maxillary / Mandibular)

**Required elements:**
- Edentulous status documentation
- Date of last extraction (must be sufficient healing time, typically 6-12 weeks for conventional, immediate dentures handled separately)
- Prior denture history (if replacement: date of prior, reason for replacement)
- Most carriers require 5-7+ years since last denture for replacement

---

## D7140 / D7210 — Extractions

**Required elements:**
- Tooth number
- Reason for extraction (non-restorable caries, advanced perio with hopeless prognosis, fracture, orthodontic, supernumerary)
- Diagnostic radiograph reference
- For D7210 specifically: documentation that bone removal or sectioning was required (not just a difficult forceps extraction)

**Common denial trigger:** D7210 downgraded to D7140. Narrative must explicitly state bone removal or tooth sectioning was performed.

---

## D9944 — Occlusal Guard, Hard Appliance, Full Arch

**Required elements:**
- Diagnosis (bruxism, clenching, TMD with parafunctional habit, post-orthodontic retention is NOT covered)
- Clinical evidence (wear facets documented on specific teeth, masseter hypertrophy, patient-reported nocturnal grinding, fractured restorations attributable to parafunction)
- Why a hard appliance specifically is indicated (vs. soft guard)
- Statement of medical necessity (protection of dentition from documented parafunctional damage)

**Common denial trigger:** classified as "non-covered preventive" by many carriers. When covered, requires explicit medical necessity language — never use "patient grinds at night" alone.

---

## Format for Adding New Codes

When adding new CDT codes to this reference:

```markdown
## D[CODE] — [Description]

**Required elements:**
- [Element 1]
- [Element 2]
- ...

**Common denial trigger:** [What carriers typically push back on, and how to preempt it]

**[Special situation, if applicable] additional requirements:**
- [Additional elements]
```
