// 名称: 节假日工具说明（紧凑版）
// 描述: 顶部统计条 + 可折叠的「影响提示 / 使用说明」，避免解释性内容占满首屏
// 路径: ExportBox/app/tools/holiday-query/holiday-info.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import type { ComponentType } from 'react'
import { AlertCircle, Calendar, ChevronDown, Clock, DollarSign, Globe, Info, Mail, Plane, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function HolidayStats({ totalCountries, totalHolidays, upcomingCount, detailedCountries, year }: { totalCountries: number; totalHolidays: number; upcomingCount: number; detailedCountries: number; year: string }) {
  const stats: Array<{ label: string; value: string; note: string; icon: ComponentType<{ className?: string }>; tone: string }> = [
    { label: '覆盖国家', value: `${totalCountries}+`, note: '国家/地区目录', icon: Globe, tone: '' },
    { label: '年度节假日', value: String(totalHolidays), note: `${year} 年总计`, icon: Calendar, tone: '' },
    { label: '即将到来', value: String(upcomingCount), note: '7 天内', icon: Clock, tone: upcomingCount > 0 ? 'text-orange-600' : '' },
    { label: '详细数据', value: String(detailedCountries), note: '个国家有明细', icon: TrendingUp, tone: '' },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 dark:border-white/10 dark:bg-slate-950/60">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className={`truncate text-[15px] font-semibold leading-5 tabular-nums ${item.tone}`}>{item.value}</p>
              <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{item.label} · {item.note}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const IMPACT_CARDS = [
  { title: '邮件回复', icon: Mail, items: ['节前 1-2 天回复变慢', '长假期间基本无回复', '节后 2-3 天恢复'] },
  { title: '物流影响', icon: Plane, items: ['海运：节前爆仓涨价', '空运：假期停飞减班', '清关：延迟 3-7 天'] },
  { title: '付款提醒', icon: DollarSign, items: ['银行假期暂停转账', '节前催收账款', '预留充足时间'] },
  { title: '重要提醒', icon: AlertCircle, items: ['圣诞节：欧美停工 2 周', '斋月：中东效率降低', '春节：东亚停工 2 周'] },
]

export function HolidayInfo() {
  return (
    <details className="group rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1.5"><Info className="h-3.5 w-3.5" />节假日对外贸的影响 · 使用说明</span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-2 grid gap-2 md:grid-cols-4">
        {IMPACT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 dark:border-white/10 dark:bg-slate-950/60">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                <Icon className="h-3.5 w-3.5 text-slate-400" />{card.title}
              </p>
              <ul className="mt-1 space-y-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                {card.items.map((item) => <li key={item}>· {item}</li>)}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="mt-2 grid gap-3 border-t border-slate-200/70 pt-2 md:grid-cols-2 dark:border-white/10">
        <div>
          <p className="mb-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200">功能特点</p>
          <ul className="space-y-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
            <li>· 覆盖全球 100+ 主要贸易国家和地区</li>
            <li>· 包含公共假期、银行假期与宗教节日</li>
            <li>· 提供节假日对商业活动的影响评级</li>
            <li>· 支持按地区、国家、月份筛选</li>
            <li>· 2027 年起为按规则推算的预测数据</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200">影响等级说明</p>
          <div className="space-y-1 text-[11px]">
            <Impact level="高影响" variant="destructive" text="大部分企业停工，银行关闭" />
            <Impact level="中影响" variant="default" text="部分企业放假，效率降低" />
            <Impact level="低影响" variant="secondary" text="正常工作，个别行业受影响" />
          </div>
        </div>
      </div>
    </details>
  )
}

function Impact({ level, variant, text }: { level: string; variant: 'destructive' | 'default' | 'secondary'; text: string }) {
  return <div className="flex items-center gap-1.5"><Badge variant={variant} className="text-[10px]">{level}</Badge><span className="text-slate-500 dark:text-slate-400">{text}</span></div>
}
