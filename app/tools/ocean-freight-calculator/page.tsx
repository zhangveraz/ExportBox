// 名称: 海运费用拆分计算器
// 描述: 按海运费、港杂、报关、保险和目的港费用测算海运成本摊销
// 路径: ExportBox/app/tools/ocean-freight-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

'use client'

import { useMemo, useState } from 'react'
import { OceanFreightForm } from './ocean-freight-form'
import { INITIAL_FORM, formatCny, formatNumber, toNumber, type FormState, type NumericField } from './ocean-freight-page-data'
import { OceanFreightResults, OceanFreightStats } from './ocean-freight-results'
import { ToolShell } from '@/components/tools/tool-shell'
import { calculateOceanFreight, type OceanFreightInputs, type OceanFreightMode } from '@/lib/tools/ocean-freight-calculator'

export default function OceanFreightCalculatorPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const inputs = useMemo<OceanFreightInputs>(() => ({
    mode: form.mode, quantity: toNumber(form.quantity), totalCbm: toNumber(form.totalCbm), totalWeightKg: toNumber(form.totalWeightKg),
    containerCount: toNumber(form.containerCount), minChargeableCbm: toNumber(form.minChargeableCbm), oceanFreightForeign: toNumber(form.oceanFreightForeign),
    destinationChargeForeign: toNumber(form.destinationChargeForeign), exchangeRate: toNumber(form.exchangeRate), originChargesCny: toNumber(form.originChargesCny),
    truckingFeeCny: toNumber(form.truckingFeeCny), customsFeeCny: toNumber(form.customsFeeCny), documentFeeCny: toNumber(form.documentFeeCny),
    cargoValueCny: toNumber(form.cargoValueCny), insuranceRatePercent: toNumber(form.insuranceRatePercent),
  }), [form])
  const result = useMemo(() => calculateOceanFreight(inputs), [inputs])

  const getSummaryText = () => [
      '海运费用拆分测算', `运输方式：${result.modeLabel}`, `数量：${result.quantity} 件`, `计费体积：${formatNumber(result.chargeableCbm, 3)} CBM`,
      `总毛重：${formatNumber(toNumber(form.totalWeightKg), 2)} kg`, `海运费：${formatCny(result.freightCny)}`, `目的港费用：${formatCny(result.destinationChargeCny)}`,
      `起运端费用：${formatCny(result.originSubtotalCny)}`, `保险费：${formatCny(result.insuranceFeeCny)}`, `总费用：${formatCny(result.totalCostCny)}`,
      `每CBM：${formatCny(result.perCbmCny)}`, `每件摊费：${formatCny(result.perCartonCny)}`,
    ].join('\n')
  const updateField = (field: NumericField, value: string) => setForm((current) => ({ ...current, [field]: value }))

  return (
    <ToolShell
      title="海运费用拆分计算器"
      description="汇总海运费、起运港杂费、拖车、报关、保险和目的港费用，快速折算每件、每 CBM 与每柜成本"
      onReset={() => setForm(INITIAL_FORM)}
    >
      {/* 顶部四格概览 + 左侧录参 / 右侧费用拆分，1080p 下一屏看完 */}
      <OceanFreightStats result={result} form={form} />
      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <OceanFreightForm form={form} onFieldChange={updateField} onModeChange={(mode: OceanFreightMode) => setForm((current) => ({ ...current, mode }))} onPreset={(values) => setForm((current) => ({ ...current, ...values }))} summaryText={getSummaryText()} />
        <OceanFreightResults result={result} form={form} />
      </div>
    </ToolShell>
  )
}
