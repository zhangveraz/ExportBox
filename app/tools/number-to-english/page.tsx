// 名称: 数字转英文
// 描述: 将数字转换为英文表达形式，支持基数词和序数词
// 路径: ExportBox/app/tools/number-to-english/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useState } from 'react'
import { COMMON_NUMBERS, type NumberEnglishHistoryItem } from './number-english-data'
import { NumberEnglishInfo, NumberEnglishStats } from './number-english-info'
import { NumberEnglishHistory, NumberEnglishResults } from './number-english-results'
import { Button } from '@/components/ui/button'
import { ToolShell } from '@/components/tools/tool-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { convertOrdinal, numberToEnglish } from '@/lib/tools/number-english'

export default function NumberToEnglishPage() {
  const [number, setNumber] = useState('')
  const [cardinalResult, setCardinalResult] = useState('')
  const [ordinalResult, setOrdinalResult] = useState('')
  const [history, setHistory] = useState<NumberEnglishHistoryItem[]>([])
  const [error, setError] = useState('')

  const fail = (message: string) => {
    setError(message); setCardinalResult(''); setOrdinalResult('')
  }
  const handleConvert = () => {
    setError('')
    const value = Number(number)
    if (!number.trim()) return fail('请输入数字')
    if (!Number.isFinite(value) || !Number.isInteger(value)) return fail('请输入有效的整数')
    if (value < 0) return fail('请输入正数')
    if (value > 999999999999) return fail('数字太大，最大支持12位数')

    const cardinal = numberToEnglish(value)
    const ordinal = convertOrdinal(value)
    setCardinalResult(cardinal)
    setOrdinalResult(ordinal)
    setHistory((items) => [{ number, cardinal, ordinal }, ...items.slice(0, 4)])
  }

  return (
    <ToolShell title="数字转英文" description="将数字转换为英文表达形式，支持基数词和序数词，适用于支票、合同等正式文件">

      <NumberEnglishStats historyCount={history.length} />

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <Card className="gap-0 py-0">
          <CardHeader className="px-3 pt-3 pb-1.5"><CardTitle className="text-sm font-semibold">数字转换</CardTitle></CardHeader>
          <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
            <div className="space-y-1">
              <Label htmlFor="number" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">输入数字</Label>
              <Input id="number" type="number" placeholder="请输入整数，如：12345" value={number} onChange={(event) => { setNumber(event.target.value); setError('') }} onKeyDown={(event) => { if (event.key === 'Enter') handleConvert() }} className="h-10 text-base font-semibold tabular-nums" />
              {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">常用数字</Label>
              <div className="flex flex-wrap gap-1.5">{COMMON_NUMBERS.map((item) => <Button key={item.value} variant={number === item.value ? 'default' : 'outline'} size="sm" className="h-7 px-2 text-xs" onClick={() => { setNumber(item.value); setError('') }}>{item.label}</Button>)}</div>
            </div>
            <Button onClick={handleConvert} className="h-8 w-full text-sm">转换为英文</Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <NumberEnglishResults number={number} cardinal={cardinalResult} ordinal={ordinalResult} />
          <NumberEnglishHistory history={history} />
        </div>
      </div>

      <NumberEnglishInfo />
    </ToolShell>
  )
}
