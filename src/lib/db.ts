// Tauri IPC bridge - calls Rust backend commands
// Falls back to localStorage in browser (dev mode without Tauri)

import { invoke } from '@tauri-apps/api/core'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  notes: string
  created_at: number
  updated_at: number
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  position: number
  created_at: number
  updated_at: number
}

const USE_TAURI = typeof window !== 'undefined' && '__TAURI__' in window

// --- Customers ---

export async function getCustomers(): Promise<Customer[]> {
  if (USE_TAURI) {
    return invoke('get_customers')
  }
  // Fallback: localStorage
  const data = localStorage.getItem('customers')
  return data ? JSON.parse(data) : []
}

export async function createCustomer(data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
  if (USE_TAURI) {
    return invoke('create_customer', { data })
  }
  const customer: Customer = {
    ...data,
    id: crypto.randomUUID(),
    created_at: Date.now(),
    updated_at: Date.now(),
  }
  const list = await getCustomers()
  list.push(customer)
  localStorage.setItem('customers', JSON.stringify(list))
  return customer
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  if (USE_TAURI) {
    return invoke('update_customer', { id, data })
  }
  const list = await getCustomers()
  const idx = list.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error('Customer not found')
  list[idx] = { ...list[idx], ...data, updated_at: Date.now() }
  localStorage.setItem('customers', JSON.stringify(list))
  return list[idx]
}

export async function deleteCustomer(id: string): Promise<boolean> {
  if (USE_TAURI) {
    return invoke('delete_customer', { id })
  }
  const list = await getCustomers()
  localStorage.setItem('customers', JSON.stringify(list.filter((c) => c.id !== id)))
  return true
}

// --- Tasks ---

export async function getTasks(): Promise<Task[]> {
  if (USE_TAURI) {
    return invoke('get_tasks')
  }
  const data = localStorage.getItem('tasks')
  return data ? JSON.parse(data) : []
}

export async function createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  if (USE_TAURI) {
    return invoke('create_task', { data })
  }
  const task: Task = {
    ...data,
    id: crypto.randomUUID(),
    created_at: Date.now(),
    updated_at: Date.now(),
  }
  const list = await getTasks()
  list.push(task)
  localStorage.setItem('tasks', JSON.stringify(list))
  return task
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  if (USE_TAURI) {
    return invoke('update_task', { id, data })
  }
  const list = await getTasks()
  const idx = list.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error('Task not found')
  list[idx] = { ...list[idx], ...data, updated_at: Date.now() }
  localStorage.setItem('tasks', JSON.stringify(list))
  return list[idx]
}

export async function deleteTask(id: string): Promise<boolean> {
  if (USE_TAURI) {
    return invoke('delete_task', { id })
  }
  const list = await getTasks()
  localStorage.setItem('tasks', JSON.stringify(list.filter((t) => t.id !== id)))
  return true
}

export async function reorderTasks(ids: string[]): Promise<boolean> {
  if (USE_TAURI) {
    return invoke('reorder_tasks', { ids })
  }
  const list = await getTasks()
  const reordered = ids.map((id, pos) => {
    const task = list.find((t) => t.id === id)!
    return { ...task, position: pos }
  })
  const rest = list.filter((t) => !ids.includes(t.id))
  localStorage.setItem('tasks', JSON.stringify([...reordered, ...rest]))
  return true
}

// --- Export ---

export async function exportJson(): Promise<string> {
  if (USE_TAURI) {
    return invoke('export_json')
  }
  const data = { customers: await getCustomers(), tasks: await getTasks() }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `yihao-export-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  return url
}

export async function exportCsv(table: 'customers' | 'tasks'): Promise<string> {
  if (USE_TAURI) {
    return invoke('export_csv', { table })
  }
  const rows = table === 'customers' ? await getCustomers() : await getTasks()
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0]).join(',')
  const lines = rows.map((r) => Object.values(r).join(','))
  const csv = [headers, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `yihao-${table}-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
  return url
}
