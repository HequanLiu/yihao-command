'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, Edit2, X, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useCustomerStore } from '@/stores/customer-store'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, type Customer } from '@/lib/db'
import { cn } from '@/lib/utils'

function CustomerModal({ customer, onClose, onSave }: {
  customer?: Customer
  onClose: () => void
  onSave: () => void
}) {
  const [form, setForm] = useState({
    name: customer?.name ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    company: customer?.company ?? '',
    notes: customer?.notes ?? '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (customer) {
      await updateCustomer(customer.id, form)
    } else {
      await createCustomer(form)
    }
    onSave()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{customer ? '编辑客户' : '新增客户'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">姓名 *</label>
            <input
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm modal-input"
              spellCheck={false}
              autoComplete="off"
              placeholder="客户姓名"
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">邮箱</label>
              <input
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
              spellCheck={false}
              autoComplete="off"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">电话</label>
              <input
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
              spellCheck={false}
              autoComplete="off"
                placeholder="138xxxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">公司</label>
            <input
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
              spellCheck={false}
              autoComplete="off"
              placeholder="公司名称"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">备注</label>
            <textarea
              className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
              spellCheck={false}
              autoComplete="off"
              placeholder="跟进记录、需求..."
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md text-sm hover:bg-accent"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CustomersPage() {
  const { customers, loading, search, setSearch, setCustomers, addCustomer, updateCustomer: updateC, removeCustomer } = useCustomerStore()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Customer | undefined>()

  useEffect(() => {
    getCustomers().then(setCustomers)
  }, [setCustomers])

  const filtered = customers.filter((c) =>
    c.name.includes(search) || c.email.includes(search) || c.company.includes(search)
  )

  const handleSave = () => {
    getCustomers().then(setCustomers)
  }

  const handleDelete = async (id: string) => {
    await deleteCustomer(id)
    removeCustomer(id)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/" className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-accent transition-colors mb-4">
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">客户雷达</h1>
          <p className="text-sm text-muted-foreground mt-1">共 {customers.length} 位客户</p>
        </div>
        <button
          onClick={() => { setEditing(undefined); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> 新增客户
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full pl-9 pr-4 py-2 border rounded-md text-sm"
          placeholder="搜索客户姓名、邮箱、公司..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">加载中...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {search ? '没有匹配的客户' : '还没有客户，点击右上角新增'}
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">姓名</th>
                <th className="text-left px-4 py-3 font-medium">公司</th>
                <th className="text-left px-4 py-3 font-medium">邮箱</th>
                <th className="text-left px-4 py-3 font-medium">电话</th>
                <th className="text-right px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.company || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { setEditing(c); setShowModal(true) }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-3 w-3" /> 编辑
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-muted-foreground hover:text-destructive ml-2"
                    >
                      <Trash2 className="h-3 w-3" /> 删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CustomerModal
          customer={editing}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
