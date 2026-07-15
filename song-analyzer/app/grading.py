"""Proprietary track grading: five pillars plus actionable artist feedback.

Pillars
  quality       — production/master quality (loudness, clipping, balance, dynamics)
  catchiness    — hook strength, repetition structure, groove
  streaming     — streaming readiness (intro, hook timing, duration, normalization)
  reach         — popularity reach (proximity + breadth vs major-artist audiences)
  scalability   — playlist/context versatility (how many listening moods it serves)

Every pillar is scored 0-100 with a letter grade. Feedback items are concrete
changes the artist can make to perform better on streaming services, phrased
qualitatively — no invented statistics.
"""

import math

from analyzer import StructureMetrics, TrackFeatures
from benchmarks import corpus_metrics, hit_range
from scoring import grade_for

# Empirically, charting masters are hot: the hit-benchmark loudness range
# (derived from ~3k hit-level tracks) sits around -7 to -4.3 dB even though
# platforms normalize playback to ~-14 LUFS. We grade against the observed
# hit range, widened toward quiet since normalization makes under-mastering
# mostly a perception issue while over-limiting costs punch.
_LOUD_LO, _LOUD_HI = hit_range("loudness", "p10", "p90", default=(-16.0, -9.5))
LOUDNESS_RANGE = (_LOUD_LO - 3.0, _LOUD_HI)
DURATION_RANGE = hit_range("duration_s", default=(140.0, 215.0))
TEMPO_RANGE = hit_range("tempo", default=(88.0, 142.0))

PILLAR_WEIGHTS = {
    "quality": 0.20,
    "catchiness": 0.25,
    "streaming": 0.20,
    "reach": 0.20,
    "scalability": 0.15,
}

PILLAR_LABELS = {
    "quality": "Production quality",
    "catchiness": "Catchiness",
    "streaming": "Streaming readiness",
    "reach": "Popularity reach",
    "scalability": "Scalability",
}

# Listening-context profiles for the scalability pillar: (feature -> target,
# tolerance). A track that credibly fits several contexts can live on more
# playlist types and mood stations.
CONTEXTS = {
    "Workout": {"energy": (0.75, 0.25), "danceability": (0.7, 0.25), "tempo_min": 100},
    "Party": {"energy": (0.7, 0.25), "danceability": (0.75, 0.2), "valence": (0.6, 0.3)},
    "Chill / study": {"energy": (0.3, 0.2), "density": (0.3, 0.25), "danceability": (0.4, 0.3)},
    "Late night": {"energy": (0.45, 0.25), "brightness": (0.35, 0.25), "valence": (0.35, 0.3)},
    "Road trip": {"energy": (0.55, 0.25), "valence": (0.55, 0.3), "danceability": (0.55, 0.3)},
    "Coffeehouse / acoustic": {"acousticness": (0.6, 0.25), "energy": (0.4, 0.25)},
}


def _credit(distance: float, tolerance: float) -> float:
    return math.exp(-0.693 * (distance / tolerance) ** 2)


def _range_credit(value: float, lo: float, hi: float, falloff: float) -> float:
    """1.0 inside [lo, hi], decaying smoothly outside at rate `falloff`."""
    if lo <= value <= hi:
        return 1.0
    distance = (lo - value) if value < lo else (value - hi)
    return _credit(distance, falloff)


# --------------------------------------------------------------------------
# Pillar scoring
# --------------------------------------------------------------------------

def score_quality(f: TrackFeatures, s: StructureMetrics) -> float:
    loudness = _range_credit(s.loudness_lufs, *LOUDNESS_RANGE, 4.0)
    clipping = 1.0 if s.clipping_ratio < 0.0005 else _credit(s.clipping_ratio, 0.01)
    balance = (
        _range_credit(s.band_low, 0.20, 0.45, 0.12)
        + _range_credit(s.band_mid, 0.35, 0.60, 0.12)
        + _range_credit(s.band_high, 0.08, 0.30, 0.10)
    ) / 3.0
    width = _range_credit(s.stereo_width, 0.15, 0.75, 0.20)
    dynamics = _range_credit(f.dynamics, 0.15, 0.75, 0.15)
    # Mastering convention: leave ~1 dB of true-peak headroom to survive
    # lossy transcoding; a slammed 0 dBFS peak loses credit.
    headroom = _range_credit(s.true_peak_db, -12.0, -0.8, 0.8)
    # A competitive master still moves: 4-12 dB of short-term loudness spread.
    lra = _range_credit(s.loudness_range_db, 4.0, 12.0, 4.0)
    score = 100 * (0.24 * loudness + 0.14 * clipping + 0.22 * balance
                   + 0.10 * width + 0.12 * dynamics + 0.08 * headroom + 0.10 * lra)
    return round(score, 1)


def score_catchiness(f: TrackFeatures, s: StructureMetrics) -> float:
    hook_repeat = _range_credit(s.repetition, 0.45, 0.85, 0.20)
    # Structural chorus: hits typically spend ~20-45% of runtime in chorus.
    if s.has_chorus:
        chorus = _range_credit(s.chorus_ratio, 0.20, 0.45, 0.15)
    else:
        chorus = 0.3  # no detected chorus: possible but rarely catchy
    prominence = min(1.0, s.hook_prominence * 2.0)
    groove = f.danceability
    steadiness = s.tempo_stability
    tempo_zone = _range_credit(f.tempo, TEMPO_RANGE[0], TEMPO_RANGE[1], 30.0)
    # A little rhythmic tension is ear candy; none is stiff, too much is work.
    feel = _range_credit(s.syncopation, 0.12, 0.55, 0.25)
    score = 100 * (0.24 * hook_repeat + 0.18 * chorus + 0.14 * prominence
                   + 0.18 * groove + 0.10 * steadiness + 0.10 * tempo_zone
                   + 0.06 * feel)
    return round(score, 1)


def score_streaming(f: TrackFeatures, s: StructureMetrics) -> float:
    # When a reference-audio corpus has been ingested, its structure stats
    # replace the hand-tuned intro/hook expectations.
    corpus = corpus_metrics()
    intro_edge, hook_edge = 12.0, 35.0
    if corpus:
        intro_edge = corpus.get("intro_length", {}).get("p75", intro_edge)
        hook_edge = corpus.get("hook_arrival", {}).get("p75", hook_edge)
    intro = _range_credit(s.intro_length, 0.0, intro_edge, max(8.0, intro_edge))
    # Prefer the structural first-chorus time when segmentation found one;
    # fall back to the recurrence-based hook estimate.
    hook_time = s.first_chorus_time if s.has_chorus and s.first_chorus_time >= 0 \
        else s.hook_arrival
    hook_timing = _range_credit(hook_time, 0.0, hook_edge, max(20.0, hook_edge * 0.7))
    duration = _range_credit(s.duration_total, *DURATION_RANGE, 60.0)
    loudness = _range_credit(s.loudness_lufs, *LOUDNESS_RANGE, 4.0)
    # Streaming-era endings are cold: long fade-outs invite early skips that
    # hurt completion rate.
    ending = 1.0 if s.hard_ending else _range_credit(s.fade_out_seconds, 0.0, 6.0, 6.0)
    score = 100 * (0.26 * intro + 0.26 * hook_timing + 0.22 * duration
                   + 0.14 * loudness + 0.12 * ending)
    return round(score, 1)


def score_reach(matches: list[dict]) -> float:
    if not matches:
        return 0.0
    top = matches[0]["score"] / 100.0
    breadth = min(1.0, sum(1 for m in matches if m["score"] >= 60) / 4.0)
    return round(100 * (0.65 * top + 0.35 * breadth), 1)


def context_fits(f: TrackFeatures) -> list[dict]:
    fits = []
    for name, targets in CONTEXTS.items():
        credits = []
        for dim, spec in targets.items():
            if dim == "tempo_min":
                credits.append(1.0 if f.tempo >= spec or f.tempo * 2 >= spec else 0.4)
                continue
            center, tol = spec
            credits.append(_credit(abs(getattr(f, dim) - center), tol))
        fit = sum(credits) / len(credits)
        fits.append({"context": name, "fit": round(fit * 100)})
    fits.sort(key=lambda c: c["fit"], reverse=True)
    return fits


def score_scalability(fits: list[dict]) -> float:
    strong = [c for c in fits if c["fit"] >= 60]
    top3 = sum(c["fit"] for c in fits[:3]) / 3.0
    return round(0.6 * top3 + 40.0 * min(1.0, len(strong) / 3.0), 1)


# --------------------------------------------------------------------------
# Feedback engine
# --------------------------------------------------------------------------

def _fb(pillar: str, severity: str, message: str) -> dict:
    return {"pillar": PILLAR_LABELS[pillar], "severity": severity, "message": message}


def build_feedback(
    f: TrackFeatures, s: StructureMetrics, matches: list[dict],
    fits: list[dict], pillar_scores: dict,
) -> list[dict]:
    fb: list[dict] = []

    # --- Production quality ---
    loud_lo, loud_hi = LOUDNESS_RANGE
    if s.loudness_lufs < loud_lo - 0.5:
        fb.append(_fb("quality", "improve",
            f"The master sits at {s.loudness_lufs} LUFS. Charting masters we've "
            f"studied land roughly between {loud_lo:.0f} and {loud_hi:.0f} dB — this "
            f"track will sound smaller next to them in a playlist even after "
            f"normalization. Bring the master up without crushing dynamics."))
    elif s.loudness_lufs > loud_hi + 1.0:
        fb.append(_fb("quality", "improve",
            f"The master is hotter ({s.loudness_lufs} LUFS) than the charting range "
            f"we've measured (~{loud_lo:.0f} to {loud_hi:.0f} dB). Platforms "
            f"normalize playback to ~-14 LUFS, so limiting past the hit range buys "
            f"no loudness — it only costs punch."))
    if s.clipping_ratio >= 0.0005:
        fb.append(_fb("quality", "critical",
            f"Digital clipping detected on {s.clipping_ratio:.2%} of samples. Re-export "
            f"with at least 1 dB of true-peak headroom — clipping reads as amateur on "
            f"editorial review and can cause distortion after transcoding."))
    if s.band_low > 0.50:
        fb.append(_fb("quality", "improve",
            "The mix is bottom-heavy (over half the spectral energy is below 250 Hz). "
            "Carve space in the low end so the vocal and hook translate on phone "
            "speakers and earbuds, where most streaming happens."))
    elif s.band_low < 0.15:
        fb.append(_fb("quality", "improve",
            "The low end is thin (under 15% of spectral energy below 250 Hz). Modern "
            "playlist neighbors will feel fuller — reinforce the bass/kick foundation."))
    if s.band_high > 0.35:
        fb.append(_fb("quality", "improve",
            "High-frequency energy is elevated — the track may read harsh at playlist "
            "volume. Tame sibilance and cymbal buildup above 4 kHz."))
    if s.stereo_width < 0.05:
        fb.append(_fb("quality", "tip",
            "The track is essentially mono. Widening pads, doubles, or reverbs would "
            "give it a more modern, immersive image (keep the low end mono)."))
    elif s.stereo_width > 0.85:
        fb.append(_fb("quality", "improve",
            "Stereo width is extreme — check mono compatibility; heavy side energy can "
            "collapse or phase-cancel on single-speaker devices."))
    if f.dynamics < 0.12:
        fb.append(_fb("quality", "improve",
            "Dynamic range is very compressed. Sections should breathe — automate a "
            "lift into the chorus so the hook lands harder."))

    # --- Master details ---
    if s.true_peak_db > -0.3:
        fb.append(_fb("quality", "improve",
            f"Sample peaks hit {s.true_peak_db} dBFS. Leave ~1 dB of true-peak "
            f"headroom so the master survives lossy transcoding (AAC/Ogg) without "
            f"inter-sample distortion."))
    if 0 < s.loudness_range_db < 3.5:
        fb.append(_fb("quality", "improve",
            f"Short-term loudness range is only {s.loudness_range_db} dB — the track "
            f"sits at one intensity the whole way. Hits typically breathe 4-12 dB "
            f"between their quietest and loudest passages."))

    # --- Song structure ---
    if not s.has_chorus and s.n_sections >= 3:
        fb.append(_fb("catchiness", "improve",
            "Section analysis couldn't find a distinct repeated chorus — no section "
            "family both repeats and lifts above the rest. If the song has a chorus, "
            "differentiate it harder (energy, instrumentation, melody); if it "
            "doesn't, know that you're trading reach for form."))
    elif s.has_chorus and s.chorus_ratio < 0.15:
        fb.append(_fb("catchiness", "tip",
            f"The chorus only occupies {s.chorus_ratio:.0%} of the runtime. Hits "
            f"typically spend 20-45% of the track in chorus — consider a double "
            f"chorus or a final-chorus extension."))
    if s.has_chorus and s.first_chorus_time > 50:
        fb.append(_fb("streaming", "improve",
            f"The first chorus lands at {s.first_chorus_time:.0f}s. Modern "
            f"arrangements front-load it — aim to reach the chorus (or a hook "
            f"preview) inside 30-45 seconds."))
    if s.energy_build < 0.35:
        fb.append(_fb("catchiness", "improve",
            "The energy arc is flat or declining — the track never builds toward a "
            "peak. Stage the arrangement (drop elements out, then stack them back) "
            "so there's somewhere for the listener to be taken."))
    elif s.climax_position < 0.30:
        fb.append(_fb("catchiness", "tip",
            "The loudest moment arrives in the first third of the track, which can "
            "make the back half feel like an afterglow. Consider saving one 'biggest' "
            "moment for the final chorus."))
    if not s.hard_ending and s.fade_out_seconds > 8:
        fb.append(_fb("streaming", "improve",
            f"The track fades out over ~{s.fade_out_seconds:.0f}s. Fade-outs invite "
            f"early skips that count against completion rate — streaming-era hits "
            f"overwhelmingly end cold. Write an ending."))
    if s.key_change and s.second_key:
        fb.append(_fb("catchiness", "strength",
            f"Key modulation detected (into {s.second_key}) — a lift like that is "
            f"rare in modern releases and can be a signature moment; make sure the "
            f"arrangement spotlights it."))
    if f.key_confidence < 0.4:
        fb.append(_fb("quality", "tip",
            "The tonal center reads ambiguous to key detection. If that's stylistic, "
            "fine — but check that layered elements aren't clashing harmonically."))
    if s.vocal_presence < 0.30:
        fb.append(_fb("reach", "tip",
            "The mix reads instrumental-forward (low melodic mid-band presence). "
            "Vocal-forward tracks travel further on mainstream playlists — if "
            "there's a vocal, bring it up; if not, target instrumental/mood "
            "playlists deliberately."))
    if s.timbral_variety < 0.12:
        fb.append(_fb("catchiness", "tip",
            "The sound palette barely changes across the track. Introduce at least "
            "one new texture per section (a counter-melody, a percussion layer, an "
            "octave lift) to reward continued listening."))

    # --- Catchiness ---
    if s.repetition < 0.40:
        fb.append(_fb("catchiness", "improve",
            "The song rarely returns to the same material. Streaming-era listeners "
            "anchor on a returning hook — consider a clearer, more repeated chorus or "
            "a recurring instrumental motif."))
    elif s.repetition > 0.92:
        fb.append(_fb("catchiness", "tip",
            "The track is highly repetitive. If that's not a deliberate loop-based "
            "aesthetic, add variation (a bridge, a drop change) to hold attention "
            "through the back half."))
    if s.hook_prominence < 0.15 and s.repetition >= 0.40:
        fb.append(_fb("catchiness", "improve",
            "The repeated section doesn't lift above the rest of the track "
            "energetically. Give the hook contrast: more instrumentation, wider "
            "stereo, or a vocal layer so it registers as the peak."))
    if s.tempo_stability < 0.45:
        fb.append(_fb("catchiness", "tip",
            "Tempo drifts noticeably. If the performance isn't intentionally rubato, "
            "tighten timing — steady grooves playlist better and loop cleaner on "
            "short-form video."))

    # --- Streaming readiness ---
    if s.intro_length > 15:
        fb.append(_fb("streaming", "critical" if s.intro_length > 30 else "improve",
            f"The intro takes {s.intro_length:.0f}s to reach full energy. Skips "
            f"cluster in the first seconds of a track, and a skip before 30s means "
            f"no royalty and a negative algorithmic signal — get a vocal or hook "
            f"element in within roughly 10 seconds."))
    if not s.has_chorus and s.hook_arrival > 45:
        fb.append(_fb("streaming", "improve",
            f"Your most-repeated section first arrives around {s.hook_arrival:.0f}s. "
            f"Consider restructuring so the hook (or a preview of it) lands inside "
            f"the first 30-40 seconds."))
    dur_lo, dur_hi = DURATION_RANGE
    if s.duration_total > dur_hi + 45:
        fb.append(_fb("streaming", "improve",
            f"At {s.duration_total/60:.1f} minutes the track runs well past the "
            f"charting sweet spot we've measured ({dur_lo/60:.0f}:{dur_lo%60:02.0f}-"
            f"{dur_hi/60:.0f}:{dur_hi%60:02.0f}). A tighter radio edit typically "
            f"completes more often, and completion rate feeds the algorithm."))
    elif s.duration_total < 120:
        fb.append(_fb("streaming", "tip",
            f"The track is short ({s.duration_total:.0f}s). That's fine for "
            f"streaming (a stream counts at 30s), but make sure it still feels like "
            f"a complete statement — very short tracks can read as interludes to "
            f"editors."))

    # --- Reach ---
    if matches and matches[0]["score"] < 55:
        fb.append(_fb("reach", "improve",
            "The track doesn't sit close to any mainstream audience profile. That can "
            "be genuine differentiation — but for playlist pitching, pick one or two "
            "reference artists and align the production palette (drums, vocal "
            "treatment, low-end) toward their lane."))
    elif matches:
        names = ", ".join(m["artist"] for m in matches[:2])
        fb.append(_fb("reach", "strength",
            f"Strongest audience proximity: {names}. Use them as the named "
            f"sound-alikes in editorial pitches and ad targeting."))

    # --- Scalability ---
    strong = [c["context"] for c in fits if c["fit"] >= 60]
    if len(strong) >= 3:
        fb.append(_fb("scalability", "strength",
            f"Versatile: credibly fits {len(strong)} listening contexts "
            f"({', '.join(strong)}), which widens playlist and mood-station "
            f"opportunities."))
    elif len(strong) <= 1:
        only = f" (only {strong[0]})" if strong else ""
        fb.append(_fb("scalability", "tip",
            f"The track fits a narrow set of listening contexts{only}. Not a flaw — "
            f"but plan the playlist strategy around that one context rather than "
            f"broad pitching."))

    # --- Strengths from high pillar scores ---
    for key, score in pillar_scores.items():
        if score >= 80 and key not in ("reach", "scalability"):
            fb.append(_fb(key, "strength",
                f"{PILLAR_LABELS[key]} grades {grade_for(score)} — lead with this in "
                f"your pitch narrative."))

    severity_rank = {"critical": 0, "improve": 1, "tip": 2, "strength": 3}
    fb.sort(key=lambda item: severity_rank[item["severity"]])
    return fb


# --------------------------------------------------------------------------
# Entry point
# --------------------------------------------------------------------------

def grade_track(f: TrackFeatures, s: StructureMetrics, matches: list[dict]) -> dict:
    fits = context_fits(f)
    pillar_scores = {
        "quality": score_quality(f, s),
        "catchiness": score_catchiness(f, s),
        "streaming": score_streaming(f, s),
        "reach": score_reach(matches),
        "scalability": score_scalability(fits),
    }
    overall = round(sum(PILLAR_WEIGHTS[k] * v for k, v in pillar_scores.items()), 1)
    pillars = [
        {
            "key": key,
            "label": PILLAR_LABELS[key],
            "score": score,
            "grade": grade_for(score),
        }
        for key, score in pillar_scores.items()
    ]
    return {
        "overall_score": overall,
        "overall_grade": grade_for(overall),
        "pillars": pillars,
        "contexts": fits,
        "feedback": build_feedback(f, s, matches, fits, pillar_scores),
    }
