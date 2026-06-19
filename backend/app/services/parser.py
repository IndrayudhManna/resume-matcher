from pdfminer.high_level import extract_text
from docx import Document
import io


def parse_pdf(file_bytes: bytes) -> str:
    text = extract_text(io.BytesIO(file_bytes))
    return text.strip()


def parse_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text.strip()


def parse_resume(filename: str, file_bytes: bytes) -> str:
    if filename.lower().endswith(".pdf"):
        return parse_pdf(file_bytes)
    elif filename.lower().endswith(".docx"):
        return parse_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type. Please upload a PDF or DOCX file.")