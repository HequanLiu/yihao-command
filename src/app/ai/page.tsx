import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function AIPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/" className="inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-accent transition-colors mb-4">
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">AI助手</h1>
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p className="text-lg">AI助手功能开发中</p>
        <p className="text-sm mt-2">将支持数据分析、建议生成、自动化流程</p>
      </div>
    </div>
  )
}
