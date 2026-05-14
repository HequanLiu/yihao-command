import { create } from 'zustand'
import type { Customer } from '@/lib/db'

interface CustomerStore {
  customers: Customer[]
  loading: boolean
  search: string
  setSearch: (s: string) => void
  setCustomers: (list: Customer[]) => void
  addCustomer: (c: Customer) => void
  updateCustomer: (id: string, c: Partial<Customer>) => void
  removeCustomer: (id: string) => void
  setLoading: (v: boolean) => void
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  loading: false,
  search: '',
  setSearch: (search) => set({ search }),
  setCustomers: (customers) => set({ customers }),
  addCustomer: (c) => set((s) => ({ customers: [...s.customers, c] })),
  updateCustomer: (id, c) =>
    set((s) => ({
      customers: s.customers.map((x) => (x.id === id ? { ...x, ...c } : x)),
    })),
  removeCustomer: (id) =>
    set((s) => ({ customers: s.customers.filter((x) => x.id !== id) })),
  setLoading: (loading) => set({ loading }),
}))
