// 名称: 进口到岸成本计算器
// 描述: 按货值、运费、保险、关税、进口增值税和本地费用测算进口到岸成本
// 路径: ExportBox/app/tools/import-landed-cost-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-30

'use client'

import { useMemo, useState } from 'react'
import { ImportCostForm } from './import-cost-form'
import { INITIAL_FORM, buildSummary, toNumber, type FormState, type NumericField } from './import-cost-page-data'
import { ImportCostResults, ImportCostStats } from './import-cost-results'
import { ToolShell } from '@/components/tools/tool-shell'
import { calculateImportLandedCost, type ImportCurrency, type ImportLandedCostInputs } from '@/lib/tools/import-landed-cost-calculator'

export default function ImportLandedCostCalculatorPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const foreignFormatter = useMemo(() => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: form.currency, maximumFractionDigits: 2 }), [form.currency])
  const inputs = useMemo<ImportLandedCostInputs>(() => ({
    quantity: toNumber(form.quantity), unitPriceForeign: toNumber(form.unitPriceForeign), exchangeRate: toNumber(form.exchangeRate), internationalFreightForeign: toNumber(form.internationalFreightForeign),
    insuranceForeign: toNumber(form.insuranceForeign), otherForeignCost: toNumber(form.otherForeignCost), dutyRatePercent: toNumber(form.dutyRatePercent), vatRatePercent: toNumber(form.vatRatePercent),
    customsFeeCny: toNumber(form.customsFeeCny), portChargeCny: toNumber(form.portChargeCny), domesticFreightCny: toNumber(form.domesticFreightCny), otherLocalCostCny: toNumber(form.otherLocalCostCny), targetSellingPriceCny: toNumber(form.targetSellingPriceCny),
  }), [form])
  const result = useMemo(() => calculateImportLandedCost(inputs), [inputs])
  const formatForeign = (value: number) => foreignFormatter.format(value)
  const getSummaryText = () => buildSummary(result, form.currency, formatForeign)
  const updateField = (field: NumericField, value: string) => setForm((current) => ({ ...current, [field]: value }))

  return (
    <ToolShell
      title="进口到岸成本计算器"
      description="按货值、国际运费、保险、关税、进口增值税和本地清关费用测算到岸总成本与每件成本"
    >
      {/* 顶部四格概览 + 左侧密集录参 / 右侧结果卡，1080p 下尽量一屏看完 */}
      <ImportCostStats result={result} />
      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <ImportCostForm
          form={form}
          onFieldChange={updateField}
          onCurrencyChange={(currency: ImportCurrency, exchangeRate: string) => setForm((current) => ({ ...current, currency, exchangeRate }))}
          onPreset={(values) => setForm((current) => ({ ...current, ...values }))}
          onReset={() => setForm(INITIAL_FORM)}
          summaryText={getSummaryText()}
        />
        <ImportCostResults result={result} />
      </div>
    </ToolShell>
  )
}
