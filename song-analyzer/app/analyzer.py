"""Audio feature extraction for uploaded tracks.

Extracts a platform-independent sonic fingerprint plus production/structure
metrics using librosa. We compute our own features rather than relying on
Spotify's Audio Features API, which was deprecated for new third-party apps
in November 2024.

Fingerprint features are normalized to 0-1 (except tempo/key) so they can be
compared directly against curated artist profiles in profiles.py. Structure
metrics feed the proprietary grading pillars in grading.py.
"""

from dataclasses import dataclass, asdict, field

import librosa
import numpy as np
import pyloudnorm

from structure import (
    detect_key_change,
    ending_metrics,
    energy_arc,
    estimate_key_mode,
    segment_sections,
    syncopation,
    timbral_variety,
    vocal_presence,
)

# Analysis settings: 22.05kHz mono is plenty for feature extraction and keeps
# analysis under a few seconds per track. The fingerprint uses up to 90s from
# past the intro; structure metrics look at up to 6 minutes of the track.
SAMPLE_RATE = 22050
MAX_ANALYSIS_SECONDS = 90
MAX_STRUCTURE_SECONDS = 360
LOUDNESS_SR = 44100  # pyloudnorm's K-weighting filters expect a full-band rate

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
    key_confidence: float = 1.0  # 0-1, separation of the winning key estimate

    def to_dict(self) -> dict:
        d = asdict(self)
        return {k: (round(v, 3) if isinstance(v, float) else v) for k, v in d.items()}


@dataclass
class StructureMetrics:
    """Production, arrangement, and structure metrics feeding the pillars."""
    duration_total: float     # full track length in seconds
    loudness_lufs: float      # integrated loudness (streaming target ~ -14)
    clipping_ratio: float     # fraction of samples at/near digital full scale
    stereo_width: float       # 0-1, side/mid energy balance (0 = mono)
    band_low: float           # share of spectral energy below 250 Hz
    band_mid: float           # share between 250 Hz and 4 kHz
    band_high: float          # share above 4 kHz
    intro_length: float       # seconds until the track reaches full energy
    hook_arrival: float       # seconds until the most-repeated section first plays
    repetition: float         # 0-1, how much material recurs (hook/chorus weight)
    hook_prominence: float    # 0-1, energy of repeated material vs track average
    tempo_stability: float    # 0-1, steadiness of the tempo over time
    # --- structure & arrangement ---
    sections: list = field(default_factory=list)  # [{start,end,label,energy}]
    n_sections: int = 0
    has_chorus: bool = False
    first_chorus_time: float = -1.0   # seconds; -1 when no chorus detected
    chorus_ratio: float = 0.0         # share of runtime spent in chorus
    avg_section_seconds: float = 0.0
    energy_build: float = 0.5         # 0-1, does energy climb toward a climax
    climax_position: float = 0.5      # 0-1, where the loudest moment sits
    energy_curve: list = field(default_factory=list)  # 8-point normalized arc
    fade_out_seconds: float = 0.0
    hard_ending: bool = True
    # --- tonality & feel ---
    key_change: bool = False
    second_key: str | None = None     # e.g. "D major" when key_change is True
    syncopation: float = 0.0          # 0-1, off-grid onset share
    vocal_presence: float = 0.0       # 0-1, harmonic mid-band proxy
    timbral_variety: float = 0.0      # 0-1, palette variation over time
    # --- master ---
    true_peak_db: float = -70.0       # dBFS sample peak (approx, no oversampling)
    loudness_range_db: float = 0.0    # short-term loudness spread

    def to_dict(self) -> dict:
        d = asdict(self)
        return {k: (round(v, 3) if isinstance(v, float) else v) for k, v in d.items()}


def _clip01(x: float) -> float:
    return float(np.clip(x, 0.0, 1.0))


def analyze_file(path: str) -> tuple[TrackFeatures, StructureMetrics]:
    """Extract the sonic fingerprint and structure metrics from an audio file."""
    total = librosa.get_duration(path=path)
    y_full, sr = librosa.load(path, sr=SAMPLE_RATE, mono=True, duration=MAX_STRUCTURE_SECONDS)
    if y_full.size < sr:  # under a second of audio
        raise ValueError("Audio file is too short to analyze (need at least 1 second).")

    structure = _analyze_structure(path, y_full, sr, total)

    # Fingerprint on up to 90s from past the intro, when the track affords it.
    start = int(15.0 * sr) if total > MAX_ANALYSIS_SECONDS + 30 else 0
    y = y_full[start : start + int(MAX_ANALYSIS_SECONDS * sr)]
    features = _fingerprint(y, sr)
    return features, structure


def _fingerprint(y: np.ndarray, sr: int) -> TrackFeatures:

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
    key, mode, key_confidence = estimate_key_mode(chroma)

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
        key_confidence=key_confidence,
    )


def _loudness_and_stereo(path: str) -> dict:
    """Master metrics from a full-band load: loudness, peaks, width, range."""
    y2, sr2 = librosa.load(path, sr=LOUDNESS_SR, mono=False, duration=120.0)
    if y2.ndim == 1:
        stereo_width = 0.0
        samples = y2
        mono_mix = y2
        meter_input = y2
    else:
        left, right = y2[0], y2[1]
        mid = (left + right) / 2.0
        side = (left - right) / 2.0
        mid_rms = float(np.sqrt(np.mean(mid**2))) + 1e-9
        side_rms = float(np.sqrt(np.mean(side**2)))
        stereo_width = _clip01(side_rms / mid_rms * 2.0)
        samples = y2.flatten()
        mono_mix = mid
        meter_input = y2.T  # pyloudnorm expects (samples, channels)

    clipping_ratio = float(np.mean(np.abs(samples) >= 0.985))
    peak = float(np.max(np.abs(samples))) + 1e-12
    true_peak_db = round(20.0 * np.log10(peak), 2)

    meter = pyloudnorm.Meter(LOUDNESS_SR)
    try:
        lufs = float(meter.integrated_loudness(np.ascontiguousarray(meter_input)))
        if not np.isfinite(lufs):
            lufs = -70.0
    except Exception:
        lufs = -70.0

    # Short-term (3s) loudness spread — an LRA-style dynamics-of-the-master
    # measure, computed as p95 - p10 of windowed RMS in dB.
    win = 3 * LOUDNESS_SR
    n_windows = max(1, len(mono_mix) // win)
    window_rms = np.array([
        np.sqrt(np.mean(mono_mix[i * win:(i + 1) * win] ** 2) + 1e-12)
        for i in range(n_windows)
    ])
    window_db = 20.0 * np.log10(window_rms + 1e-12)
    loudness_range_db = float(np.percentile(window_db, 95) - np.percentile(window_db, 10)) \
        if len(window_db) > 3 else 0.0

    return {
        "loudness_lufs": lufs,
        "clipping_ratio": clipping_ratio,
        "stereo_width": stereo_width,
        "true_peak_db": true_peak_db,
        "loudness_range_db": round(loudness_range_db, 1),
    }


def _analyze_structure(
    path: str, y: np.ndarray, sr: int, duration_total: float
) -> StructureMetrics:
    master = _loudness_and_stereo(path)

    # Spectral energy balance across low / mid / high bands.
    spec = np.abs(librosa.stft(y, n_fft=2048)) ** 2
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
    total_e = float(spec.sum()) + 1e-9
    band_low = float(spec[freqs < 250].sum()) / total_e
    band_high = float(spec[freqs >= 4000].sum()) / total_e
    band_mid = max(0.0, 1.0 - band_low - band_high)

    # Intro length: seconds until smoothed RMS first reaches 60% of the
    # track's sustained loud level (85th percentile frame RMS).
    rms = librosa.feature.rms(y=y)[0]
    times = librosa.times_like(rms, sr=sr)
    kernel = max(1, int(1.0 / (times[1] - times[0])))  # ~1s smoothing
    rms_smooth = np.convolve(rms, np.ones(kernel) / kernel, mode="same")
    threshold = 0.6 * float(np.percentile(rms_smooth, 85))
    above = np.nonzero(rms_smooth >= threshold)[0]
    intro_length = float(times[above[0]]) if above.size else float(times[-1])

    # Repetition / hook detection via beat-synchronous chroma self-similarity.
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    _, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
    repetition, hook_arrival, hook_prominence = 0.0, duration_total, 0.0
    if len(beats) >= 16:
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        chroma_sync = librosa.util.sync(chroma, beats)
        rec = librosa.segment.recurrence_matrix(
            chroma_sync, mode="affinity", sym=True, width=4
        )
        off_diag = rec[np.triu_indices_from(rec, k=4)]
        if off_diag.size:
            # How strongly the top decile of section pairs repeat each other.
            repetition = _clip01(float(np.percentile(off_diag, 90)) * 1.4)
        row_strength = rec.sum(axis=1)
        top_beats = np.argsort(row_strength)[-max(4, len(beats) // 10):]
        beat_times = librosa.frames_to_time(beats, sr=sr)
        hook_arrival = float(beat_times[int(top_beats.min())])
        rms_at_beats = librosa.util.sync(rms[np.newaxis, :], beats).flatten()
        if rms_at_beats.size and rms_at_beats.mean() > 0:
            hook_rms = rms_at_beats[top_beats[top_beats < len(rms_at_beats)]]
            if hook_rms.size:
                hook_prominence = _clip01(
                    float(hook_rms.mean()) / (float(rms_at_beats.mean()) + 1e-9) - 0.5
                )

    # Tempo stability: variation of the frame-wise tempo estimate.
    tempo_track = librosa.feature.tempo(
        onset_envelope=onset_env, sr=sr, aggregate=None
    )
    if tempo_track.size > 1 and float(np.mean(tempo_track)) > 0:
        cv = float(np.std(tempo_track)) / float(np.mean(tempo_track))
        tempo_stability = _clip01(1.0 - cv * 3.0)
    else:
        tempo_stability = 0.5

    # --- Song structure, energy arc, ending, tonality, feel ---
    analyzed_duration = len(y) / sr
    section_info = segment_sections(y, sr, beats, rms, analyzed_duration)
    arc = energy_arc(rms, times)
    ending = ending_metrics(rms, times)

    y_harm_full = librosa.effects.harmonic(y)
    chroma_full = librosa.feature.chroma_cqt(y=y_harm_full, sr=sr)
    key_change, second_key = detect_key_change(chroma_full)

    return StructureMetrics(
        duration_total=round(duration_total, 1),
        loudness_lufs=round(master["loudness_lufs"], 1),
        clipping_ratio=round(master["clipping_ratio"], 4),
        stereo_width=master["stereo_width"],
        band_low=band_low,
        band_mid=band_mid,
        band_high=band_high,
        intro_length=round(intro_length, 1),
        hook_arrival=round(hook_arrival, 1),
        repetition=repetition,
        hook_prominence=hook_prominence,
        tempo_stability=tempo_stability,
        sections=section_info["sections"],
        n_sections=section_info["n_sections"],
        has_chorus=section_info["has_chorus"],
        first_chorus_time=section_info["first_chorus_time"],
        chorus_ratio=section_info["chorus_ratio"],
        avg_section_seconds=section_info["avg_section_seconds"],
        energy_build=arc["energy_build"],
        climax_position=arc["climax_position"],
        energy_curve=arc["energy_curve"],
        fade_out_seconds=ending["fade_out_seconds"],
        hard_ending=ending["hard_ending"],
        key_change=key_change,
        second_key=second_key,
        syncopation=syncopation(onset_env, beats, sr),
        vocal_presence=vocal_presence(y_harm_full, sr),
        timbral_variety=timbral_variety(y, sr),
        true_peak_db=master["true_peak_db"],
        loudness_range_db=master["loudness_range_db"],
    )
