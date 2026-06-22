import requests
from app.core.config import settings


def extract_skills_from_resume(resume_text: str) -> list[str]:
    """Extract key skills from resume text using simple keyword matching."""
    common_skills = [
        "python", "java", "javascript", "typescript", "react", "node",
        "fastapi", "flask", "spring boot", "django", "sql", "postgresql",
        "mysql", "mongodb", "redis", "docker", "kubernetes", "aws", "azure",
        "gcp", "git", "linux", "rest", "api", "machine learning", "deep learning",
        "tensorflow", "pytorch", "pandas", "numpy", "html", "css", "tailwind",
        "c++", "c#", "golang", "rust", "kafka", "elasticsearch", "jenkins",
        "ci/cd", "microservices", "spring", "hibernate", "jpa", "junit",
        "pytest", "selenium", "opencv", "data science", "nlp"
    ]

    resume_lower = resume_text.lower()
    found = [skill for skill in common_skills if skill in resume_lower]
    return found[:8]


def fetch_jobs(keywords: list[str], country: str = "in", results_per_page: int = 10) -> list[dict]:
    """Fetch jobs from Adzuna API based on keywords."""
    if not settings.ADZUNA_APP_ID or not settings.ADZUNA_APP_KEY:
        return []

    query = " ".join(keywords[:4])

    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    params = {
        "app_id": settings.ADZUNA_APP_ID,
        "app_key": settings.ADZUNA_APP_KEY,
        "results_per_page": results_per_page,
        "what": query,
        "content-type": "application/json"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])
    except Exception as e:
        print(f"Adzuna API error: {e}")
        return []


def rank_jobs(jobs: list[dict], matched_keywords: list[str], missing_keywords: list[str]) -> list[dict]:
    """Rank jobs by how well they match the resume keywords."""
    all_keywords = [kw.lower() for kw in matched_keywords + missing_keywords]
    ranked = []

    for job in jobs:
        title = job.get("title", "").lower()
        description = job.get("description", "").lower()
        company = job.get("company", {}).get("display_name", "Unknown")
        location = job.get("location", {}).get("display_name", "Unknown")
        url = job.get("redirect_url", "#")
        salary_min = job.get("salary_min")
        salary_max = job.get("salary_max")

        match_count = sum(1 for kw in all_keywords if kw in title or kw in description)
        match_score = min(round((match_count / max(len(all_keywords), 1)) * 100), 99)

        ranked.append({
            "title": job.get("title", "Unknown"),
            "company": company,
            "location": location,
            "match_score": match_score,
            "url": url,
            "salary_min": salary_min,
            "salary_max": salary_max,
            "description": job.get("description", "")[:300] + "..."
        })

    ranked.sort(key=lambda x: x["match_score"], reverse=True)
    return ranked