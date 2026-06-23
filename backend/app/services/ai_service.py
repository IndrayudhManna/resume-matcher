import json
import re
from app.core.config import settings


def _extract_json(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in AI response")
    return json.loads(match.group())


def _call_ai(prompt: str, temperature: float = 0.0) -> str:
    if settings.USE_GROQ and settings.GROQ_API_KEY:
        from groq import Groq
        client = Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=1000
        )
        return response.choices[0].message.content
    else:
        import ollama
        response = ollama.generate(
            model=settings.OLLAMA_MODEL,
            prompt=prompt,
            options={"temperature": temperature}
        )
        return response["response"]


def analyze_resume_vs_jd(resume_text: str, job_description: str) -> dict:
    prompt = f"""You are an ATS (Applicant Tracking System) expert. Analyze how well this resume matches the job description.

STRICT RULES:
- A keyword is MATCHED only if it explicitly appears as a word or phrase in the RESUME TEXT below
- Do NOT infer, assume, or guess — if the exact word is not in the resume, it is MISSING

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY a valid JSON object with this exact structure, no extra text before or after:
{{
  "score": <integer 0-100>,
  "matched_keywords": [<ONLY keywords that literally appear word-for-word in the resume text above>],
  "missing_keywords": [<keywords from JD that do NOT appear in the resume text>],
  "summary": "<3 sentence explanation of the fit and key gaps>"
}}"""

    raw_output = _call_ai(prompt, temperature=0.0)
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

    raw_output = _call_ai(prompt, temperature=0.3)
    result = _extract_json(raw_output)

    return {
        "improved_bullets": result.get("improved_bullets", []),
        "general_tips": result.get("general_tips", [])
    }