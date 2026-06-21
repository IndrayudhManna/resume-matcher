interface ScoreCardProps {
  score: number
}

function ScoreCard({ score }: ScoreCardProps) {
  const getColor = () => {
    if (score >= 75) return '#4ade80'
    if (score >= 50) return '#facc15'
    return '#f87171'
  }

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#1f2937"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getColor()}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{score}%</span>
        </div>
      </div>
      <p className="text-gray-400 mt-4 text-sm">ATS Match Score</p>
    </div>
  )
}

export default ScoreCard