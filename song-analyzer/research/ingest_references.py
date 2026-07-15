"""Batch-analyze reference audio (e.g. charting songs) to calibrate the engine.

Point this at a folder of reference tracks you have lawful access to
(purchased downloads, a licensed research library, your own catalog):

    refs/
      Drake/
        track1.mp3
        track2.mp3
      Taylor Swift/
        ...

Usage:
    python ingest_references.py refs/                 # derive artist profiles
    python ingest_references.py refs/ --corpus-metrics  # also derive structure
                                                        # benchmarks from all audio

Outputs (both consumed automatically by the app):
  app/data/artist_profiles.json — per-artist sonic centroids that override the
      hand-curated seed profiles in profiles.py. Artists need >= MIN_TRACKS
      tracks; artists not in the seed list get placeholder genre/audience
      metadata you can edit in the JSON.
  app/data/corpus_metrics.json  — with --corpus-metrics: percentile stats of
      structure metrics (intro length, hook arrival, repetition, ...) across
      the whole corpus. The streaming-readiness grader prefers these over its
      hand-tuned defaults.

Only derived statistics are written. No audio is copied or redistributed —
feature extraction from recordings you have lawful access to is standard
music-information-retrieval practice.
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent / "app"))

from analyzer import analyze_file  # noqa: E402
from profiles import ARTIST_PROFILES  # noqa: E402

AUDIO_EXTENSIONS = {".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac", ".aiff", ".aif"}
MIN_TRACKS = 3
DATA_DIR = Path(__file__).parent.parent / "app" / "data"

STRUCTURE_FIELDS = [
    "intro_length", "hook_arrival", "repetition", "hook_prominence",
    "stereo_width", "loudness_lufs", "duration_total", "tempo_stability",
]


def percentiles(values: list[float]) -> dict:
    arr = np.array(values, dtype=float)
    return {
        "p10": round(float(np.percentile(arr, 10)), 3),
        "p25": round(float(np.percentile(arr, 25)), 3),
        "p50": round(float(np.percentile(arr, 50)), 3),
        "p75": round(float(np.percentile(arr, 75)), 3),
        "p90": round(float(np.percentile(arr, 90)), 3),
        "mean": round(float(arr.mean()), 3),
        "n": int(arr.size),
    }


def analyze_folder(root: Path) -> tuple[dict, list]:
    """Analyze every audio file; returns (per-artist feature rows, structures)."""
    by_artist: dict[str, list] = {}
    structures = []
    files = [p for p in sorted(root.rglob("*")) if p.suffix.lower() in AUDIO_EXTENSIONS]
    if not files:
        raise SystemExit(f"no audio files found under {root}")
    for i, path in enumerate(files, 1):
        artist = path.parent.name if path.parent != root else "_uncategorized"
        print(f"[{i}/{len(files)}] {artist} / {path.name}", flush=True)
        try:
            features, structure = analyze_file(str(path))
        except Exception as exc:
            print(f"    skipped ({exc})")
            continue
        by_artist.setdefault(artist, []).append(features)
        structures.append(structure)
    return by_artist, structures


def derive_profiles(by_artist: dict) -> dict:
    seed_meta = {p.name: p for p in ARTIST_PROFILES}
    profiles = {}
    for artist, rows in sorted(by_artist.items()):
        if artist == "_uncategorized" or len(rows) < MIN_TRACKS:
            if artist != "_uncategorized":
                print(f"  ! {artist}: only {len(rows)} tracks (need {MIN_TRACKS}) — skipped")
            continue
        tempos = np.array([r.tempo for r in rows])
        seed = seed_meta.get(artist)
        profiles[artist] = {
            "genres": seed.genres if seed else ["unknown — edit me"],
            "audience": seed.audience if seed else "Edit: describe this artist's audience.",
            "tempo_center": round(float(np.median(tempos)), 1),
            "tempo_spread": round(max(15.0, float(np.percentile(tempos, 75) - np.percentile(tempos, 25))), 1),
            "energy": round(float(np.median([r.energy for r in rows])), 3),
            "danceability": round(float(np.median([r.danceability for r in rows])), 3),
            "brightness": round(float(np.median([r.brightness for r in rows])), 3),
            "acousticness": round(float(np.median([r.acousticness for r in rows])), 3),
            "valence": round(float(np.median([r.valence for r in rows])), 3),
            "density": round(float(np.median([r.density for r in rows])), 3),
            "minor_share": round(sum(1 for r in rows if r.mode == "minor") / len(rows), 3),
            "n_tracks": len(rows),
        }
    return profiles


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("root", help="folder of reference audio, one subfolder per artist")
    ap.add_argument("--corpus-metrics", action="store_true",
                    help="also derive structure benchmarks from all analyzed audio")
    args = ap.parse_args()

    by_artist, structures = analyze_folder(Path(args.root))
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    profiles = derive_profiles(by_artist)
    if profiles:
        out = DATA_DIR / "artist_profiles.json"
        out.write_text(json.dumps({"derived_profiles": profiles}, indent=2) + "\n")
        print(f"wrote {out} ({len(profiles)} artists)")
    else:
        print("no artist had enough tracks to derive a profile")

    if args.corpus_metrics and structures:
        stats = {
            field: percentiles([getattr(s, field) for s in structures])
            for field in STRUCTURE_FIELDS
        }
        out = DATA_DIR / "corpus_metrics.json"
        out.write_text(json.dumps(
            {"n_tracks": len(structures), "structure": stats}, indent=2) + "\n")
        print(f"wrote {out} ({len(structures)} tracks)")


if __name__ == "__main__":
    main()
