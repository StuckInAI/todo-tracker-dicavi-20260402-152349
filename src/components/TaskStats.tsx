'use client'

interface StatsProps {
  stats: {
    total: number
    completed: number
    active: number
    high: number
  }
}

export default function TaskStats({ stats }: StatsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div className="card text-center">
        <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-sm text-gray-500 mt-1">Total Tasks</div>
      </div>
      <div className="card text-center">
        <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
        <div className="text-sm text-gray-500 mt-1">Completed</div>
      </div>
      <div className="card text-center">
        <div className="text-3xl font-bold text-orange-500">{stats.active}</div>
        <div className="text-sm text-gray-500 mt-1">Active</div>
      </div>
      <div className="card text-center">
        <div className="text-3xl font-bold text-purple-600">{completionRate}%</div>
        <div className="text-sm text-gray-500 mt-1">Progress</div>
        {stats.total > 0 && (
          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
