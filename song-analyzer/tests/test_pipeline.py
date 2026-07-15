"""Smoke tests: synthesize audio, run the full analyze → grade → rank pipeline."""

import os
import sys
import tempfile

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "app"))

from analyzer import analyze_file  # noqa: E402
from grading import context_fits, grade_track  # noqa: E402
from scoring import grade_for, rank_matches, score_against_profile  # noqa: E402
from profiles import ARTIST_PROFILES  # noqa: E402

SR = 22050


def synth_track(seconds: float = 40.0, bpm: float = 120.0, stereo: bool = False) -> str:
    """Synthesize a kick-pulse + chord track and return a temp WAV path."""
    t = np.linspace(0, seconds, int(SR * seconds), endpoint=False)
    # Sustained major chord (A, C#, E) for tonal content
    chord = sum(0.15 * np.sin(2 * np.pi * f * t) for f in (220.0, 277.18, 329.63))
    # Kick-like pulses on the beat grid
    beat_period = 60.0 / bpm
    pulses = np.zeros_like(t)
    click = np.exp(-np.linspace(0, 8, int(SR * 0.05))) * np.sin(
        2 * np.pi * 80 * np.linspace(0, 0.05, int(SR * 0.05))
    )
    for b in np.arange(0, seconds, beat_period):
        i = int(b * SR)
        pulses[i : i + len(click)] += click[: len(pulses) - i]
    audio = (chord + 0.8 * pulses).astype(np.float32)
    audio /= np.abs(audio).max()
    if stereo:
        audio = np.stack([audio, np.roll(audio, 40)], axis=1)
    fd, path = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    sf.write(path, audio, SR)
    return path


def _analyzed(**kwargs):
    path = synth_track(**kwargs)
    try:
        return analyze_file(path)
    finally:
        os.unlink(path)


def test_analyze_extracts_sane_features():
    f, s = _analyzed()
    assert 40 <= f.tempo <= 240
    for dim in ("energy", "danceability", "brightness", "acousticness",
                "valence", "dynamics", "density"):
        v = getattr(f, dim)
        assert 0.0 <= v <= 1.0, f"{dim}={v} out of range"
    assert f.mode in ("major", "minor")
    assert f.key in {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"}


def test_structure_metrics_are_sane():
    _, s = _analyzed(stereo=True)
    assert 35 <= s.duration_total <= 45
    assert -70 <= s.loudness_lufs <= 0
    assert 0.0 <= s.clipping_ratio <= 1.0
    for dim in ("stereo_width", "repetition", "hook_prominence", "tempo_stability"):
        v = getattr(s, dim)
        assert 0.0 <= v <= 1.0, f"{dim}={v} out of range"
    assert abs(s.band_low + s.band_mid + s.band_high - 1.0) < 0.01
    assert 0.0 <= s.intro_length <= s.duration_total
    assert 0.0 <= s.hook_arrival <= s.duration_total
    assert s.stereo_width > 0.0  # stereo input must register width


def test_grading_report_shape():
    f, s = _analyzed()
    audience = rank_matches(f)
    report = grade_track(f, s, audience["matches"])

    assert 0 <= report["overall_score"] <= 100
    assert report["overall_grade"] == grade_for(report["overall_score"])
    keys = {p["key"] for p in report["pillars"]}
    assert keys == {"quality", "catchiness", "streaming", "reach", "scalability"}
    for p in report["pillars"]:
        assert 0 <= p["score"] <= 100
        assert p["grade"] == grade_for(p["score"])
    assert len(report["contexts"]) == len(context_fits(f))
    assert report["feedback"], "feedback should never be empty"
    for item in report["feedback"]:
        assert item["severity"] in ("critical", "improve", "tip", "strength")
        assert item["message"]
    # Feedback is ordered most-severe first.
    rank = {"critical": 0, "improve": 1, "tip": 2, "strength": 3}
    sevs = [rank[i["severity"]] for i in report["feedback"]]
    assert sevs == sorted(sevs)


def test_scoring_and_ranking():
    f, _ = _analyzed()
    report = rank_matches(f)
    assert len(report["matches"]) == 5
    scores = [m["score"] for m in report["matches"]]
    assert scores == sorted(scores, reverse=True)
    for m in report["matches"]:
        assert 0 <= m["score"] <= 100
    # Top 3 matches carry playbooks; every playbook stays compliant.
    for m in report["matches"][:3]:
        assert m["playbook"], f"missing playbook for {m['artist']}"
        text = " ".join(s["action"] for s in m["playbook"]).lower()
        assert "never pay for guaranteed placement" in text
    assert "disclaimer" in report


def test_perfect_profile_match_scores_high():
    profile = ARTIST_PROFILES[0]
    from analyzer import TrackFeatures
    f = TrackFeatures(
        tempo=profile.tempo_center, key="C",
        mode="minor" if profile.minor_share >= 0.5 else "major",
        energy=profile.energy, danceability=profile.danceability,
        brightness=profile.brightness, acousticness=profile.acousticness,
        valence=profile.valence, dynamics=0.5, density=profile.density,
        duration=90.0,
    )
    match = score_against_profile(f, profile)
    assert match["score"] >= 90, match


def test_grade_bands():
    assert grade_for(95) == "A+"
    assert grade_for(72) == "B"
    assert grade_for(50) == "C-"
    assert grade_for(10) == "F"


if __name__ == "__main__":
    test_analyze_extracts_sane_features()
    test_structure_metrics_are_sane()
    test_grading_report_shape()
    test_scoring_and_ranking()
    test_perfect_profile_match_scores_high()
    test_grade_bands()
    print("all tests passed")
