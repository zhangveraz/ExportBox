// 名称: 空运/快递计费重计算器
// 描述: 根据外箱尺寸、毛重、净重、泡重系数和运价估算空运快递计费重量与费用
// 路径: ExportBox/app/tools/air-freight-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-07-30

'use client'

import { useMemo, useState } from 'react'
import { AirFreightForm } from './air-freight-form'
import { INITIAL_FORM, formatMoney, formatNumber, toNumber, type DivisorChoice, type FormState, type NumericField } from './air-freight-page-data'
import { AirFreightResults, AirFreightStats } from './air-freight-results'
import { TOOL_RESULT_COLUMN, ToolShell } from '@/components/tools/tool-shell'
import { AIR_FREIGHT_DIVISORS, calculateAirFreight } from '@/lib/tools/air-freight-calculator'

export default function AirFreightCalculatorPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  // 记住用户点了哪个快捷场景：默认值与「快递小票」一致，所以初始就高亮它
  const [activePreset, setActivePreset] = useState<string | null>('快递小票')
  const inputs = useMemo(() => ({
    lengthCm: toNumber(form.lengthCm), widthCm: toNumber(form.widthCm), heightCm: toNumber(form.heightCm), grossWeightKg: toNumber(form.grossWeightKg),
    netWeightKg: toNumber(form.netWeightKg), quantity: toNumber(form.quantity), divisor: toNumber(form.divisor), ratePerKg: toNumber(form.ratePerKg),
    minCharge: toNumber(form.minCharge), fuelSurchargePercent: toNumber(form.fuelSurchargePercent), handlingFee: toNumber(form.handlingFee),
  }), [form])
  const result = useMemo(() => calculateAirFreight(inputs), [inputs])
  const volumetric = result.billingBasis === 'volumetric'
  const divisorNote = form.divisorChoice === 'custom' ? '自定义泡重口径' : AIR_FREIGHT_DIVISORS[form.divisorChoice].note

  const getSummaryText = () => {
    return [
      '空运/快递计费重测算', `箱规：${form.lengthCm} x ${form.widthCm} x ${form.heightCm} cm`, `单箱毛重：${form.grossWeightKg} kg`, `单箱净重：${form.netWeightKg} kg`, `箱数：${form.quantity} 箱`, `泡重系数：${form.divisor}`,
      `单箱体积：${result.cartonCbm} CBM`, `总体积：${result.totalCbm} CBM`, `总毛重：${formatNumber(result.actualWeightKg, 2)} kg`, `总净重：${formatNumber(result.netWeightKg, 2)} kg`, `总体积重：${formatNumber(result.volumetricWeightKg, 2)} kg`,
      `计费重量：${formatNumber(result.chargeableWeightKg, 2)} kg`, `计费依据：${volumetric ? '体积重' : '毛重'}`, `基础运费：${formatMoney(result.baseFreight)}`, `燃油附加：${formatMoney(result.fuelSurcharge)}`, `操作费：${formatMoney(result.handlingFee)}`, `费用合计：${formatMoney(result.totalCharge)}`, `单箱费用：${formatMoney(result.unitCharge)}`,
    ].join('\n')
  }

  const updateField = (field: NumericField, value: string) => setForm((current) => ({ ...current, [field]: value, ...(field === 'divisor' ? { divisorChoice: 'custom' as DivisorChoice } : {}) }))
  const updateDivisorChoice = (choice: DivisorChoice) => setForm((current) => ({ ...current, divisorChoice: choice, ...(choice === 'custom' ? {} : { divisor: String(AIR_FREIGHT_DIVISORS[choice].value) }) }))
  // 手动改了任一参数就说明已经偏离场景模板，取消高亮
  const updateFieldManually = (field: NumericField, value: string) => {
    setActivePreset(null)
    updateField(field, value)
  }
  const applyPreset = (label: string, values: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...values }))
    setActivePreset(label)
  }
  const resetAll = () => {
    setForm(INITIAL_FORM)
    setActivePreset('快递小票')
  }

  return (
    <ToolShell
      title="空运/快递计费重计算器"
      description="按箱规、毛重、净重、泡重系数和运价估算空运快递计费重量、抛重差与费用"
      onReset={resetAll}
    >
      {/* 参数有 10 个字段（箱规 / 重量 / 运价），左侧需要更多空间，右列适度加宽 */}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <AirFreightForm
          form={form}
          divisorNote={divisorNote}
          activePreset={activePreset}
          onFieldChange={updateFieldManually}
          onDivisorChoice={updateDivisorChoice}
          onPreset={applyPreset}
          summaryText={getSummaryText()}
        />
        <div className={TOOL_RESULT_COLUMN}>
          <AirFreightStats result={result} />
          <AirFreightResults result={result} />
        </div>
      </div>
    </ToolShell>
  )
}
