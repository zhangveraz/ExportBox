// 名称: 文本转换结果与历史
// 描述: 展示当前转换结果及最近五次记录（紧凑版）
// 路径: ExportBox/app/tools/text-case/text-case-history.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { TextCaseHistoryItem } from './text-case-data'

interface TextCaseResultProps {
  output: string
  onUseAsInput: () => void
}

export function TextCaseResult({ output, onUseAsInput }: TextCaseResultProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-sm font-semibold">转换结果</CardTitle>
        {output && (
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" onClick={onUseAsInput} title="将结果作为输入" className="h-6 px-1.5 text-[11px]"><RefreshCw className="mr-1 h-3 w-3" />作为输入</Button>
            <EnhancedCopyButton text={output} className="h-6 px-2 text-[11px]">复制</EnhancedCopyButton>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-3 pt-0 pb-3">
        {output
          ? <Textarea value={output} readOnly className="min-h-[132px] bg-muted font-mono text-[12px] leading-5" />
          : <div className="flex min-h-[132px] items-center justify-center rounded-md border border-dashed text-[11px] text-muted-foreground">转换结果将显示在这里</div>}
      </CardContent>
    </Card>
  )
}

interface TextCaseHistoryProps {
  history: TextCaseHistoryItem[]
}

export function TextCaseHistory({ history }: TextCaseHistoryProps) {
  if (history.length === 0) return null
  return (
    <Card>
      <CardHeader className="px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-sm font-semibold">最近转换记录<span className="ml-1.5 text-[10px] font-normal text-muted-foreground">最多保留 5 条</span></CardTitle>
      </CardHeader>
      <CardContent className="px-3 pt-0 pb-3">
        <div className="divide-y">
          {history.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2 py-1">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <Badge variant="outline" className="h-4 shrink-0 px-1 text-[10px]">{item.type}</Badge>
                <span className="truncate font-mono text-[10px] text-muted-foreground">{item.output.length > 40 ? `${item.output.slice(0, 40)}…` : item.output}</span>
              </div>
              <EnhancedCopyButton text={item.output} iconOnly title="复制历史结果" className="h-6 w-6 shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
