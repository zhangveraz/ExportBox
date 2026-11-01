// 名称: 英文大小写转换
// 描述: 快速转换英文文本的大小写格式，支持多种转换模式
// 路径: ExportBox/app/tools/text-case/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

'use client'

import { useState } from 'react'
import { AlertCircle, Trash2 } from 'lucide-react'
import { CASE_OPTIONS, SAMPLE_TEXTS, type TextCaseHistoryItem } from './text-case-data'
import { TextCaseHistory, TextCaseResult } from './text-case-history'
import { TextCaseInfo, TextCaseStats } from './text-case-info'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ToolShell } from '@/components/tools/tool-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { convertCase, type TextCase } from '@/lib/tools/text-case'

export default function TextCasePage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [caseType, setCaseType] = useState<TextCase>('upper')
  const [error, setError] = useState('')
  const [history, setHistory] = useState<TextCaseHistoryItem[]>([])

  const handleConvert = () => {
    setError('')
    if (!input.trim()) {
      setError('请输入需要转换的文本'); setOutput(''); return
    }
    if (/[\u4e00-\u9fa5]/.test(input)) {
      setError('检测到中文字符，本工具仅支持英文大小写转换。'); setOutput(''); return
    }
    if (!/[a-zA-Z0-9]/.test(input)) {
      setError('未检测到有效字符，请输入包含英文字母或数字的文本'); setOutput(''); return
    }
    try {
      const result = convertCase(input, caseType)
      setOutput(result)
      const typeLabel = CASE_OPTIONS.find((option) => option.value === caseType)?.shortLabel || caseType
      setHistory((items) => [{ input: input.slice(0, 50), output: result.slice(0, 50), type: typeLabel }, ...items.slice(0, 4)])
    } catch {
      setError('转换失败，请重试'); setOutput('')
    }
  }
  const preview = (() => {
    if (!input.trim()) return ''
    try {
      return convertCase(input, caseType).slice(0, 50) + (input.length > 50 ? '...' : '')
    } catch {
      return ''
    }
  })()

  return (
    <ToolShell title="英文大小写转换" description="快速转换英文文本的大小写格式，支持编程命名规范与文件名格式化">
      
      <TextCaseStats historyCount={history.length} />
      <div className="mt-2.5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <Card>
          <CardHeader className="px-3 pt-2.5 pb-1.5">
            <CardTitle className="text-sm font-semibold">文本转换</CardTitle>
            <CardDescription className="mt-0.5 truncate text-[10px] leading-4">仅支持英文文本，自动识别单词边界与文件名关键词</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pt-0 pb-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="input" className="text-[11px] font-medium leading-4">输入文本</Label>
                <span className="text-[10px] tabular-nums text-muted-foreground">{input.length} 字符</span>
              </div>
              <Textarea id="input" placeholder="请输入需要转换的英文文本…&#10;支持多行文本输入" value={input} onChange={(event) => { setInput(event.target.value); setError('') }} className="min-h-[150px] font-mono text-[12px] leading-5" />
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-muted-foreground">快速填充：</span>
              {SAMPLE_TEXTS.map((sample) => <Button key={sample.label} variant="outline" onClick={() => { setInput(sample.text); setError(''); setOutput('') }} className="h-6 px-2 text-[11px]">{sample.label}</Button>)}
            </div>
            <div className="space-y-1">
              <Label htmlFor="case-type" className="text-[11px] font-medium leading-4">转换类型</Label>
              <Select value={caseType} onValueChange={(value) => setCaseType(value as TextCase)}>
                <SelectTrigger id="case-type" className="h-8 w-full text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {CASE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}><div className="flex w-full items-center gap-2">{option.icon}<div className="flex-1"><div className="text-[12px] font-medium">{option.label}</div><div className="text-[10px] text-muted-foreground">{option.example}</div></div></div></SelectItem>)}
                </SelectContent>
              </Select>
              {input && <p className="truncate rounded-md bg-muted px-2 py-1 font-mono text-[11px]"><span className="mr-1 font-sans text-[10px] text-muted-foreground">预览</span>{preview}</p>}
            </div>
            {error && <Alert variant="destructive" className="px-2.5 py-1.5"><AlertCircle className="h-3.5 w-3.5" /><AlertDescription className="text-[11px] leading-4">{error}</AlertDescription></Alert>}
            <div className="flex gap-2">
              <Button onClick={handleConvert} className="h-8 flex-1 text-[12px]">转换文本</Button>
              <Button variant="outline" onClick={() => { setInput(''); setOutput(''); setError('') }} title="清空所有内容" className="h-8 w-9 p-0"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          <TextCaseResult output={output} onUseAsInput={() => { setInput(output); setOutput(''); setError('') }} />
          <TextCaseHistory history={history} />
        </div>
      </div>
      <TextCaseInfo />
    </ToolShell>
  )
}
