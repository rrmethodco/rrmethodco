"""Song Analyzer — FastAPI service.

POST /api/analyze with an audio file; returns the proprietary graded report:
five pillar scores (production quality, catchiness, streaming readiness,
popularity reach, scalability), actionable artist feedback, listening-context
fits, and ranked major-artist audience matches with placement playbooks.

GET /api/tiers returns the service tiers. GET / serves the upload UI.

Run from this directory:
    uvicorn main:app --reload --port 8000
"""

import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from analyzer import analyze_file
from grading import grade_track
from scoring import rank_matches

MAX_UPLOAD_BYTES = 60 * 1024 * 1024  # 60 MB
ALLOWED_EXTENSIONS = {".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac", ".aiff", ".aif"}

STATIC_DIR = Path(__file__).parent / "static"

app = FastAPI(title="Song Analyzer", version="0.2.0")

# Service tiers. Prices are placeholders pending market testing; the royalty
# tier requires a signed participation agreement drafted by an entertainment
# attorney (see README: business model & legal).
TIERS = [
    {
        "name": "Single Report",
        "model": "one-time fee",
        "price": "$29 / track",
        "includes": [
            "Full graded analysis (all five pillars)",
            "Actionable feedback report",
            "Top-5 audience matches with one placement playbook",
        ],
    },
    {
        "name": "Pro",
        "model": "subscription",
        "price": "$19 / month",
        "includes": [
            "Unlimited track analyses and re-grades after revisions",
            "All placement playbooks + editorial pitch copy",
            "Release-cycle tracking across your catalog",
        ],
    },
    {
        "name": "Partner",
        "model": "revenue share",
        "price": "$0 upfront + 5% of royalties/publishing (term-limited)",
        "includes": [
            "Everything in Pro",
            "Hands-on release campaign run by our team",
            "Curator outreach and ad management on your behalf",
            "Requires a signed participation agreement (independent legal review encouraged)",
        ],
    },
]


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/tiers")
def tiers() -> dict:
    return {"tiers": TIERS}


@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)) -> JSONResponse:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{suffix}'. "
                   f"Accepted: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 60 MB upload limit.")
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(data)
            tmp_path = tmp.name
        features, structure = analyze_file(tmp_path)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception:
        raise HTTPException(
            status_code=422,
            detail="Could not decode this audio file. Try exporting as WAV or MP3.",
        )
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

    audience = rank_matches(features)
    report = grade_track(features, structure, audience["matches"])
    report["filename"] = file.filename
    report["features"] = features.to_dict()
    report["structure"] = structure.to_dict()
    report["audience"] = audience
    return JSONResponse(report)
