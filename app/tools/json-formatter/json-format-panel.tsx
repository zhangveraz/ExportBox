// 名称: JSON 格式化面板
// 描述: 展示 JSON 统计、格式化选项与输出结果（单屏紧凑版）
// 路径: ExportBox/app/tools/json-formatter/json-format-panel.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TabsContent } from '@/components/ui/tabs'
import type { ValidationResult } from '@/lib/tools/json-formatter'

const TEXTAREA = 'w-full rounded-md border border-input bg-background px-2.5 py-2 font-mono text-[12px] leading-5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring'
const LABEL = 'text-[11px] font-medium leading-4'

interface JsonStatsProps {
  size: number
  lines: number
  minifiedSize: number
  saved: number
  isValid: boolean
}

export function JsonFormatterStats({ size, lines, minifiedSize, saved, isValid }: JsonStatsProps) {
  const cells = [
    { label: '原始大小', value: `${size} B`, note: `${lines} 行` },
    { label: '压缩大小', value: `${minifiedSize} B`, note: `节省 ${saved}%` },
    { label: '验证状态', value: isValid ? '有效' : '无效', note: isValid ? '可格式化' : '待修正' },
    { label: '功能', value: '5', note: '种转换模式' },
  ]

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {cells.map((cell) => (
        <div key={cell.label} className="rounded-md bg-muted/50 px-2.5 py-1.5">
          <p className="truncate text-[10px] leading-4 text-muted-foreground">{cell.label}</p>
          <p className="truncate text-[13px] font-semibold leading-5 tabular-nums">{cell.value}</p>
          <p className="truncate text-[10px] leading-4 text-muted-foreground">{cell.note}</p>
        </div>
      ))}
    </div>
  )
}

interface JsonFormatPanelProps {
  input: string
  indent: number
  sortKeys: boolean
  removeNull: boolean
  validation: ValidationResult
  formatted: string
  minified: string
  onInputChange: (value: string) => void
  onIndentChange: (value: number) => void
  onToggleSortKeys: () => void
  onToggleRemoveNull: () => void
}

export function JsonFormatPanel(props: JsonFormatPanelProps) {
  const { input, indent, sortKeys, removeNull, validation, formatted, minified } = props

  return (
    <TabsContent value="format" className="space-y-2.5">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="json-input" className={LABEL}>JSON 输入</Label>
            <span className="text-[10px] tabular-nums text-muted-foreground">{input.length} 字符</span>
          </div>
          <textarea id="json-input" placeholder="粘贴或输入 JSON 数据…" value={input} onChange={(event) => props.onInputChange(event.target.value)} className={`${TEXTAREA} h-[220px]`} />
          {!validation.valid && input.trim() && (
            <Alert variant="destructive" className="px-2.5 py-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              <AlertDescription className="text-[11px] leading-4">JSON 错误：{validation.error}{validation.errorLine && `（第 ${validation.errorLine} 行）`}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="indent" className="text-[10px] font-medium leading-4">缩进</Label>
              <Select value={String(indent)} onValueChange={(value) => props.onIndentChange(Number(value))}>
                <SelectTrigger id="indent" className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 空格</SelectItem>
                  <SelectItem value="4">4 空格</SelectItem>
                  <SelectItem value="8">8 空格</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant={sortKeys ? 'default' : 'outline'} onClick={props.onToggleSortKeys} className="h-7 w-full px-2 text-[11px]">{sortKeys ? '✓ ' : ''}按键排序</Button>
            </div>
            <div className="flex items-end">
              <Button variant={removeNull ? 'default' : 'outline'} onClick={props.onToggleRemoveNull} className="h-7 w-full px-2 text-[11px]">{removeNull ? '✓ ' : ''}移除 Null</Button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label className={LABEL}>格式化结果</Label>
            <EnhancedCopyButton text={formatted} className="h-6 px-2 text-[10px]">复制</EnhancedCopyButton>
          </div>
          <textarea readOnly value={formatted} className={`${TEXTAREA} h-[150px] bg-muted`} />
          <div className="flex items-center justify-between gap-2">
            <Label className={LABEL}>压缩结果</Label>
            <EnhancedCopyButton text={minified} className="h-6 px-2 text-[10px]">复制</EnhancedCopyButton>
          </div>
          <textarea readOnly value={minified} className={`${TEXTAREA} h-[62px] bg-muted`} />
        </div>
      </div>
    </TabsContent>
  )
}
