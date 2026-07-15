# Song Analyzer

Proprietary song analyzer for independent artists: upload a track, get a
graded report on **quality, catchiness, streaming readiness, popularity
reach, and scalability**, concrete feedback on what to fix to perform better
on streaming services, and a ranked map of which **major artists' audiences**
the track belongs with — plus a platform-compliant placement playbook for
reaching them.

## What the engine grades

Every uploaded track is scored 0–100 (with a letter grade) on five pillars:

| Pillar | What it measures | Signals used |
|---|---|---|
| **Production quality** | Is the master competitive? | Integrated loudness vs the ~-14 LUFS streaming target, clipping detection, low/mid/high spectral balance, stereo width, dynamic range |
| **Catchiness** | Does it hook? | Repetition structure via chroma self-similarity, hook prominence (does the repeated section lift?), groove/danceability, tempo stability |
| **Streaming readiness** | Will it survive the skip window? | Intro length, when the hook first arrives, duration vs playlist norms, normalization compliance |
| **Popularity reach** | How close is it to mainstream demand? | Proximity to and breadth across 20 curated major-artist sonic profiles |
| **Scalability** | How many listening moments can it serve? | Fit across contexts (workout, party, chill/study, late night, road trip, coffeehouse) |

The report then generates prioritized feedback (`Fix first` → `Improve` →
`Tip` → `Strength`): e.g. *"the intro takes 22s to reach full energy — skips
cluster in the first seconds and a skip before 30s pays no royalty; get a
hook element in within ~10 seconds."*

All analysis is our own DSP pipeline (librosa + pyloudnorm). We deliberately
don't depend on Spotify's Audio Features API, which was deprecated for new
third-party apps in November 2024. That makes the analyzer proprietary IP.

## The placement thesis (read this before selling)

**Not possible:** No third party can insert a track into a major artist's
Spotify Radio or Apple Music station. There is no API, partner program, or
paid channel for it. Artist radio is collaborative filtering over real
listener behavior. Services promising direct placement use bot farms or
playlist fraud — "artificial streaming" under both platforms' terms — which
gets tracks removed, royalties clawed back, and catalogs banned, and would
expose the business to deceptive-advertising and payola-adjacent liability.

**Possible (what we sell):** Radio placement happens organically when enough
of Artist X's listeners stream and save your track. So we grade the track,
fix what's holding it back, identify the audiences it fits, and drive those
exact listeners through compliant channels: Spotify for Artists editorial
pitching (with named sound-alikes), Apple Music for Artists, curator outreach
(SubmitHub/Groover), Marquee/Showcase, interest-targeted ads, and short-form
seeding. "We got you into Drake Radio" is not sellable; "your track grades
B+ against Drake's catalog, here's what to fix and the release plan to put it
in front of Drake listeners" is.

## Business model

| Tier | Model | Price (placeholder) | Includes |
|---|---|---|---|
| Single Report | one-time fee | $29 / track | Full graded analysis, feedback report, top-5 audience matches, one playbook |
| Pro | subscription | $19 / month | Unlimited analyses + re-grades, all playbooks, editorial pitch copy, catalog tracking |
| Partner | revenue share | $0 upfront + 5% of royalties/publishing, term-limited | Everything in Pro + our team runs the release campaign, curator outreach, and ads |

**Legal notes on the Partner tier (get an entertainment attorney before
launch):**

- A royalty/publishing participation is a rights transaction. It needs a
  written agreement covering scope (which recordings/compositions), term
  (strongly recommend time-limited, e.g. 2–3 years, not life-of-copyright),
  what the 5% attaches to (gross vs net, recording royalties vs publishing —
  these are very different money), audit rights, and reversion.
- If the service "procures employment or engagements" for artists, some
  states (notably California's Talent Agencies Act and New York's employment
  agency law) regulate or license that activity. Marketing services are
  generally fine; booking/placement-for-hire language is not. Word the
  agreement and the site copy carefully.
- Collecting a share of publishing usually means registering with PROs or
  using a publishing administrator; plan that infrastructure before signing
  anyone.
- Never condition the royalty share on "guaranteed placement" — see the
  placement thesis above.

## Calibration: the analyzer studies charting songs

The grading engine is calibrated against what famous, high-performing songs
actually look like, on two levels:

**1. Public chart metadata (ships with the repo).**
`research/derive_benchmarks.py` studies ~33k tracks with Spotify audio
features and popularity scores (TidyTuesday `spotify_songs.csv` snapshot),
treats popularity ≥ 75 as hit-level (~3k tracks), and writes percentile
distributions to `app/data/benchmarks.json`. The graders read it at import:

- Duration is graded against the hit sweet spot (p25–p75 ≈ **3:06–3:55**,
  median 3:28) instead of a hand-picked range.
- Loudness is graded against measured hit masters (p10–p90 ≈ **−12 to
  −3.3 dB**) — empirically, charting masters run much hotter than the −14
  LUFS normalization target, so we stopped penalizing hot masters the way
  mastering folklore suggests.
- Tempo is scored against the hit tempo band (**97–136 BPM**).
- Per-genre distributions (pop, rap, rock, latin, r&b, edm) are stored for
  future genre-conditional grading.

**2. Reference audio you supply (`research/ingest_references.py`).**
Public metadata can't measure intros, hook timing, or repetition — only real
audio can. Point the ingester at a folder of charting songs you have lawful
access to (purchased/licensed copies), organized one subfolder per artist:

```bash
python research/ingest_references.py refs/ --corpus-metrics
```

It batch-analyzes everything through the same DSP pipeline and writes:
- `app/data/artist_profiles.json` — data-derived sonic centroids per artist
  (≥3 tracks each), which automatically override the hand-curated seed
  profiles and can add new artists.
- `app/data/corpus_metrics.json` — corpus distributions of intro length,
  hook arrival, repetition, stereo width, etc. The streaming-readiness
  grader automatically prefers these over its defaults.

Only derived statistics are stored — no audio is copied or redistributed.
Feature extraction from recordings you have lawful access to is standard
music-information-retrieval practice; don't torrent a training corpus.

## Running the MVP

```bash
pip install -r requirements.txt
cd app
uvicorn main:app --port 8000
```

Open http://localhost:8000 and drop in an MP3/WAV/FLAC/M4A.

API:
- `POST /api/analyze` (multipart, field `file`) → graded report JSON:
  `overall_score`, `overall_grade`, `pillars[]`, `feedback[]`, `contexts[]`,
  `features`, `structure`, and `audience` (ranked matches + playbooks).
- `GET /api/tiers` → service tiers.

## Architecture

```
app/
  analyzer.py   # librosa/pyloudnorm DSP: sonic fingerprint + structure metrics
  profiles.py   # curated major-artist sonic profiles (MVP seed data)
  grading.py    # five-pillar proprietary grading + feedback engine
  scoring.py    # artist-audience similarity, fit grades, placement playbooks
  main.py       # FastAPI: analyze endpoint, tiers endpoint, static UI
  static/       # single-page upload/report UI (no build step)
tests/          # pipeline tests using synthesized audio
```

## Known MVP limitations / production roadmap

- **Artist profiles are editorial seed values.** Derive centroids from
  analyzed reference catalogs (30–50 tracks per artist), refresh on new
  releases, expand from 20 artists to hundreds.
- **Catchiness/valence are DSP proxies.** The defensible moat is a learned
  model: fine-tuned audio embeddings (MERT/CLAP-class) trained against real
  streaming outcomes. The pillar architecture stays; the scorers upgrade.
- **No accounts/billing yet.** Stripe for the one-time and subscription
  tiers; the Partner tier needs contract + royalty-accounting infrastructure.
- **Close the loop:** with artist consent, connect Spotify for Artists /
  Apple Music for Artists stats to measure whether the playbook moved
  algorithmic-source streams — measured lift is the renewal pitch and the
  training data for the learned model.
