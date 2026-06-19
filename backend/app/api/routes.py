from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parser import parse_resume
from app.schemas.resume import ResumeUploadResponse

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