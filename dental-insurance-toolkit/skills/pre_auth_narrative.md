# Skill: Pre-Authorization Narrative Generator

## Purpose

Generate a carrier-tuned, code-compliant clinical narrative justifying a proposed dental procedure for insurance pre-authorization. Designed for use by the office manager / billing coordinator at a Denticon-using general dental practice.

## When to Use

Run this skill any time a procedure requires pre-authorization (predetermination) before treatment. Most common triggers in a GP practice:

- D2740 / D2750 — Crowns
- D2950 / D2954 — Core buildups, posts and cores
- D3310-D3348 — Endodontic therapy and retreatment
- D4341 / D4342 — Periodontal scaling and root planing
- D5110-D5214 — Dentures and partials
- D7210 — Surgical extractions
- D9944 — Occlusal guards (medical necessity)

## Inputs (collected from user)

1. **Procedure(s)** — CDT code(s) + tooth number(s) or quadrant(s) + date of service
2. **Carrier** — selected from the practice's top-6 carrier list in `practice_context.md`
3. **Clinical findings** — pasted from chart notes (de-identified — no patient name, DOB, ID#)
4. **Diagnostic evidence available** — checklist: PA radiograph / BWX / pano / perio chart / intraoral photo / clinical exam findings
5. **Prior treatment on tooth** — if any (date, procedure, outcome)

## Process

### Step 1 — Verify inputs
- Confirm CDT code is one we have a template for (see `reference/cdt_narrative_requirements.md`).
- Confirm tooth number is in valid range (1-32 permanent, A-T primary).
- If carrier not in top-6 list, default to "generic conservative" template and flag for review.

### Step 2 — Required-evidence checklist
For the given CDT code, look up the evidence required (see `reference/cdt_narrative_requirements.md`). For each required element:
- Mark ✅ if present in clinical findings input
- Mark ❌ if missing → add to "evidence gaps" list

If any ❌ items exist, **do not generate the narrative yet.** Return the gap list to the user with specific guidance on what to add to the chart (e.g., "Pocket depths required for D4341 — please re-record perio chart for the affected quadrant").

### Step 3 — Apply carrier-specific tuning
Each carrier has known preferences (loaded from `reference/carrier_intelligence.md`). Adjust:
- Terminology (e.g., "non-restorable" vs. "structurally compromised")
- Required elements emphasized first (e.g., Delta wants extent of decay quantified; Cigna wants explicit fracture documentation)
- Format (some carriers want bulleted clinical findings; others want prose)

### Step 4 — Generate narrative
Compose 3-6 sentences following this structure:

1. **Tooth and finding** — "Tooth #[X] presents with [clinical finding]."
2. **Diagnostic evidence** — "Periapical radiograph dated [DOS] demonstrates [specific finding]. Clinical examination reveals [finding]."
3. **Prior treatment context** (if applicable) — "Tooth was previously restored with [procedure] on [date]; current restoration is [failure mode]."
4. **Prognosis without treatment** — "Without [proposed treatment], tooth is at risk of [specific consequence]."
5. **Justification for chosen code** — "[Proposed code] is indicated because [conservative-alternative-considered-and-rejected reasoning]."

### Step 5 — Generate output package
Return:
- The narrative text (ready to paste into Denticon eClaims "Remarks" field)
- A list of attachments to include (which radiographs, perio chart, photos)
- A confidence rating: HIGH (all evidence present, carrier matches template) / MEDIUM (minor gaps or unfamiliar carrier) / LOW (significant gaps — recommend chart review before submission)
- Audit record: timestamp, user, code(s), carrier, confidence rating

## Output Format

```
═══════════════════════════════════════════════════════
PRE-AUTHORIZATION NARRATIVE
═══════════════════════════════════════════════════════
Procedure:    [CDT code(s)] — [description]
Tooth/Area:   #[X] / [quadrant]
Carrier:      [carrier name]
Confidence:   [HIGH/MEDIUM/LOW]
═══════════════════════════════════════════════════════

NARRATIVE:
[3-6 sentence narrative, ready to copy/paste]

ATTACHMENTS REQUIRED:
- [ ] Periapical radiograph #[X], dated [DOS]
- [ ] [other attachments]

EVIDENCE GAPS (if any):
- [missing element + guidance]

NOTES FOR SUBMITTER:
- [carrier-specific submission tip]
═══════════════════════════════════════════════════════
```

## Edge Case Handling

- **Multiple procedures on same tooth (e.g., D2950 + D2740):** generate one narrative covering both, justifying buildup necessity before crown placement.
- **Replacement crown:** must include date of original restoration and reason for failure. Refuse to generate if either is missing — common denial trigger.
- **Crown on non-symptomatic tooth (cracked tooth syndrome):** require explicit fracture documentation (visible craze line, transillumination finding, or bite-stick positive). Many carriers deny without this.
- **Perio SRP with light bleeding only:** flag as MEDIUM confidence — many carriers require ≥4mm pockets in ≥4 teeth per quadrant for D4341. Suggest verifying pocket depths before submission.
- **Carrier not in top-6 list:** use generic template, flag for manual review by office manager.
- **Conflicting information in clinical notes** (e.g., note says #14 but TX plan says #15): halt and request clarification from user. Never guess.

## Quality Checks (run before returning output)

1. Does the narrative reference the exact tooth/area submitted?
2. Does it cite at least one diagnostic evidence type?
3. Does it state prognosis without treatment?
4. Is it free of forbidden phrases ("comfort," "cosmetic," "patient prefers," "patient wants")?
5. Is it ≤6 sentences?
6. Is all language traceable to the input clinical findings (no fabricated facts)?
7. Is the patient PHI fully stripped from the output?

If any check fails, regenerate. If the same check fails twice, return LOW confidence and explain why.

## Error Recovery

- **Missing required input:** ask the user a single targeted question; do not guess.
- **Ambiguous CDT code:** present 2-3 options ("Did you mean D2740 [crown porcelain/ceramic] or D2750 [crown PFM noble metal]?") and let user pick.
- **Suspected PHI in input:** halt, alert user, request de-identified version. Do not process.
- **Tool failure (e.g., reference file unreadable):** fall back to generic conservative template, flag confidence as LOW, tell user.

## Success Metrics (track per use)

- Time to generate (target: <90 seconds end-to-end)
- User edits before submission (target: <10% of narratives need substantive edits)
- Approval rate at 30 days post-submission (target: ≥85%, baseline ~70%)
- Office manager satisfaction (weekly check: 1-5)
