"""Audio feature extraction for uploaded tracks.

Extracts a platform-independent sonic fingerprint using librosa. We compute
our own features rather than relying on Spotify's Audio Features API, which
was deprecated for new third-party apps in November 2024.

All features are normalized to 0-1 (except tempo/key) so they can be compared
directly against curated artist profiles in profiles.py.
"""

from dataclasses import dataclass, asdict

import librosa
import numpy as np

# Analysis settings: 22.05kHz mono is plenty for feature extraction and keeps
# analysis under a few seconds per track. We analyze up to 90s from the
# middle-ish of the track to skip long intros.
SAMPLE_RATE = 22050
MAX_ANALYSIS_SECONDS = 90

KEY_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Krumhansl-Schmuckler key profiles for major/minor mode estimation.
MAJOR_PROFILE = np.array(
    [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
)
MINOR_PROFILE = np.array(
    [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]
)


@dataclass
class TrackFeatures:
    tempo: float          # BPM
    key: str              # e.g. "F#"
    mode: str             # "major" | "minor"
    energy: float         # 0-1, overall intensity (RMS-based)
    danceability: float   # 0-1, beat strength / pulse clarity
    brightness: float     # 0-1, spectral centroid (dark <-> bright)
    acousticness: float   # 0-1, harmonic vs percussive/electronic balance
    valence: float        # 0-1, estimated musical positivity
    dynamics: float       # 0-1, dynamic range (compressed <-> dynamic)
    density: float        # 0-1, onset/event density (sparse <-> busy)
    duration: float       # seconds of audio analyzed

    def to_dict(self) -> dict:
        d = asdict(self)
        return {k: (round(v, 3) if isinstance(v, float) else v) for k, v in d.items()}


def _clip01(x: float) -> float:
    return float(np.clip(x, 0.0, 1.0))


def _estimate_key_mode(chroma: np.ndarray) -> tuple[str, str]:
    profile = chroma.mean(axis=1)
    best_score, best_key, best_mode = -np.inf, 0, "major"
    for shift in range(12):
        rotated = np.roll(profile, -shift)
        for mode, template in (("major", MAJOR_PROFILE), ("minor", MINOR_PROFILE)):
            score = np.corrcoef(rotated, template)[0, 1]
            if score > best_score:
                best_score, best_key, best_mode = score, shift, mode
    return KEY_NAMES[best_key], best_mode


def analyze_file(path: str) -> TrackFeatures:
    """Extract the sonic fingerprint from an audio file."""
    total = librosa.get_duration(path=path)
    # Skip the first 15s (intros) when the track is long enough to afford it.
    offset = 15.0 if total > MAX_ANALYSIS_SECONDS + 30 else 0.0
    y, sr = librosa.load(
        path, sr=SAMPLE_RATE, mono=True, offset=offset, duration=MAX_ANALYSIS_SECONDS
    )
    if y.size < sr:  # under a second of audio
        raise ValueError("Audio file is too short to analyze (need at least 1 second).")

    # --- Rhythm ---
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
    tempo = float(np.atleast_1d(tempo)[0])

    # Danceability proxy: how much stronger onsets at beat positions are than
    # the average onset activity. Steady, prominent beats score high.
    if len(beats) > 4 and onset_env.mean() > 0:
        beat_strength = onset_env[beats].mean() / (onset_env.mean() + 1e-9)
        beat_intervals = np.diff(beats)
        regularity = 1.0 - min(1.0, float(np.std(beat_intervals) / (np.mean(beat_intervals) + 1e-9)))
        danceability = _clip01(0.25 * (beat_strength - 1.0) + 0.6 * regularity + 0.1)
    else:
        danceability = 0.1

    # --- Energy & dynamics ---
    rms = librosa.feature.rms(y=y)[0]
    energy = _clip01(float(rms.mean()) / 0.25)  # ~0.25 RMS is a loud modern master
    p95, p10 = np.percentile(rms, 95), np.percentile(rms, 10)
    dynamics = _clip01(float((p95 - p10) / (p95 + 1e-9)))

    # --- Timbre ---
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    brightness = _clip01(float(centroid.mean()) / 4000.0)

    y_harm, y_perc = librosa.effects.hpss(y)
    harm_e = float(np.sum(y_harm**2))
    perc_e = float(np.sum(y_perc**2))
    flatness = float(librosa.feature.spectral_flatness(y=y).mean())
    # Mostly-harmonic, non-noisy signals read as more acoustic/organic.
    acousticness = _clip01((harm_e / (harm_e + perc_e + 1e-9)) * (1.0 - min(1.0, flatness * 10)))

    # --- Event density ---
    onsets = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)
    onsets_per_sec = len(onsets) / (len(y) / sr)
    density = _clip01(onsets_per_sec / 6.0)  # ~6 onsets/sec is very busy

    # --- Tonality ---
    chroma = librosa.feature.chroma_cqt(y=y_harm, sr=sr)
    key, mode = _estimate_key_mode(chroma)

    # Valence proxy: major mode, brightness, and tempo all push positive.
    mode_term = 0.62 if mode == "major" else 0.38
    tempo_term = _clip01((tempo - 60) / 120.0)
    valence = _clip01(0.45 * mode_term + 0.3 * brightness + 0.25 * tempo_term)

    return TrackFeatures(
        tempo=round(tempo, 1),
        key=key,
        mode=mode,
        energy=energy,
        danceability=danceability,
        brightness=brightness,
        acousticness=acousticness,
        valence=valence,
        dynamics=dynamics,
        density=density,
        duration=round(len(y) / sr, 1),
    )
