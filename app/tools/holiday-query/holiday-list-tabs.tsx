// 名称: 节假日列表标签页
// 描述: 展示即将到来和国际性节日（紧凑多列卡片）
// 路径: ExportBox/app/tools/holiday-query/holiday-list-tabs.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

import { Calendar, Globe, Info, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getImpactLevelName, internationalHolidays, type Holiday, type UpcomingHoliday } from '@/lib/tools/holiday-query'
import { formatCalendarDateKey } from '@/lib/date-utils'

const LIST_GRID = 'grid max-h-[520px] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3'

function impactTone(impact: string) {
  return impact === 'high'
    ? 'bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-300'
    : impact === 'medium'
      ? 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300'
      : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
}

export function UpcomingHolidayTab({ holidays }: { holidays: UpcomingHoliday[] }) {
  return <div className="space-y-2.5">
    <div className="flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-[11px] text-orange-700"><TrendingUp className="h-3.5 w-3.5 shrink-0" />未来 30 天内全球即将到来的重要节假日，请提前安排订单和物流</div>
    <div className={LIST_GRID}>
      {holidays.length > 0
        ? holidays.slice(0, 30).map((holiday, index) => <UpcomingCard key={`${holiday.country}-${holiday.date}-${index}`} holiday={holiday} />)
        : <div className="col-span-full flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-6 text-xs text-muted-foreground"><Info className="h-3.5 w-3.5" />未来 30 天暂无已收录的高影响节假日</div>}
    </div>
  </div>
}

function UpcomingCard({ holiday }: { holiday: UpcomingHoliday }) {
  const urgent = holiday.daysUntil <= 7
  return <div className={`rounded-lg border px-2 py-1.5 transition-colors hover:bg-muted/40 ${urgent ? 'border-orange-200 bg-orange-50/40' : ''}`}>
    <div className="flex items-start justify-between gap-1.5">
      <p className="flex min-w-0 items-center gap-1 text-[12px] font-medium">
        <span className="shrink-0 text-sm leading-none">{holiday.flag}</span>
        <span className="truncate" title={holiday.name}>{holiday.name}</span>
      </p>
      <Badge variant={urgent ? 'destructive' : 'outline'} className="shrink-0 px-1 text-[10px]">{holiday.daysUntil}天后</Badge>
    </div>
    <p className="truncate text-[10px] text-muted-foreground" title={holiday.nameCN || holiday.localName}>{holiday.nameCN || holiday.localName || '—'}</p>
    <div className="mt-1 flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
      <span className="truncate"><Calendar className="mr-0.5 inline h-3 w-3" />{formatCalendarDateKey(holiday.date, { month: '2-digit', day: '2-digit' })}</span>
      <span className={`shrink-0 rounded px-1 py-px text-[10px] ${impactTone(holiday.impact)}`}>{getImpactLevelName(holiday.impact)}影响</span>
    </div>
    <p className="truncate text-[10px] text-muted-foreground/80">{holiday.country}</p>
  </div>
}

export function InternationalHolidayTab() {
  return <div className="space-y-2.5">
    <div className="flex items-center gap-1.5 rounded-lg border bg-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground"><Globe className="h-3.5 w-3.5 shrink-0" />全球性节日和纪念日，影响多个国家的商业活动</div>
    <div className={LIST_GRID}>
      {internationalHolidays.map((holiday: Holiday, index: number) => <div key={index} className="rounded-lg border px-2 py-1.5 transition-colors hover:bg-muted/40">
        <div className="flex items-start justify-between gap-1.5">
          <p className="min-w-0 truncate text-[12px] font-medium" title={holiday.name}>{holiday.name}</p>
          <span className={`shrink-0 rounded px-1 py-px text-[10px] ${impactTone(holiday.impact)}`}>{getImpactLevelName(holiday.impact)}影响</span>
        </div>
        <p className="truncate text-[10px] text-muted-foreground">{holiday.nameCN || holiday.localName} · {holiday.date}</p>
        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground/80" title={holiday.description}>{holiday.description}</p>
      </div>)}
    </div>
  </div>
}
