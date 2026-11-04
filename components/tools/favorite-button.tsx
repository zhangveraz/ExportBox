// 名称: 收藏按钮
// 描述: 一颗小星星，点一下把工具加入收藏夹，再点一下取消，收藏结果记在浏览器本地
// 路径: ExportBox/components/tools/favorite-button.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

'use client'

import { Star } from 'lucide-react'
import { toggleFavorite, useFavorites } from '@/lib/tools/personalization'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  slug: string
  /** 显示在星星后面的文字，不传则只显示星星 */
  label?: string
  size?: 'sm' | 'md'
  className?: string
}

export function FavoriteButton({ slug, label, size = 'sm', className }: FavoriteButtonProps) {
  const favorites = useFavorites()
  const active = favorites.includes(slug)

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? '取消收藏' : '收藏该工具'}
      title={active ? '取消收藏' : '收藏到收藏夹'}
      onClick={(event) => {
        // 卡片本身可能是链接，别让点星星顺带跳走
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(slug)
      }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-md border border-transparent transition-colors',
        size === 'sm' ? 'h-6 w-6' : 'h-7 gap-1.5 px-2',
        active
          ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-300/10'
          : 'text-slate-300 hover:bg-slate-100 hover:text-amber-500 dark:text-slate-500 dark:hover:bg-white/10',
        className
      )}
    >
      <Star className={cn(size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4', active && 'fill-amber-400')} />
      {label && <span className="text-xs font-medium">{label}</span>}
    </button>
  )
}
