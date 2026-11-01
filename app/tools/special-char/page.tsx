// 名称: 特殊字符检查与转换
// 描述: 检查并转换文本中的特殊字符，避免邮件或文档中的乱码
// 路径: ExportBox/app/tools/special-char/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

'use client'

import { useState } from 'react'
import { SAMPLE_TEXTS, categorizeSpecialChars, type CheckHistoryItem } from './special-char-data'
import { SpecialCharHistory, SpecialCharStats } from './special-char-dashboard'
import { SpecialCharInfo } from './special-char-info'
import { SpecialCharCheckResult } from './special-char-result'
import { Button } from '@/components/ui/button'
import { ToolShell } from '@/components/tools/tool-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { checkSpecialChars } from '@/lib/tools/special-char'

export default function SpecialCharPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ReturnType<typeof checkSpecialChars> | null>(null)
  const [checkHistory, setCheckHistory] = useState<CheckHistoryItem[]>([])

  const handleCheck = () => {
    if (!input) return
    const checkResult = checkSpecialChars(input)
    setResult(checkResult)
    setCheckHistory((history) => [{
      time: new Date().toLocaleTimeString('zh-CN'),
      charCount: checkResult.specialChars.length,
      hasSpecial: checkResult.hasSpecialChars,
    }, ...history.slice(0, 4)])
  }

  return (
    <ToolShell title="特殊字符检查与转换" description="检查文本中的特殊字符，并提供清理或替换选项，避免在邮件或文档中出现乱码">
      
      <SpecialCharStats history={checkHistory} />
      <div className="mt-2.5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <Card className="self-start">
          <CardHeader className="px-3 pt-2.5 pb-1.5">
            <CardTitle className="text-sm font-semibold">文本检查</CardTitle>
            <CardDescription className="mt-0.5 truncate text-[10px] leading-4">粘贴文本后自动检测并标记所有特殊字符</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pt-0 pb-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="input" className="text-[11px] font-medium leading-4">输入文本</Label>
                <span className="text-[10px] tabular-nums text-muted-foreground">{input.length} 字符</span>
              </div>
              <Textarea id="input" placeholder="粘贴需要检查的文本…" value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[170px] font-mono text-[12px] leading-5" />
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-muted-foreground">快速示例：</span>
              {SAMPLE_TEXTS.map((sample) => (
                <Button key={sample.label} variant="outline" onClick={() => { setInput(sample.text); setResult(null) }} className="h-6 px-2 text-[11px]">{sample.label}</Button>
              ))}
            </div>
            <Button onClick={handleCheck} className="h-8 w-full text-[12px]">检查特殊字符</Button>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {result
            ? <SpecialCharCheckResult result={result} stats={categorizeSpecialChars(result.specialChars)} />
            : <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed px-3 py-6 text-[11px] text-muted-foreground">点击「检查特殊字符」后在此查看结果</div>}
          <SpecialCharHistory history={checkHistory} />
        </div>
      </div>
      <SpecialCharInfo />
    </ToolShell>
  )
}
