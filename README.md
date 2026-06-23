# AI Resume Matcher

An AI-powered full-stack web platform that analyzes your resume against a job description, predicts your ATS compatibility score, identifies keyword gaps, suggests resume improvements, and surfaces matching real job listings.

## Features

- **ATS Score Prediction** — Get a 0-100 match score showing how well your resume aligns with a job description
- **Keyword Gap Analysis** — See exactly which keywords are matched and which are missing
- **AI Resume Improvement** — LLaMA 3.1 rewrites your resume bullets to naturally include missing keywords
- **Job Discovery** — Fetches real job listings from Adzuna API ranked by resume match percentage

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| AI Engine | LLaMA 3.1 via Ollama (local inference, free) |
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Database | PostgreSQL |
| Cache | Redis |
| Job Listings | Adzuna API |
| Containerization | Docker + Docker Compose |

## Architecture

- **Parser Service** — Extracts text from uploaded PDF/DOCX resumes using pdfminer and python-docx
- **AI Service** — Sends resume + job description to local LLaMA 3.1 model, returns structured JSON with score, keywords, and summary
- **Job Service** — Extracts skills from resume, queries Adzuna API, ranks results by keyword match
- **REST API** — FastAPI with async SQLAlchemy for database persistence

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker Desktop
- Ollama with LLaMA 3.1 (`ollama pull llama3.1`)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Docker (PostgreSQL + Redis)

```bash
docker compose up -d
```

### Environment Variables

Create `backend/.env`:

DATABASE_URL=postgresql://postgres:password@localhost:5433/resumematcher

REDIS_URL=redis://localhost:6380

ADZUNA_APP_ID=your_app_id

ADZUNA_APP_KEY=your_app_key

SECRET_KEY=your_secret_key

OLLAMA_MODEL=llama3.1

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/resume/upload | Upload PDF/DOCX resume |
| POST | /api/resume/analyze | ATS score + keyword analysis |
| POST | /api/resume/improve | AI bullet point rewriting |
| POST | /jobs/search | Fetch and rank matching jobs |

## Project Structure

resume-matcher/

├── backend/

│   ├── app/

│   │   ├── api/routes.py

│   │   ├── core/config.py

│   │   ├── core/database.py

│   │   ├── models/

│   │   ├── schemas/

│   │   └── services/

│   └── .env

├── frontend/

│   └── src/

│       ├── api/

│       └── components/

└── docker-compose.yml

## Author

**Indrayudh Manna** — B.Tech CSE, University of Engineering & Management, Kolkata  
GitHub: [IndrayudhManna](https://github.com/IndrayudhManna)