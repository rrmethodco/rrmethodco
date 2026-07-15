"""Artist Radio Fit Analyzer — FastAPI service.

POST /api/analyze with an audio file; returns extracted features, ranked
major-artist fit scores with grades, and placement playbooks.
GET / serves the upload UI.

Run from this directory:
    uvicorn main:app --reload --port 8000
"""

import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from analyzer import analyze_file
from scoring import rank_matches

MAX_UPLOAD_BYTES = 60 * 1024 * 1024  # 60 MB
ALLOWED_EXTENSIONS = {".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac", ".aiff", ".aif"}

STATIC_DIR = Path(__file__).parent / "static"

app = FastAPI(title="Artist Radio Fit Analyzer", version="0.1.0")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


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
        features = analyze_file(tmp_path)
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

    report = rank_matches(features)
    report["filename"] = file.filename
    return JSONResponse(report)
