// 名称: 装柜/箱规计算器
// 描述: 根据纸箱尺寸、毛重、数量和柜型估算装柜数量与空间利用率
// 路径: ExportBox/app/tools/container-load-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-30

'use client'

import { useMemo, useState } from 'react'
import { ContainerLoadForm } from './container-load-form'
import { INITIAL_FORM, formatNumber, toNumber, type FormState, type NumericField } from './container-load-page-data'
import { ContainerLoadResults, ContainerLoadStats } from './container-load-results'
import { ToolShell } from '@/components/tools/tool-shell'
import { calculateContainerLoad, type ContainerType } from '@/lib/tools/container-load-calculator'

export default function ContainerLoadCalculatorPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const inputs = useMemo(() => ({
    lengthCm: toNumber(form.lengthCm), widthCm: toNumber(form.widthCm), heightCm: toNumber(form.heightCm),
    grossWeightKg: toNumber(form.grossWeightKg), quantity: toNumber(form.quantity), containerType: form.containerType
  }), [form])
  const result = useMemo(() => calculateContainerLoad(inputs), [inputs])
  const doesNotFit = result && !result.fitsContainer
  const getSummaryText = () => {
    if (!result || !result.fitsContainer) return ''
    const orientation = result.bestOrientation ? `${result.bestOrientation.lengthCm}×${result.bestOrientation.widthCm}×${result.bestOrientation.heightCm} cm` : '未知'
    return [
      `箱规: ${formatNumber(inputs.lengthCm)}×${formatNumber(inputs.widthCm)}×${formatNumber(inputs.heightCm)} cm，单箱毛重: ${formatNumber(inputs.grossWeightKg)} kg，总箱数: ${formatNumber(inputs.quantity)}`,
      `最佳摆放: ${orientation}，单柜最多: ${formatNumber(result.maxCartonsPerContainer)} 箱`,
      `需要柜数: ${result.requiredContainers} × ${result.container.name}，末柜装: ${result.lastContainerCartons} 箱`,
      `体积利用率: ${result.volumeUtilizationPercent}%，重量利用率: ${result.weightUtilizationPercent}%，限制因素: ${result.limitingFactor === 'dimensions' ? '尺寸' : result.limitingFactor === 'weight' ? '重量' : '体积'}`,
    ].join('\n')
  }
  const updateField = (field: NumericField, value: string) => setForm((current) => ({ ...current, [field]: value }))

  return (
    <ToolShell
      title="装柜/箱规计算器"
      description="根据纸箱尺寸、单箱毛重和总箱数估算整柜装载数量、柜数和利用率"
      onReset={() => setForm(INITIAL_FORM)}
    >
      {/* 顶部四格概览 + 左侧录参 / 右侧结果，1080p 下一屏看完 */}
      <ContainerLoadStats result={result} />
      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <ContainerLoadForm
          form={form}
          doesNotFit={doesNotFit}
          onFieldChange={updateField}
          onContainerChange={(containerType: ContainerType) => setForm((current) => ({ ...current, containerType }))}
          onPreset={(values) => setForm((current) => ({ ...current, ...values }))}
          summaryText={getSummaryText()}
        />
        <ContainerLoadResults result={result} containerType={form.containerType} />
      </div>
    </ToolShell>
  )
}
