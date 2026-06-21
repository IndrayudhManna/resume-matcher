import api from './client'
import type { UploadResponse, AnalyzeResponse, ImproveResponse } from './types'

export async function uploadResume(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<UploadResponse>('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<AnalyzeResponse> {
  const response = await api.post<AnalyzeResponse>('/resume/analyze', {
    resume_text: resumeText,
    job_description: jobDescription,
  })
  return response.data
}

export async function improveResume(
  resumeText: string,
  missingKeywords: string[]
): Promise<ImproveResponse> {
  const response = await api.post<ImproveResponse>('/resume/improve', {
    resume_text: resumeText,
    missing_keywords: missingKeywords,
  })
  return response.data
}