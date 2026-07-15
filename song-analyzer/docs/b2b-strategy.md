# B2B Strategy: the analyzer as infrastructure

The consumer product (artist uploads a track, gets a graded report) builds the
brand and the outcome dataset. The B2B product sells the same engine to
companies drowning in audio volume. This doc maps who buys, what they buy,
what to charge, and how to sequence it.

## Why B2B is attractive here

- **The volume problem is on their side.** ~100k+ tracks hit streaming daily.
  Distributors, labels, libraries and platforms all have intake pipelines with
  humans making triage decisions that a $0.10 API call can pre-sort.
- **Bigger contracts, lower churn.** Indie artists pay $19-29 in bursts and
  churn between releases. A distributor integrates an API into their intake
  flow and stays for years.
- **Precedent.** Musiio (AI tagging/triage) sold to SoundCloud in 2022 —
  platforms buy this capability rather than build it. Cyanite, Bridge.audio
  and others sell adjacent tagging/search; nobody leads with *release-
  readiness grading + feedback*, which is our angle.
- **Same engine, zero marginal R&D.** Everything B2B ships already exists for
  the consumer product; only the packaging differs.

## Segments and use cases

| Segment | Their problem | Our product | Entry point |
|---|---|---|---|
| **Distributors** (DistroKid-class, boutique) | Thousands of weekly uploads; QC issues (clipping, broken masters) cause DSP rejections and support tickets; no upsell signal | Intake QC (auto-flag technical failures) + triage ranking (who to offer marketing upsells to) | `/api/v1/triage`, CSV pilot on one week of intake |
| **Label A&R / demo inboxes** | Hundreds of demos, minutes of listening time each | Ranked inbox: priority/review/pass buckets, one-line top issue, nearest-comparable-artist | Catalog CLI on their demo folder — no integration needed |
| **Sync & production music libraries** | Catalog QC, metadata quality (key/BPM/mood must be right for search), gap analysis | Batch KPI extraction + QC flags; later: "find tracks like X" similarity search | Catalog CLI, then API |
| **Playlist/radio curators & promo platforms** (SubmitHub-class) | Submission floods, no objective pre-filter | Readiness score as a submission gate or badge | API partnership / white-label score |
| **Producer tools & DAW plugins** | Want "how will this perform on streaming" features | White-label grading via API | API licensing |
| **Artist-services agencies** | Sell campaigns; need to qualify which clients/tracks are campaign-ready | Reports as a client-facing deliverable | Reseller pricing on the consumer report |

## What they're buying (productized)

1. **Triage API** (`/api/v1/triage`, live) — ranked batch summaries with
   priority/review/pass buckets, per-pillar scores, flag counts, top issue.
2. **Full-report API** (`/api/v1/analyze`, live) — the complete graded JSON
   for building their own UI on top.
3. **Catalog CLI** (`tools/triage_catalog.py`, live) — runs inside the
   customer's infrastructure; audio never leaves their machines. This is the
   frictionless pilot: "give us nothing, run this on a folder, look at the CSV."
4. **Roadmap:** async bulk pipeline (S3 in → webhook out), per-customer keys +
   usage metering, white-label PDF reports, similarity/reference search
   ("rank my inbox by distance to <reference track>"), genre-conditional
   grading using the per-genre benchmark data we already derive.

## Pricing sketch (validate against pilots)

- **Metered API:** $0.25/track at low volume, sliding to $0.05-0.10/track
  above ~50k tracks/mo. (At 20-40s of CPU per track, COGS is roughly
  $0.005-0.02/track on commodity compute — healthy margin at every tier.)
- **Platform license:** $2k-10k/mo flat for distributors/libraries with
  volume bands, so procurement is predictable.
- **Pilot:** free or $500 fixed for a one-time catalog run with a findings
  memo. The memo sells the license.
- **White-label reports:** per-report price to agencies/distributor upsell
  flows (they charge the artist $29-79; we take $5-10 wholesale).

## Competitive positioning

- **Cyanite / former-Musiio (SoundCloud):** auto-tagging and search for
  catalogs — descriptive, not evaluative. We *grade* and produce actionable
  feedback; tagging is a subset of our KPI output.
- **Chartmetric / Soundcharts:** post-release market analytics on streaming
  data — they can't see a track before release. We're pre-release; the
  products are complementary (and they're plausible acquirers/partners).
- **LANDR:** mastering-centric; grades the master, not the song's structure,
  catchiness, or audience fit.
- Our wedge: **the only pre-release, evaluative, feedback-generating engine**
  — and every consumer report grows the outcome dataset B2B buyers can't
  replicate.

## Go-to-market sequencing

1. **Now → 3 mo:** run free pilot triages for 3-5 boutique distributors /
   micro-labels (the CLI makes this a folder-drop exercise). Deliverable: CSV
   + one-page findings memo. Goal: two design partners and testimonial data.
2. **3 → 6 mo:** per-customer API keys, metering, async bulk. Convert design
   partners to paid platform licenses. Publish a validation study (grades vs
   subsequent streaming outcomes) — the single strongest sales asset.
3. **6 → 12 mo:** similarity search + genre-conditional grading; approach
   promo platforms and producer-tool companies for white-label deals.

## Risks specific to B2B

- **Long sales cycles at big distributors** — start boutique, land-and-expand.
- **"Why not build it ourselves?"** — the answer is the outcome-calibrated
  benchmarks and the validation study, not the DSP. Ship that study early.
- **Score liability:** a "pass" bucket that buries a future hit is the
  nightmare demo. Position as *triage assist* (ordering human attention),
  never auto-rejection, and keep the priority bucket generous.
