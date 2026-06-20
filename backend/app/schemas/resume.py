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