# Skill: Claim Appeal Letter Generator (Endodontics)

## Purpose

Generate a formal, evidence-based appeal letter responding to a denied endodontic insurance claim. Designed for use by the office manager / billing coordinator at a PBS Endo-using endodontic practice.

## When to Use

Run this skill any time an EOB returns with a denial that the practice believes is recoverable. Most common endo-practice denials this skill handles:

| Denial type | Typical EOB language | Recoverability |
|-------------|---------------------|----------------|
| Retreatment not medically necessary | "Original treatment still serviceable" | HIGH (with imaging) |
| Apicoectomy denied — try retreatment first | "Conservative options not exhausted" | MEDIUM-HIGH |
| D3331 bundled into RCT | "Procedure included in primary endodontic therapy" | HIGH |
| CBCT (D0367) denied | "Imaging not medically necessary" | MEDIUM-HIGH |
| Frequency limitation | "Service exceeds frequency" (rare in endo) | MEDIUM |
| Missing tooth clause | "Tooth missing prior to coverage" | LOW (rare in endo since tooth is typically present) |
| Coordination of benefits | "Primary carrier information needed" | HIGH (paperwork-only) |
| Sedation denied | "Conscious sedation not medically necessary" | MEDIUM |
| Buildup bundled | "Buildup included in restorative" | HIGH |
| Insufficient documentation | "X-rays / CBCT / chart notes required" | HIGH |

## Inputs (collected from user)

1. **Original claim details** — CDT code(s), tooth #, date of service, billed amount
2. **Denial details** — denial code from EOB, exact denial reason text, paid amount (if any)
3. **Carrier** — selected from the practice's top-6 list
4. **Original clinical evidence** — pulpal/periapical diagnoses, diagnostic test results, imaging findings, restorability, treatment performed
5. **For retreatment denials** — date of original endo, evidence of failure of prior treatment
6. **For surgical endo denials** — prior orthograde attempts, reasons retreatment was contraindicated
7. **Patient coverage details** — plan effective date (relevant for missing tooth clause edge cases), prior endo benefits used

## Process

### Step 1 — Classify the denial
Match the EOB language to one of the 10 denial types above. If unclassifiable, flag and request user input.

### Step 2 — Recoverability assessment
Run the denial through the endo recoverability matrix in `reference/denial_playbook.md`:
- **DO NOT APPEAL:** legitimate contractual exclusion, time-barred denial, no clinical evidence to support original claim. Tell user honestly — appealing wastes time and damages credibility with the carrier.
- **APPEAL WITH STRONG EVIDENCE:** classify confidence as HIGH and proceed.
- **APPEAL WITH CAVEATS:** classify as MEDIUM, generate the letter but flag specific weaknesses.

### Step 3 — Pull the denial-type framework
Each denial type has a different rebuttal structure:

- **Retreatment denials** → cite specific evidence of prior endo failure: persistent or new periapical pathology, post-treatment symptoms, missed canal anatomy visible on CBCT, inadequate obturation length on prior PA.
- **Apicoectomy denials ("try retreatment first")** → cite why orthograde retreatment is contraindicated: post and core that cannot be removed without compromising tooth structure, two prior orthograde attempts already performed, ledge/perforation/separated instrument that cannot be bypassed, anatomical factors.
- **D3331 bundling denials** → cite ADA CDT distinction; D3331 is for treatment of obstruction (separated instrument removal, ledge bypass, calcified canal negotiation) and is separately reportable. Reference the specific obstruction encountered and the additional time/skill required.
- **CBCT denials** → cite specific clinical question that PA imaging could not answer: suspected vertical root fracture, missed canal anatomy (MB2 in maxillary molars, second mesial canal in mandibular molars), suspected periapical pathology not visualized on PA, surgical planning for apicoectomy, assessment of prior treatment failure.
- **Sedation denials** → cite medical necessity factors: severe anxiety with documented prior failed appointments, complex/long procedure (apicoectomy, retreatment), patient medical history precluding repeat appointments, gag reflex.
- **Buildup denials** → cite CDT distinction: buildup is required for retentive structure when coronal tooth structure is insufficient.

### Step 4 — Build the letter
Standard structure (4 paragraphs):

1. **Reference & request** — Patient ID (de-identified placeholder for draft), date of service, claim #, denial code. State explicitly: "We respectfully request reconsideration of this denial."
2. **Denial summary & reason for disagreement** — Restate the denial reason in one sentence, then state why we disagree, in one sentence.
3. **Clinical evidence** — The body. Walk through pulpal/periapical diagnoses, imaging findings (with dates), why the procedure performed was the standard of endodontic care. For retreatment: explicit failure documentation. For surgical: explicit retreatment-contraindicated reasoning. Reference specific dates, measurements, anatomical findings.
4. **Request for action & escalation note** — "Please review the attached documentation and reprocess this claim. If denial is upheld, please advise of the peer-to-peer review process and timeline." (For endo, peer-to-peer is especially valuable — clinical reviewer at carrier is often a generalist or oral surgeon, not an endodontist; speaking endodontist-to-clinical-director frequently reverses denials.)

### Step 5 — Generate output package

Return:
- The full appeal letter (PDF-ready, 1 page)
- Cover sheet for fax/portal submission
- Attachments checklist (original claim, EOB, pre-op PA, post-op PA, working length film, CBCT screenshots if applicable, chart notes excerpt)
- Escalation path: peer-to-peer eligibility, state insurance commissioner contact (state-specific from `practice_context.md`), timeline expectations
- Audit record

## Output Format

```
═══════════════════════════════════════════════════════
CLAIM APPEAL LETTER
═══════════════════════════════════════════════════════
Carrier:           [carrier name]
Original DOS:      [date]
Claim #:           [claim number]
Procedure:         [CDT] — [description]
Tooth:             #[X]
Denial Code:       [code] — [classification]
Recoverability:    [HIGH/MEDIUM — or DO NOT APPEAL with reason]
═══════════════════════════════════════════════════════

[Full letter, 1 page, ready for letterhead]

═══════════════════════════════════════════════════════
ATTACHMENTS CHECKLIST:
- [ ] Copy of original EOB
- [ ] Copy of original claim form
- [ ] Pre-op periapical radiograph dated [DOS]
- [ ] Working length film dated [DOS] (if applicable)
- [ ] Post-op PA dated [DOS]
- [ ] CBCT screenshots / report (if relevant)
- [ ] Clinical notes excerpt (de-identified)
- [ ] [Other carrier-specific items]

ESCALATION PATH:
1. Submit appeal via [carrier-specific channel]
2. Expected response timeline: [X business days]
3. If denied again: request peer-to-peer review (endodontist to carrier dental director)
4. Final escalation: [state] Department of Insurance complaint — [contact info]
═══════════════════════════════════════════════════════
```

## Edge Case Handling

- **Multiple denial codes on one claim:** address each separately within the letter, organized by recoverability priority.
- **Retreatment denied with no record of original endo:** halt, request that the patient or referring GP supply original treatment date. If unavailable, flag as MEDIUM and proceed with "patient reports prior endodontic treatment approximately [timeframe] ago, with current symptoms and radiographic evidence consistent with treatment failure."
- **Apicoectomy denied because retreatment "should be attempted":** strongest case structure — list specific reasons orthograde retreatment is contraindicated. If those reasons aren't strong, flag as MEDIUM-LOW and recommend peer-to-peer rather than written appeal.
- **Repeat denial (we've already appealed once):** escalate framing to peer-to-peer request. Different letter template in `templates/peer_to_peer_request.md`.
- **Patient-pay-in-full situation:** explain to user this is for the patient's records / state complaint, not a recovery from the carrier.
- **Time-barred denial:** check carrier's appeal window. If past window, refuse to generate appeal — recommend writing it off and tracking pattern.

## Quality Checks (run before returning output)

1. Does the letter reference the specific claim #, DOS, tooth #, and denial code?
2. Does it directly address the carrier's stated reason for denial (not a generic appeal)?
3. Does it cite specific clinical evidence (pulpal/periapical diagnoses, imaging findings with dates)?
4. For retreatment cases: does it document failure of prior treatment?
5. For surgical endo cases: does it justify why surgery over retreatment?
6. Is it ≤1 page when formatted on standard letterhead?
7. Is the tone professional and free of frustration / accusation?
8. Is patient PHI properly placeholdered for the draft?
9. Is the requested action explicit ("please reprocess and remit")?

## Error Recovery

- **Missing original claim details:** request from user; do not invent claim numbers or dates.
- **EOB language unclear:** ask user to paste the exact denial text.
- **No clinical evidence available to support original claim:** halt. Flag the documentation gap as a process improvement (this becomes its own value-add — endodontists with thin chart notes lose appealable revenue).
- **User wants to appeal a legitimately deniable claim:** explain professionally, do not generate. Trust > one-time win.

## Success Metrics (track per use)

- Time to generate (target: <2 minutes)
- Appeal success rate at 60 days post-submission (target: ≥75%, baseline ~50-55% for endo)
- Recovered revenue per month (the killer KPI for the case study — endo retreatment denials are typically $800-$1,500 each, apicoectomy denials $1,200-$2,000+)
- Avoided wasted appeals (denials we correctly identified as DO NOT APPEAL)
