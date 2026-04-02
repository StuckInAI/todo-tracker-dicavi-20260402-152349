'use client'

import { useState } from 'react'
import { Task, TaskPriority } from '@/types/task'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<Task>) => void
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority)
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleSave = () => {
    if (!editTitle.trim()) return
    onEdit(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      dueDate: editDueDate || undefined,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditPriority(task.priority)
    setEditDueDate(task.dueDate || '')
    setIsEditing(false)
  }

  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString())

  const priority = priorityConfig[task.priority]

  if (isEditing) {
    return (
      <div className="task-item border-blue-300 bg-blue-50">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="input-field font-medium"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            className="input-field resize-none"
            rows={2}
            placeholder="Description (optional)"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={editPriority}
              onChange={e => setEditPriority(e.target.value as TaskPriority)}
              className="input-field"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1">
              Save Changes
            </button>
            <button onClick={handleCancel} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`task-item ${
      task.completed ? 'opacity-70 bg-gray-50' : ''
    } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-blue-500'
          }`}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={`font-semibold text-gray-900 ${
                task.completed ? 'line-through text-gray-400' : ''
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.color}`}
            >
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${priority.dot} mr-1`}></span>
              {priority.label}
            </span>
            {isOverdue && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 font-medium">
                ⚠️ Overdue
              </span>
            )}
          </div>

          {task.description && (
            <p className={`text-sm text-gray-500 mb-2 ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
            {task.dueDate && (
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                📅 Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.completedAt && (
              <span className="text-green-500">
                ✓ Completed {new Date(task.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {!task.completed && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              aria-label="Edit task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {showConfirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-lg text-xs font-medium transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="p-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              aria-label="Delete task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
