// 名称: 人民币大写转换
// 描述: 将数字金额转换为中文大写形式，适用于发票、合同等正式文件
// 路径: ExportBox/app/tools/rmb-converter/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useState } from 'react'
import { RmbReference, RmbStats } from './rmb-info-panels'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ToolShell } from '@/components/tools/tool-shell'
import { numberToChinese } from '@/lib/tools/rmb-converter'
import { ClipboardList } from 'lucide-react'

export default function RMBConverterPage() {
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState<Array<{ amount: string, result: string }>>([])

  const handleConvert = () => {
    setError('')
    const num = Number(amount)

    if (!Number.isFinite(num)) {
      setError('请输入有效的数字')
      setResult('')
      return
    }

    if (num < 0) {
      setError('请输入正数')
      setResult('')
      return
    }

    if (num > 999999999999999) {
      setError('数字太大，无法转换')
      setResult('')
      return
    }

    try {
      const converted = numberToChinese(num)
      setResult(converted)
      setHistory(prev => [{ amount: amount, result: converted }, ...prev.slice(0, 4)])
    } catch {
      setError('转换出错，请重试')
      setResult('')
    }
  }

  const commonAmounts = [
    { value: '100', label: '100元' },
    { value: '1000', label: '1千元' },
    { value: '10000', label: '1万元' },
    { value: '100000', label: '10万元' },
    { value: '1000000', label: '100万元' },
  ]

  return (
    <ToolShell title="人民币大写转换器" description="将数字金额转换为中文大写格式，适用于发票、合同等正式文件">

      <RmbStats historyCount={history.length} />

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* 输入区 */}
        <Card className="gap-0 py-0">
          <CardHeader className="px-3 pt-3 pb-1.5">
            <CardTitle className="text-sm font-semibold">金额转换</CardTitle>
            <p className="text-[11px] text-muted-foreground">输入数字金额，自动转换为财务规范的中文大写格式</p>
          </CardHeader>
          <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
            <div className="space-y-1">
              <Label htmlFor="amount" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">金额（数字）</Label>
              <Input
                id="amount"
                type="number"
                placeholder="请输入金额，如：12345.67"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleConvert() }}
                step="0.01"
                className="h-10 text-base font-semibold tabular-nums"
              />
              {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">快捷金额</Label>
              <div className="flex flex-wrap gap-1.5">
                {commonAmounts.map((item) => (
                  <Button
                    key={item.value}
                    variant={amount === item.value ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => { setAmount(item.value); setError('') }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleConvert} className="h-8 w-full text-sm">
              转换为大写
            </Button>
          </CardContent>
        </Card>

        {/* 结果与历史 */}
        <Card className="gap-0 py-0">
          <CardHeader className="px-3 pt-3 pb-1.5">
            <CardTitle className="text-sm font-semibold">转换结果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
            <div className="rounded-md border-2 border-primary/60 bg-primary/5 px-3 py-2">
              {result ? (
                <div className="flex items-start justify-between gap-2">
                  <p className="text-lg leading-7 font-bold text-primary">{result}</p>
                  <EnhancedCopyButton text={result} variant="ghost" size="sm">复制</EnhancedCopyButton>
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">输入金额后点击「转换为大写」，结果会显示在这里。</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <ClipboardList className="h-3.5 w-3.5" />最近转换记录（最多 5 条）
              </div>
              {history.length > 0 ? (
                <div className="divide-y divide-border/70 rounded-md border bg-muted/40">
                  {history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 px-2 py-1">
                      <div className="min-w-0 flex-1 truncate text-[12px]">
                        <span className="font-mono tabular-nums text-muted-foreground">{item.amount}</span>
                        <span className="mx-1 text-muted-foreground/60">→</span>
                        <span className="text-slate-700 dark:text-slate-200">{item.result}</span>
                      </div>
                      <EnhancedCopyButton text={item.result} variant="ghost" size="icon" iconOnly title="复制历史结果" className="h-6 w-6 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-dashed px-2 py-2 text-[11px] text-muted-foreground">还没有记录，转换一次就会出现在这里。</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <RmbReference />
    </ToolShell>
  )
}
