"""Catalog triage CLI: rank a folder of tracks by release-readiness.

The B2B workhorse for volume that shouldn't go through a synchronous HTTP
call — a distributor's weekly intake, a label's demo inbox, a sync library's
back catalog. Runs entirely inside your infrastructure; audio never leaves
the machine.

Usage:
    python tools/triage_catalog.py path/to/catalog/ -o triage
    # writes triage.csv (spreadsheet-friendly) and triage.json (full rows)

Each row: rank, bucket (priority / review / pass), overall grade, per-pillar
scores, flag counts, top issue, nearest major-artist audience, key/tempo/
duration/loudness. Buckets are defined in app/reporting.py.
"""

import argparse
import csv
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "app"))

from reporting import ALLOWED_EXTENSIONS, full_report, triage_summary  # noqa: E402

CSV_COLUMNS = [
    "rank", "bucket", "filename", "overall_score", "overall_grade",
    "quality", "catchiness", "streaming", "reach", "scalability",
    "critical_flags", "improve_flags", "nearest_artist", "nearest_artist_score",
    "key", "tempo", "duration", "loudness_lufs", "has_chorus", "top_issue",
]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("root", help="folder of audio files (searched recursively)")
    ap.add_argument("-o", "--out", default="triage",
                    help="output basename (writes <out>.csv and <out>.json)")
    args = ap.parse_args()

    root = Path(args.root)
    files = [p for p in sorted(root.rglob("*")) if p.suffix.lower() in ALLOWED_EXTENSIONS]
    if not files:
        raise SystemExit(f"no audio files found under {root}")

    rows, errors = [], []
    started = time.time()
    for i, path in enumerate(files, 1):
        print(f"[{i}/{len(files)}] {path.name}", flush=True)
        try:
            report = full_report(str(path))
        except Exception as exc:
            errors.append({"filename": str(path), "error": str(exc)})
            print(f"    skipped ({exc})")
            continue
        rows.append(triage_summary(report, str(path.relative_to(root))))

    rows.sort(key=lambda r: r["overall_score"], reverse=True)
    for rank, row in enumerate(rows, 1):
        row["rank"] = rank

    json_path = Path(f"{args.out}.json")
    json_path.write_text(json.dumps(
        {"n_analyzed": len(rows), "errors": errors, "results": rows}, indent=2) + "\n")

    csv_path = Path(f"{args.out}.csv")
    with csv_path.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=CSV_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({**row, **row["pillars"]})

    elapsed = time.time() - started
    buckets = {b: sum(1 for r in rows if r["bucket"] == b)
               for b in ("priority", "review", "pass")}
    print(f"\nanalyzed {len(rows)} tracks in {elapsed/60:.1f} min "
          f"({elapsed/max(len(rows),1):.0f}s/track)")
    print(f"buckets: {buckets}")
    print(f"wrote {csv_path} and {json_path}")


if __name__ == "__main__":
    main()
