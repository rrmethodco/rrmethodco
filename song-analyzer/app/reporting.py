"""Shared report building for the consumer endpoint, B2B API, and CLI tools."""

from analyzer import analyze_file
from grading import grade_track
from scoring import rank_matches

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac", ".aiff", ".aif"}
MAX_UPLOAD_BYTES = 60 * 1024 * 1024  # 60 MB


def full_report(path: str) -> dict:
    """Run the complete pipeline on an audio file and return the report dict."""
    features, structure = analyze_file(path)
    audience = rank_matches(features)
    report = grade_track(features, structure, audience["matches"])
    report["features"] = features.to_dict()
    report["structure"] = structure.to_dict()
    report["audience"] = audience
    return report


def triage_summary(report: dict, filename: str) -> dict:
    """Condense a full report into one catalog-triage row.

    Buckets:
      priority — strong overall grade and no critical flags: surface to a human
      review   — promising but flawed, or strong with critical issues to fix
      pass     — below the attention threshold for a high-volume pipeline
    """
    criticals = [f for f in report["feedback"] if f["severity"] == "critical"]
    improves = [f for f in report["feedback"] if f["severity"] == "improve"]
    score = report["overall_score"]
    if score >= 72 and not criticals:
        bucket = "priority"
    elif score >= 55:
        bucket = "review"
    else:
        bucket = "pass"
    top_match = report["audience"]["matches"][0] if report["audience"]["matches"] else None
    return {
        "filename": filename,
        "bucket": bucket,
        "overall_score": score,
        "overall_grade": report["overall_grade"],
        "pillars": {p["key"]: p["score"] for p in report["pillars"]},
        "critical_flags": len(criticals),
        "improve_flags": len(improves),
        "top_issue": criticals[0]["message"] if criticals
                     else (improves[0]["message"] if improves else None),
        "nearest_artist": top_match["artist"] if top_match else None,
        "nearest_artist_score": top_match["score"] if top_match else None,
        "key": f"{report['features']['key']} {report['features']['mode']}",
        "tempo": report["features"]["tempo"],
        "duration": report["structure"]["duration_total"],
        "loudness_lufs": report["structure"]["loudness_lufs"],
        "has_chorus": report["structure"]["has_chorus"],
    }
