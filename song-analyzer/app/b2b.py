"""B2B API v1: authenticated programmatic access for catalog-scale use.

Target buyers: distributors triaging daily upload volume, label A&R screening
demo inboxes, sync/production libraries doing QC and tagging.

Auth (MVP): set SONG_ANALYZER_API_KEYS to a comma-separated list of keys;
clients send `X-API-Key`. Production replaces this with per-customer keys,
usage metering, and rate limits.

Endpoints:
  POST /api/v1/analyze — one file, full graded report (same JSON the consumer
      product renders).
  POST /api/v1/triage  — up to MAX_TRIAGE_FILES files, returns ranked one-row
      summaries with priority/review/pass buckets. Synchronous MVP; catalog
      scale (thousands of tracks) is served by the async-queue roadmap or the
      tools/triage_catalog.py CLI run inside the customer's infrastructure.

Interactive OpenAPI docs ship for free at /docs.
"""

import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Header, HTTPException, UploadFile

from reporting import ALLOWED_EXTENSIONS, MAX_UPLOAD_BYTES, full_report, triage_summary

MAX_TRIAGE_FILES = 10

router = APIRouter(prefix="/api/v1", tags=["b2b"])


def _require_api_key(x_api_key: str) -> None:
    configured = {
        k.strip() for k in os.environ.get("SONG_ANALYZER_API_KEYS", "").split(",")
        if k.strip()
    }
    if not configured:
        raise HTTPException(
            status_code=503,
            detail="B2B API not configured: set SONG_ANALYZER_API_KEYS.",
        )
    if x_api_key not in configured:
        raise HTTPException(status_code=401, detail="Invalid or missing X-API-Key.")


async def _to_temp_file(file: UploadFile) -> str:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{suffix}' for {file.filename!r}.",
        )
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail=f"{file.filename!r} is empty.")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413, detail=f"{file.filename!r} exceeds the 60 MB limit.")
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(data)
        return tmp.name


def _analyze_temp(tmp_path: str, filename: str) -> dict:
    try:
        report = full_report(tmp_path)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"{filename!r}: {exc}")
    except Exception:
        raise HTTPException(
            status_code=422,
            detail=f"Could not decode {filename!r}. WAV or MP3 are safest.",
        )
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
    report["filename"] = filename
    return report


@router.post("/analyze")
async def analyze_one(
    file: UploadFile = File(...),
    x_api_key: str = Header(default=""),
) -> dict:
    """Full graded report for a single track."""
    _require_api_key(x_api_key)
    tmp_path = await _to_temp_file(file)
    return _analyze_temp(tmp_path, file.filename or "upload")


@router.post("/triage")
async def triage_batch(
    files: list[UploadFile] = File(...),
    x_api_key: str = Header(default=""),
) -> dict:
    """Ranked triage of a batch: who deserves human attention first."""
    _require_api_key(x_api_key)
    if len(files) > MAX_TRIAGE_FILES:
        raise HTTPException(
            status_code=413,
            detail=f"Max {MAX_TRIAGE_FILES} files per synchronous triage call. "
                   f"Use the catalog CLI or the async pipeline for larger batches.",
        )
    rows, errors = [], []
    for file in files:
        name = file.filename or "upload"
        try:
            tmp_path = await _to_temp_file(file)
            report = _analyze_temp(tmp_path, name)
        except HTTPException as exc:
            errors.append({"filename": name, "error": exc.detail})
            continue
        rows.append(triage_summary(report, name))
    rows.sort(key=lambda r: r["overall_score"], reverse=True)
    for rank, row in enumerate(rows, 1):
        row["rank"] = rank
    buckets = {b: sum(1 for r in rows if r["bucket"] == b)
               for b in ("priority", "review", "pass")}
    return {"n_analyzed": len(rows), "buckets": buckets,
            "results": rows, "errors": errors}
