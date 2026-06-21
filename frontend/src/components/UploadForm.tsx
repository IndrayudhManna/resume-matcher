import { useState } from 'react'

interface UploadFormProps {
  onSubmit: (file: File, jobDescription: string) => void
  isLoading: boolean
}

function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file && jobDescription.trim()) {
      onSubmit(file, jobDescription)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Upload your resume (PDF or DOCX)
        </label>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-700 bg-gray-900 border border-gray-700 rounded-lg p-2"
        />
        {file && (
          <p className="text-sm text-gray-400 mt-2">Selected: {file.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Paste the job description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the full job description here..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        type="submit"
        disabled={!file || !jobDescription.trim() || isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {isLoading ? 'Analyzing... this can take a minute' : 'Analyze My Resume'}
      </button>
    </form>
  )
}

export default UploadForm