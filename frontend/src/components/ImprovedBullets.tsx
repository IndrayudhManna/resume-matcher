import type { ImprovedBullet } from '../api/types'

interface ImprovedBulletsProps {
  bullets: ImprovedBullet[]
  tips: string[]
}

function ImprovedBullets({ bullets, tips }: ImprovedBulletsProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-purple-400 mb-4">
          Suggested Improvements
        </h3>
        <div className="space-y-4">
          {bullets.map((b, i) => (
            <div key={i} className="border-l-2 border-purple-500/50 pl-4">
              <p className="text-gray-500 text-xs line-through mb-1">{b.original}</p>
              <p className="text-gray-100 text-sm">{b.improved}</p>
            </div>
          ))}
        </div>
      </div>

      {tips.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-purple-400 mb-3">General Tips</h3>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="text-gray-300 text-sm flex gap-2">
                <span className="text-purple-400">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ImprovedBullets