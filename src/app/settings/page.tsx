'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { useState } from 'react'
import { Download, Github, Database } from 'lucide-react'
import { exportJson, exportCsv } from '@/lib/db'

export default function SettingsPage() {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type: 'json' | 'customers' | 'tasks') => {
    setExporting(true)
    try {
      if (type === 'json') {
        await exportJson()
      } else {
        await exportCsv(type)
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/" className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-accent transition-colors mb-4">
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <h1 className="text-2xl font-bold mb-6">设置</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Download className="h-5 w-5" /> 数据导出
        </h2>
        <div className="border rounded-lg p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            数据完全存储在本地，导出后可自行备份。
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 disabled:opacity-50"
            >
              导出 JSON（全量）
            </button>
            <button
              onClick={() => handleExport('customers')}
              disabled={exporting}
              className="px-4 py-2 border rounded-md text-sm hover:bg-accent disabled:opacity-50"
            >
              导出 CSV（客户）
            </button>
            <button
              onClick={() => handleExport('tasks')}
              disabled={exporting}
              className="px-4 py-2 border rounded-md text-sm hover:bg-accent disabled:opacity-50"
            >
              导出 CSV（任务）
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Database className="h-5 w-5" /> 存储信息
        </h2>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            当前数据存储在浏览器本地存储（localStorage）中。<br />
            如需多设备同步，可配置云同步（Pro 功能）。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Github className="h-5 w-5" /> 关于
        </h2>
        <div className="border rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">一号指挥台 v0.1.0</p>
          <p className="text-sm text-muted-foreground">
            开源的一人公司管理工具 / Open-source management tool for solopreneurs
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            AGPL v3 · GitHub 开源
          </p>
        </div>
      </section>
    </div>
  )
}
