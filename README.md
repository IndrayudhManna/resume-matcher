# AI Resume Matcher

An AI-powered full-stack web platform that analyzes your resume against a job description, predicts your ATS compatibility score, identifies keyword gaps, suggests AI-powered resume improvements, and surfaces real matching job listings — all in seconds.

## Live Demo

- **Frontend:** https://resume-matcher-opal-three.vercel.app
- **Backend API:** https://resume-matcher-backend-qz09.onrender.com
- **API Docs:** https://resume-matcher-backend-qz09.onrender.com/docs

> Note: Render free tier spins down after inactivity. First request may take 30-60 seconds to wake up.

## Features

- **ATS Score Prediction** — Get a 0-100 match score showing how well your resume aligns with a job description
- **Keyword Gap Analysis** — See exactly which keywords are matched and which are missing, with zero hallucination (strict literal matching enforced in prompt)
- **AI Resume Improvement** — LLaMA 3.1 rewrites your resume bullets to naturally incorporate missing keywords
- **Job Discovery** — Fetches real Indian job listings from Adzuna API, ranked by resume match percentage
- **Redis Caching** — Same resume + JD combination returns cached results instantly, ensuring consistency
- **PDF & DOCX Support** — Upload any standard resume format

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| AI Engine | LLaMA 3.1 via Groq API (production) / Ollama (local dev) |
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Database | PostgreSQL — Neon (production) / Docker (local) |
| Cache | Redis — Upstash (production) / Docker (local) |
| Job Listings | Adzuna API (free tier) |
| Containerization | Docker + Docker Compose (local development) |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## Architecture

- **Parser Service** — Extracts clean text from uploaded PDF/DOCX resumes using pdfminer.six and python-docx
- **AI Service** — Sends resume + job description to LLaMA 3.1 via Groq API, returns structured JSON with score, matched keywords, missing keywords, and summary. Temperature set to 0 for consistent results.
- **Job Service** — Extracts skills from resume text, queries Adzuna API with top skills, ranks returned jobs by keyword match score, filters out 0% matches
- **Caching Layer** — MD5 hash of resume+JD used as Redis cache key, results cached for 1 hour
- **REST API** — FastAPI with async SQLAlchemy for non-blocking database persistence to PostgreSQL

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker Desktop
- Ollama with LLaMA 3.1 — `ollama pull llama3.1`

## Production Deployment

| Service | Platform | Free Tier |
|---|---|---|
| Backend | Render | Free web service |
| PostgreSQL | Neon | Free forever |
| Redis | Upstash | Free forever |
| Frontend | Vercel | Free forever |

No credit card required for any of the above.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| POST | /api/resume/upload | Upload PDF/DOCX resume, returns extracted text |
| POST | /api/resume/analyze | ATS score + keyword analysis |
| POST | /api/resume/improve | AI bullet point rewriting using missing keywords |
| POST | /jobs/search | Fetch and rank real job listings from Adzuna |

## Key Technical Decisions

- **Groq over OpenAI** — Free tier, same LLaMA 3.1 model, 10x faster than local Ollama inference
- **Temperature 0** — Eliminates AI response variability for consistent keyword matching across identical inputs
- **Redis caching** — Prevents duplicate AI calls for the same resume+JD, ensures deterministic results
- **asyncpg + SQLAlchemy async** — Non-blocking database operations for better performance under load
- **Conditional SSL** — Automatically detects Neon vs local Postgres and applies SSL only when needed

## Author

**Indrayudh Manna** — B.Tech CSE, University of Engineering & Management, Kolkata

GitHub: [IndrayudhManna](https://github.com/IndrayudhManna)

LinkedIn: [indrayudhmanna](https://www.linkedin.com/in/indrayudhmanna)