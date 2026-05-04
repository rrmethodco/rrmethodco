# Skill: Claim Appeal Letter Generator

## Purpose

Generate a formal, evidence-based appeal letter responding to a denied dental insurance claim. Designed for use by the office manager / billing coordinator at a Denticon-using general dental practice.

## When to Use

Run this skill any time an EOB returns with a denial that the practice believes is recoverable. Common GP-practice denials this skill handles:

| Denial type | Typical EOB language | Recoverability |
|-------------|---------------------|----------------|
| Not medically necessary | "Service not deemed necessary" | HIGH |
| Frequency limitation | "Service exceeds frequency" | MEDIUM (often legitimate) |
| Alternate benefit (downgrade) | "Benefit calculated at alternate procedure" | HIGH |
| Missing tooth clause | "Tooth missing prior to coverage" | LOW unless documentation exists |
| Coordination of benefits | "Primary carrier information needed" | HIGH (often paperwork-only) |
| Bundling | "Procedure included in another service" | HIGH |
| Pre-authorization required | "Pre-auth not on file" | MEDIUM (depends on contract) |
| Insufficient documentation | "Additional documentation required" | HIGH |

## Inputs (collected from user)

1. **Original claim details** — CDT code(s), tooth #, date of service, billed amount
2. **Denial details** — denial code from EOB, exact denial reason text, paid amount (if any)
3. **Carrier** — selected from the practice's top-6 list
4. **Original clinical evidence** — clinical notes, radiograph findings, perio chart values that supported the original claim
5. **Patient coverage details** — plan effective date, deductible status (relevant for missing tooth clause and frequency cases)

## Process

### Step 1 — Classify the denial
Match the EOB language to one of the 8 denial types above. If unclassifiable, flag and request user input.

### Step 2 — Recoverability assessment
Run the denial through the recoverability matrix in `reference/denial_playbook.md`:
- **DO NOT APPEAL:** legitimate frequency limit (patient genuinely had cleaning 2 months ago), missing tooth clause with no pre-coverage documentation, contractual exclusion. Tell user honestly — appealing these wastes time and damages credibility with the carrier.
- **APPEAL WITH STRONG EVIDENCE:** classify confidence as HIGH and proceed.
- **APPEAL WITH CAVEATS:** classify as MEDIUM, generate the letter but flag specific weaknesses.

### Step 3 — Pull the denial-type framework
Each denial type has a different rebuttal structure (in `templates/`). For example:
- **Medical necessity denials** → lead with clinical evidence and code-specific justification
- **Alternate benefit denials** → cite why the actual procedure performed was clinically required (e.g., composite for posterior tooth on a patient with metal allergy or for structural reasons)
- **Bundling denials** → cite the CDT descriptors showing the procedures are distinct
- **Frequency denials** → cite medical exception language (e.g., D4910 perio maintenance more frequent than 2x/year if patient is in active perio therapy with documented pocket depths)

### Step 4 — Build the letter
Standard structure (4 paragraphs):

1. **Reference & request** — Patient ID (de-identified to placeholder for draft, re-attached at final assembly), date of service, claim #, denial code. State explicitly: "We respectfully request reconsideration of this denial."
2. **Denial summary & reason for disagreement** — Restate the denial reason in one sentence, then state why we disagree, in one sentence.
3. **Clinical evidence** — The body. Walk through the clinical findings, diagnostic evidence, and why the procedure was medically necessary as performed. Reference specific dates, measurements, radiograph findings.
4. **Request for action & escalation note** — "Please review the attached documentation and reprocess this claim. If denial is upheld, please advise of the peer-to-peer review process and timeline." (This signals you'll escalate; carriers process more carefully when they know.)

### Step 5 — Generate output package

Return:
- The full appeal letter (PDF-ready, 1 page)
- Cover sheet for fax/portal submission
- Attachments checklist (original claim, EOB, clinical notes excerpt, radiographs, perio chart, photos)
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
Denial Code:       [code] — [classification]
Recoverability:    [HIGH/MEDIUM — or DO NOT APPEAL with reason]
═══════════════════════════════════════════════════════

[Full letter, 1 page, ready for letterhead]

═══════════════════════════════════════════════════════
ATTACHMENTS CHECKLIST:
- [ ] Copy of original EOB
- [ ] Copy of original claim form
- [ ] Clinical notes (de-identified excerpt) for DOS [date]
- [ ] [Specific radiographs / perio chart / photos]
- [ ] [Other carrier-specific items]

ESCALATION PATH:
1. Submit appeal via [carrier-specific channel]
2. Expected response timeline: [X business days]
3. If denied again: request peer-to-peer review (clinical reviewer to clinical reviewer)
4. Final escalation: [state] Department of Insurance complaint — [contact info]
═══════════════════════════════════════════════════════
```

## Edge Case Handling

- **Multiple denial codes on one claim:** address each separately within the letter, organized by recoverability priority.
- **Partial payment denial:** explicitly reference the paid amount and what's still being contested.
- **Repeat denial (we've already appealed once):** escalate framing to peer-to-peer request rather than re-appeal. Different letter template in `templates/peer_to_peer_request.md`.
- **Patient-pay-in-full situation:** explain to user this is for the patient's records / state complaint, not a recovery from the carrier.
- **Carrier requires their own appeal form:** generate the narrative content but flag that user must transcribe to carrier-specific form (Delta and a few others).
- **Time-barred denial:** check carrier's appeal window (typically 90-180 days from EOB date). If past window, refuse to generate appeal — recommend writing it off and tracking pattern instead.

## Quality Checks (run before returning output)

1. Does the letter reference the specific claim #, DOS, and denial code?
2. Does it directly address the carrier's stated reason for denial (not a generic appeal)?
3. Does it cite at least one specific clinical evidence item?
4. Is it ≤1 page when formatted on standard letterhead?
5. Is the tone professional and free of frustration / accusation?
6. Is patient PHI properly placeholdered for the draft?
7. Is the requested action explicit ("please reprocess and remit")?

## Error Recovery

- **Missing original claim details:** request from user; do not invent claim numbers or dates.
- **EOB language unclear:** ask user to paste the exact denial text.
- **No clinical evidence available to support original claim:** halt. The honest answer is that this denial isn't appealable without documentation. Flag the documentation gap as a process improvement for the practice (this becomes its own value-add).
- **User wants to appeal a legitimately deniable claim** (e.g., genuinely too-frequent prophy): explain professionally, do not generate. Trust > one-time win.

## Success Metrics (track per use)

- Time to generate (target: <2 minutes)
- Appeal success rate at 60 days post-submission (target: ≥70%, baseline ~40-50%)
- Recovered revenue per month (the killer KPI for the case study)
- Avoided wasted appeals (denials we correctly identified as DO NOT APPEAL — saves staff time and carrier credibility)
