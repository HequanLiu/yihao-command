'use client'

import { useState } from 'react'

interface MainContentProps {
  children?: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto">
      {children || (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-lg">欢迎使用一号指挥台</p>
          <p className="text-sm mt-2">选择左侧菜单开始</p>
        </div>
      )}
    </main>
  )
}
