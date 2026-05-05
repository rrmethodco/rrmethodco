# UX Punch List — Endo Automation prototype

Audited 2026-05-05 against `claude/dental-automation-toolkit-YcfMu`. Screenshots in this same directory (`01-` through `09-`).

Severity legend:
- **CRIT** — would damage the demo with mom; fix before discovery interview
- **HIGH** — visible friction the office manager will hit on day 1
- **MED** — rough edges that erode trust over weeks of daily use
- **LOW** — polish / nice-to-haves

---

## CRIT — fix before mom sees it

### 1. Output narrative gets squeezed to ~180px on `/generate/*` routes
**Where:** [05-preauth-form-generated.png](05-preauth-form-generated.png) — same will affect `/generate/appeal` and `/generate/referral`.
**Root cause:** [components/OutputDisplay.tsx:91](../components/OutputDisplay.tsx) uses `lg:grid-cols-[1fr_280px]` unconditionally. On `/queue` the component has the full content width and the layout works. On `/generate/*` it's nested inside a 50/50 form-vs-output split, so the 280px sidebar consumes most of the column — the narrative wraps to ~10 chars per line.
**Why it matters:** This is THE primary surface. If mom triggers a generation in the demo and sees a narrative wrapped 1-2 words per line, she'll think the prototype is broken.
**Fix:** Add a `layout?: "compact" | "wide"` prop to `OutputDisplay`. Default `wide` (current behavior, 2-col internal). On `/generate/*` pages, pass `compact` → render single column (narrative on top, evidence + attachments below). Or use a container query if you want it self-adapting.

### 2. Mock narratives contain raw `[bracketed]` scaffold annotations
**Where:** [05-preauth-form-generated.png](05-preauth-form-generated.png) — narrative ends with `[Cigna-tuned (anatomical specificity, restorability front-loaded)]` and `[Patient identifiers stripped during processing; will be re-attached locally at final document assembly.]`
**Why it matters:** These are debug/spec annotations rendered straight into the body. Mom will ask "what's that in brackets?" and the answer is "those are TODO notes the system left in the output." Erodes trust in the second she sees them.
**Fix:** Strip from the canned mock output in `lib/mock-api.ts`. The "why this works" insight already has a home in the Notes box below the narrative — promote those bracketed notes there instead, or just drop them.

---

## HIGH — fix this week

### 3. "Approve & submit" destination is only revealed AFTER the click
**Where:** [03-queue-expanded-output-display.png](03-queue-expanded-output-display.png) — button at bottom right.
**Detail:** The post-decision screen ([OutputDisplay.tsx:60-65](../components/OutputDisplay.tsx)) clarifies "Saved to PBS Endo Document Center · Submitted via clearinghouse · Audit log updated" — but only after you click. Pre-click, the office manager doesn't know what `Submit` does.
**Fix:** Add a hover tooltip on the button OR a one-line caption below it: "Submits to clearinghouse + saves to PBS Endo Document Center."

### 4. Rejection captures no reason — kills the training feedback loop
**Where:** [03-queue-expanded-output-display.png](03-queue-expanded-output-display.png) — `Reject` button.
**Why it matters:** During Phase 1 the rejection signal is the most valuable data we get back. Just discarding the output with no reason text means we can't tune the skills against what mom's office manager actually disliked. This is a Phase 1 KPI miss.
**Fix:** Reject opens a small modal: "Why? (a) Wrong diagnosis (b) Missing evidence (c) Wrong tone/voice (d) Carrier mismatch (e) Other [free text]". Reason gets saved on the audit record.

### 5. No "see source inputs" on a queue item
**Where:** [03-queue-expanded-output-display.png](03-queue-expanded-output-display.png).
**Why it matters:** Trust-building phase. The office manager will want to verify what data fed the generation before approving — especially for MEDIUM-confidence items. "Show me what the agent saw."
**Fix:** Add a collapsible "Source inputs" panel below the metadata strip, showing the de-identified clinical fields the agent received.

### 6. "Mom's Practice" is hardcoded in sidebar header
**Where:** every screenshot — sidebar shows `Mom's Practice · 4 endodontists`.
**Detail:** Fine for mom's actual demo (warm), but blocks reuse with any other prospect.
**Fix:** Pull from a single config in `lib/practice.ts` (or env). For mom: replace with her actual practice name. For prospects: one-line edit.

### 7. Next.js dev tools "1 issue" badge in the corner during demo
**Where:** [02-queue-collapsed.png](02-queue-collapsed.png) — red `1 Issue` chip bottom-left.
**Detail:** Caused by 404 on `/favicon.ico`. Dev-only overlay, but it's visible if you demo from `npm run dev`.
**Fix:** (a) add a real favicon at `app/icon.tsx` or `app/favicon.ico` (kills the 404 → kills the badge), (b) demo from `npm run build && npm start` (production overlays disabled).

---

## MED — fix before broader rollout

### 8. Tooth # and Date inputs accept anything
**Where:** [04-preauth-form-empty.png](04-preauth-form-empty.png), [06-appeal-form.png](06-appeal-form.png), [07-referral-form.png](07-referral-form.png).
**Detail:** Tooth `#14` is a free-text field — could receive `14`, `tooth 14`, `#14a`, etc. Dates are also free text (`04/22/2026`).
**Fix:** Tooth → numeric input bounded 1-32 (Universal Numbering System). Date → `<input type="date">`.

### 9. EPT field is a free-text "elevated threshold" placeholder
**Where:** [04-preauth-form-empty.png](04-preauth-form-empty.png).
**Detail:** The web README itself called this out as a UX dial-in question. EPT is a numeric microamp threshold (0-80μA range typical).
**Fix:** Either numeric input with `μA` suffix, or a simplified select: Normal / Heightened / Reduced / No response / Not performed. Ask mom which framing her endodontists prefer in the discovery interview.

### 10. Referring GP has no autocomplete database
**Where:** [07-referral-form.png](07-referral-form.png).
**Detail:** Referrals are 80-160/wk, the highest-volume skill. Office manager retypes "Sunset Family Dentistry" and "Marcus Patel" repeatedly.
**Fix:** Phase 2 = `lib/referring-gps.ts` storing the practice's GP rolodex with autocomplete. Phase 3 = pull from PBS Endo's referral source list directly.

### 11. 4 letter-type cards are vertical-heavy for a one-time choice
**Where:** [07-referral-form.png](07-referral-form.png).
**Detail:** Each card is full-row × 2 rows. For a workflow used 80-160 times/week, these 4 cards eat the top half of the form even though selection takes one click.
**Fix:** Compact to a horizontal segmented control (4 pills across) with cadence as small subtext under the active one.

### 12. Notes section is buried below the narrative
**Where:** [03-queue-expanded-output-display.png](03-queue-expanded-output-display.png) — `Cigna prefers explicit fracture/failure documentation — narrative leads with progression of lesion.`
**Why it matters:** This is the most strategic piece on screen — it tells the office manager *why* the narrative is shaped this way and builds trust in the carrier intelligence layer. Currently a thin info banner under the body.
**Fix:** Promote to a `Carrier insight` callout near the metadata strip, OR pin to the top of the OutputDisplay so it's read before the body.

### 13. No keyboard shortcuts in the queue
**Where:** [02-queue-collapsed.png](02-queue-collapsed.png).
**Detail:** For an agentic V2 workflow used dozens of times per day, mouse-only triage is slow.
**Fix:** J/K to move between items, Enter/Space to expand, A to approve, R to reject, E to edit, ? for help modal.

### 14. "Approve all HIGH-confidence (4)" fires with no confirmation
**Where:** [02-queue-collapsed.png](02-queue-collapsed.png) — top-right green button.
**Detail:** One click submits 4 items. Even with HIGH confidence, that's $2,665 of pre-auths going out with no second look.
**Fix:** Confirmation modal: "Approving 4 items totaling $2,665. Items will submit to clearinghouse + PBS Endo Document Center. Continue?"

---

## LOW — polish

### 15. Dashboard delta indicators don't show baseline date
**Where:** [01-dashboard.png](01-dashboard.png) — `+15.0pp vs. baseline` etc.
**Fix:** Hover tooltip: `Baseline measured week of YYYY-MM-DD, pre-deployment.` Will be a real value once the measurement-tracker baseline week runs.

### 16. Settings "Knowledge layer" footer leaks dev language
**Where:** [09-settings.png](09-settings.png) — bottom panel lists `dental-insurance-toolkit/` directory and `.md` filenames.
**Why it matters:** Tells mom "this is held together with markdown files." Erodes the infrastructure feel.
**Fix:** Hide from the office-manager UI entirely, or rephrase as "Knowledge updates managed by the build team — refreshed continuously."

### 17. Auto-trigger watchers all marked "Phase 3"
**Where:** [09-settings.png](09-settings.png).
**Detail:** Correct for the prototype but reads as "not yet, not yet, not yet, not yet."
**Fix:** Reframe header to "Coming in Phase 3 — autonomous triggers we'll wire up after PBS Endo integration."

### 18. History export button has no format choice
**Where:** [08-history.png](08-history.png) — top-right.
**Fix:** Dropdown: CSV (analyst use) / PDF (compliance officer / audit response).

---

## Things the prototype gets RIGHT (don't lose these)

- **Auto-triggered queue framing** — `5 pending · auto-triggered from PBS Endo events · awaiting approval` immediately conveys the agentic value prop.
- **HIGH-denial-risk warning** on procedure dropdown (D3348, D3331, D9248 etc. show ⚠) — prophylactic and clinically real.
- **Character counter** on appeal/referral textarea (`562 characters · minimum 100 recommended for HIGH confidence`) — strong forcing function, transparent confidence model.
- **Per-skill avg generation time** on dashboard volume cards (`Avg 90 sec per generation`) — concrete time-savings story for the buyer.
- **HIPAA configuration block** on settings — Anthropic BAA / Practice BAA / Local de-identification / Audit logging with status pills. Shows mom we've thought about this.
- **Footer reassurance** on OutputDisplay — `Patient identifiers stripped during processing. Will be re-attached on approval at final document assembly.` Trust signal in the right place.

---

## Audit limitations

- Generated output captured for pre-auth only. Appeal + referral outputs likely share the same squeeze bug (Issue #1) since they use the same `OutputDisplay` component, but I didn't verify visually.
- Edit mode (clicking `Edit` on a narrative) was not exercised.
- Filter toggles on `/queue` (All / Pre-auths / Appeals / Referrals + HIGH-confidence-only) were not exercised.
- Mobile / tablet viewport not audited (1440×900 desktop only).
