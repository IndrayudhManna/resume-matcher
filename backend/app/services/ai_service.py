import ollama
import json
import re
from app.core.config import settings


def _extract_json(text: str) -> dict:
    """Extract JSON object from model output, even if wrapped in extra text."""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in AI response")
    return json.loads(match.group())


def analyze_resume_vs_jd(resume_text: str, job_description: str) -> dict:
    prompt = f"""You are an ATS (Applicant Tracking System) expert. Analyze how well this resume matches the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY a valid JSON object with this exact structure, no extra text before or after:
{{
  "score": <integer 0-100>,
  "matched_keywords": [<list of skills/keywords from JD found in resume>],
  "missing_keywords": [<list of important skills/keywords from JD NOT found in resume>],
  "summary": "<3 sentence explanation of the fit and key gaps>"
}}"""

    response = ollama.generate(
        model=settings.OLLAMA_MODEL,
        prompt=prompt,
        options={"temperature": 0.2}
    )

    raw_output = response["response"]
    result = _extract_json(raw_output)

    return {
        "score": result.get("score", 0),
        "matched_keywords": result.get("matched_keywords", []),
        "missing_keywords": result.get("missing_keywords", []),
        "summary": result.get("summary", "")
    }