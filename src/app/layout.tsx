import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '一号指挥台',
  description: '开源的一人公司管理工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
