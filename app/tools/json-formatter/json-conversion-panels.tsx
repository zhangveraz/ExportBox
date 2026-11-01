// 名称: JSON 转换面板
// 描述: 展示 JSON 与 CSV 双向转换界面（单屏双栏版）
// 路径: ExportBox/app/tools/json-formatter/json-conversion-panels.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

const LABEL = 'text-[11px] font-medium leading-4'
const TEXTAREA = 'w-full rounded-md border border-input bg-background px-2.5 py-2 font-mono text-[12px] leading-5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring'

export interface ConversionResult {
  success: boolean
  data: string
  error: string
}

interface ResultProps {
  label: string
  result: ConversionResult
  className: string
}

function ConversionResultView({ label, result, className }: ResultProps) {
  if (result.success) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label className={LABEL}>{label}</Label>
          <EnhancedCopyButton text={result.data} className="h-6 px-2 text-[10px]">复制</EnhancedCopyButton>
        </div>
        <textarea readOnly value={result.data} className={className} />
      </div>
    )
  }

  if (!result.error) return null
  return (
    <Alert variant="destructive" className="px-2.5 py-1.5">
      <AlertCircle className="h-3.5 w-3.5" />
      <AlertDescription className="text-[11px] leading-4">{result.error}</AlertDescription>
    </Alert>
  )
}

interface JsonConversionPanelsProps {
  input: string
  csvInput: string
  jsonToCsvResult: ConversionResult
  csvToJsonResult: ConversionResult
  onInputChange: (value: string) => void
  onCsvInputChange: (value: string) => void
}

export function JsonConversionPanels(props: JsonConversionPanelsProps) {
  return (
    <>
      <TabsContent value="convert">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-1.5">
            <Label htmlFor="json-to-csv" className={LABEL}>JSON 数组</Label>
            <textarea id="json-to-csv" placeholder='输入 JSON 数组，例如: [{"name":"张三","age":30}]' value={props.input} onChange={(event) => props.onInputChange(event.target.value)} className={`${TEXTAREA} h-[220px]`} />
          </div>
          <ConversionResultView label="CSV 结果" result={props.jsonToCsvResult} className={`${TEXTAREA} h-[220px] bg-muted`} />
        </div>
      </TabsContent>

      <TabsContent value="csv">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-1.5">
            <Label htmlFor="csv-to-json" className={LABEL}>CSV 输入</Label>
            <textarea id="csv-to-json" placeholder="输入 CSV 数据，首行为列名" value={props.csvInput} onChange={(event) => props.onCsvInputChange(event.target.value)} className={`${TEXTAREA} h-[180px]`} />
          </div>
          <ConversionResultView label="JSON 结果" result={props.csvToJsonResult} className={`${TEXTAREA} h-[180px] bg-muted`} />
        </div>
      </TabsContent>
    </>
  )
}
