// 名称: 外贸订单保本销量计算器
// 描述: 按售价、成本与成交费率测算保本销量和目标利润销量
// 路径: ExportBox/app/tools/order-break-even-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-08-11

'use client'

import { useMemo, useState } from 'react'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { ToolShell } from '@/components/tools/tool-shell'
import { calculateOrderBreakEven, type BreakEvenCurrency } from '@/lib/tools/order-break-even-calculator'
import { OrderBreakEvenForm } from './order-break-even-form'
import { buildOrderBreakEvenSummary, createInitialForm, toInputs, type BreakEvenNumericField, type OrderBreakEvenFormState } from './order-break-even-page-data'
import { OrderBreakEvenResults, OrderBreakEvenStats } from './order-break-even-results'

export default function OrderBreakEvenCalculatorPage() {
  const [form, setForm] = useState<OrderBreakEvenFormState>(createInitialForm)
  const calculation = useMemo(() => {
    try {
      return { result: calculateOrderBreakEven(toInputs(form)), error: '' }
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : '保本销量无法计算，请检查输入' }
    }
  }, [form])
  const summaryText = calculation.result ? buildOrderBreakEvenSummary(calculation.result) : ''
  const reset = () => setForm(createInitialForm())
  const updateField = (field: BreakEvenNumericField, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const updateCurrency = (currency: BreakEvenCurrency) => setForm((current) => ({ ...current, currency }))
  const applyPreset = (values: OrderBreakEvenFormState) => setForm({ ...values })

  return <ToolShell title="外贸订单保本销量计算器" description="从已知售价反推覆盖固定成本和达到目标利润所需的最低销量。">{calculation.error && <EnhancedAlert type="error" title="计算错误" message={calculation.error} action={{ label: '重置', onClick: reset }} className="mb-4" />}{calculation.result && <OrderBreakEvenStats result={calculation.result} />}<div className="grid gap-3 lg:grid-cols-[minmax(0,1.03fr)_minmax(340px,0.97fr)]"><OrderBreakEvenForm form={form} summaryText={summaryText} onFieldChange={updateField} onCurrencyChange={updateCurrency} onPreset={applyPreset} onReset={reset} />{calculation.result ? <OrderBreakEvenResults result={calculation.result} /> : <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">修正参数后查看保本销量</div>}</div></ToolShell>
}
