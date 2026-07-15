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


def synth_structured_song(bpm: float = 102.0) -> str:
    """Verse/chorus arrangement (intro V C V C V C C) for structure tests."""
    def section(chord_freqs, seconds, level):
        t = np.linspace(0, seconds, int(SR * seconds), endpoint=False)
        chord = sum(0.11 * np.sin(2 * np.pi * f * t) for f in chord_freqs)
        click = np.exp(-np.linspace(0, 8, int(SR * 0.05))) * np.sin(
            2 * np.pi * 75 * np.linspace(0, 0.05, int(SR * 0.05)))
        pulses = np.zeros_like(t)
        for b in np.arange(0, seconds, 60.0 / bpm):
            i = int(b * SR)
            pulses[i: i + len(click)] += click[: len(pulses) - i]
        rng = np.random.default_rng(3)
        return level * (chord + 0.9 * pulses + 0.015 * rng.standard_normal(len(t)))

    verse = section((220.0, 261.63, 329.63), 20, 0.7)    # A minor
    chorus = section((261.63, 329.63, 392.0), 18, 1.0)   # C major, louder
    intro = section((220.0,), 8, 0.35)
    audio = np.concatenate(
        [intro, verse, chorus, verse, chorus, verse * 0.9, chorus, chorus])
    audio /= np.abs(audio).max() * 1.15
    fd, path = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    sf.write(path, audio.astype(np.float32), SR)
    return path


def test_structure_segmentation_on_verse_chorus_song():
    path = synth_structured_song()
    try:
        _, s = analyze_file(path)
    finally:
        os.unlink(path)
    assert s.n_sections >= 3
    assert s.sections, "sections should be populated"
    for sec in s.sections:
        assert sec["label"] in ("intro", "verse", "chorus", "bridge", "outro")
        assert 0 <= sec["start"] < sec["end"]
        assert 0.0 <= sec["energy"] <= 1.0
        assert sec["end"] - sec["start"] >= 2.0, "boundary slivers should be merged"
    assert s.has_chorus
    # Ground truth: intro (8s) + verse (20s) puts the first chorus near 28s.
    assert 20 <= s.first_chorus_time <= 40, s.first_chorus_time
    assert 0.2 <= s.chorus_ratio <= 0.75
    assert len(s.energy_curve) == 8
    assert s.hard_ending and s.fade_out_seconds < 5
    # Am verse / C major chorus are relative keys — must NOT read as modulation.
    assert not s.key_change
    for dim in ("syncopation", "vocal_presence", "timbral_variety", "energy_build",
                "climax_position"):
        v = getattr(s, dim)
        assert 0.0 <= v <= 1.0, f"{dim}={v} out of range"
    assert s.true_peak_db <= 0.0
    assert s.loudness_range_db >= 0.0


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


def test_hit_benchmarks_loaded_and_used():
    from benchmarks import hit_benchmarks, hit_range
    stats = hit_benchmarks()
    assert stats is not None, "app/data/benchmarks.json should ship with the repo"
    assert stats["duration_s"]["n"] > 1000
    lo, hi = hit_range("tempo")
    assert 60 < lo < hi < 200
    # Grading must pick the empirical ranges up, not the fallbacks.
    from grading import DURATION_RANGE, TEMPO_RANGE
    assert DURATION_RANGE == (stats["duration_s"]["p25"], stats["duration_s"]["p75"])
    assert TEMPO_RANGE == (stats["tempo"]["p25"], stats["tempo"]["p75"])


def test_derived_profile_override(tmp_path=None):
    import json
    import profiles as profiles_mod
    seed = profiles_mod.ARTIST_PROFILES[0]
    derived = {
        "derived_profiles": {
            seed.name: {"tempo_center": 87.5, "energy": 0.512},
            "Brand New Artist": {
                "genres": ["testcore"], "audience": "test audience",
                "tempo_center": 120.0, "tempo_spread": 20.0, "energy": 0.5,
                "danceability": 0.5, "brightness": 0.5, "acousticness": 0.5,
                "valence": 0.5, "density": 0.5, "minor_share": 0.5,
            },
        }
    }
    path = profiles_mod.Path(profiles_mod.__file__).parent / "data" / "artist_profiles.json"
    assert not path.exists(), "test expects no derived profiles checked in"
    path.write_text(json.dumps(derived))
    try:
        merged = profiles_mod._apply_derived_profiles(
            [profiles_mod.ArtistProfile(**{
                **{k: getattr(seed, k) for k in (
                    "name", "genres", "tempo_center", "tempo_spread", "energy",
                    "danceability", "brightness", "acousticness", "valence",
                    "density", "minor_share", "audience")},
            })]
        )
        by_name = {p.name: p for p in merged}
        assert by_name[seed.name].tempo_center == 87.5
        assert by_name[seed.name].energy == 0.512
        assert "Brand New Artist" in by_name
        assert by_name["Brand New Artist"].genres == ["testcore"]
    finally:
        path.unlink()


def _fake_report(score: float, criticals: int = 0) -> dict:
    return {
        "overall_score": score,
        "overall_grade": grade_for(score),
        "pillars": [{"key": k, "score": score} for k in
                    ("quality", "catchiness", "streaming", "reach", "scalability")],
        "feedback": ([{"severity": "critical", "message": "clipping"}] * criticals
                     + [{"severity": "improve", "message": "fix the intro"}]),
        "audience": {"matches": [{"artist": "Drake", "score": 61.0}]},
        "features": {"key": "C", "mode": "major", "tempo": 120.0},
        "structure": {"duration_total": 200.0, "loudness_lufs": -8.0, "has_chorus": True},
    }


def test_triage_summary_buckets():
    from reporting import triage_summary
    assert triage_summary(_fake_report(80), "a.wav")["bucket"] == "priority"
    # A critical flag keeps even a strong track out of the priority bucket.
    crit = triage_summary(_fake_report(80, criticals=1), "b.wav")
    assert crit["bucket"] == "review"
    assert crit["top_issue"] == "clipping"
    assert crit["critical_flags"] == 1
    assert triage_summary(_fake_report(60), "c.wav")["bucket"] == "review"
    assert triage_summary(_fake_report(40), "d.wav")["bucket"] == "pass"
    row = triage_summary(_fake_report(80), "a.wav")
    assert row["nearest_artist"] == "Drake"
    assert row["key"] == "C major"


def test_b2b_api_key_gate():
    import b2b
    from fastapi import HTTPException
    saved = os.environ.pop("SONG_ANALYZER_API_KEYS", None)
    try:
        try:
            b2b._require_api_key("anything")
            raise AssertionError("unconfigured API must return 503")
        except HTTPException as exc:
            assert exc.status_code == 503
        os.environ["SONG_ANALYZER_API_KEYS"] = "k1, k2"
        b2b._require_api_key("k1")
        b2b._require_api_key("k2")
        try:
            b2b._require_api_key("wrong")
            raise AssertionError("bad key must return 401")
        except HTTPException as exc:
            assert exc.status_code == 401
    finally:
        if saved is None:
            os.environ.pop("SONG_ANALYZER_API_KEYS", None)
        else:
            os.environ["SONG_ANALYZER_API_KEYS"] = saved


if __name__ == "__main__":
    test_triage_summary_buckets()
    test_b2b_api_key_gate()
    test_structure_segmentation_on_verse_chorus_song()
    test_analyze_extracts_sane_features()
    test_structure_metrics_are_sane()
    test_grading_report_shape()
    test_scoring_and_ranking()
    test_perfect_profile_match_scores_high()
    test_grade_bands()
    test_hit_benchmarks_loaded_and_used()
    test_derived_profile_override()
    print("all tests passed")
