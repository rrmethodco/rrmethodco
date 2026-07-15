"""Smoke tests: synthesize audio, run the full analyze → score pipeline."""

import os
import sys
import tempfile

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "app"))

from analyzer import analyze_file  # noqa: E402
from scoring import grade_for, rank_matches, score_against_profile  # noqa: E402
from profiles import ARTIST_PROFILES  # noqa: E402

SR = 22050


def synth_track(seconds: float = 12.0, bpm: float = 120.0) -> str:
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
    fd, path = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    sf.write(path, audio, SR)
    return path


def test_analyze_extracts_sane_features():
    path = synth_track()
    try:
        f = analyze_file(path)
    finally:
        os.unlink(path)
    assert 40 <= f.tempo <= 240
    for dim in ("energy", "danceability", "brightness", "acousticness",
                "valence", "dynamics", "density"):
        v = getattr(f, dim)
        assert 0.0 <= v <= 1.0, f"{dim}={v} out of range"
    assert f.mode in ("major", "minor")
    assert f.key in {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"}


def test_scoring_and_ranking():
    path = synth_track()
    try:
        f = analyze_file(path)
    finally:
        os.unlink(path)

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
    test_scoring_and_ranking()
    test_perfect_profile_match_scores_high()
    test_grade_bands()
    print("all tests passed")
