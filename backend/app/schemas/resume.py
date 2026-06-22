from pydantic import BaseModel
from typing import List, Optional


class ResumeUploadResponse(BaseModel):
    filename: str
    extracted_text: str
    character_count: int


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str


class AnalyzeResponse(BaseModel):
    score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    summary: str


class ImproveRequest(BaseModel):
    resume_text: str
    missing_keywords: List[str]


class ImprovedBullet(BaseModel):
    original: str
    improved: str


class ImproveResponse(BaseModel):
    improved_bullets: List[ImprovedBullet]
    general_tips: List[str]


class JobMatch(BaseModel):
    title: str
    company: str
    location: str
    match_score: int
    url: str
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    description: str


class JobSearchRequest(BaseModel):
    resume_text: str
    matched_keywords: List[str]
    missing_keywords: List[str]


class JobSearchResponse(BaseModel):
    jobs: List[JobMatch]
    total_found: int