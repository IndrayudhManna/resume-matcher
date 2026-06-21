import { useState } from 'react'
import UploadForm from './components/UploadForm'
import ScoreCard from './components/ScoreCard'
import KeywordList from './components/KeywordList'
import SummaryCard from './components/SummaryCard'
import ImprovedBullets from './components/ImprovedBullets'
import { uploadResume, analyzeResume, improveResume } from './api/resume'
import type { AnalyzeResponse, ImproveResponse } from './api/types'

function App() {
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null)
  const [improvement, setImprovement] = useState<ImproveResponse | null>(null)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setError('')
    setAnalysis(null)
    setImprovement(null)
    setIsAnalyzing(true)

    try {
      const uploadResult = await uploadResume(file)
      setResumeText(uploadResult.extracted_text)

      const analyzeResult = await analyzeResume(
        uploadResult.extracted_text,
        jobDescription
      )
      setAnalysis(analyzeResult)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please check the backend is running and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImprove = async () => {
    if (!analysis || !resumeText) return
    setIsImproving(true)
    setError('')

    try {
      const result = await improveResume(resumeText, analysis.missing_keywords)
      setImprovement(result)
    } catch (err) {
      console.error(err)
      setError('Failed to generate improvements. Please try again.')
    } finally {
      setIsImproving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-400 mb-3">
            AI Resume Matcher
          </h1>
          <p className="text-gray-400 text-lg">
            Upload your resume. Get your ATS score. Land the job.
          </p>
        </div>

        <UploadForm onSubmit={handleAnalyze} isLoading={isAnalyzing} />

        {error && (
          <div className="max-w-2xl mx-auto mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg">
            {error}
          </div>
        )}

        {analysis && (
          <div className="mt-12 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <ScoreCard score={analysis.score} />
              <SummaryCard summary={analysis.summary} />
            </div>

            <KeywordList
              matched={analysis.matched_keywords}
              missing={analysis.missing_keywords}
            />

            {!improvement && (
              <button
                onClick={handleImprove}
                disabled={isImproving}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {isImproving
                  ? 'Generating improvements... this can take a minute'
                  : 'Improve My Resume'}
              </button>
            )}

            {improvement && (
              <ImprovedBullets
                bullets={improvement.improved_bullets}
                tips={improvement.general_tips}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App