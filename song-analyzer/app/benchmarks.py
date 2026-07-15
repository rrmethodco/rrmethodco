"""Loads empirical hit-song benchmarks for the grading engine.

Two data files, both optional (grading falls back to hand-tuned defaults):

  data/benchmarks.json      — derived from public chart/popularity metadata
                              (research/derive_benchmarks.py). Tempo, duration
                              and loudness distributions of hit-level tracks.
  data/corpus_metrics.json  — derived from actual reference audio analyzed by
                              our own pipeline (research/ingest_references.py
                              --corpus-metrics). Structure metrics the public
                              metadata can't provide: intro length, hook
                              arrival, repetition.
"""

import json
from functools import lru_cache
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"


@lru_cache(maxsize=1)
def hit_benchmarks() -> dict | None:
    """Percentile stats of hit-level tracks, or None if not derived yet."""
    path = DATA_DIR / "benchmarks.json"
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text()).get("hits")
    except (json.JSONDecodeError, OSError):
        return None


@lru_cache(maxsize=1)
def corpus_metrics() -> dict | None:
    """Structure-metric stats from analyzed reference audio, or None."""
    path = DATA_DIR / "corpus_metrics.json"
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text()).get("structure")
    except (json.JSONDecodeError, OSError):
        return None


def hit_range(field: str, lo_key: str = "p25", hi_key: str = "p75",
              default: tuple[float, float] | None = None) -> tuple[float, float] | None:
    """(lo, hi) of a hit-distribution field, or `default` if unavailable."""
    stats = hit_benchmarks()
    if stats and field in stats:
        return stats[field][lo_key], stats[field][hi_key]
    return default
