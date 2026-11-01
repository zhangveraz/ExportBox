// 名称: 宗教节日标签页
// 描述: 按宗教分组紧凑展示参考节日
// 路径: ExportBox/app/tools/holiday-query/holiday-religious-tab.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

import { AlertCircle, Globe, Info } from 'lucide-react'
import { getImpactLevelName, religiousHolidays2025, type Holiday } from '@/lib/tools/holiday-query'
import { formatCalendarDateKey } from '@/lib/date-utils'

const GROUPS = [
  { title: '伊斯兰教节日', match: '伊斯兰教', note: '影响中东、东南亚、南亚、北非', color: 'text-emerald-600' },
  { title: '基督教节日', match: '基督教', note: '影响欧美、拉美、非洲', color: 'text-blue-600' },
  { title: '印度教节日', match: '印度教', note: '影响印度、尼泊尔、斯里兰卡', color: 'text-orange-600' },
]

export function ReligiousHolidayTab() {
  const other = religiousHolidays2025.filter((holiday) => !GROUPS.some((group) => holiday.description?.includes(group.match)))
  return <div className="space-y-2.5">
    <div className="flex items-start gap-1.5 rounded-lg border bg-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />主要宗教节日对相关国家和地区的商业活动有重要影响。以下日期为参考数据，伊斯兰历和部分宗教历法日期可能有 1-2 天偏差。</div>
    <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
      {GROUPS.map((group) => <ReligionGroup key={group.match} title={group.title} note={group.note} color={group.color} holidays={religiousHolidays2025.filter((holiday) => holiday.description?.includes(group.match))} />)}
      <ReligionGroup title="其他宗教节日" holidays={other} />
    </div>
  </div>
}

function ReligionGroup({ title, holidays, note, color }: { title: string; holidays: Holiday[]; note?: string; color?: string }) {
  if (holidays.length === 0) return null
  return <div>
    <div className="mb-1.5 flex items-center gap-1.5">
      {note && <Globe className={`h-3.5 w-3.5 shrink-0 ${color}`} />}
      <h3 className="text-[13px] font-semibold">{title}</h3>
      {note && <span className="truncate text-[10px] text-muted-foreground">{note}</span>}
    </div>
    <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
      {holidays.map((holiday, index) => <div key={index} className="rounded-lg border px-2 py-1.5 transition-colors hover:bg-muted/40">
        <div className="flex items-start justify-between gap-1.5">
          <p className="min-w-0 truncate text-[12px] font-medium" title={holiday.name}>{holiday.name}</p>
          <span className={`shrink-0 rounded px-1 py-px text-[10px] ${holiday.impact === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{getImpactLevelName(holiday.impact)}影响</span>
        </div>
        <p className="truncate text-[10px] text-muted-foreground">{holiday.nameCN || holiday.localName} · {formatCalendarDateKey(holiday.date, { month: '2-digit', day: '2-digit' })}</p>
        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground/80" title={holiday.description}>{holiday.description}</p>
        {holiday.name.includes('Ramadan') && <p className="mt-1 flex items-start gap-1 rounded bg-amber-50 px-1 py-0.5 text-[10px] text-amber-700"><AlertCircle className="mt-px h-2.5 w-2.5 shrink-0" />斋月期间工作时间缩短，商务活动减少</p>}
      </div>)}
    </div>
  </div>
}
