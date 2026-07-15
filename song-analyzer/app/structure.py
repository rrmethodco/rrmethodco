"""Musicological structure analysis: sections, energy arc, tonality, rhythm.

This module turns raw audio into song-level KPIs that simple frame statistics
can't provide:

- Section segmentation and labeling (intro / verse / chorus / bridge / outro)
  via beat-synchronous chroma+MFCC agglomerative segmentation, then clustering
  of segments into repeated section families. The most-repeated, highest-energy
  family is labeled the chorus.
- Energy arc: does the track build toward a climax, and where does the climax
  sit in the timeline?
- Ending analysis: fade-out length vs cold ending.
- Key estimation (Krumhansl-Schmuckler) and modulation detection.
- Rhythm feel: syncopation (off-beat onset share).
- Vocal presence (harmonic mid-band energy — a stemless proxy) and timbral
  variety (MFCC variation over time).

Everything here is deterministic DSP. Section labels are heuristic — they are
the analyzer's best structural reading, not ground truth, and are labeled as
such in the product copy.
"""

import numpy as np
import librosa
import scipy.cluster.hierarchy as hierarchy

KEY_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Krumhansl-Schmuckler key profiles for major/minor mode estimation.
MAJOR_PROFILE = np.array(
    [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
)
MINOR_PROFILE = np.array(
    [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]
)

# Cosine distance under which two segments are considered the same section
# family (verse 1 ~ verse 2). Tuned on synthetic + spot-checked material.
SECTION_CLUSTER_DISTANCE = 0.08


def _clip01(x: float) -> float:
    return float(np.clip(x, 0.0, 1.0))


def estimate_key_mode(chroma: np.ndarray) -> tuple[str, str, float]:
    """Best (key, mode, confidence) for a chroma matrix."""
    profile = chroma.mean(axis=1)
    scores = []
    for shift in range(12):
        rotated = np.roll(profile, -shift)
        for mode, template in (("major", MAJOR_PROFILE), ("minor", MINOR_PROFILE)):
            score = float(np.corrcoef(rotated, template)[0, 1])
            scores.append((score, KEY_NAMES[shift], mode))
    scores.sort(reverse=True)
    best, runner_up = scores[0], scores[1]
    # Confidence: how far the winner separates from the next candidate.
    confidence = _clip01((best[0] - runner_up[0]) * 8.0 + 0.3)
    return best[1], best[2], confidence


def _is_relative_pair(key_a: str, mode_a: str, key_b: str, mode_b: str) -> bool:
    """True for relative major/minor pairs (same pitch set, e.g. Am <-> C)."""
    ia, ib = KEY_NAMES.index(key_a), KEY_NAMES.index(key_b)
    if mode_a == "minor" and mode_b == "major":
        return (ia + 3) % 12 == ib
    if mode_a == "major" and mode_b == "minor":
        return (ib + 3) % 12 == ia
    return False


def detect_key_change(chroma: np.ndarray) -> tuple[bool, str | None]:
    """Compare tonality of the track's halves to spot a true modulation.

    Relative-key flips (A minor <-> C major) are ignored: they share a pitch
    set, so a chorus leaning on the relative major is normal harmony, not a
    key change.
    """
    if chroma.shape[1] < 32:
        return False, None
    half = chroma.shape[1] // 2
    key_a, mode_a, conf_a = estimate_key_mode(chroma[:, :half])
    key_b, mode_b, conf_b = estimate_key_mode(chroma[:, half:])
    if (key_a, mode_a) == (key_b, mode_b) or _is_relative_pair(key_a, mode_a, key_b, mode_b):
        return False, None
    if min(conf_a, conf_b) > 0.45:
        return True, f"{key_b} {mode_b}"
    return False, None


# --------------------------------------------------------------------------
# Section segmentation
# --------------------------------------------------------------------------

def segment_sections(
    y: np.ndarray, sr: int, beats: np.ndarray, rms: np.ndarray, duration: float
) -> dict:
    """Detect and label song sections. Returns section list + structure KPIs."""
    empty = {
        "sections": [], "n_sections": 0, "chorus_ratio": 0.0,
        "first_chorus_time": -1.0, "has_chorus": False, "avg_section_seconds": 0.0,
    }
    if len(beats) < 24:
        return empty

    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)[1:]  # drop loudness-ish c0
    feats = np.vstack([
        librosa.util.normalize(librosa.util.sync(chroma, beats), axis=0),
        librosa.util.normalize(librosa.util.sync(mfcc, beats), axis=0),
    ])
    n_beats = feats.shape[1]

    # One boundary roughly every ~16 beats (about 8 bars in 4/4), bounded.
    k = int(np.clip(round(n_beats / 16), 4, 14))
    k = min(k, max(2, n_beats // 8))
    bounds = librosa.segment.agglomerative(feats, k)
    bounds = np.unique(np.concatenate([bounds, [0], [n_beats]]))

    beat_times = librosa.frames_to_time(beats, sr=sr)
    rms_beats = librosa.util.sync(rms[np.newaxis, :], beats).flatten()

    segments = []
    for i in range(len(bounds) - 1):
        b0, b1 = int(bounds[i]), int(bounds[i + 1])
        if b1 <= b0:
            continue
        start = float(beat_times[b0]) if b0 < len(beat_times) else duration
        end = float(beat_times[b1]) if b1 < len(beat_times) else duration
        mean_feat = feats[:, b0:b1].mean(axis=1)
        energy = float(rms_beats[b0:min(b1, len(rms_beats))].mean()) if len(rms_beats) > b0 else 0.0
        segments.append({"start": start, "end": end, "feat": mean_feat, "energy": energy})
    if len(segments) < 2:
        return empty

    # Cluster segments into repeated section families (cosine distance).
    mat = np.array([s["feat"] / (np.linalg.norm(s["feat"]) + 1e-9) for s in segments])
    if len(segments) == 2:
        families = np.array([1, 2])
    else:
        links = hierarchy.linkage(mat, method="average", metric="cosine")
        families = hierarchy.fcluster(links, t=SECTION_CLUSTER_DISTANCE, criterion="distance")

    fam_stats = {}
    for seg, fam in zip(segments, families):
        st = fam_stats.setdefault(int(fam), {"count": 0, "time": 0.0, "energy": []})
        st["count"] += 1
        st["time"] += seg["end"] - seg["start"]
        st["energy"].append(seg["energy"])
    for st in fam_stats.values():
        st["energy"] = float(np.mean(st["energy"]))

    # Chorus family: repeated, and the most energetic among repeated families.
    repeated = {f: st for f, st in fam_stats.items() if st["count"] >= 2}
    chorus_fam = max(repeated, key=lambda f: repeated[f]["energy"]) if repeated else None

    max_energy = max(st["energy"] for st in fam_stats.values()) + 1e-9
    sections = []
    for i, (seg, fam) in enumerate(zip(segments, families)):
        fam = int(fam)
        rel_energy = seg["energy"] / max_energy
        if fam == chorus_fam:
            label = "chorus"
        elif i == 0 and fam_stats[fam]["count"] == 1 and rel_energy < 0.85:
            label = "intro"
        elif i == len(segments) - 1 and fam_stats[fam]["count"] == 1 and rel_energy < 0.85:
            label = "outro"
        elif fam_stats[fam]["count"] >= 2:
            label = "verse"
        else:
            label = "bridge"
        sections.append({
            "start": round(seg["start"], 1),
            "end": round(seg["end"], 1),
            "label": label,
            "energy": round(min(1.0, rel_energy), 2),
        })

    # Clean the timeline: absorb boundary slivers (<2.5s) and merge
    # consecutive sections that share a label into one block.
    merged: list[dict] = []
    for sec in sections:
        short = (sec["end"] - sec["start"]) < 2.5
        if merged and (short or sec["label"] == merged[-1]["label"]):
            merged[-1]["end"] = sec["end"]
            merged[-1]["energy"] = max(merged[-1]["energy"], sec["energy"])
        else:
            merged.append(dict(sec))
    sections = merged

    chorus_secs = [s for s in sections if s["label"] == "chorus"]
    chorus_time = sum(s["end"] - s["start"] for s in chorus_secs)
    return {
        "sections": sections,
        "n_sections": len(sections),
        "chorus_ratio": round(chorus_time / max(duration, 1e-9), 3),
        "first_chorus_time": round(chorus_secs[0]["start"], 1) if chorus_secs else -1.0,
        "has_chorus": bool(chorus_secs),
        "avg_section_seconds": round(float(np.mean(
            [s["end"] - s["start"] for s in sections])), 1),
    }


# --------------------------------------------------------------------------
# Energy arc & ending
# --------------------------------------------------------------------------

def energy_arc(rms: np.ndarray, times: np.ndarray) -> dict:
    """Build/climax KPIs plus an 8-point normalized energy curve for the UI."""
    kernel = max(1, int(3.0 / max(times[1] - times[0], 1e-9)))  # ~3s smoothing
    smooth = np.convolve(rms, np.ones(kernel) / kernel, mode="same")
    peak = float(smooth.max()) + 1e-9

    climax_idx = int(np.argmax(smooth))
    climax_position = float(times[climax_idx] / max(times[-1], 1e-9))

    # Energy build: rank correlation between time and energy up to the climax.
    upto = smooth[: max(climax_idx, 2)]
    ranks = np.argsort(np.argsort(upto))
    t = np.arange(len(upto))
    denom = float(np.std(ranks) * np.std(t)) + 1e-9
    build_corr = float(np.mean((ranks - ranks.mean()) * (t - t.mean())) / denom)
    energy_build = _clip01(0.5 + 0.5 * build_corr)

    curve = [round(float(np.mean(chunk) / peak), 2)
             for chunk in np.array_split(smooth, 8)]
    return {
        "energy_build": round(energy_build, 3),
        "climax_position": round(climax_position, 3),
        "energy_curve": curve,
    }


def ending_metrics(rms: np.ndarray, times: np.ndarray) -> dict:
    """Fade-out length and whether the track ends cold (streaming-era norm)."""
    level = float(np.percentile(rms, 85)) + 1e-9
    rel = rms / level
    fade_seconds = 0.0
    threshold_idx = None
    for i in range(len(rel) - 1, -1, -1):
        if rel[i] >= 0.5:
            threshold_idx = i
            break
    if threshold_idx is not None and threshold_idx < len(rel) - 1:
        fade_seconds = float(times[-1] - times[threshold_idx])
    last_window = rel[times >= times[-1] - 3.0]
    hard_ending = bool(last_window.size and float(last_window.mean()) >= 0.4)
    return {"fade_out_seconds": round(fade_seconds, 1), "hard_ending": hard_ending}


# --------------------------------------------------------------------------
# Rhythm feel & timbre
# --------------------------------------------------------------------------

def syncopation(onset_env: np.ndarray, beats: np.ndarray, sr: int) -> float:
    """Share of onset energy that lands off the beat grid (0 = four-square)."""
    if len(beats) < 8:
        return 0.0
    onsets = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)
    if onsets.size == 0:
        return 0.0
    beat_interval = float(np.median(np.diff(beats)))
    tolerance = beat_interval * 0.2
    # Distance from each onset to the nearest beat or half-beat position.
    grid = np.sort(np.concatenate([beats, beats[:-1] + np.diff(beats) / 2.0]))
    dist = np.min(np.abs(onsets[:, None] - grid[None, :]), axis=1)
    return _clip01(float(np.mean(dist > tolerance)) * 1.5)


def vocal_presence(y_harm: np.ndarray, sr: int) -> float:
    """Harmonic energy share in the 300 Hz-3.4 kHz melody/vocal band.

    A stemless proxy: high values mean a prominent melodic foreground (usually
    a vocal), not a guarantee of one.
    """
    spec = np.abs(librosa.stft(y_harm, n_fft=2048)) ** 2
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
    total = float(spec.sum()) + 1e-9
    band = float(spec[(freqs >= 300) & (freqs <= 3400)].sum())
    return _clip01((band / total - 0.25) * 2.2)


def timbral_variety(y: np.ndarray, sr: int) -> float:
    """How much the sound palette changes over time (MFCC dispersion)."""
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)[1:]
    spread = float(np.mean(np.std(mfcc, axis=1)))
    return _clip01(spread / 20.0)
