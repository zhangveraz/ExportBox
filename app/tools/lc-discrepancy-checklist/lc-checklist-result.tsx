// 名称: 信用证交单自查结果
// 描述: 完成度、风险等级、未勾致命项与英文改证片段（单屏紧凑版）
// 路径: ExportBox/app/tools/lc-discrepancy-checklist/lc-checklist-result.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { AlertTriangle, Lightbulb, MailWarning } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import type { LcChecklistEvaluation } from '@/lib/tools/lc-discrepancy-checklist'
import { cn } from '@/lib/utils'

export interface LcChecklistResultProps {
  evaluation: LcChecklistEvaluation
  amendmentRequests: string[]
}

const RISK_BADGE: Record<LcChecklistEvaluation['riskLevel'], string> = {
  high: 'border-red-200 bg-red-50 text-red-700 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-300',
  medium: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-300',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-300',
}

export function LcChecklistResult({ evaluation, amendmentRequests }: LcChecklistResultProps) {
  const stats = [
    { label: '完成度', value: `${evaluation.completionPercent}%`, note: `${evaluation.checkedCount}/${evaluation.totalItems} 项` },
    { label: '自查得分', value: `${evaluation.score}`, note: '致命10/重要5/次要2' },
    { label: '未勾致命', value: `${evaluation.uncheckedCritical.length}`, note: evaluation.uncheckedCritical.length > 0 ? '可能被拒付' : '全部通过' },
    { label: '未勾重要', value: `${evaluation.uncheckedMajor.length}`, note: '建议复核' },
  ]

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
          <CardTitle className="text-sm font-semibold">风险评估</CardTitle>
          <Badge variant="outline" className={cn('h-5 shrink-0 px-2 text-[11px] font-semibold', RISK_BADGE[evaluation.riskLevel])}>{evaluation.riskLabel}</Badge>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pt-0 pb-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-valuenow={evaluation.completionPercent} aria-valuemin={0} aria-valuemax={100} aria-label="清单完成度">
            <div
              className={cn('h-full rounded-full transition-all', evaluation.riskLevel === 'low' ? 'bg-emerald-500' : evaluation.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500')}
              style={{ width: `${evaluation.completionPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-md bg-muted/50 px-2 py-1.5">
                <p className="truncate text-[10px] leading-4 text-muted-foreground">{stat.label}</p>
                <p className="text-[13px] font-semibold leading-5 tabular-nums">{stat.value}</p>
                <p className="truncate text-[10px] leading-4 text-muted-foreground">{stat.note}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] leading-4 text-muted-foreground">{evaluation.summary}</p>

          {evaluation.uncheckedCritical.length > 0 && (
            <div className="space-y-0.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] leading-4 dark:border-red-300/20 dark:bg-red-300/10">
              <p className="flex items-center gap-1 font-semibold text-red-700 dark:text-red-300"><AlertTriangle className="h-3.5 w-3.5" />未解决的致命项（{evaluation.uncheckedCritical.length}）</p>
              <ul className="ml-4 list-disc text-red-700/90 dark:text-red-200/90">
                {evaluation.uncheckedCritical.map((item) => <li key={item.id}>{item.text}</li>)}
              </ul>
            </div>
          )}

          <div className="space-y-0.5">
            <p className="flex items-center gap-1 text-[11px] font-semibold"><Lightbulb className="h-3.5 w-3.5 text-amber-600" />下一步建议</p>
            <ul className="ml-4 list-disc text-[11px] leading-4 text-muted-foreground">
              {evaluation.advice.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><MailWarning className="h-3.5 w-3.5" />英文改证/确认片段</CardTitle>
            <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">针对未勾致命项生成，可直接粘贴进邮件或交单面函</p>
          </div>
          {amendmentRequests.length > 0 && (
            <EnhancedCopyButton text={amendmentRequests.join('\n\n')} variant="outline" className="h-6 shrink-0 px-2 text-[11px]">全部复制</EnhancedCopyButton>
          )}
        </CardHeader>
        <CardContent className="space-y-1.5 px-3 pt-0 pb-3">
          {amendmentRequests.length === 0 ? (
            <p className="rounded-md border border-dashed px-3 py-4 text-center text-[11px] text-muted-foreground">致命项全部通过，无需生成改证片段</p>
          ) : (
            amendmentRequests.map((sentence) => (
              <div key={sentence} className="flex items-start justify-between gap-2 rounded-md border bg-muted/20 px-2 py-1.5">
                <p className="min-w-0 flex-1 wrap-break-word text-[11px] leading-4">{sentence}</p>
                <EnhancedCopyButton text={sentence} variant="ghost" className="h-5 shrink-0 px-1 text-[10px]">复制</EnhancedCopyButton>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
