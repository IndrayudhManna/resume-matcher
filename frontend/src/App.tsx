import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Spinner from './components/Spinner'
import UploadForm from './components/UploadForm'
import ScoreCard from './components/ScoreCard'
import KeywordList from './components/KeywordList'
import SummaryCard from './components/SummaryCard'
import ImprovedBullets from './components/ImprovedBullets'
import JobCard from './components/JobCard'
import { uploadResume, analyzeResume, improveResume, searchJobs } from './api/resume'
import type { AnalyzeResponse, ImproveResponse, JobMatch } from './api/types'

function App() {
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null)
  const [improvement, setImprovement] = useState<ImproveResponse | null>(null)
  const [jobs, setJobs] = useState<JobMatch[]>([])

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [isSearchingJobs, setIsSearchingJobs] = useState(false)
  const [error, setError] = useState('')

  // Keep Render backend alive — ping every 10 minutes
  useEffect(() => {
    const keepAlive = () => {
      fetch('https://resume-matcher-backend-qz09.onrender.com/')
        .catch(() => {})
    }
    keepAlive()
    const interval = setInterval(keepAlive, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

const handleAnalyze = async (file: File, jobDescription: string) => {
  setError('')
  setAnalysis(null)
  setImprovement(null)
  setJobs([])
  setIsAnalyzing(true)

  const attempt = async () => {
    const uploadResult = await uploadResume(file)
    setResumeText(uploadResult.extracted_text)
    const analyzeResult = await analyzeResume(uploadResult.extracted_text, jobDescription)
    setAnalysis(analyzeResult)
  }

  try {
    await attempt()
  } catch (_) {
    try {
      await new Promise(resolve => setTimeout(resolve, 15000))
      await attempt()
    } catch (_) {
      try {
        await new Promise(resolve => setTimeout(resolve, 15000))
        await attempt()
      } catch (_) {
        setError('Analysis failed. Please try again in a moment.')
      }
    }
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
      setError('Failed to generate improvements. Please try again.')
    } finally {
      setIsImproving(false)
    }
  }

  const handleSearchJobs = async () => {
    if (!analysis || !resumeText) return
    setIsSearchingJobs(true)
    setError('')

    try {
      const result = await searchJobs(resumeText, analysis.matched_keywords, analysis.missing_keywords)
      setJobs(result.jobs)
      if (result.jobs.length === 0) {
        setError('No matching jobs found. Try again later.')
      }
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.')
    } finally {
      setIsSearchingJobs(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-purple-400 mb-3">
              Match Your Resume to Any Job
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Upload your resume and a job description. Get an ATS score, keyword gaps, AI-powered improvements, and matching job listings — instantly.
            </p>
          </div>

          <UploadForm onSubmit={handleAnalyze} isLoading={isAnalyzing} />

          {isAnalyzing && (
            <Spinner message="Analyzing your resume with AI — this takes a few seconds..." />
          )}

          {error && (
            <div className="max-w-2xl mx-auto mt-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg">
              {error}
            </div>
          )}

          {analysis && !isAnalyzing && (
            <div className="mt-12 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ScoreCard score={analysis.score} />
                <SummaryCard summary={analysis.summary} />
              </div>

              <KeywordList
                matched={analysis.matched_keywords}
                missing={analysis.missing_keywords}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {!improvement && (
                  <button
                    onClick={handleImprove}
                    disabled={isImproving}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {isImproving ? 'Generating...' : 'Improve My Resume'}
                  </button>
                )}

                <button
                  onClick={handleSearchJobs}
                  disabled={isSearchingJobs}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {isSearchingJobs ? 'Searching jobs...' : 'Find Matching Jobs'}
                </button>
              </div>

              {isImproving && (
                <Spinner message="Rewriting your resume bullets with AI..." />
              )}

              {isSearchingJobs && (
                <Spinner message="Fetching matching jobs from Adzuna..." />
              )}

              {improvement && (
                <ImprovedBullets
                  bullets={improvement.improved_bullets}
                  tips={improvement.general_tips}
                />
              )}

              {jobs.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Matching Jobs ({jobs.length})
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {jobs.map((job, i) => (
                      <JobCard key={i} job={job} rank={i + 1} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App