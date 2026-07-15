"""Derive hit-song benchmarks from a public dataset of Spotify tracks.

Studies what famous charting/high-popularity songs actually look like and
writes the aggregated statistics to app/data/benchmarks.json, which the
grading engine loads instead of hand-tuned ranges.

Source dataset: the TidyTuesday 2020-01-21 `spotify_songs.csv` snapshot
(~33k tracks with Spotify audio features and 0-100 track popularity).
We treat popularity >= 75 as "hit-level" — roughly chart/major-playlist
territory at snapshot time. Only derived statistics are stored; no dataset
rows are redistributed.

Semantics note: Spotify's `loudness` (album-normalized dB) approximates
integrated LUFS closely enough for range-setting; `energy`, `danceability`,
`valence`, `acousticness` are Spotify's learned features, while our analyzer
computes DSP proxies of the same concepts — so those distributions are
recorded for reference and used only loosely (wide tolerances) in grading.
Tempo and duration are directly comparable.

Usage:
    python derive_benchmarks.py path/to/spotify_songs.csv
"""

import csv
import json
import sys
from pathlib import Path

import numpy as np

HIT_POPULARITY = 75
OUT_PATH = Path(__file__).parent.parent / "app" / "data" / "benchmarks.json"

NUMERIC_FIELDS = [
    "tempo", "loudness", "energy", "danceability", "valence",
    "acousticness", "duration_s", "mode",
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


def load_rows(csv_path: str) -> list[dict]:
    rows = []
    with open(csv_path, newline="", encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            try:
                rows.append({
                    "popularity": float(row["track_popularity"]),
                    "genre": row["playlist_genre"].strip().lower(),
                    "tempo": float(row["tempo"]),
                    "loudness": float(row["loudness"]),
                    "energy": float(row["energy"]),
                    "danceability": float(row["danceability"]),
                    "valence": float(row["valence"]),
                    "acousticness": float(row["acousticness"]),
                    "duration_s": float(row["duration_ms"]) / 1000.0,
                    "mode": float(row["mode"]),
                })
            except (KeyError, ValueError):
                continue
    return rows


def stats_for(rows: list[dict]) -> dict:
    return {
        field: percentiles([r[field] for r in rows])
        for field in NUMERIC_FIELDS
    }


def main(csv_path: str) -> None:
    rows = load_rows(csv_path)
    hits = [r for r in rows if r["popularity"] >= HIT_POPULARITY]
    if len(hits) < 200:
        raise SystemExit(f"only {len(hits)} hit-level rows — refusing to derive benchmarks")

    by_genre = {}
    for genre in sorted({r["genre"] for r in hits}):
        genre_hits = [r for r in hits if r["genre"] == genre]
        if len(genre_hits) >= 100:
            by_genre[genre] = stats_for(genre_hits)

    benchmarks = {
        "source": "tidytuesday 2020-01-21 spotify_songs.csv",
        "hit_definition": f"track_popularity >= {HIT_POPULARITY}",
        "n_tracks_total": len(rows),
        "n_hits": len(hits),
        "hits": stats_for(hits),
        "all_tracks": stats_for(rows),
        "hits_by_genre": by_genre,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(benchmarks, indent=2) + "\n")
    print(f"wrote {OUT_PATH}")
    print(f"  {len(hits)} hit-level tracks of {len(rows)} total")
    h = benchmarks["hits"]
    print(f"  hit duration p25-p75: {h['duration_s']['p25']:.0f}-{h['duration_s']['p75']:.0f}s "
          f"(median {h['duration_s']['p50']:.0f}s)")
    print(f"  hit loudness p25-p75: {h['loudness']['p25']} to {h['loudness']['p75']} dB")
    print(f"  hit tempo p25-p75: {h['tempo']['p25']:.0f}-{h['tempo']['p75']:.0f} BPM")
    print(f"  genres with benchmarks: {', '.join(by_genre)}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "spotify_songs.csv")
