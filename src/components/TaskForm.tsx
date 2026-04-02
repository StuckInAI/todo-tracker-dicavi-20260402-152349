'use client'

import { useState } from 'react'
import { TaskPriority } from '@/types/task'

interface TaskFormProps {
  onAdd: (title: string, description: string, priority: TaskPriority, dueDate?: string) => void
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Task title is required')
      return
    }
    onAdd(title.trim(), description.trim(), priority, dueDate || undefined)
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => {
            setTitle(e.target.value)
            setError('')
          }}
          placeholder="What do you need to do?"
          className="input-field"
          maxLength={100}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add more details (optional)"
          className="input-field resize-none"
          rows={2}
          maxLength={300}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as TaskPriority)}
            className="input-field"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="input-field"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
        <span className="text-lg">+</span>
        Add Task
      </button>
    </form>
  )
}
