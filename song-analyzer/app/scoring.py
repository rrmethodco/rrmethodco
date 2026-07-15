"""Fit scoring, grading, and placement playbook generation.

Compares a track's extracted features against curated artist profiles and
produces: a 0-100 fit score per artist, a letter grade, ranked matches, and a
legitimate placement playbook for the top matches.

Playbooks only recommend channels that comply with Spotify/Apple Music terms.
There is no mechanism — paid or otherwise — to directly insert a track into
another artist's algorithmic radio; radio inclusion happens organically when
enough of that artist's listeners stream and save your track.
"""

from analyzer import TrackFeatures
from profiles import ARTIST_PROFILES, ArtistProfile

import math

# How much each feature dimension matters when judging "would this track fit
# next to this artist in a radio session?" Rhythm and energy dominate the
# listening context; timbre and mood refine it.
FEATURE_WEIGHTS = {
    "energy": 0.20,
    "danceability": 0.20,
    "brightness": 0.10,
    "acousticness": 0.15,
    "valence": 0.12,
    "density": 0.08,
}
TEMPO_WEIGHT = 0.10
MODE_WEIGHT = 0.05

# Feature-dimension tolerance: score decays smoothly, hitting ~50% credit at
# this distance on a 0-1 scale.
FEATURE_TOLERANCE = 0.22

GRADE_BANDS = [
    (90, "A+"), (85, "A"), (80, "A-"),
    (75, "B+"), (70, "B"), (65, "B-"),
    (60, "C+"), (55, "C"), (50, "C-"),
    (40, "D"), (0, "F"),
]


def _gaussian_credit(distance: float, tolerance: float) -> float:
    """1.0 at zero distance, ~0.5 at `tolerance`, decaying smoothly."""
    return math.exp(-0.693 * (distance / tolerance) ** 2)


def _tempo_credit(track_tempo: float, profile: ArtistProfile) -> float:
    """Tempo credit, considering half-time and double-time equivalence."""
    candidates = (track_tempo, track_tempo * 2, track_tempo / 2)
    best = 0.0
    for t in candidates:
        distance = abs(t - profile.tempo_center)
        best = max(best, _gaussian_credit(distance, profile.tempo_spread))
    return best


def score_against_profile(features: TrackFeatures, profile: ArtistProfile) -> dict:
    targets = profile.feature_targets()
    track_values = {
        "energy": features.energy,
        "danceability": features.danceability,
        "brightness": features.brightness,
        "acousticness": features.acousticness,
        "valence": features.valence,
        "density": features.density,
    }

    breakdown = {}
    total = 0.0
    for dim, weight in FEATURE_WEIGHTS.items():
        credit = _gaussian_credit(abs(track_values[dim] - targets[dim]), FEATURE_TOLERANCE)
        breakdown[dim] = round(credit * 100)
        total += weight * credit

    tempo_credit = _tempo_credit(features.tempo, profile)
    breakdown["tempo"] = round(tempo_credit * 100)
    total += TEMPO_WEIGHT * tempo_credit

    # Mode affinity: credit for matching the catalog's major/minor tendency.
    track_minor = 1.0 if features.mode == "minor" else 0.0
    mode_credit = 1.0 - abs(track_minor - profile.minor_share)
    breakdown["mode"] = round(mode_credit * 100)
    total += MODE_WEIGHT * mode_credit

    score = round(total * 100, 1)
    return {
        "artist": profile.name,
        "genres": profile.genres,
        "audience": profile.audience,
        "score": score,
        "grade": grade_for(score),
        "breakdown": breakdown,
    }


def grade_for(score: float) -> str:
    for threshold, grade in GRADE_BANDS:
        if score >= threshold:
            return grade
    return "F"


def build_playbook(match: dict) -> list[dict]:
    """Legitimate placement channels to reach this artist's audience."""
    artist = match["artist"]
    strong = match["score"] >= 70
    steps = [
        {
            "channel": "Spotify editorial pitch",
            "action": (
                f"Pitch the unreleased track via Spotify for Artists at least 7 days "
                f"before release. In the pitch form, name {artist} as a sound-alike and "
                f"use the genre/mood tags from this report. A successful pitch also "
                f"guarantees Release Radar delivery to your followers."
            ),
        },
        {
            "channel": "Apple Music for Artists",
            "action": (
                "Claim your Apple Music for Artists profile and submit the release "
                "through your distributor for editorial consideration; keep metadata "
                "(genre, mood) consistent with this report's classification."
            ),
        },
        {
            "channel": "Independent playlist curators",
            "action": (
                f"Target user-made playlists whose titles/descriptions feature {artist} "
                f"or the genres {', '.join(match['genres'])} via SubmitHub, Groover, or "
                f"direct curator outreach. Never pay for guaranteed placement or streams "
                f"— bot-driven playlists get tracks removed and can get your catalog "
                f"flagged for artificial streaming."
            ),
        },
        {
            "channel": f"Ad targeting of {artist} listeners",
            "action": (
                f"Run Meta/TikTok/YouTube ads targeting {artist} fans (interest "
                f"targeting), and use Spotify Marquee/Showcase (available to eligible "
                f"artists via Spotify for Artists) to reach listeners with an affinity "
                f"for your sound. Streams and saves from {artist}'s real listeners are "
                f"exactly the collaborative-filtering signal that gets a track pulled "
                f"into {artist} Radio and algorithmic mixes organically."
            ),
        },
        {
            "channel": "Short-form seeding",
            "action": (
                f"Seed the hook on TikTok/Reels/Shorts with creators whose audience "
                f"overlaps {artist}'s. Off-platform discovery that converts to searches, "
                f"saves, and playlist adds is the strongest organic radio signal."
            ),
        },
    ]
    if strong:
        steps.insert(0, {
            "channel": "Priority target",
            "action": (
                f"This track grades {match['grade']} against {artist}'s sonic profile — "
                f"make {artist}'s audience the primary target for the release campaign "
                f"and concentrate budget on the channels below rather than spreading "
                f"across weaker matches."
            ),
        })
    return steps


def rank_matches(features: TrackFeatures, top_n: int = 5) -> dict:
    scored = [score_against_profile(features, p) for p in ARTIST_PROFILES]
    scored.sort(key=lambda m: m["score"], reverse=True)
    top = scored[:top_n]
    for match in top[:3]:
        match["playbook"] = build_playbook(match)

    best = top[0]
    return {
        "features": features.to_dict(),
        "overall_grade": best["grade"],
        "overall_score": best["score"],
        "headline": (
            f"Closest major-artist audience: {best['artist']} "
            f"({best['score']}/100, grade {best['grade']})"
        ),
        "matches": top,
        "disclaimer": (
            "Fit scores identify which major-artist audiences your track sonically "
            "belongs with. No service can directly place a track into Spotify or "
            "Apple Music artist radio — those stations are built from real listener "
            "behavior. The playbooks target the right listeners through compliant "
            "channels so the algorithms pick the track up organically."
        ),
    }
