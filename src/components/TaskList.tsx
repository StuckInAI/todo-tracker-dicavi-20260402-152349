'use client'

import { Task } from '@/types/task'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, updates: Partial<Task>) => void
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-500 mb-2">No tasks found</h3>
        <p className="text-gray-400">Add a new task or adjust your filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
