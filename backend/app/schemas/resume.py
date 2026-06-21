from pydantic import BaseModel
from typing import List


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