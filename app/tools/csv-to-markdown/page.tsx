// 名称: CSV 与 Markdown 表格互转工具
// 描述: 在浏览器本地完成 CSV 与 Markdown 表格的互相转换
// 路径: ExportBox/app/tools/csv-to-markdown/page.tsx
// 作者: ExportBox
// 更新时间: 2026-09-16

'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight, Info, RotateCcw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { MobileButtonGroup } from '@/components/tools/mobile-friendly-wrapper'
import { ToolShell } from '@/components/tools/tool-shell'
import { csvToMarkdown, markdownToCsv } from '@/lib/tools/csv-to-markdown'

const SAMPLE_CSV = '产品,数量,单价\nBluetooth Earbuds,500,12.5\nUSB-C Cable,1000,1.8'
const SAMPLE_MARKDOWN = '| 产品 | 数量 | 单价 |\n| --- | --- | --- |\n| Bluetooth Earbuds | 500 | 12.5 |'

type Direction = 'csv-to-md' | 'md-to-csv'

const DIRECTION_LABELS: Record<Direction, string> = {
  'csv-to-md': 'CSV → Markdown',
  'md-to-csv': 'Markdown → CSV',
}

export default function CsvToMarkdownPage() {
  const [direction, setDirection] = useState<Direction>('csv-to-md')
  const [input, setInput] = useState(SAMPLE_CSV)

  const result = useMemo(
    () => (direction === 'csv-to-md' ? csvToMarkdown(input) : markdownToCsv(input)),
    [direction, input]
  )

  const swapDirection = () => {
    const next: Direction = direction === 'csv-to-md' ? 'md-to-csv' : 'csv-to-md'
    setDirection(next)
    if (result.ok) setInput(result.output)
  }

  return (
    <ToolShell title="CSV 与 Markdown 表格互转" description="把客户表格快速转成 Markdown 写入文档，或把 Markdown 表格还原为 CSV 交给 Excel">
      

      <MobileButtonGroup className="mb-2.5">
        {(Object.keys(DIRECTION_LABELS) as Direction[]).map((item) => (
          <Button key={item} type="button" variant={direction === item ? 'default' : 'outline'} onClick={() => setDirection(item)} className="h-7 px-2.5 text-[11px]">
            {DIRECTION_LABELS[item]}
          </Button>
        ))}
      </MobileButtonGroup>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">{direction === 'csv-to-md' ? 'CSV 输入' : 'Markdown 输入'}</CardTitle>
              <CardDescription className="mt-0.5 truncate text-[10px] leading-4">
                {direction === 'csv-to-md' ? '支持带引号的 CSV 字段，逗号分隔，首行为表头' : '每行以 | 开头结尾，自动跳过 --- 分隔行'}
              </CardDescription>
            </div>
            <MobileButtonGroup>
              <Button type="button" variant="outline" onClick={swapDirection} className="h-6 px-2 text-[11px]">
                <ArrowLeftRight className="mr-1 h-3.5 w-3.5" />换向
              </Button>
              <Button type="button" variant="ghost" onClick={() => setInput(direction === 'csv-to-md' ? SAMPLE_CSV : SAMPLE_MARKDOWN)} className="h-6 px-2 text-[11px]">
                <RotateCcw className="mr-1 h-3.5 w-3.5" />示例
              </Button>
            </MobileButtonGroup>
          </CardHeader>
          <CardContent className="px-3 pt-0 pb-3">
            <Textarea
              id="csv-md-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={direction === 'csv-to-md' ? '粘贴 CSV 文本' : '粘贴 Markdown 表格'}
              className="min-h-[220px] font-mono text-[12px] leading-5"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 px-3 pt-2.5 pb-1.5">
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">转换结果</CardTitle>
              <CardDescription className="mt-0.5 truncate text-[10px] leading-4">
                {result.ok ? `${result.columnCount} 列 · 含表头共 ${result.rowCount + 1} 行` : '等待有效输入'}
              </CardDescription>
            </div>
            <EnhancedCopyButton text={result.ok ? result.output : ''} disabled={!result.ok} className="h-6 shrink-0 px-2 text-[11px]">复制</EnhancedCopyButton>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pt-0 pb-3">
            {!result.ok && (
              <Alert variant="destructive" className="px-2.5 py-1.5">
                <Info className="h-3.5 w-3.5" />
                <AlertDescription className="text-[11px] leading-4">{result.error}</AlertDescription>
              </Alert>
            )}
            <Textarea
              aria-label="转换结果"
              readOnly
              value={result.ok ? result.output : ''}
              placeholder="转换结果将显示在这里"
              className="min-h-[220px] font-mono text-[12px] leading-5"
            />
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  )
}
