'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, CheckSquare, Calendar, Wallet, Bot, Settings, Github } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/customers', label: '客户雷达', icon: Users },
  { href: '/tasks', label: '任务面板', icon: CheckSquare },
  { href: '/calendar', label: '日程汇总', icon: Calendar },
  { href: '/finance', label: '财务概览', icon: Wallet },
  { href: '/ai', label: 'AI助手', icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold text-primary">一号指挥台</h1>
        <p className="text-xs text-muted-foreground">开源版 v0.1.0</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          设置
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </aside>
  )
}
