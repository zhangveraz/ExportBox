// 名称: 数字转英文结果
// 描述: 展示基数词、序数词和最近五次转换记录（紧凑版）
// 路径: ExportBox/app/tools/number-to-english/number-english-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber, type NumberEnglishHistoryItem } from './number-english-data'

interface NumberEnglishResultsProps {
  number: string
  cardinal: string
  ordinal: string
}

export function NumberEnglishResults(props: NumberEnglishResultsProps) {
  const empty = !props.cardinal && !props.ordinal
  return (
    <Card className="gap-0 py-0">
      <CardContent className="px-3 pt-2.5 pb-2.5">
        {empty
          ? <p className="rounded-md border border-dashed px-3 py-4 text-center text-[12px] text-muted-foreground">输入数字后点击「转换为英文」，基数词与序数词会显示在这里。</p>
          : <div className="divide-y divide-border/70">
            <div className="pb-2">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-muted-foreground">基数词 Cardinal — 表示数量</span>
                <EnhancedCopyButton text={props.cardinal} variant="ghost" size="sm" className="h-6 text-[11px]">复制</EnhancedCopyButton>
              </div>
              <p className="text-base leading-6 font-semibold text-primary">{props.cardinal}</p>
            </div>
            <div className="pt-2">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-muted-foreground">序数词 Ordinal — 表示顺序</span>
                <EnhancedCopyButton text={props.ordinal} variant="ghost" size="sm" className="h-6 text-[11px]">复制</EnhancedCopyButton>
              </div>
              <p className="text-base leading-6 font-semibold text-primary">{props.ordinal}</p>
            </div>
            <p className="pt-1.5 text-[11px] text-muted-foreground">数字形式：{formatNumber(props.number)}</p>
          </div>}
      </CardContent>
    </Card>
  )
}

interface NumberEnglishHistoryProps {
  history: NumberEnglishHistoryItem[]
}

export function NumberEnglishHistory({ history }: NumberEnglishHistoryProps) {
  if (history.length === 0) return null
  return (
    <Card className="gap-0 py-0">
      <CardContent className="px-3 pt-2.5 pb-2.5">
        <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">最近转换记录（最多 5 条）</p>
        <div className="divide-y divide-border/70 rounded-md border bg-muted/40">
          {history.map((item, index) => (
            <div key={index} className="space-y-0.5 px-2 py-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[12px] font-semibold tabular-nums">{formatNumber(item.number)}</span>
                <div className="flex gap-0.5">
                  <HistoryCopy label="基数" text={item.cardinal} />
                  <HistoryCopy label="序数" text={item.ordinal} />
                </div>
              </div>
              <p className="line-clamp-1 text-[11px] text-muted-foreground" title={item.cardinal}>基数：<span className="text-slate-700 dark:text-slate-200">{item.cardinal}</span></p>
              <p className="line-clamp-1 text-[11px] text-muted-foreground" title={item.ordinal}>序数：<span className="text-slate-700 dark:text-slate-200">{item.ordinal}</span></p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function HistoryCopy({ label, text }: { label: string; text: string }) {
  return <EnhancedCopyButton text={text} variant="ghost" size="sm" className="h-6 px-1.5 text-[11px]">{label}</EnhancedCopyButton>
}
