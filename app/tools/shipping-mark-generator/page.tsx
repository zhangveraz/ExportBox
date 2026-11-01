// 名称: 外贸唛头生成器
// 描述: 组合唛头要素，实时预览印刷面与逐箱标签
// 路径: ExportBox/app/tools/shipping-mark-generator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-09-30

'use client'

import { useMemo, useState } from 'react'
import { ToolShell } from '@/components/tools/tool-shell'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import {
  buildCartonLabels,
  buildMarkLines,
  buildMarkText,
  type ShippingMarkInput,
} from '@/lib/tools/shipping-mark-generator'
import { ShippingMarkForm, type ShippingMarkFormState } from './shipping-mark-form'
import { ShippingMarkPreview } from './shipping-mark-preview'
import { SHIPPING_MARK_PRESETS } from './shipping-mark-data'

const LABEL_PREVIEW_LIMIT = 5

function createInitialForm(): ShippingMarkFormState {
  return {
    consigneeMark: 'ABC',
    orderNo: 'PO-2026-0930',
    destinationPort: 'HAMBURG',
    cartonCount: '50',
    cartonNumberStyle: 'range',
    startCartonNo: '1',
    extraLinesText: '',
    showMadeIn: true,
    showGrossWeight: false,
    grossWeightKg: '0',
    showDimensions: false,
    dimensionsCm: '',
  }
}

function toInt(value: string): number {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function toInput(form: ShippingMarkFormState): ShippingMarkInput {
  return {
    consigneeMark: form.consigneeMark,
    orderNo: form.orderNo,
    destinationPort: form.destinationPort,
    cartonCount: toInt(form.cartonCount),
    cartonNumberStyle: form.cartonNumberStyle,
    startCartonNo: toInt(form.startCartonNo),
    extraLines: form.extraLinesText.split('\n'),
    showMadeIn: form.showMadeIn,
    showGrossWeight: form.showGrossWeight,
    grossWeightKg: toNumber(form.grossWeightKg),
    showDimensions: form.showDimensions,
    dimensionsCm: form.dimensionsCm,
  }
}

function presetToFormState(input: ShippingMarkInput): ShippingMarkFormState {
  return {
    consigneeMark: input.consigneeMark,
    orderNo: input.orderNo,
    destinationPort: input.destinationPort,
    cartonCount: String(input.cartonCount),
    cartonNumberStyle: input.cartonNumberStyle,
    startCartonNo: String(input.startCartonNo),
    extraLinesText: input.extraLines.join('\n'),
    showMadeIn: input.showMadeIn,
    showGrossWeight: input.showGrossWeight,
    grossWeightKg: String(input.grossWeightKg),
    showDimensions: input.showDimensions,
    dimensionsCm: input.dimensionsCm,
  }
}

export default function ShippingMarkGeneratorPage() {
  const [form, setForm] = useState<ShippingMarkFormState>(createInitialForm)

  const computation = useMemo(() => {
    try {
      const input = toInput(form)
      const lines = buildMarkLines(input)
      const labels = buildCartonLabels(input, LABEL_PREVIEW_LIMIT)
      return {
        lines,
        text: buildMarkText(input),
        labels,
        totalCartons: input.cartonCount,
        truncated: labels.length < input.cartonCount,
        error: '',
      }
    } catch (error) {
      return { lines: [], text: '', labels: [], totalCartons: 0, truncated: false, error: error instanceof Error ? error.message : '唛头无法生成，请检查输入' }
    }
  }, [form])

  const applyPreset = (presetId: string) => {
    const preset = SHIPPING_MARK_PRESETS.find((item) => item.id === presetId)
    if (preset) setForm(presetToFormState(preset.input))
  }

  return (
    <ToolShell
      title="外贸唛头生成器"
      description="填写收货人代号、订单号、目的港与箱号风格，一键生成外箱印刷唛头与逐箱标签，支持复制到标签软件"
      onReset={() => setForm(createInitialForm())}
    >
      {computation.error && <EnhancedAlert type="error" title="生成失败" message={computation.error} action={{ label: '重置', onClick: () => setForm(createInitialForm()) }} />}

      {/* 右侧是唛头预览，属于“看效果”的工具，预览区比表单略宽更好读 */}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
        <ShippingMarkForm
          form={form}
          onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
          onApplyPreset={applyPreset}
        />
        <div className="xl:sticky xl:top-20">
          {computation.error ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">修正参数后查看唛头预览</div>
          ) : (
            <ShippingMarkPreview
              markLines={computation.lines}
              markText={computation.text}
              cartonLabels={computation.labels}
              totalCartons={computation.totalCartons}
              truncated={computation.truncated}
            />
          )}
        </div>
      </div>
    </ToolShell>
  )
}
