from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.parser import parse_resume
from app.services.ai_service import analyze_resume_vs_jd, improve_resume_bullets
from app.schemas.resume import (
    ResumeUploadResponse,
    AnalyzeRequest,
    AnalyzeResponse,
    ImproveRequest,
    ImproveResponse,
)
from app.core.database import get_db
from app.models import ResumeAnalysis

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is healthy"}


@router.post("/resume/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    file_bytes = await file.read()

    try:
        extracted_text = parse_resume(file.filename, file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse resume: {str(e)}")

    if not extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract any text from the file")

    return ResumeUploadResponse(
        filename=file.filename,
        extracted_text=extracted_text,
        character_count=len(extracted_text)
    )


@router.post("/resume/analyze", response_model=AnalyzeResponse)
async def analyze_resume(payload: AnalyzeRequest, db: AsyncSession = Depends(get_db)):
    if not payload.resume_text.strip() or not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Resume text and job description cannot be empty")

    try:
        result = analyze_resume_vs_jd(payload.resume_text, payload.job_description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    analysis = ResumeAnalysis(
        resume_filename="uploaded_resume",
        resume_text=payload.resume_text,
        job_description=payload.job_description,
        match_score=result["score"],
        matched_keywords=result["matched_keywords"],
        missing_keywords=result["missing_keywords"],
        ai_summary=result["summary"]
    )
    db.add(analysis)
    await db.commit()

    return AnalyzeResponse(
        score=result["score"],
        matched_keywords=result["matched_keywords"],
        missing_keywords=result["missing_keywords"],
        summary=result["summary"]
    )


@router.post("/resume/improve", response_model=ImproveResponse)
async def improve_resume(payload: ImproveRequest):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty")

    try:
        result = improve_resume_bullets(payload.resume_text, payload.missing_keywords)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI improvement failed: {str(e)}")

    return ImproveResponse(
        improved_bullets=result["improved_bullets"],
        general_tips=result["general_tips"]
    )