// 名称: Unix 时间戳转换工具
// 描述: 时间戳与北京时间日期互转，支持秒/毫秒口径
// 路径: ExportBox/app/tools/timestamp-converter/page.tsx
// 作者: ExportBox
// 更新时间: 2026-09-16

'use client'

import { useMemo, useState } from 'react'
import { useNow } from '@/lib/client-hooks'
import { Clock, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { FormattedInput } from '@/components/ui/formatted-input'
import { MobileButtonGroup } from '@/components/tools/mobile-friendly-wrapper'
import { ToolShell } from '@/components/tools/tool-shell'
import {
  parseShanghaiDateTime,
  timestampToBreakdown,
} from '@/lib/tools/timestamp-converter'

type TimestampUnit = 'auto' | 's' | 'ms'

const UNIT_LABELS: Record<TimestampUnit, string> = {
  auto: '自动判断',
  s: '秒（10 位）',
  ms: '毫秒（13 位）',
}

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState('')
  const [unit, setUnit] = useState<TimestampUnit>('auto')
  const [dateTime, setDateTime] = useState('')
  // 服务端渲染 null 占位，挂载后由客户端时钟接管，避免 SSR/客户端时间不一致的 hydration 错误
  const liveDate = useNow(1000)
  const liveNow = liveDate ? { seconds: Math.floor(liveDate.getTime() / 1000), milliseconds: liveDate.getTime() } : null
  const now = liveNow ?? { seconds: 0, milliseconds: 0 }

  const breakdown = useMemo(() => timestampToBreakdown(timestamp, unit), [timestamp, unit])
  const parsed = useMemo(() => parseShanghaiDateTime(dateTime), [dateTime])

  return (
    <ToolShell title="Unix 时间戳转换" description="Unix 时间戳与北京时间日期互转，用于排查日志、回调参数与 API 数据时间">
      

      <div className="mb-2.5 rounded-md border bg-muted/40 px-2.5 py-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">当前时间（每秒刷新）</span>
          <span className="font-mono text-[12px] font-semibold tabular-nums">{liveNow ? `${now.seconds} s ／ ${now.milliseconds} ms` : '—— s ／ —— ms'}</span>
          <span className="ml-auto flex items-center gap-1">
            <EnhancedCopyButton text={String(now.seconds)} title="复制当前秒级时间戳" disabled={!liveNow} className="h-6 px-1.5 text-[10px]">复制秒</EnhancedCopyButton>
            <EnhancedCopyButton text={String(now.milliseconds)} title="复制当前毫秒时间戳" disabled={!liveNow} className="h-6 px-1.5 text-[10px]">复制毫秒</EnhancedCopyButton>
          </span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader className="px-3 pt-2.5 pb-1.5">
            <CardTitle className="text-sm font-semibold">时间戳 → 日期</CardTitle>
            <CardDescription className="mt-0.5 truncate text-[10px] leading-4">所有结果按北京时间（Asia/Shanghai）显示</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
            <div className="space-y-2">
              <Label htmlFor="timestamp-input" className="text-[11px] font-medium leading-4">Unix 时间戳</Label>
              <FormattedInput
                id="timestamp-input"
                value={timestamp}
                onChange={setTimestamp}
                format="none"
                placeholder="如 1760000000"
                className="h-8 font-mono text-[12px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium leading-4">时间戳口径</Label>
              <Select value={unit} onValueChange={(value) => setUnit(value as TimestampUnit)}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(UNIT_LABELS) as TimestampUnit[]).map((item) => (
                    <SelectItem key={item} value={item}>{UNIT_LABELS[item]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {timestamp.trim() !== '' && !breakdown && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>请输入有效的时间戳数字（超出可表示范围也会被拒绝）。</AlertDescription>
              </Alert>
            )}
            <div className="rounded-md border border-emerald-200 bg-emerald-50/80 px-2.5 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
              <p className="text-[10px] leading-4 text-emerald-800 dark:text-cyan-100">北京时间</p>
              <p className="wrap-break-word text-base font-bold leading-6 tabular-nums text-emerald-950 dark:text-white">
                {breakdown ? breakdown.display : '—'}
              </p>
              {breakdown && <p className="mt-0.5 break-all font-mono text-[10px] leading-4 text-emerald-700 dark:text-cyan-200">{breakdown.iso}</p>}
            </div>
            <MobileButtonGroup>
              <EnhancedCopyButton text={breakdown ? breakdown.display : ''} disabled={!breakdown} className="h-7 px-2 text-[11px]">复制日期</EnhancedCopyButton>
              <Button type="button" variant="outline" disabled={!liveNow} onClick={() => setTimestamp(String(now.seconds))} className="h-7 px-2 text-[11px]">填入当前秒级</Button>
            </MobileButtonGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 pt-2.5 pb-1.5">
            <CardTitle className="text-sm font-semibold">日期 → 时间戳</CardTitle>
            <CardDescription className="mt-0.5 truncate text-[10px] leading-4">输入北京时间，格式 YYYY-MM-DD HH:mm:ss（时间可省略）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
            <div className="space-y-2">
              <Label htmlFor="datetime-input" className="text-[11px] font-medium leading-4">北京时间</Label>
              <FormattedInput
                id="datetime-input"
                value={dateTime}
                onChange={setDateTime}
                format="none"
                placeholder="如 2026-09-16 14:30:05"
                className="h-8 font-mono text-[12px]"
              />
            </div>
            {dateTime.trim() !== '' && !parsed && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>日期或时间数字超出合法范围，请核对后重试。</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2.5 rounded-md bg-muted/50 px-2.5 py-1.5 text-[11px]">
                <span className="text-muted-foreground">秒级时间戳</span>
                <span className="font-mono font-medium tabular-nums">{parsed ? parsed.seconds : '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-2.5 rounded-md bg-muted/50 px-2.5 py-1.5 text-[11px]">
                <span className="text-muted-foreground">毫秒时间戳</span>
                <span className="font-mono font-medium tabular-nums">{parsed ? parsed.milliseconds : '—'}</span>
              </div>
            </div>
            <MobileButtonGroup>
              <EnhancedCopyButton text={parsed ? String(parsed.seconds) : ''} disabled={!parsed} className="h-7 px-2 text-[11px]">复制秒级</EnhancedCopyButton>
              <EnhancedCopyButton text={parsed ? String(parsed.milliseconds) : ''} disabled={!parsed} className="h-7 px-2 text-[11px]">复制毫秒</EnhancedCopyButton>
            </MobileButtonGroup>
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  )
}
