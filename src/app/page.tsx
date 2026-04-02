'use client'

import { useState, useEffect } from 'react'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import TaskStats from '@/components/TaskStats'
import FilterBar from '@/components/FilterBar'
import { Task, TaskFilter, TaskPriority } from '@/types/task'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'daily-tasks'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTasks(parsed)
      } catch (e) {
        console.error('Failed to parse tasks from localStorage', e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoaded])

  const addTask = (title: string, description: string, priority: TaskPriority, dueDate?: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || undefined,
    }
    setTasks(prev => [newTask, ...prev])
  }

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : undefined }
          : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    )
  }

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed))
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'active'
        ? !task.completed
        : task.completed

    const matchesPriority =
      priorityFilter === 'all' ? true : task.priority === priorityFilter

    const matchesSearch =
      searchQuery === ''
        ? true
        : task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesPriority && matchesSearch
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl">✅</span>
            <h1 className="text-4xl font-bold text-gray-900">Daily Task Manager</h1>
          </div>
          <p className="text-gray-500 text-lg">
            Stay organized and productive every day
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats */}
        <TaskStats stats={stats} />

        {/* Task Form */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
          <TaskForm onAdd={addTask} />
        </div>

        {/* Filter Bar */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClearCompleted={clearCompleted}
          completedCount={stats.completed}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />

        {/* Footer */}
        <footer className="text-center mt-10 text-gray-400 text-sm">
          <p>Daily Task Manager &copy; {new Date().getFullYear()} — Built with Next.js & Tailwind CSS</p>
        </footer>
      </div>
    </main>
  )
}
