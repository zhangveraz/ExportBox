// 名称: 交期计算结果
// 描述: 单屏紧凑版交期结果，含预计交付日期、阶段里程碑与排除日期
// 路径: ExportBox/app/tools/delivery-date-calculator/delivery-date-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { CalendarOff, Factory, PackageCheck, Ship } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDeliveryDate, type DeliveryDateCalculation, type DeliveryMilestone } from '@/lib/tools/delivery-date-calculator'

export function DeliveryDateResults({ calculation }: { calculation: DeliveryDateCalculation }) {
  if (!calculation.result) return <Alert variant="destructive"><AlertDescription>{calculation.error}</AlertDescription></Alert>
  const result = calculation.result
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
          <CardTitle className="text-sm font-semibold">预计交付日期</CardTitle>
          <Badge variant="secondary" className="h-5 text-[10px]">{result.elapsedDays} 个自然日后</Badge>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pt-0 pb-3">
          <div className="rounded-md border border-emerald-200 bg-emerald-50/80 px-2.5 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
            <p className="text-[10px] leading-4 text-emerald-800 dark:text-cyan-100">最终里程碑</p>
            <p className="text-xl font-bold leading-7 text-emerald-950 dark:text-white">{formatDeliveryDate(result.deliveryDate)}</p>
            <p className="font-mono text-[10px] leading-4 text-emerald-700 dark:text-cyan-200">{result.deliveryDate}</p>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Cell label="计划天数" value={`${result.plannedDays} 天`} />
            <Cell label="自然日" value={`${result.elapsedDays} 天`} />
            <Cell label="起始日" value={formatDeliveryDate(result.startDate)} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="px-3 pt-2.5 pb-1.5">
          <CardTitle className="text-sm font-semibold">阶段里程碑</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-0 pb-3">
          <dl className="divide-y">
            {result.milestones.map((milestone) => <MilestoneRow key={milestone.key} milestone={milestone} />)}
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="px-3 pt-2.5 pb-1.5">
          <CardTitle className="text-sm font-semibold">排除日期<span className="ml-1.5 text-[10px] font-normal text-muted-foreground">工作日模式下未计入计划天数</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pt-0 pb-3">
          <div className="grid grid-cols-2 gap-1.5">
            <Cell label="周末" value={`${result.weekendDaysSkipped} 天`} />
            <Cell label="公共假日" value={`${result.holidayDaysSkipped} 天`} />
          </div>
          {!result.holidayCoverageComplete && (
            <Alert className="px-2 py-1.5">
              <CalendarOff className="h-3.5 w-3.5" />
              <AlertDescription className="text-[10px] leading-4">预计日期跨出节假日数据覆盖范围，未覆盖年份仅排除周末，请结合当地官方日历复核。</AlertDescription>
            </Alert>
          )}
          {result.skippedHolidays.length > 0 && (
            <div className="max-h-40 space-y-0.5 overflow-y-auto pr-1">
              {result.skippedHolidays.slice(0, 8).map((holiday) => (
                <div key={holiday.date} className="flex items-center justify-between gap-2 border-b py-1 text-[11px] last:border-0">
                  <span className="truncate">{holiday.nameCN || holiday.localName || holiday.name}</span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{holiday.date}</span>
                </div>
              ))}
              {result.skippedHolidays.length > 8 && <p className="pt-1 text-[10px] text-muted-foreground">另有 {result.skippedHolidays.length - 8} 个公共假日未展开。</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MilestoneRow({ milestone }: { milestone: DeliveryMilestone }) {
  const Icon = milestone.key === 'production' ? Factory : milestone.key === 'transit' ? Ship : PackageCheck
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <dt className="flex min-w-0 items-center gap-1.5 text-[11px]">
        <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{milestone.label}</span>
        <span className="shrink-0 text-[10px] text-muted-foreground">+{milestone.days} 天</span>
      </dt>
      <dd className="shrink-0 text-[11px] font-medium tabular-nums">{formatDeliveryDate(milestone.date)}</dd>
    </div>
  )
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
      <p className="text-[10px] leading-4 text-muted-foreground">{label}</p>
      <p className="truncate text-[13px] font-semibold leading-5 tabular-nums">{value}</p>
    </div>
  )
}
