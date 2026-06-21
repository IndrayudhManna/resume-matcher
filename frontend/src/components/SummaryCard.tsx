interface SummaryCardProps {
  summary: string
}

function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-purple-400 mb-3">AI Summary</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
    </div>
  )
}

export default SummaryCard