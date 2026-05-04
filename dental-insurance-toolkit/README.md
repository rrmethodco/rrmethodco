# Dental Insurance Recovery Toolkit

> Two AI-powered automations for general dental practices using Denticon: pre-authorization narrative generation and claim appeal letter drafting. Designed as a sellable productized service for the GP-dentist niche.

## What This Is

A complete starter kit for building, testing, and selling an "Insurance Recovery System" to general dental practices. Pilot designed for a GP practice on Denticon; transferable to Dentrix, Eaglesoft, Open Dental, and Curve with minor context adjustments.

## What's In Here

```
dental-insurance-toolkit/
├── README.md                              ← you are here
│
├── context/
│   └── practice_context.md                ← shared context: practice profile, carrier mix, codes, voice, HIPAA posture
│
├── skills/
│   ├── pre_auth_narrative.md              ← skill: generate pre-auth narratives
│   └── claim_appeal_letter.md             ← skill: generate appeal letters
│
├── reference/
│   ├── cdt_narrative_requirements.md      ← per-CDT-code evidence requirements
│   ├── carrier_intelligence.md            ← carrier-specific narrative preferences and denial patterns
│   └── denial_playbook.md                 ← denial classification + rebuttal frameworks
│
├── samples/
│   ├── sample_pre_auth_inputs.md          ← 5 de-identified test cases for pre-auth skill
│   └── sample_appeal_inputs.md            ← 5 de-identified test cases for appeal skill
│
└── templates/
    ├── discovery_interview.md             ← 60-90 min client discovery script
    └── measurement_tracker.md             ← baseline + ongoing metrics for case study
```

## Build Order (2-Week Sprint)

### Week 1 — Foundation

| Day | Task |
|-----|------|
| 1 | Run `templates/discovery_interview.md` with dad + office manager. Collect 10 sample pre-auths + 10 sample EOBs, top 6 carriers, top 30 CDT codes used. |
| 2 | Fill in `context/practice_context.md` with real data. Update `reference/carrier_intelligence.md` with practice-specific patterns. |
| 3 | Run baseline week: track every pre-auth and appeal with current process. Capture in `templates/measurement_tracker.md`. |
| 4-5 | Build & test pre-auth skill against the 5 cases in `samples/sample_pre_auth_inputs.md`. Refine until 4/5 pass. |

### Week 2 — Iteration & Live Test

| Day | Task |
|-----|------|
| 6-7 | Build & test appeal skill against 5 cases in `samples/sample_appeal_inputs.md`. Refine until 4/5 pass + Sample 3 correctly flags DO NOT APPEAL. |
| 8-9 | Live pilot: office manager runs both skills on real (de-identified) cases for 2 days. Track friction. |
| 10 | Refinement pass. Lock v1. Schedule 30-day measurement check-in. |

## HIPAA Setup (DO BEFORE TOUCHING PHI)

1. **BAA with Anthropic** — Use Claude API with a signed Business Associate Agreement (Enterprise / Claude for Work tier). Without this, no PHI may be processed.
2. **Local de-identification step** — Strip patient name, DOB, ID#, full address, contact info before sending any clinical data to Claude. Re-attach identifiers locally during final document assembly only.
3. **Practice-side BAA** — You sign a BAA with the practice. Their HIPAA officer signs off.
4. **Audit logging** — Every generation produces a record: timestamp, user, inputs (de-identified), output, confidence rating. Stored locally on practice infrastructure.
5. **No PHI in non-BAA tools** — Do not route through Gmail, Slack, or generic file-sharing without separate BAA confirmation.

## Selling This (after pilot success)

### Package: "Insurance Recovery System"

**Deliverables:**
- 90-min discovery interview
- Customized context file + carrier intelligence for the practice's mix
- Both skills (pre-auth + appeal), tuned to their top 6 carriers
- HIPAA-compliant local deployment + BAA paperwork
- 2-week testing and refinement on real cases
- Office manager training (1 hour)
- Documentation handoff
- 30 days of post-launch support

**Pricing:** $5,000 one-time build + $750/month maintenance (refines skills, adds new carriers, adds new CDT codes as the practice grows)

**ROI math (for the sales conversation):**
- Avg GP practice: 30 pre-auths/week + 10 appeals/week
- Pre-auth time saved: ~10 hrs/week
- Appeal time saved: ~5 hrs/week
- Approval rate lift: 70% → 87% = ~5 additional approvals/week × $800 avg = $4,000/week
- Recovered write-off appeals: typically $2,000-$5,000/month
- **Total monthly value: $15,000-$20,000+**
- Payback period: <1 month

### Target client profile

- General dental practice
- 2+ providers (more = more insurance volume)
- $700K-$2M annual production
- 50%+ PPO mix (FFS practices have less denial pain)
- Office manager who is competent and cooperative (not the bottleneck)

### Where to find them (after dad's case study)

1. Dad's study club / alumni network → warm intros
2. State dental association events
3. Local dental societies (most cities have monthly meetings)
4. Dental practice management Facebook groups (lots of office managers)
5. LinkedIn outreach to "Dental Office Manager" titles in the metro area

### The hook (use dad's metrics)

> "I built an insurance automation system for a GP practice in [state] that recovered $X,XXX in their first month and gave their office manager 12 hours per week back. Open to a 15-minute call to see if something similar would work for your office?"

## What's Next After v1

Once you have 3-5 paying GP clients:

1. **Productize:** the same skills work for any GP practice with minimal customization. Build a "carrier pack" library covering the top 30 dental carriers nationally.
2. **Adjacent skills:** add the third- and fourth-most-painful workflows (treatment plan presentations, recall reactivation campaigns) as expansion sells to existing clients.
3. **Vertical expansion:** specialty practices (perio, endo, OS) have similar but specialty-specific insurance patterns. Same pattern, different code library.
4. **Recurring revenue:** $750/month maintenance × 10 clients = $7,500 MRR. Plus 2 new builds/month at $5K = $17,500/month.

## Notes for Maintainer

- This toolkit is a starting point, not finished software. Every section in `[BRACKETS]` needs to be filled in for the specific practice.
- Update `reference/carrier_intelligence.md` quarterly — carrier behavior changes with policy updates.
- Update `reference/cdt_narrative_requirements.md` annually when ADA publishes new CDT codes.
- Anonymize and reuse the most successful narratives as exemplars in `reference/` over time — this is how the system gets smarter per practice.
