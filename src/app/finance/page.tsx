import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function FinancePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/" className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-accent transition-colors mb-4">
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">财务概览</h1>
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p className="text-lg">财务管理功能开发中</p>
        <p className="text-sm mt-2">将支持收入/支出/利润图表</p>
      </div>
    </div>
  )
}
