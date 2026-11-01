// 名称: 拼音转换结果
// 描述: 紧凑展示转换文本、字符统计与最近五次记录
// 路径: ExportBox/app/tools/pinyin/pinyin-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Badge } from '@/components/ui/badge'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { analyzeText } from '@/lib/tools/pinyin'
import type { PinyinHistoryItem } from './pinyin-page-data'

interface PinyinResultsProps {
  output: string
  stats: ReturnType<typeof analyzeText>
}

export function PinyinResults({ output, stats }: PinyinResultsProps) {
  if (!output) return <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed px-3 py-6 text-[11px] text-muted-foreground">点击「转换拼音」后在此查看结果</div>
  const statItems = [
    { label: '总字符', value: stats.totalChars },
    { label: '中文', value: stats.chineseChars },
    { label: '非中文', value: stats.nonChineseChars },
    { label: '中文占比', value: stats.conversionRate },
  ]
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-sm font-semibold">转换结果</CardTitle>
        <EnhancedCopyButton text={output} className="h-6 shrink-0 px-2 text-[11px]">复制</EnhancedCopyButton>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pt-0 pb-3">
        <Textarea value={output} readOnly className="min-h-[120px] bg-muted font-mono text-[12px] leading-5" />
        <div className="grid grid-cols-4 gap-1.5">
          {statItems.map((item) => (
            <div key={item.label} className="rounded-md bg-muted/40 px-1.5 py-1 text-center">
              <p className="truncate text-[13px] font-semibold leading-5 tabular-nums">{item.value}</p>
              <p className="truncate text-[10px] leading-4 text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface PinyinHistoryProps {
  history: PinyinHistoryItem[]
}

export function PinyinHistory({ history }: PinyinHistoryProps) {
  if (history.length === 0) return null
  return (
    <Card>
      <CardHeader className="px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-sm font-semibold">最近转换记录<span className="ml-1.5 text-[10px] font-normal text-muted-foreground">最多 5 条</span></CardTitle>
      </CardHeader>
      <CardContent className="px-3 pt-0 pb-3">
        <div className="divide-y">
          {history.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2 py-1">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <Badge variant="outline" className="h-4 shrink-0 px-1 text-[10px]">{item.toneType}</Badge>
                <span className="truncate font-mono text-[10px] text-muted-foreground" title={item.input}>{item.input}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">→</span>
                <span className="truncate font-mono text-[10px]">{item.output}</span>
              </div>
              <EnhancedCopyButton text={item.output} iconOnly title="复制历史结果" className="h-6 w-6 shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
