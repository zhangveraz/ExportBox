// 名称: 装箱单表单
// 描述: 单证头部信息、明细行编辑、Excel 粘贴导入与草稿恢复
// 路径: ExportBox/app/tools/packing-list-generator/packing-list-form.tsx
// 作者: ExportBox
// 更新时间: 2026-10-10

import { ClipboardPaste, FileUp, Package, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { parsePastedLines } from '@/lib/tools/packing-list-generator'

export interface PackingLineFormState {
  id: string
  description: string
  cartons: string
  qtyPerCarton: string
  unit: string
  gwPerCarton: string
  nwPerCarton: string
  dimensions: string
}

export interface PackingFormState {
  exporter: string
  consignee: string
  invoiceNo: string
  date: string
  vessel: string
  containerNo: string
  portOfLoading: string
  portOfDischarge: string
  marks: string
  notes: string
  lines: PackingLineFormState[]
}

export interface PackingListFormProps {
  form: PackingFormState
  onChange: (patch: Partial<PackingFormState>) => void
  onLineChange: (lineId: string, field: keyof Omit<PackingLineFormState, 'id'>, value: string) => void
  onAddLine: () => void
  onRemoveLine: (lineId: string) => void
  onRestoreDraft: () => void
  hasDraft: boolean
}

export function PackingListForm({ form, onChange, onLineChange, onAddLine, onRemoveLine, onRestoreDraft, hasDraft }: PackingListFormProps) {
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [pasteError, setPasteError] = useState('')

  const handleParse = () => {
    try {
      const parsed = parsePastedLines(pasteText)
      onChange({
        lines: [
          ...form.lines.filter((line) => line.description.trim().length > 0),
          ...parsed.map((line) => ({
            id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            description: line.description,
            cartons: String(line.cartons),
            qtyPerCarton: String(line.qtyPerCarton),
            unit: line.unit,
            gwPerCarton: String(line.gwPerCarton),
            nwPerCarton: String(line.nwPerCarton),
            dimensions: line.dimensions,
          })),
        ],
      })
      setPasteText('')
      setPasteError('')
      setPasteOpen(false)
    } catch (error) {
      setPasteError(error instanceof Error ? error.message : '粘贴内容无法解析')
    }
  }

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm"><Package className="h-4 w-4" />装箱单信息</CardTitle>
        <CardDescription className="text-xs">明细支持从 Excel 直接粘贴导入，填写内容自动保存为本地草稿</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasDraft && (
          <EnhancedAlert
            type="info"
            title="检测到本地草稿"
            message="上次编辑未导出的内容已自动保存在本浏览器，可一键恢复。"
            action={{ label: '恢复草稿', onClick: onRestoreDraft }}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="exporter" label="发货人 Exporter" value={form.exporter} onChange={(value) => onChange({ exporter: value })} placeholder="ExportBox Trading Co., Ltd." />
          <TextField id="consignee" label="收货人 Consignee" value={form.consignee} onChange={(value) => onChange({ consignee: value })} placeholder="NORDIC HOME AB" />
          <TextField id="invoiceNo" label="发票号" value={form.invoiceNo} onChange={(value) => onChange({ invoiceNo: value })} placeholder="INV-2026-0930" />
          <TextField id="date" label="日期" value={form.date} onChange={(value) => onChange({ date: value })} placeholder="2026-10-10" />
          <TextField id="vessel" label="船名/航次" value={form.vessel} onChange={(value) => onChange({ vessel: value })} placeholder="MSC ANNA V.026W" />
          <TextField id="containerNo" label="柜号/封号" value={form.containerNo} onChange={(value) => onChange({ containerNo: value })} placeholder="MSCU1234567 / SEAL 08888" />
          <TextField id="portOfLoading" label="起运港" value={form.portOfLoading} onChange={(value) => onChange({ portOfLoading: value })} placeholder="Ningbo, China" />
          <TextField id="portOfDischarge" label="目的港" value={form.portOfDischarge} onChange={(value) => onChange({ portOfDischarge: value })} placeholder="Goteborg, Sweden" />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">明细（最多 40 行）</h3>
              <p className="mt-1 text-xs text-muted-foreground">也可以在 Excel 中按「品名 / 箱数 / 每箱数量 / 单位 / 毛重 / 净重 / 尺寸」整理后整列复制</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPasteOpen((open) => !open)}>
                <ClipboardPaste className="mr-2 h-4 w-4" />粘贴导入
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onAddLine} disabled={form.lines.length >= 40}>
                <Plus className="mr-2 h-4 w-4" />添加明细
              </Button>
            </div>
          </div>

          {pasteOpen && (
            <div className="space-y-2 rounded-md border border-dashed p-3">
              <Label htmlFor="paste-area">粘贴 Excel 区域（TAB 分隔，每行一条，列序：品名 箱数 每箱数量 单位 毛重 净重 尺寸）</Label>
              <Textarea id="paste-area" value={pasteText} onChange={(event) => setPasteText(event.target.value)} className="min-h-[110px] font-mono text-xs" placeholder={'Thermos Flask 500ml\t1200\t24\tPCS\t12.5\t11.2\t60x40x40\nReplacement Lid\t240\t60\tPCS\t3.2\t2.8\t40x30x25'} />
              {pasteError && <EnhancedAlert type="error" title="解析失败" message={pasteError} />}
              <Button type="button" size="sm" onClick={handleParse} disabled={!pasteText.trim()}>
                <FileUp className="mr-2 h-4 w-4" />解析并追加
              </Button>
            </div>
          )}

          {form.lines.map((line, index) => (
            <div key={line.id} className="overflow-hidden rounded-lg border">
              <div className="flex items-center justify-between gap-2 bg-muted/40 px-2.5 py-1">
                <span className="text-[11px] font-medium text-muted-foreground">第 {index + 1} 行</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="删除明细"
                  aria-label={`删除第 ${index + 1} 行明细`}
                  disabled={form.lines.length <= 1}
                  onClick={() => onRemoveLine(line.id)}
                  className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-red-600"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />删除
                </Button>
              </div>
              <div className="space-y-2 p-2.5">
                {/* 品名独占一行、与单位并排，保证长品名也能完整看到 */}
                <div className="flex items-end gap-2">
                  <label htmlFor={`${line.id}-desc`} className="block min-w-0 flex-1">
                    <span className="mb-1 block text-[11px] text-muted-foreground">品名 / Description</span>
                    <Input
                      id={`${line.id}-desc`}
                      value={line.description}
                      onChange={(event) => onLineChange(line.id, 'description', event.target.value)}
                      placeholder="如 Stainless Steel Water Bottle 500ml"
                      maxLength={160}
                      className="h-9 text-[13px]"
                    />
                  </label>
                  <label htmlFor={`${line.id}-unit`} className="block w-20 shrink-0">
                    <span className="mb-1 block text-[11px] text-muted-foreground">单位</span>
                    <Input
                      id={`${line.id}-unit`}
                      value={line.unit}
                      onChange={(event) => onLineChange(line.id, 'unit', event.target.value)}
                      maxLength={10}
                      placeholder="PCS"
                      className="h-9 text-[13px]"
                    />
                  </label>
                </div>

                {/* 数量与重量：固定三列，窄屏也不挤 */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <SmallNumber id={`${line.id}-cartons`} label="箱数" value={line.cartons} onChange={(value) => onLineChange(line.id, 'cartons', value)} integer />
                  <SmallNumber id={`${line.id}-qty`} label="每箱数量" value={line.qtyPerCarton} onChange={(value) => onLineChange(line.id, 'qtyPerCarton', value)} />
                  <label htmlFor={`${line.id}-dims`} className="block min-w-0">
                    <span className="mb-1 block truncate text-[11px] text-muted-foreground" title="单箱尺寸 CM">尺寸 CM</span>
                    <Input
                      id={`${line.id}-dims`}
                      value={line.dimensions}
                      onChange={(event) => onLineChange(line.id, 'dimensions', event.target.value)}
                      maxLength={30}
                      placeholder="60x40x40"
                      className="h-8 text-[13px]"
                    />
                  </label>
                  <SmallNumber id={`${line.id}-gw`} label="单箱毛重 KG" value={line.gwPerCarton} onChange={(value) => onLineChange(line.id, 'gwPerCarton', value)} />
                  <SmallNumber id={`${line.id}-nw`} label="单箱净重 KG" value={line.nwPerCarton} onChange={(value) => onLineChange(line.id, 'nwPerCarton', value)} />
                  <div className="flex items-end">
                    <p className="w-full rounded-md bg-muted/40 px-2 py-1.5 text-[11px] text-muted-foreground">
                      合计 {line.cartons || 0} 箱
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="marks">唛头（可选）</Label>
            <Textarea id="marks" value={form.marks} onChange={(event) => onChange({ marks: event.target.value })} className="min-h-[64px] font-mono text-xs" placeholder={'ABC\nPO-2026-0930\nHAMBURG\nCARTON NO. 1-120'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">备注（可选）</Label>
            <Input id="notes" value={form.notes} onChange={(event) => onChange({ notes: event.target.value })} maxLength={200} placeholder="如：Each carton with shipping mark on two sides" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TextField({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <Label htmlFor={id} className="text-[11px] text-muted-foreground">{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-8 text-[13px] font-medium" maxLength={160} />
    </div>
  )
}

function SmallNumber({ id, label, value, onChange, integer = false }: { id: string; label: string; value: string; onChange: (value: string) => void; integer?: boolean }) {
  return (
    <div className="min-w-0 space-y-1">
      <Label htmlFor={id} className="text-[11px] text-muted-foreground">{label}</Label>
      <FormattedInput id={id} value={value} onChange={onChange} format={integer ? 'number' : 'decimal'} maxDecimals={integer ? 0 : 2} className="h-8 text-[13px]" />
    </div>
  )
}
