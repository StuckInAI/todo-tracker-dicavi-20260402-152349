export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskFilter = 'all' | 'active' | 'completed'

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  completed: boolean
  createdAt: string
  completedAt?: string
  dueDate?: string
}
