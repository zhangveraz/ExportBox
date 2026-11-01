// 名称: 首页主视觉
// 描述: 左文右图的工作台式首屏，用纯 CSS 网格与柔光代替图片底图
// 路径: ExportBox/components/home/home-hero.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import Link from 'next/link'
import { ArrowLeftRight, ArrowRight, ArrowUpRight, Container, Sparkles } from 'lucide-react'
import { HERO_TOOLS, HOME_STATS } from './home-data'

/** 右侧示例卡片的行数据（纯展示，不参与计算） */
const PREVIEW_ROWS: Array<{ label: string; value: string }> = [
  { label: '采购单价', value: '¥ 12.80' },
  { label: '数量', value: '5,000 pcs' },
  { label: '海运与杂费', value: '¥ 6,200' },
]

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white dark:border-white/10 dark:bg-slate-950">
      {/* 背景：细网格 + 两团柔光，全部用 CSS 绘制，不加载图片 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.055)_1px,transparent_1px)] [background-size:56px_56px] dark:bg-[linear-gradient(to_right,rgba(148,197,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,197,255,0.07)_1px,transparent_1px)]" />
        <div className="absolute -top-28 -right-24 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent dark:from-slate-950" />
      </div>

      <div className="relative grid items-center gap-10 px-5 py-11 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,392px)] lg:px-12 lg:py-14">
        {/* 左侧：标题与入口 */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-blue-700 dark:border-white/15 dark:bg-white/5 dark:text-blue-200">
            <Sparkles className="h-3 w-3" />
            无需注册 · 打开即用
          </span>

          <h1 className="mt-5 text-[2rem] leading-[1.18] font-semibold tracking-tight text-slate-950 sm:text-[2.6rem] lg:text-5xl dark:text-white">
            把报价、装柜、
            <span className="bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              单证资料
            </span>
            <br className="hidden sm:block" />
            收进同一个工作台
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-300">
            报价核算、装柜估算、费用核对、国家与时区资料，46 个外贸工具都放在一处，
            不用在十几个标签页之间来回切换。
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/tools/container-load-calculator"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <Container className="h-4 w-4" />
              装柜计算
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white/70 px-5 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:border-blue-300/50 dark:hover:text-blue-100"
            >
              浏览全部工具
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 常用入口：桌面端固定 6 列，12 个正好两排 */}
          <div className="mt-7">
            <p className="mb-2 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">常用工具</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
              {HERO_TOOLS.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    title={tool.title}
                    className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-2.5 text-[13px] font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-300/40 dark:hover:bg-blue-400/10 dark:hover:text-blue-100"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-300" />
                    <span className="truncate">{tool.shortTitle}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 统计：一条细线下面横排，不再用四张卡片 */}
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-200/80 pt-5 dark:border-white/10">
            {HOME_STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{stat.value}</span>
                  {stat.label}
                </div>
              )
            })}
          </div>
        </div>

        {/* 右侧：报价测算示例卡片 */}
        <div className="relative">
          <div className="rounded-xl border border-white/80 bg-white/85 p-4 shadow-2xl shadow-blue-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase dark:text-slate-500">
                报价测算
              </p>
              <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                示例
              </span>
            </div>

            <dl className="mt-4 space-y-2.5 text-xs">
              {PREVIEW_ROWS.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500 dark:text-slate-400">{row.label}</dt>
                  <dd className="font-medium text-slate-800 tabular-nums dark:text-slate-200">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-white/10">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">客户报价</span>
              <span className="text-lg font-semibold text-blue-700 tabular-nums dark:text-blue-300">¥ 78,400</span>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50/80 p-3 dark:bg-blue-400/10">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>毛利率</span>
                <span className="font-semibold text-blue-700 dark:text-blue-200">24.6%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-blue-100 dark:bg-white/10">
                <div className="h-full w-[62%] rounded-full bg-linear-to-r from-blue-500 to-cyan-400" />
              </div>
            </div>
          </div>

          {/* 两个浮动小标签，让卡片更有层次（窄屏隐藏） */}
          <div className="float-a absolute -top-3 -left-3 hidden items-center gap-1.5 rounded-lg border border-white/80 bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 shadow-lg shadow-blue-900/10 backdrop-blur-sm sm:flex dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-300">
            <Container className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
            装柜测算 · 68 m³
          </div>
          <div className="float-b absolute -right-3 -bottom-3 hidden items-center gap-1.5 rounded-lg border border-white/80 bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 shadow-lg shadow-blue-900/10 backdrop-blur-sm sm:flex dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-300">
            <ArrowLeftRight className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" />
            汇率 · 今日更新
          </div>
        </div>
      </div>
    </section>
  )
}
