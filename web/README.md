# Endo Automation — Web Prototype

Clickable Next.js prototype for the Endo Automation system. Designed for UX dial-in sessions with mom + her office manager during the discovery interview. AI generation is mocked with realistic delays + canned outputs that match what the production system should produce — no API keys, BAA, or PHI handling required.

## Run locally

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

## What's implemented

- **Dashboard** (`/`) — KPIs, pending queue summary, recent activity, annualized impact projection
- **Review queue** (`/queue`) — agentic V2 surface; pending items from auto-triggers; filter by skill type and confidence; expand to review; one-click approve / edit / reject; bulk approve all HIGH-confidence
- **Pre-auth generation** (`/generate/pre-auth`) — full input form (procedure, diagnoses, diagnostic tests, imaging, restorability, prior treatment); generates carrier-tuned narrative; flags evidence gaps
- **Appeal generation** (`/generate/appeal`) — denial classification dropdown, recoverability scoring, DO NOT APPEAL recommendations for legitimate denials
- **Referral letter generation** (`/generate/referral`) — 4 letter types (acknowledgment / diagnostic / post-treatment / recall) with conditional fields
- **History** (`/history`) — audit log table, search, filter by skill type
- **Settings** (`/settings`) — practice profile, carrier mix, HIPAA configuration status, auto-trigger watchers

## What's mocked vs. real

| Real | Mocked |
|------|--------|
| All UI components | AI generation (delayed + canned) |
| Form validation | PBS Endo integration |
| Confidence scoring logic | Submission to clearinghouse |
| Evidence checklist logic | Auth / multi-tenancy |
| State management | Persistence (resets on reload) |
| Realistic clinical content | BAA + audit log signing |

## File map

```
web/
├── app/
│   ├── layout.tsx           # Sidebar nav + chrome
│   ├── page.tsx             # Dashboard
│   ├── queue/page.tsx       # Review queue
│   ├── generate/
│   │   ├── pre-auth/page.tsx
│   │   ├── appeal/page.tsx
│   │   └── referral/page.tsx
│   ├── history/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── Nav.tsx              # Sidebar navigation
│   ├── OutputDisplay.tsx    # The generated output card (the most-iterated component)
│   ├── QueueItem.tsx        # One row in the review queue
│   ├── ConfidenceBadge.tsx  # HIGH/MEDIUM/LOW + recoverability badges
│   ├── EvidenceChecklist.tsx
│   └── StatCard.tsx
├── lib/
│   ├── types.ts             # All shared types
│   ├── mock-api.ts          # Mocked generation functions (returns realistic outputs)
│   ├── mock-data.ts         # Pre-populated queue + history
│   ├── cdt-codes.ts         # 25+ endo CDT codes + clinical dropdowns
│   ├── carriers.ts          # 6 carriers + 10 denial type classifications
│   └── utils.ts
└── package.json
```

## UX dial-in priorities

When sharing with mom + office manager, the components most worth iterating:

1. **`OutputDisplay`** — this is THE primary surface. Office manager sees this 100+ times/week. Approve/edit/reject ergonomics, confidence visibility, evidence checklist clarity, attachments list completeness.
2. **`QueueItem` (`/queue`)** — the agentic V2 experience. Sortable, scannable, fast to triage. Bulk approve for HIGH-confidence items.
3. **Pre-auth form** — the most clinically detailed. 15+ fields. Are the dropdowns the right granularity? Should EPT be a number? Is the imaging checklist right?
4. **Referral letter form** — highest volume (80-160/week). Are the 4 letter types the right split? Is conditional content collection ergonomic?

## What's NOT here yet

- Real Anthropic API integration → Phase 2 build
- PBS Endo trigger watchers → Phase 3 build
- eClaims clearinghouse submission → Phase 3 build
- Auth + multi-tenancy → Phase 2 build
- Persistence (Supabase) → Phase 2 build
- BAA signing flow → Phase 2 build

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Lucide icons
- Future: Supabase (DB + auth), Anthropic SDK (with BAA), clearinghouse API
