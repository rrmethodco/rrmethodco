# Denial Playbook

> Recoverability matrix and rebuttal frameworks per denial type. Used by `claim_appeal_letter.md` Steps 1-3.

---

## Denial Classification Matrix

| Denial Type | EOB Indicators | Recoverability | Default Action |
|-------------|---------------|----------------|----------------|
| Not medically necessary | "Service not deemed necessary," "Lacks medical necessity," CARC 50 | **HIGH** | Appeal with clinical evidence |
| Frequency limitation | "Exceeds frequency," "Service too soon," CARC 119 | **MEDIUM** | Appeal only if exception applies |
| Alternate benefit (downgrade) | "Benefit calculated at alternate procedure," "Downgrade applied," CARC 142 | **HIGH** | Appeal with structural justification |
| Missing tooth clause | "Tooth missing prior to coverage," "Missing tooth provision applies" | **LOW** | Appeal only if pre-coverage documentation exists |
| Coordination of benefits | "Primary carrier information needed," CARC 22 | **HIGH** | Often paperwork-only fix |
| Bundling | "Procedure included in another service," CARC 97 | **HIGH** | Appeal with code distinction |
| Pre-authorization required | "No pre-auth on file," CARC 197 | **MEDIUM** | Depends on contract terms |
| Insufficient documentation | "Additional documentation required," "X-rays required" | **HIGH** | Resubmit with documentation |
| Contractual exclusion | "Service not covered under plan" | **DO NOT APPEAL** | Notify patient; write off or bill |
| Time-barred | EOB date >180 days old (carrier-specific) | **DO NOT APPEAL** | Process improvement only |

---

## Rebuttal Framework: Not Medically Necessary

**Lead with:** clinical evidence and specific code-level justification.

**Letter structure:**
1. Reference claim, denial code, requested action
2. Restate denial reason in one sentence
3. **Clinical evidence paragraph** (bulk of letter):
   - Tooth/area + presenting finding
   - Diagnostic evidence with dates (radiographs, perio chart, photos)
   - Why the procedure performed was the standard of care
   - What would happen if procedure had not been performed
4. Request reconsideration; cite peer-to-peer availability

**Key phrases that work:**
- "Standard of care for this presentation"
- "Failure to treat would have resulted in [specific consequence]"
- "Diagnostic findings as documented support medical necessity"

**Key phrases to avoid:**
- "Patient wanted this done"
- "We always do this for these cases"
- "This is how we've always billed it"

---

## Rebuttal Framework: Alternate Benefit (Downgrade)

Most common in: posterior composites downgraded to amalgam (D2391/D2392/D2393/D2394 → D2140/D2150/D2160/D2161).

**Lead with:** clinical reason composite was specifically required.

**Valid clinical justifications:**
- Patient documented metal allergy
- Tooth structure insufficient to retain amalgam (would require pin retention; less conservative than bonded composite)
- Adjacent restoration is composite (mixed-metal galvanic concern)
- Cusp involvement requiring bonded preparation
- Esthetic visibility (anterior or premolar with smile-line involvement)

**Letter structure:**
1. Reference claim, denial code
2. Acknowledge alternate benefit applied; state clinical reason actual procedure was required
3. Cite specific finding from chart
4. Request claim be reprocessed at the procedure performed, not the alternate

---

## Rebuttal Framework: Bundling

Most common: D2950 buildup bundled with D2740 crown.

**Lead with:** ADA CDT distinction between procedures.

**Letter structure:**
1. Reference claim
2. Cite ADA CDT descriptors:
   - D2740: "Crown — porcelain/ceramic. A laboratory-fabricated single tooth restoration covering all coronal surfaces."
   - D2950: "Core buildup, including any pins. Refers to building up of coronal structure when there is insufficient retention for a separate extracoronal restorative procedure."
3. State: "These are distinct procedures. The buildup was required because [specific finding — e.g., 'less than 50% coronal tooth structure remained following caries excavation']."
4. Cite that the ADA CDT manual explicitly identifies these as separately reportable when both are clinically necessary

---

## Rebuttal Framework: Frequency Limitation

**Most common situations:**
- D1110 prophy — patient had cleaning <6 months ago
- D4910 perio maintenance — exceeds 2x/year
- D0210 FMX — taken within 36-60 months of prior
- D2740 crown — replacement <5 years from prior

**Decision tree:**
1. Is there a documented clinical exception? (perio active therapy, trauma, lost prior crown, restorability change)
   - **YES** → appeal with exception documentation
   - **NO** → recommend write-off or patient billing; do not appeal

**When appealing:**
- Cite the carrier's own exception clause (most plans have one for "documented clinical necessity")
- Provide chart evidence of the exception
- Be specific about why this case differs from a routine frequency violation

---

## Rebuttal Framework: Coordination of Benefits (COB)

Often a paperwork issue, not a true denial. Recovery rate >85% with correct submission.

**Letter structure (more of a documentation submission):**
1. Reference claim
2. Provide primary insurance EOB attached
3. Confirm secondary status of denying carrier
4. Request reprocessing as secondary

---

## Rebuttal Framework: Pre-Authorization Required

**Decision tree:**
1. Was pre-auth required by contract for this code?
   - Check carrier provider manual / contract
2. Was the procedure performed urgently / emergently?
   - **YES** → appeal citing emergency exception
   - **NO** → check if retrospective auth is possible (some carriers allow within 30-60 days post-DOS)
3. If neither applies → process improvement opportunity, not appealable

---

## Rebuttal Framework: Insufficient Documentation

Highest recovery rate of all denial types — usually just submit what they asked for.

**Process:**
1. Identify exactly what documentation was requested
2. Pull from chart
3. De-identify and submit with brief cover letter referencing the original claim and the specific request being addressed

Generally a short cover letter, not a full appeal.

---

## When NOT to Appeal (Trust Preservation)

Submitting losing appeals damages your credibility with the carrier and wastes office staff time. Decline to appeal when:

- The denial reflects a legitimate contractual exclusion (e.g., adult orthodontics not covered under plan)
- The frequency limitation has no clinical exception
- The missing tooth clause applies and there's no pre-coverage documentation
- The time window for appeal has passed
- The clinical record genuinely doesn't support the claim as billed

In these cases, the right output is:
1. Honest classification: "DO NOT APPEAL — [specific reason]"
2. Recommended next step: write off, bill patient, or fix process to prevent recurrence
3. (For repeat patterns) flag for the practice as a workflow improvement opportunity

This is its own value-add: the practice stops wasting hours on unwinnable appeals.

---

## Escalation Path (after appeal denial)

1. **Peer-to-peer review** — clinical reviewer to clinical reviewer (the dentist calls the carrier's dental director). Available with most major carriers. Highest recovery rate of any escalation step.
2. **Second-level appeal** — formal written appeal to carrier's appeals committee. Typically requires more substantive new evidence.
3. **State Department of Insurance complaint** — for clear violations of contract terms. State-specific contact info should be in `practice_context.md`. Not a quick path but very effective for systemic carrier issues.
4. **Pattern documentation** — if the same denial pattern recurs, document it for negotiation at the next contract renewal cycle.
