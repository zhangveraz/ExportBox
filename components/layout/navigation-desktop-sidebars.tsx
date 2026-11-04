// 名称: 桌面导航侧栏
// 描述: 左侧展示业务流程分类与收藏夹入口，右侧展示用户收藏的工具
// 路径: ExportBox/components/layout/navigation-desktop-sidebars.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

import Link from 'next/link'
import { ArrowRight, BadgeCheck, ExternalLink, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getToolBySlug, type ToolCategory } from '@/lib/tools/registry'
import { useFavorites } from '@/lib/tools/personalization'
import { getToolBadgeClassName } from '@/lib/tools/registry-ui'
import { cn } from '@/lib/utils'
import {
  NAV_ACTIVE_CATEGORIES,
  NAV_CATEGORY_META,
  NAV_EXTERNAL_LINKS,
  NAV_FEATURED_TOOLS,
  NAV_TOOLS_BY_CATEGORY,
} from './navigation-data'

interface CategorySidebarProps {
  activeCategory: ToolCategory
  onActiveCategoryChange: (category: ToolCategory) => void
  onClose: () => void
}

export function CategorySidebar({ activeCategory, onActiveCategoryChange, onClose }: CategorySidebarProps) {
  const favorites = useFavorites()

  return (
    <aside className="h-full overflow-y-auto border-r border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">业务流程</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {Object.values(NAV_TOOLS_BY_CATEGORY).flat().length} 款工具
          </p>
        </div>
        <Badge className="border-0 bg-slate-950 text-white dark:bg-white dark:text-slate-950">Desk</Badge>
      </div>

      <div className="space-y-1">
        {NAV_ACTIVE_CATEGORIES.map((category) => {
          const meta = NAV_CATEGORY_META[category]
          const Icon = meta.icon
          return (
            <button
              key={category}
              type="button"
              onMouseEnter={() => onActiveCategoryChange(category)}
              onFocus={() => onActiveCategoryChange(category)}
              onClick={() => onActiveCategoryChange(category)}
              className={cn(
                'group flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-all hover:bg-white hover:shadow-xs dark:hover:bg-white/10',
                activeCategory === category && 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-200/80 dark:bg-cyan-300/10 dark:text-cyan-200 dark:ring-cyan-300/20'
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon className={cn('h-4 w-4 shrink-0', meta.tone)} />
                <span className={cn(
                  'truncate font-medium text-slate-700 group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white',
                  activeCategory === category && 'text-emerald-700 dark:text-cyan-200'
                )}>
                  {category}
                </span>
              </span>
              <span className="text-xs text-slate-400">{NAV_TOOLS_BY_CATEGORY[category].length}</span>
            </button>
          )
        })}

        {/* 业务流程下面单独留一个收藏夹入口，点一下跳到收藏夹页面 */}
        <Link
          href="/favorites"
          onClick={onClose}
          className="group mt-1 flex items-center justify-between rounded-md border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-sm transition-all hover:border-amber-300 hover:bg-amber-100/80 dark:border-amber-300/20 dark:bg-amber-300/10 dark:hover:bg-amber-300/20"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-500" />
            <span className="truncate font-medium text-amber-700 dark:text-amber-200">收藏夹</span>
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-300">{favorites.length}</span>
        </Link>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200/80 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-cyan-200">
          <BadgeCheck className="h-3.5 w-3.5" />
          精选链路
        </div>
        <div className="space-y-1">
          {NAV_FEATURED_TOOLS.slice(0, 3).map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              onClick={onClose}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200"
            >
              {tool.shortTitle}
              <ArrowRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

/** 右侧栏：显示用户收藏的工具，没有收藏时给一句提示 */
export function FavoritesSidebar({ onClose }: { onClose: () => void }) {
  const favorites = useFavorites()
  const favoriteTools = favorites
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is NonNullable<ReturnType<typeof getToolBySlug>> => Boolean(tool))

  return (
    <aside className="h-full overflow-y-auto border-l border-slate-200/80 bg-slate-950 p-4 text-white dark:border-white/10">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
          <p className="text-sm font-semibold">收藏夹</p>
        </div>
        {favoriteTools.length > 0 && (
          <Link
            href="/favorites"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
          >
            全部收藏
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {favoriteTools.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/15 p-4 text-center">
          <p className="text-xs font-medium text-slate-200">暂无收藏工具</p>
          <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
            在搜索结果里点工具右侧的星标，就能收藏到这里
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {favoriteTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              onClick={onClose}
              className="block rounded-md border border-white/10 bg-white/4 p-3 transition-colors hover:border-amber-300/50 hover:bg-amber-300/10"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold">{tool.shortTitle}</span>
                {tool.badge ? (
                  <Badge variant="outline" className={cn('shrink-0 border-0 px-2 py-0 text-[10px]', getToolBadgeClassName(tool.badge))}>
                    {tool.badge}
                  </Badge>
                ) : (
                  <Star className="h-3 w-3 shrink-0 fill-amber-300 text-amber-300" />
                )}
              </div>
              <p className="line-clamp-2 text-xs leading-5 text-slate-300">{tool.description}</p>
            </Link>
          ))}
        </div>
      )}

      {NAV_EXTERNAL_LINKS.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="mb-2 text-xs font-semibold text-slate-400">外部入口</p>
          <div className="space-y-1">
            {NAV_EXTERNAL_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                  <ExternalLink className="ml-auto h-3 w-3 text-slate-500" />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}
