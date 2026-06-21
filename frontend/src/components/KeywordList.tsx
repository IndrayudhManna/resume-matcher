interface KeywordListProps {
  matched: string[]
  missing: string[]
}

function KeywordList({ matched, missing }: KeywordListProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-green-400 mb-3">
          Matched Keywords ({matched.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {matched.length === 0 && (
            <p className="text-gray-500 text-sm">No matches found</p>
          )}
          {matched.map((kw, i) => (
            <span
              key={i}
              className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-red-400 mb-3">
          Missing Keywords ({missing.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {missing.length === 0 && (
            <p className="text-gray-500 text-sm">No gaps found — great job!</p>
          )}
          {missing.map((kw, i) => (
            <span
              key={i}
              className="bg-red-500/10 text-red-400 border border-red-500/30 text-xs px-3 py-1 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KeywordList