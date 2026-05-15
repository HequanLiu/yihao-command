'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTaskStore } from '@/stores/task-store'
import { getTasks, createTask, updateTask, deleteTask, reorderTasks, type Task } from '@/lib/db'
import { cn } from '@/lib/utils'

const COLUMNS = [
  { id: 'todo', label: '待办' },
  { id: 'in_progress', label: '进行中' },
  { id: 'done', label: '已完成' },
] as const

function TaskCard({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <p className="text-sm font-medium">{task.title}</p>
      {task.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="mt-2 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

function Column({ colId, label, tasks, onAdd, onDelete }: {
  colId: string
  label: string
  tasks: Task[]
  onAdd: () => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex-1 min-w-[260px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{label} <span className="text-muted-foreground font-normal">({tasks.length})</span></h3>
        <button onClick={onAdd} className="text-muted-foreground hover:text-primary">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[200px]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={() => onDelete(task.id)} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function AddTaskModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'todo' as const })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await createTask({ ...form, position: 0 })
    onSave()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold mb-4">新增任务</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">标题 *</label>
            <input
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm modal-input"
              spellCheck={false}
              autoComplete="off"
              placeholder="任务标题"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium">描述</label>
            <textarea
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
              spellCheck={false}
              autoComplete="off"
              placeholder="可选描述"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-md text-sm hover:bg-accent">取消</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90">保存</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const { tasks, setTasks, addTask, updateTask: updateT, removeTask } = useTaskStore()
  const [showAdd, setShowAdd] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    getTasks().then(setTasks)
  }, [setTasks])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIdx = tasks.findIndex((t) => t.id === active.id)
    const newIdx = tasks.findIndex((t) => t.id === over.id)
    if (oldIdx === -1 || newIdx === -1) return

    // Optimistic reorder
    const newTasks = [...tasks]
    const [moved] = newTasks.splice(oldIdx, 1)
    newTasks.splice(newIdx, 0, moved)
    setTasks(newTasks)

    await reorderTasks(newTasks.map((t) => t.id))
  }

  const handleAddTask = async (status: 'todo' | 'in_progress' | 'done') => {
    setShowAdd(status)
  }

  const handleSaveTask = () => {
    getTasks().then(setTasks)
  }

  const handleStatusChange = async (id: string, status: 'todo' | 'in_progress' | 'done') => {
    await updateTask(id, { status })
    updateT(id, { status })
  }

  const handleDelete = async (id: string) => {
    await deleteTask(id)
    removeTask(id)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link href="/" className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-accent transition-colors mb-4">
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">任务面板</h1>
          <p className="text-sm text-muted-foreground mt-1">共 {tasks.length} 个任务</p>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id)
            return (
              <Column
                key={col.id}
                colId={col.id}
                label={col.label}
                tasks={colTasks}
                onAdd={() => handleAddTask(col.id)}
                onDelete={handleDelete}
              />
            )
          })}
        </div>
      </DndContext>

      {showAdd && (
        <AddTaskModal onClose={() => setShowAdd(null)} onSave={handleSaveTask} />
      )}
    </div>
  )
}
