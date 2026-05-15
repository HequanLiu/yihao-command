'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
}

export function PageHeader({ title, description, backHref }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {backHref && (
        <Link
          href={backHref}
          className="flex items-center justify-center w-8 h-8 rounded-md border hover:bg-accent transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}
