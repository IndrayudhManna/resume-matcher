export interface UploadResponse {
  filename: string
  extracted_text: string
  character_count: number
}

export interface AnalyzeResponse {
  score: number
  matched_keywords: string[]
  missing_keywords: string[]
  summary: string
}

export interface ImprovedBullet {
  original: string
  improved: string
}

export interface ImproveResponse {
  improved_bullets: ImprovedBullet[]
  general_tips: string[]
}