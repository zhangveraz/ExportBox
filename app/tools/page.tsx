// 名称: 工具总目录页
// 描述: 独立索引页，按业务分类展示全部工具及其用途说明
// 路径: ExportBox/app/tools/page.tsx
// 作者: ExportBox
// 更新时间: 2026-10-12

import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SITE_NAME } from '@/lib/site'
import { HOME_ACTIVE_CATEGORIES, HOME_TOOLS, HOME_TOOLS_BY_CATEGORY } from '@/components/home/home-data'
import { HomeCategoryRail } from '@/components/home/home-category-nav'

export const metadata: Metadata = {
  title: `全部工具目录 - ${HOME_TOOLS.length} 个外贸实用工具 | ${SITE_NAME}`,
  description: `${SITE_NAME} 共 ${HOME_TOOLS.length} 个外贸工具，覆盖财务报价、物流装柜、外贸沟通、单证制作、国家资料等 8 大业务分类，全部免费且在浏览器本地运行。`,
  alternates: { canonical: '/tools' },
}

export default function ToolsIndexPage() {
  // 右侧悬浮分类栏的数据，id 与下方各分类 section 的锚点一一对应
  const categoryItems = HOME_ACTIVE_CATEGORIES.map((category, index) => ({
    id: `category-${index}`,
    label: category,
    count: HOME_TOOLS_BY_CATEGORY[category].length,
  }))

  return (
    <>
      <div className="space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">全部工具目录</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {HOME_TOOLS.length} 个工具按外贸业务流分为 {HOME_ACTIVE_CATEGORIES.length} 类：从客户报价、装柜出货，到收款催款、单证制作。全部工具免费、免注册，计算在浏览器本地完成。
        </p>
      </header>

      <div className="space-y-8">
        {HOME_ACTIVE_CATEGORIES.map((category, index) => (
          <section key={category} id={`category-${index}`} className="scroll-mt-24 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{category}</h2>
              <Badge variant="outline" className="border-slate-200 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                {HOME_TOOLS_BY_CATEGORY[category].length} 个
              </Badge>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {HOME_TOOLS_BY_CATEGORY[category].map((rawTool) => {
                const tool = HOME_TOOLS.find((item) => item.id === rawTool.id)
                if (!tool) return null
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group flex min-h-[58px] items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white/85 p-2.5 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-900/5 dark:border-white/10 dark:bg-white/4 dark:hover:border-cyan-300/50"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${tool.bgColor} ${tool.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <p className="truncate text-[13px] font-semibold text-slate-950 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-cyan-200">{tool.title}</p>
                        {tool.badge && <Badge variant="outline" className={`shrink-0 border-0 px-1.5 py-0 text-[10px] ${tool.badgeClassName}`}>{tool.badge}</Badge>}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{tool.description}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
      </div>

      {/* 全部工具页也显示右侧悬浮分类栏 */}
      <HomeCategoryRail items={categoryItems} />
    </>
  )
}
