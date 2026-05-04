# Skill: Pre-Authorization Narrative Generator (Endodontics)

## Purpose

Generate a carrier-tuned, code-compliant clinical narrative justifying a proposed endodontic procedure for insurance pre-authorization. Designed for use by the office manager / billing coordinator at a PBS Endo-using endodontic practice.

## When to Use

Run this skill any time an endodontic procedure requires pre-authorization (predetermination) before treatment. Most common triggers in an endodontic practice:

| Code | Procedure | Pre-auth required? |
|------|-----------|--------------------|
| D3310/D3320/D3330 | Endodontic therapy | Often, for some carriers |
| D3331 | Treatment of root canal obstruction | Almost always — high denial rate |
| D3346/D3347/D3348 | Retreatment | **Almost always** — highest denial rate |
| D3410/D3421/D3425 | Apicoectomy | **Almost always** — highest scrutiny |
| D3426 | Apicoectomy, additional root | Yes, bundled with primary |
| D0367 | CBCT imaging | Often denied without strong narrative |
| D9248 | Oral conscious sedation | Often denied — needs medical necessity |

## Inputs (collected from user)

1. **Procedure(s)** — CDT code(s) + tooth number + date of service
2. **Carrier** — selected from the practice's top-6 carrier list in `practice_context.md`
3. **Pulpal diagnosis** — irreversible pulpitis / necrotic pulp / previously treated / previously initiated
4. **Periapical diagnosis** — normal / symptomatic apical periodontitis / asymptomatic apical periodontitis / acute apical abscess / chronic apical abscess
5. **Diagnostic test results** — cold test result, EPT (if performed), percussion, palpation, periodontal probing
6. **Imaging available** — PA(s) with date, BWX with date, CBCT with date, working length film
7. **Restorability assessment** — restorable / questionable / non-restorable (and reasoning)
8. **Prior treatment on tooth** — for retreatment cases: original endo date if known, reason for failure (radiographic evidence of periapical pathology, persistent symptoms, post-and-core failure, recurrent decay)

## Process

### Step 1 — Verify inputs
- Confirm CDT code is one we have a template for (see `reference/cdt_narrative_requirements.md`).
- Confirm tooth number is in valid range (1-32 permanent, A-T primary).
- Confirm pulpal AND periapical diagnoses are both provided (endo-specific requirement).
- If carrier not in top-6 list, default to "generic conservative" template and flag for review.

### Step 2 — Required-evidence checklist
For the given CDT code, look up the required evidence (see `reference/cdt_narrative_requirements.md`). For each required element:
- Mark ✅ if present in clinical findings input
- Mark ❌ if missing → add to "evidence gaps" list

If any ❌ items exist, **do not generate the narrative yet.** Return the gap list to the user with specific guidance on what to add to the chart (e.g., "EPT result required for D3346 retreatment — please add tooth response prior to submission").

### Step 3 — Apply carrier-specific tuning
Each carrier has known preferences (loaded from `reference/carrier_intelligence.md`). Adjust:
- Terminology (e.g., "non-restorable" vs. "previously failed treatment")
- Required elements emphasized first (e.g., Delta wants explicit failure-of-prior-treatment for retreatments; Cigna wants restorability statements front-loaded)
- Format (some carriers want diagnostic findings bulleted; others want prose)

### Step 4 — Generate narrative
Compose 4-7 sentences following this endo-specific structure:

1. **Tooth, presenting complaint, pulpal diagnosis** — "Tooth #[X] presents with [symptom/finding]. Pulpal diagnosis is [diagnosis]."
2. **Periapical diagnosis + diagnostic findings** — "Periapical diagnosis is [diagnosis] based on [test results]."
3. **Imaging evidence** — "Periapical radiograph dated [DOS] demonstrates [specific finding — periapical radiolucency at [size mm], widened PDL, etc.]. CBCT dated [DOS] confirms [finding]." (when applicable)
4. **For retreatment cases — failure of prior endo** — "Tooth was previously treated endodontically on [date]. Evidence of failure includes [persistent periapical pathology / recurrent symptoms / inadequate obturation length / missed canal anatomy seen on CBCT]."
5. **For surgical cases — why surgery over retreatment** — "Surgical intervention is indicated because [retreatment is contraindicated due to post and core/coronal restoration that cannot be removed without compromising tooth structure / patient has had two prior orthograde attempts / iatrogenic factors preclude orthograde access]."
6. **Restorability + prognosis** — "Tooth is restorable following treatment. Prognosis without intervention: [tooth loss within X timeframe due to spreading periapical infection / continued symptoms / functional loss]."
7. **Justification for chosen code** — "[Proposed code] is the standard of endodontic care for this presentation."

### Step 5 — Generate output package
Return:
- The narrative text (ready to paste into PBS Endo eClaims "Remarks" field or attach as separate document)
- A list of attachments to include (which radiographs, CBCT slices, photos)
- A confidence rating: HIGH / MEDIUM / LOW
- Audit record: timestamp, user, code(s), carrier, confidence rating

## Output Format

```
═══════════════════════════════════════════════════════
PRE-AUTHORIZATION NARRATIVE
═══════════════════════════════════════════════════════
Procedure:    [CDT code(s)] — [description]
Tooth:        #[X]
Pulpal Dx:    [diagnosis]
Periapical Dx: [diagnosis]
Carrier:      [carrier name]
Confidence:   [HIGH/MEDIUM/LOW]
═══════════════════════════════════════════════════════

NARRATIVE:
[4-7 sentence narrative, ready to copy/paste]

ATTACHMENTS REQUIRED:
- [ ] Pre-op periapical radiograph #[X], dated [DOS]
- [ ] Working length film (if applicable)
- [ ] CBCT screenshots of [region] (if obtained)
- [ ] [other attachments]

EVIDENCE GAPS (if any):
- [missing element + guidance]

NOTES FOR SUBMITTER:
- [carrier-specific submission tip]
═══════════════════════════════════════════════════════
```

## Edge Case Handling

- **Retreatment with no record of original endo:** require patient or referring GP to provide approximate date and original treating provider. Flag confidence as MEDIUM if approximate. Carriers often want a 5+ year window or documented failure.
- **Apicoectomy after multiple retreatments:** strongest narrative case — list each prior orthograde attempt with dates. Cite that surgical intervention is the next standard-of-care step.
- **D3331 (separated instrument or calcified canal):** carriers often try to bundle into D3310/D3320/D3330. Narrative must explicitly state the obstruction encountered, the additional time/skill required, and that this is a separately reportable procedure per ADA CDT.
- **CBCT (D0367) added to endo case:** must justify medical necessity beyond standard PA imaging — typically: complex anatomy suspected, periapical pathology not visualized on PA, suspected fracture, suspected additional canal, prior treatment failure assessment, surgical planning.
- **Conflicting pulpal/periapical diagnoses** (e.g., notes say "vital pulp" but TX plan is for RCT): halt and request clarification. Never guess.
- **Carrier not in top-6 list:** use generic template, flag for manual review.

## Quality Checks (run before returning output)

1. Does the narrative reference the exact tooth submitted?
2. Does it state BOTH pulpal and periapical diagnoses?
3. Does it cite at least one diagnostic test result?
4. Does it cite at least one imaging finding with date?
5. For retreatment: does it document failure of prior endo?
6. For surgical endo: does it justify why surgery over retreatment?
7. Is it free of forbidden phrases ("comfort," "cosmetic," "patient prefers," "patient wants")?
8. Is it ≤7 sentences?
9. Is all language traceable to the input clinical findings (no fabricated facts)?
10. Is the patient PHI fully stripped from the output?

If any check fails, regenerate. If the same check fails twice, return LOW confidence and explain why.

## Error Recovery

- **Missing required input:** ask the user a single targeted question; do not guess.
- **Ambiguous CDT code:** present 2-3 options and let user pick.
- **Suspected PHI in input:** halt, alert user, request de-identified version. Do not process.
- **Tool failure (e.g., reference file unreadable):** fall back to generic conservative template, flag confidence as LOW, tell user.

## Success Metrics (track per use)

- Time to generate (target: <90 seconds end-to-end)
- User edits before submission (target: <10% of narratives need substantive edits)
- Approval rate at 30 days post-submission (target: ≥85%, baseline ~70-75% for endo)
- Office manager satisfaction (weekly check: 1-5)
