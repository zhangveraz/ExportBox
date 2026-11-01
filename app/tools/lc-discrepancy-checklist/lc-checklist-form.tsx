// 名称: 信用证交单自查表单
// 描述: 分组展示、双列排布的审单要点清单（单屏紧凑版）
// 路径: ExportBox/app/tools/lc-discrepancy-checklist/lc-checklist-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { ListChecks, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  LC_CHECKLIST_GROUPS,
  getLcGroupItems,
  type LcChecklistItem,
} from '@/lib/tools/lc-discrepancy-checklist'
import { cn } from '@/lib/utils'

export interface LcChecklistFormProps {
  checkedIds: string[]
  creditNo: string
  onToggle: (itemId: string) => void
  onCreditNoChange: (value: string) => void
  onCheckAll: () => void
  onReset: () => void
}

const SEVERITY_META: Record<LcChecklistItem['severity'], { label: string; className: string }> = {
  critical: { label: '致命', className: 'border-red-200 bg-red-50 text-red-700 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-300' },
  major: { label: '重要', className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-300' },
  minor: { label: '次要', className: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-300/20 dark:bg-slate-300/10 dark:text-slate-300' },
}

export function LcChecklistForm({ checkedIds, creditNo, onToggle, onCreditNoChange, onCheckAll, onReset }: LcChecklistFormProps) {
  const checked = new Set(checkedIds)

  return (
    <Card className="self-start">
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold">交单自查清单</CardTitle>
          <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">勾选已核对通过的要点，实时评估交单风险（已选 {checkedIds.length} 项）</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button type="button" variant="outline" onClick={onCheckAll} className="h-6 px-1.5 text-[11px]">
            <ListChecks className="mr-1 h-3 w-3" />全选
          </Button>
          <Button type="button" variant="outline" onClick={onReset} className="h-6 px-1.5 text-[11px]">
            <RotateCcw className="mr-1 h-3 w-3" />重置
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pt-0 pb-3">
        <Input id="creditNo" value={creditNo} onChange={(event) => onCreditNoChange(event.target.value)} className="h-7 text-[12px]" placeholder="信用证号（可选，用于改证片段抬头）" maxLength={40} aria-label="信用证号" />

        <div className="space-y-1.5">
          {LC_CHECKLIST_GROUPS.map((group) => {
            const items = getLcGroupItems(group.id)
            return (
              <div key={group.id} className="rounded-md border bg-muted/20 px-2 py-1.5">
                <p className="flex items-center justify-between gap-2 text-[11px] font-semibold leading-4" title={group.description}>
                  <span className="truncate">{group.name}</span>
                  <span className="shrink-0 text-[10px] font-normal text-muted-foreground">{items.filter((item) => checked.has(item.id)).length}/{items.length}</span>
                </p>
                <ul className="mt-0.5 grid gap-x-3 gap-y-0.5 sm:grid-cols-2">
                  {items.map((item) => (
                    <li key={item.id}>
                      <label className="flex cursor-pointer items-start gap-1.5 text-[11px] leading-4 transition-colors hover:text-emerald-700" title={item.hint || item.text}>
                        <input
                          type="checkbox"
                          checked={checked.has(item.id)}
                          onChange={() => onToggle(item.id)}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-slate-300 accent-emerald-600"
                          aria-label={item.text}
                        />
                        <span className={cn('min-w-0 flex-1', checked.has(item.id) && 'text-muted-foreground line-through')}>{item.text}</span>
                        <Badge variant="outline" className={cn('h-4 shrink-0 px-1 text-[9px]', SEVERITY_META[item.severity].className)}>{SEVERITY_META[item.severity].label}</Badge>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
