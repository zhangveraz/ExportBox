// 名称: 节假日年历标签页
// 描述: 按月份紧凑展示选定国家的年度节假日分布
// 路径: ExportBox/app/tools/holiday-query/holiday-calendar-tab.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

import { Calendar } from 'lucide-react'
import { filterHolidaysByMonth, type Country, type Holiday } from '@/lib/tools/holiday-query'
import { getCalendarDayOfMonth } from '@/lib/date-utils'

export function HolidayCalendarTab({ country, year, holidays, onMonth }: { country?: Country; year: string; holidays: Holiday[]; onMonth: (month: string) => void }) {
  return <div className="space-y-2.5">
    <div className="flex items-center gap-1.5 rounded-lg border bg-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground">{country?.flag} <span className="font-medium text-foreground/80">{country?.name || '国家'}</span>{year} 年节假日分布，点击月份查看详情</div>
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: 12 }, (_, index) => {
        const monthHolidays = filterHolidaysByMonth(holidays, index + 1)
        const highImpact = monthHolidays.some((holiday) => holiday.impact === 'high')
        return <button key={index} type="button" onClick={() => onMonth((index + 1).toString())} className={`rounded-lg border px-2 py-1.5 text-left transition-colors hover:bg-muted/40 ${monthHolidays.length > 0 ? 'border-slate-300 dark:border-white/15' : ''} ${highImpact ? 'border-red-300 bg-red-50/40 dark:border-red-400/30' : ''}`}>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold">{index + 1}月</span>
            {monthHolidays.length > 0 && <span className={`rounded px-1 text-[10px] font-medium ${highImpact ? 'bg-red-100 text-red-600 dark:bg-red-400/15 dark:text-red-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{monthHolidays.length}</span>}
          </div>
          <div className="mt-1 space-y-0.5">
            {monthHolidays.length > 0
              ? monthHolidays.slice(0, 3).map((holiday, holidayIndex) => <div key={holidayIndex} className="flex items-baseline gap-1 text-[10px] text-muted-foreground">
                <span className="shrink-0 font-medium tabular-nums text-foreground/70">{getCalendarDayOfMonth(holiday.date) ?? '--'}日</span>
                <span className="truncate" title={holiday.name}>{holiday.name}</span>
              </div>)
              : <p className="text-[10px] text-muted-foreground/70">无节假日</p>}
            {monthHolidays.length > 3 && <p className="text-[10px] text-muted-foreground">+{monthHolidays.length - 3} 更多</p>}
          </div>
        </button>
      })}
    </div>
  </div>
}
