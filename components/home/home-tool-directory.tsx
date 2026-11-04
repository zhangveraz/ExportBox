// 名称: 首页工具目录
// 描述: 按真实外贸业务流（询盘 → 报价 → 收款 → 出货 → 单证 → 效率）分 6 段展示全部工具
// 路径: ExportBox/components/home/home-tool-directory.tsx
// 作者: ExportBox
// 更新时间: 2026-11-03

import Link from 'next/link'
import { ArrowRight, BadgeCheck, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from '@/components/tools/favorite-button'
import { cn } from '@/lib/utils'
import { HOME_TOOLS } from './home-data'
import { HOME_FLOW_STAGES } from './home-flow'
import { HomeFlowNav } from './home-flow-nav'

/** slug → 首页展示用的工具卡数据（图标、配色、徽标都在 home-data 里） */
const TOOL_BY_SLUG = new Map(HOME_TOOLS.map((tool) => [tool.slug, tool]))

export function HomeToolDirectory() {
  return (
    <section id="tools" className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
            <BadgeCheck className="h-3.5 w-3.5" />
            工具目录
          </div>
          <h2 className="text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">按业务流选择工具</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            顺序就是一单生意走下去的顺序：接询盘 → 算报价 → 收钱 → 出货 → 出单证，最后是不分环节的随手小工具。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/favorites"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200 dark:hover:bg-amber-300/15"
          >
            <Star className="h-3.5 w-3.5" />
            收藏夹
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-300/50 dark:hover:text-cyan-200"
          >
            全部工具目录
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 阶段小标签，点一下滑到对应分类 */}
      <HomeFlowNav />

      <div className="space-y-4">
        {HOME_FLOW_STAGES.map((stage, index) => {
          const stageTools = stage.slugs.map((slug) => TOOL_BY_SLUG.get(slug)).filter((tool) => Boolean(tool))

          return (
            <div
              key={stage.id}
              id={stage.id}
              className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-900/4 backdrop-blur-xl sm:p-5 dark:border-white/10 dark:bg-slate-950/60"
            >
              <div className="mb-3.5 flex flex-wrap items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-semibold text-white tabular-nums shadow-sm shadow-blue-600/25 dark:bg-blue-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-slate-950 dark:text-white">{stage.label}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{stage.summary}</p>
                </div>
                <span className="ml-auto text-xs text-slate-400 tabular-nums dark:text-slate-500">
                  {stageTools.length} 个工具
                </span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stageTools.map((tool) => {
                  if (!tool) return null
                  const Icon = tool.icon
                  return (
                    <div key={tool.id} className="relative">
                      <Link
                        href={tool.href}
                        className="group flex min-h-[72px] items-center gap-3 rounded-md border border-slate-200/80 bg-white/80 p-3 pr-8 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-md hover:shadow-emerald-900/[0.05] dark:border-white/10 dark:bg-white/3 dark:hover:border-cyan-300/50 dark:hover:bg-cyan-300/10"
                      >
                        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', tool.bgColor, tool.color)}>
                          <Icon className="h-[18px] w-[18px]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <p className="truncate text-sm font-semibold text-slate-950 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-cyan-200">
                              {tool.shortTitle}
                            </p>
                            {tool.badge && (
                              <Badge
                                variant="outline"
                                className={cn('shrink-0 border-0 px-1.5 py-0 text-[10px]', tool.badgeClassName)}
                              >
                                {tool.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                      {/* 卡片右上角的收藏星标 */}
                      <FavoriteButton slug={tool.slug} className="absolute top-1 right-1 z-10 bg-white/85 dark:bg-slate-900/70" />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
