// 名称: 中文转拼音
// 描述: 将中文文本转换为汉语拼音，支持声调和多种格式
// 路径: ExportBox/app/tools/pinyin/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { EMPTY_STATS, EXAMPLE_BUTTONS, TONE_OPTIONS, type PinyinHistoryItem, type ToneType } from './pinyin-page-data'
import { PinyinInfo, PinyinStats } from './pinyin-info'
import { PinyinHistory, PinyinResults } from './pinyin-results'
import { Button } from '@/components/ui/button'
import { ToolShell } from '@/components/tools/tool-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { analyzeText, convertToPinyin, type PinyinOptions } from '@/lib/tools/pinyin'

export default function PinyinPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [toneType, setToneType] = useState<ToneType>('none')
  const [history, setHistory] = useState<PinyinHistoryItem[]>([])
  const [stats, setStats] = useState(EMPTY_STATS)

  const handleConvert = () => {
    if (!input.trim()) {
      alert('请输入中文文本'); return
    }
    const options: PinyinOptions = { toneType, separator: ' ', nonZh: 'spaced' }
    const result = convertToPinyin(input, options)
    setOutput(result)
    setStats(analyzeText(input))
    const toneLabel = toneType === 'none' ? '无声调' : toneType === 'symbol' ? '符号声调' : '数字声调'
    setHistory((items) => [{ input: input.slice(0, 50), output: result.slice(0, 50), toneType: toneLabel }, ...items.slice(0, 4)])
  }
  const handleReset = () => {
    setInput(''); setOutput(''); setStats(EMPTY_STATS)
  }

  return (
    <ToolShell title="中文转拼音" description="将中文文本转换为拼音，使用专业的 pinyin-pro 库，支持多种声调格式">
      
      <PinyinStats historyCount={history.length} />
      <div className="mt-2.5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <Card className="self-start">
          <CardHeader className="px-3 pt-2.5 pb-1.5">
            <CardTitle className="text-sm font-semibold">拼音转换</CardTitle>
            <CardDescription className="mt-0.5 truncate text-[10px] leading-4">输入中文文本，选择声调格式即可转换</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pt-0 pb-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="input" className="text-[11px] font-medium leading-4">输入中文文本</Label>
                <span className="text-[10px] tabular-nums text-muted-foreground">{input.length} 字符</span>
              </div>
              <Textarea id="input" placeholder="请输入需要转换的中文文本…" value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[150px] font-mono text-[12px] leading-5" />
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-muted-foreground">快速示例：</span>
              {EXAMPLE_BUTTONS.map((example) => <Button key={example.key} variant="outline" onClick={() => { setInput(example.text); setOutput('') }} className="h-6 px-2 text-[11px]">{example.label}</Button>)}
            </div>
            <div className="space-y-1">
              <Label htmlFor="toneType" className="text-[11px] font-medium leading-4">声调格式</Label>
              <Select value={toneType} onValueChange={(value) => setToneType(value as ToneType)}>
                <SelectTrigger id="toneType" className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>{TONE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}><div className="flex w-full items-center gap-2"><div className="flex-1"><div className="text-[12px] font-medium">{option.label}</div><div className="text-[10px] text-muted-foreground">{option.example} - {option.description}</div></div></div></SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex gap-2"><Button onClick={handleConvert} className="h-8 flex-1 text-[12px]">转换拼音</Button><Button onClick={handleReset} variant="outline" title="清空" className="h-8 w-9 p-0"><RotateCcw className="h-3.5 w-3.5" /></Button></div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          <PinyinResults output={output} stats={stats} />
          <PinyinHistory history={history} />
        </div>
      </div>
      <PinyinInfo />
    </ToolShell>
  )
}
