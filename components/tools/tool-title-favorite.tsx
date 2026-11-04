// 名称: 工具标题栏收藏按钮
// 描述: 工具页标题右侧的收藏按钮，从地址自动识别当前工具，收藏后写入本地收藏夹
// 路径: ExportBox/components/tools/tool-title-favorite.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

'use client'

import { usePathname } from 'next/navigation'
import { Star } from 'lucide-react'
import { toggleFavorite, useFavorites } from '@/lib/tools/personalization'
import { cn } from '@/lib/utils'

export function ToolTitleFavorite() {
  const pathname = usePathname()
  const favorites = useFavorites()

  // 形如 /tools/quote-calculator → quote-calculator
  const match = /^\/tools\/([^/?#]+)/.exec(pathname ?? '')
  const slug = match?.[1]

  if (!slug) return null

  const active = favorites.includes(slug)

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? '取消收藏该工具' : '收藏该工具'}
      title={active ? '已收藏，点击取消' : '收藏到收藏夹'}
      onClick={() => toggleFavorite(slug)}
      className={cn(
        'inline-flex h-7 shrink-0 items-center gap-1 rounded-md border px-2.5 text-xs transition-colors',
        active
          ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200'
          : 'border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:border-white/15 dark:text-slate-300 dark:hover:border-amber-300/40 dark:hover:bg-amber-300/10'
      )}
    >
      <Star className={cn('h-3.5 w-3.5', active && 'fill-amber-400 text-amber-500')} />
      {active ? '已收藏' : '收藏'}
    </button>
  )
}
