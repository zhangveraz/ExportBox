// 名称: 工具页功能分类标签条
// 描述: 每个工具页底部的一排分类标签（首页 + 7 个功能分类 + 收藏夹），点击跳到工具目录对应分区
// 路径: ExportBox/components/tools/tool-category-nav.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type CategoryLink = {
  label: string
  href: string
  count: number
}

const pillClassName =
  'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200'

const activePillClassName =
  'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-cyan-300/40 dark:bg-cyan-300/10 dark:text-cyan-200'

export function ToolCategoryNav({
  categories,
  categoryBySlug,
}: {
  categories: CategoryLink[]
  categoryBySlug: Record<string, string>
}) {
  const pathname = usePathname() || ''
  const slugMatch = /^\/tools\/([^/?#]+)/.exec(pathname)
  const activeCategory = slugMatch ? categoryBySlug[slugMatch[1]] : undefined

  // /tools 目录页自己就是分类索引，不用再挂一排标签
  if (!slugMatch) return null

  return (
    <nav
      aria-label="按功能分类浏览工具"
      className="mt-10 rounded-xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-900/4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">按功能分类浏览</p>
        <p className="text-[11px] leading-5 text-slate-400 dark:text-slate-500">
          工具目录按功能性分类整理，点标签去目录页看同类工具
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/" className={pillClassName}>
          <Home className="h-3.5 w-3.5" />
          首页
        </Link>

        {categories.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            aria-current={activeCategory === category.label ? 'true' : undefined}
            className={cn(pillClassName, activeCategory === category.label && activePillClassName)}
          >
            {category.label}
            <span className="text-[10px] tabular-nums opacity-60">{category.count}</span>
          </Link>
        ))}

        <Link
          href="/favorites"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200 dark:hover:bg-amber-300/15"
        >
          <Star className="h-3.5 w-3.5" />
          收藏夹
        </Link>
      </div>
    </nav>
  )
}
