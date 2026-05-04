# Endodontic Practice Automation Toolkit

> An autonomous AI agent platform for endodontic practices. Three high-volume workflows automated end-to-end: insurance pre-authorizations, claim appeals, and referral letters. Designed first for a 4-endodontist group practice on PBS Endo (mom's practice), with a productization path to the broader US endodontic market (~5,500 practices).

## Why Endodontics

- **Concentrated workflow:** ~20 CDT codes vs. 100+ for GPs. Agent gets dramatically smarter per code with focused repetition.
- **Concentrated PMS market:** PBS Endo, TDO, and Endovision dominate ~80% of practices. Three integrations vs. eight for GP.
- **Tight specialist community:** ~5,500 endodontists nationally — small enough for word-of-mouth dominance via the AAE, study clubs, and residency networks.
- **High per-procedure values:** retreatment $1,000-$1,500, apicoectomy $1,200-$2,000, CBCT $300-$400. Insurance denials hurt more in absolute dollars, making AI ROI more obvious.
- **Three high-volume workflows in one practice:** pre-auths, appeals, AND referral letters — a single deployment hits 100+ events per week.

## What's In Here

```
dental-insurance-toolkit/
├── README.md                              ← you are here
│
├── context/
│   └── practice_context.md                ← shared context: 4-endo group, PBS Endo, endo codes, voice, HIPAA
│
├── skills/
│   ├── pre_auth_narrative.md              ← skill 1: pre-auth narratives (15-25/week)
│   ├── claim_appeal_letter.md             ← skill 2: appeal letters (8-15/week)
│   └── referral_letter.md                 ← skill 3: referral letters (80-160/week — highest volume)
│
├── reference/
│   ├── cdt_narrative_requirements.md      ← per-endo-code evidence requirements
│   ├── carrier_intelligence.md            ← carrier-specific endo denial patterns
│   └── denial_playbook.md                 ← endo denial classification + rebuttal frameworks
│
├── samples/
│   ├── sample_pre_auth_inputs.md          ← 5 de-identified test cases
│   ├── sample_appeal_inputs.md            ← 5 de-identified test cases
│   └── sample_referral_inputs.md          ← 5 de-identified test cases (one per letter type)
│
└── templates/
    ├── discovery_interview.md             ← 60-90 min script for mom + office manager
    └── measurement_tracker.md             ← baseline + ongoing case-study capture
```

## Pilot Setup (Confirmed)

Mom's practice — confirmed via discovery questions:

| Factor | Status | Implication |
|--------|--------|-------------|
| Mom's role | **Owner, full authorization, on board** | No procurement cycle. Decisions made in working sessions. |
| Practice size | **4 endodontist group** | Significant volume (~100+ events/week). Multi-doc voice variation built in from day 1. |
| Billing model | **In-house** | Buyer is mom + office manager, no outsourced billing service to displace |
| Mom's engagement | **Full participant** | Real-time clinical validation, voice authenticity, and downstream AAE network access |

This is the best-case design partner profile. Most AI startups would pay $100K+ for it.

## Build Plan: Three-Phase

### Phase 1 — Knowledge Layer (Weeks 1-2)

**Output:** All three skills validated against 15 sample cases (5 each), tuned to mom's voice and her practice's top 6 carriers. Mom confirms output quality.

**Mom's time:** ~4 hours total — discovery interview (90 min), narrative review session (60 min), sample case validation (60 min), follow-up Q&A (30 min).

**Mode:** Manual (paste inputs into a text interface, get outputs back). No integration yet. Goal: prove the brain works.

### Phase 2 — Productivity Tool Lite (Weeks 3-4)

**Output:** Web app deployed at mom's practice. Office manager logs in, pastes clinical info, gets generated narrative/letter, copies to PBS Endo. Audit logs, basic dashboard, BAA in place.

**What changes:** real users (the office manager + 4 endodontists), real measurement, real testimonial-quality data starts accumulating.

**Why this phase exists:** sellable to other endo practices in parallel. Phase 2 funds Phase 3.

### Phase 3 — Full Agentic System (Weeks 5-12)

**Output:** Autonomous agent that:
- Watches PBS Endo for triggers (new TX plan with pre-auth code, new EOB with denial, treatment completed)
- Pulls clinical data automatically
- De-identifies, processes, generates outputs
- Queues for one-click human approval
- Submits via clearinghouse / uploads to Document Center
- Tracks lifecycle from submission → approval/denial → appeal → resolution
- Learns carrier patterns over time across customer base

**What we need to build:**
- Backend service (Python/Node)
- PBS Endo integration (API if available, RPA or scheduled exports as fallback — confirm with PBS Endo support during Phase 1)
- eClaims clearinghouse integration (whichever mom's practice uses — confirm during discovery)
- Web dashboard (review queue + KPIs)
- Multi-tenancy from day 1 (one tenant initially, but designed for N)
- HIPAA-compliant infrastructure with BAAs across the stack

## V1 Architecture (target for end of Phase 3)

```
┌─────────────────────────────────────────────────────────────┐
│  TRIGGERS                                                    │
│  • PBS Endo poller: new TX plan w/ pre-auth code            │
│  • PBS Endo poller: new EOB with denial code                │
│  • PBS Endo poller: treatment completed (referral letter)   │
│  • Schedule: daily morning sweep for missed items           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│  ORCHESTRATOR AGENT (Claude)                                 │
│  • Classifies the trigger                                   │
│  • Pulls relevant clinical data                             │
│  • De-identifies before processing                          │
│  • Routes to correct sub-skill                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Pre-Auth │   │ Appeal   │   │ Referral │
│ Skill    │   │ Skill    │   │ Letter   │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┴──────────────┘
                    ▼
┌──────────────────────────────────────────────────────────────┐
│  REVIEW QUEUE (web dashboard for office manager)             │
│  • Generated output + confidence rating                      │
│  • Source clinical evidence cited                            │
│  • One-click: APPROVE & SEND  /  EDIT  /  REJECT             │
│  • LOW confidence auto-flagged for endodontist review        │
└──────────────────────┬───────────────────────────────────────┘
                       │ on approval
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  SUBMISSION AGENT                                            │
│  • Insurance: submits via eClaims clearinghouse              │
│  • Referral: emails / faxes to referring GP                  │
│  • All: uploads to PBS Endo Document Center                  │
│  • Logs submission ID, timestamp, recipient                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  LIFECYCLE TRACKER                                           │
│  • Watches for response EOB / GP feedback                    │
│  • Insurance approved → log win, update carrier intelligence │
│  • Insurance denied → trigger appeal flow                    │
│  • Reports: weekly KPIs auto-generated for mom               │
└──────────────────────────────────────────────────────────────┘
```

## HIPAA Setup (DO BEFORE TOUCHING PHI)

1. **BAA with Anthropic** — Use Claude API with a signed Business Associate Agreement (Enterprise / Claude for Work tier). Without this, no PHI may be processed.
2. **Local de-identification step** — Strip patient name, DOB, ID#, full address, contact info before sending any clinical data to Claude. Re-attach identifiers locally during final document assembly only.
3. **Practice-side BAA** — Sign a BAA with mom's practice. Her HIPAA officer signs off.
4. **Audit logging** — Every generation produces a record: timestamp, user, inputs (de-identified), output, confidence rating. Stored on practice infrastructure.
5. **No PHI in non-BAA tools** — No Gmail, no Slack, no consumer cloud storage without separate BAA confirmation. AWS / GCP both offer BAAs; Vercel does not.

## Pricing (target — refine post-pilot)

### Insurance Recovery + Communications System (full package)

**Build:** $7,500-$15,000 one-time (per practice, depending on integration complexity)
**Maintenance:** $1,000-$2,000/month (refines skills, adds carriers/codes, monitors performance)

**ROI math (target for 4-endo group):**
- Time saved: 15+ hrs/week × $50/hr fully-loaded = $750/week = $36K/year
- Pre-auth approval lift: 75% → 90% × 20/wk × $1,200 avg = $3,600/week = $187K/year
- Appeal recovery: $5,000-$10,000/month additional = $60K-$120K/year
- Referral letter compliance lift: long-term referral growth → compounding revenue
- **Total annual value: $250K-$350K+**
- **Payback: <1 month**

### Target client profile (post-mom)

- Endodontic specialty practice
- 1-6 endodontists
- $1.5M+ annual production
- Uses PBS Endo, TDO, or Endovision
- 50%+ PPO mix
- Office manager who is competent and cooperative

### Where to find them (after mom's case study)

1. **Mom's network** — AAE colleagues, residency classmates, dental school program contacts, study club. Highest-velocity channel.
2. **AAE annual meeting** — every endodontist in the country shows up. Booth + sponsored content.
3. **Endo-specific online communities** — AAE Connect, Roots Summit attendees, Endodontic Practice US subscribers.
4. **PBS Endo / TDO partnerships** — once we have integration, the PMS vendors themselves are a distribution channel.
5. **State endodontic society meetings** — every state has one; small, tight communities.

### The hook (use mom's metrics)

> "I built an autonomous AI system for a 4-endodontist group on PBS Endo. They recovered $X,XXX in their first month, cut their office manager's insurance and letter-writing time from N hours to Y hours per week, and started getting referrals back from GPs faster than ever. Open to a 15-minute call to see if this would work for your practice?"

## Roadmap

### Phase 1 (Weeks 1-2): Knowledge layer
- ✅ Toolkit drafted (this directory)
- ⏭ Run discovery interview with mom + office manager
- ⏭ Validate all 15 sample cases against mom's voice
- ⏭ Tune carrier intelligence to her actual top 6 carriers

### Phase 2 (Weeks 3-4): Productivity tool lite
- ⏭ Build Next.js + Supabase web app with three skill interfaces
- ⏭ Sign BAAs (Anthropic + Supabase + practice)
- ⏭ Deploy at mom's practice with audit logging
- ⏭ Train office manager + 4 endodontists
- ⏭ Begin live measurement (vs. baseline week)

### Phase 3 (Weeks 5-12): Full agentic system
- ⏭ Confirm PBS Endo integration approach (API / RPA / exports)
- ⏭ Confirm clearinghouse integration target
- ⏭ Build orchestrator agent + sub-skill routing
- ⏭ Build trigger watchers
- ⏭ Build submission agent
- ⏭ Build lifecycle tracker
- ⏭ Deploy autonomous version at mom's practice
- ⏭ 60-day measurement → case study

### Beyond V1
- ⏭ Productize: per-carrier-pack library covering top 30 dental carriers
- ⏭ Expand: TDO and Endovision integrations
- ⏭ Adjacent: 6-month/1-year recall scheduler, post-op communication automation
- ⏭ Scale: 10 paying endo practices = $300K+ ARR

## What's Next Right Now

1. **Schedule the discovery interview** with mom + her office manager (use `templates/discovery_interview.md`). Block 90 min, in person if possible.
2. **Sign the BAA with Anthropic** (Claude for Work / Enterprise tier).
3. **Run the baseline measurement week** (use `templates/measurement_tracker.md`) before deploying anything. Without "before" numbers, the "after" numbers are just claims.

When mom signals green light on the build path, the next deliverable is the Phase 2 web app architecture + repo scaffolding.
