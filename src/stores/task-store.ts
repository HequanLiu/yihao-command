import { create } from 'zustand'
import type { Task } from '@/lib/db'

interface TaskStore {
  tasks: Task[]
  loading: boolean
  setTasks: (list: Task[]) => void
  addTask: (t: Task) => void
  updateTask: (id: string, t: Partial<Task>) => void
  removeTask: (id: string) => void
  setLoading: (v: boolean) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (t) => set((s) => ({ tasks: [...s.tasks, t] })),
  updateTask: (id, t) =>
    set((s) => ({
      tasks: s.tasks.map((x) => (x.id === id ? { ...x, ...t } : x)),
    })),
  removeTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((x) => x.id !== id) })),
  setLoading: (loading) => set({ loading }),
}))
