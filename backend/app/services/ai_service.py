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


def improve_resume_bullets(resume_text: str, missing_keywords: list) -> dict:
    keywords_str = ", ".join(missing_keywords) if missing_keywords else "general improvements"

    prompt = f"""You are a professional resume writer. Improve this resume by suggesting 3-5 rewritten bullet points 
that naturally incorporate these missing keywords where relevant: {keywords_str}

ORIGINAL RESUME:
{resume_text}

Return ONLY a valid JSON object with this exact structure, no extra text before or after:
{{
  "improved_bullets": [
    {{"original": "<original bullet or section it relates to>", "improved": "<rewritten version with keywords naturally included>"}}
  ],
  "general_tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}}"""

    response = ollama.generate(
        model=settings.OLLAMA_MODEL,
        prompt=prompt,
        options={"temperature": 0.3}
    )

    raw_output = response["response"]
    result = _extract_json(raw_output)

    return {
        "improved_bullets": result.get("improved_bullets", []),
        "general_tips": result.get("general_tips", [])
    }