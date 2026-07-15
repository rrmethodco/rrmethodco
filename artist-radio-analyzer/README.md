# Artist Radio Fit Analyzer

MVP of a subscription service for independent artists: upload a track, get a
graded analysis of which **major artists' audiences** it sonically belongs
with, and a concrete, platform-compliant **placement playbook** for reaching
those listeners — the people whose streams and saves are what actually pull a
track into Spotify/Apple Music artist radio.

## The product thesis (read this first)

**What is not possible:** No third party can insert a track into a major
artist's Spotify Radio or Apple Music station. There is no API, partner
program, or paid channel for it. Artist radio is built by collaborative
filtering over real listener behavior. Services that promise direct placement
do it through bot farms or playlist fraud — that is "artificial streaming"
under both platforms' terms, and it gets tracks removed, royalties clawed
back, and catalogs banned. Selling guaranteed placement would also expose the
business to FTC deceptive-advertising and payola-adjacent liability.

**What is possible (and what this app does):** Artist radio placement happens
organically when enough of Artist X's listeners stream, save, and playlist
your track. So the winning product is a *targeting engine*:

1. **Analyze** — extract the track's sonic fingerprint (tempo, key/mode,
   energy, danceability, brightness, acousticness, valence, dynamics, density)
   with our own DSP pipeline (librosa). We deliberately don't depend on
   Spotify's Audio Features API, which was deprecated for new third-party
   apps in November 2024.
2. **Grade & rank** — score the track 0–100 against curated sonic profiles of
   major artists, assign a letter grade, and rank the best audience matches.
3. **Playbook** — for the top matches, generate the compliant channel plan:
   Spotify for Artists editorial pitching (with the exact sound-alike and
   genre tags to use), Apple Music for Artists submission, independent
   curator outreach (SubmitHub/Groover), Marquee/Showcase, interest-targeted
   ads at the matched artist's fanbase, and short-form seeding.

The subscription value: artists stop guessing who their audience is and stop
wasting release budgets on the wrong listeners. "We got you into Drake Radio"
is not sellable; "your track grades A− against Drake's catalog — here is the
seven-day release plan to put it in front of Drake listeners" is.

## Running the MVP

```bash
pip install -r requirements.txt
cd app
uvicorn main:app --port 8000
```

Open http://localhost:8000, drop in an MP3/WAV/FLAC/M4A, and you get the
graded report in a few seconds.

API: `POST /api/analyze` (multipart, field `file`) returns JSON with
`features`, `overall_grade`, ranked `matches` (each with a score `breakdown`),
and `playbook` entries for the top three matches.

## Architecture

```
app/
  analyzer.py   # librosa DSP: 10-dimension sonic fingerprint per track
  profiles.py   # curated major-artist sonic profiles (MVP seed data)
  scoring.py    # weighted similarity → 0-100 score, letter grade, playbooks
  main.py       # FastAPI: upload endpoint + static UI
  static/       # single-page upload/report UI (no build step)
tests/          # scoring + analyzer smoke tests (synthesized audio)
```

## Known MVP limitations / production roadmap

- **Artist profiles are editorial seed values.** In production, derive each
  centroid by running 30–50 representative tracks per artist through the same
  analyzer, and refresh on new releases. Expand from 20 artists to hundreds.
- **Valence/danceability are DSP proxies.** A trained model (e.g. fine-tuned
  audio embeddings such as MERT/CLAP against labeled data) would grade far
  better than hand-built heuristics, and embedding similarity could replace
  the per-feature distance entirely.
- **No accounts/billing yet.** Subscription tiers, upload history, and
  per-release campaign tracking (did saves/follows from the target audience
  actually materialize?) are the retention loop.
- **Closing the loop:** with the artist's consent, connect their Spotify for
  Artists / Apple Music for Artists stats to measure whether the playbook
  moved algorithmic-source streams — that measured lift is the renewal pitch.
