// 名称: 条码生成参数面板
// 描述: 提供条码格式、数据内容与输出清晰度设置（单屏紧凑版）
// 路径: ExportBox/app/tools/barcode-generator/barcode-controls.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { CircleAlert, ScanLine } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  BARCODE_FORMATS,
  getBarcodeFormat,
  type BarcodeFormatId,
  type BarcodeScale,
} from '@/lib/tools/barcode-generator'

interface BarcodeControlsProps {
  formatId: BarcodeFormatId
  input: string
  scale: BarcodeScale
  error: string
  onFormatChange: (value: BarcodeFormatId) => void
  onInputChange: (value: string) => void
  onScaleChange: (value: BarcodeScale) => void
  onGenerate: () => void
}

export default function BarcodeControls({
  formatId,
  input,
  scale,
  error,
  onFormatChange,
  onInputChange,
  onScaleChange,
  onGenerate,
}: BarcodeControlsProps) {
  const format = getBarcodeFormat(formatId)

  return (
    <Card className="h-fit">
      <CardHeader className="px-3 pt-2.5 pb-1.5">
        <CardTitle className="text-sm font-semibold">生成参数</CardTitle>
        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">数据只在当前浏览器中编码，不会上传到第三方服务。</p>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pt-0 pb-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-0.5">
            <Label htmlFor="barcode-format" className="text-[11px] leading-4">条码格式</Label>
            <Select value={formatId} onValueChange={(value) => onFormatChange(value as BarcodeFormatId)}>
              <SelectTrigger id="barcode-format" className="h-8 w-full text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BARCODE_FORMATS.map((item) => (
                  <SelectItem key={item.id} value={item.id} className="text-[12px]">{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-0.5">
            <Label htmlFor="barcode-scale" className="text-[11px] leading-4">输出清晰度</Label>
            <Select value={String(scale)} onValueChange={(value) => onScaleChange(Number(value) as BarcodeScale)}>
              <SelectTrigger id="barcode-scale" className="h-8 w-full text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2" className="text-[12px]">标准（2x）</SelectItem>
                <SelectItem value="3" className="text-[12px]">高清（3x）</SelectItem>
                <SelectItem value="4" className="text-[12px]">印刷预览（4x）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-[10px] leading-4 text-muted-foreground">{format.description}</p>

        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="barcode-data" className="text-[11px] leading-4">编码数据</Label>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">{input.length} 个字符</span>
              <Button variant="ghost" size="sm" type="button" onClick={() => onInputChange(format.example)} className="h-6 px-1.5 text-[10px]">
                载入示例
              </Button>
            </div>
          </div>
          <Textarea
            id="barcode-data"
            value={input}
            inputMode={format.numericOnly ? 'numeric' : 'text'}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={format.placeholder}
            className="min-h-[104px] font-mono text-[12px] leading-4"
          />
        </div>

        {format.isGs1 && (
          <Alert className="border-emerald-200 bg-emerald-50/70 px-2 py-1 dark:border-emerald-300/20 dark:bg-emerald-300/10">
            <AlertDescription className="text-[10px] leading-[17px]">
              推荐输入 <code>(01)GTIN(17)YYMMDD(10)批号</code>；变量长度字段后还有其他 AI 时，请用 <code>\F</code> 或 <code>&lt;GS&gt;</code> 分隔。
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="px-2 py-1">
            <CircleAlert className="h-3.5 w-3.5" />
            <AlertDescription className="text-[10px] leading-[17px]">{error}</AlertDescription>
          </Alert>
        )}

        <Button type="button" className="h-8 w-full text-[12px]" onClick={onGenerate}>
          <ScanLine className="mr-1.5 h-3.5 w-3.5" />
          生成条码
        </Button>
      </CardContent>
    </Card>
  )
}
