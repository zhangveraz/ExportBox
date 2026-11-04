// 名称: 收藏夹视图
// 描述: 读取浏览器本地收藏，渲染成工具卡片；空收藏时给出引导
// 路径: ExportBox/app/favorites/favorites-view.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

'use client'

import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { HOME_TOOLS } from '@/components/home/home-data'
import { FavoriteButton } from '@/components/tools/favorite-button'
import { Badge } from '@/components/ui/badge'
import { useFavorites } from '@/lib/tools/personalization'
import { getToolBadgeClassName } from '@/lib/tools/registry-ui'
import { cn } from '@/lib/utils'

export function FavoritesView() {
  const favorites = useFavorites()
  const favoriteTools = favorites
    .map((slug) => HOME_TOOLS.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof HOME_TOOLS)[number] => Boolean(tool))

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 fill-amber-400 text-amber-500" />
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">收藏夹</h1>
          {favoriteTools.length > 0 && (
            <Badge variant="outline" className="border-amber-300 text-xs text-amber-700 dark:border-amber-300/30 dark:text-amber-200">
              {favoriteTools.length} 个工具
            </Badge>
          )}
        </div>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          收藏只保存在你自己的浏览器里，换设备或清理浏览器数据会丢失；不需要登录，也不会上传到服务器。
        </p>
      </header>

      {favoriteTools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-white/15 dark:bg-white/4">
          <Star className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-100">暂无收藏工具</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            在任意工具卡片或搜索结果右侧点一下星标，就能把常用工具收进这里，下次不用再翻目录。
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              去工具目录挑一挑
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/15 dark:text-slate-200"
            >
              回到首页
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteTools.map((tool) => {
            const Icon = tool.icon
            return (
              <div
                key={tool.id}
                className="group relative flex min-h-[74px] items-start gap-2.5 rounded-lg border border-slate-200/80 bg-white/85 p-3 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md hover:shadow-amber-900/5 dark:border-white/10 dark:bg-white/4 dark:hover:border-amber-300/40"
              >
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', tool.bgColor, tool.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={tool.href} className="block">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">{tool.shortTitle}</span>
                      {tool.badge && (
                        <Badge variant="outline" className={cn('shrink-0 border-0 px-1.5 py-0 text-[10px]', getToolBadgeClassName(tool.badge))}>
                          {tool.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.description}</p>
                  </Link>
                </div>
                <FavoriteButton slug={tool.slug} className="mt-0.5" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
