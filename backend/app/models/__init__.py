from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_filename = Column(String, nullable=False)
    resume_text = Column(Text, nullable=False)
    job_description = Column(Text, nullable=False)

    match_score = Column(Float, nullable=True)
    matched_keywords = Column(JSON, nullable=True)
    missing_keywords = Column(JSON, nullable=True)
    ai_summary = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())