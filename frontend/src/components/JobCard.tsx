import type { JobMatch } from '../api/types'

interface JobCardProps {
  job: JobMatch
  rank: number
}

function JobCard({ job, rank }: JobCardProps) {
  const getScoreColor = () => {
    if (job.match_score >= 70) return 'text-green-400 bg-green-500/10 border-green-500/30'
    if (job.match_score >= 40) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
    return 'text-red-400 bg-red-500/10 border-red-500/30'
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500/40 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-500 text-xs font-mono">#{rank}</span>
            <h3 className="text-white font-semibold text-sm">{job.title}</h3>
          </div>
          <p className="text-purple-400 text-xs">{job.company}</p>
          <p className="text-gray-500 text-xs mt-0.5">{job.location}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getScoreColor()}`}>
          {job.match_score}% match
        </span>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed mb-4">
        {job.description}
      </p>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Apply Now
      </a>
    </div>
  )
}

export default JobCard