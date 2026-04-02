'use client'

import { TaskFilter, TaskPriority } from '@/types/task'

interface FilterBarProps {
  filter: TaskFilter
  setFilter: (f: TaskFilter) => void
  priorityFilter: TaskPriority | 'all'
  setPriorityFilter: (p: TaskPriority | 'all') => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  onClearCompleted: () => void
  completedCount: number
}

export default function FilterBar({
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery,
  onClearCompleted,
  completedCount,
}: FilterBarProps) {
  const filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ]

  const priorities: { value: TaskPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
  ]

  return (
    <div className="card mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="input-field pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                filter === f.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as TaskPriority | 'all')}
          className="input-field w-auto text-sm"
        >
          {priorities.map(p => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="btn-danger text-sm py-1.5"
          >
            Clear Completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  )
}
