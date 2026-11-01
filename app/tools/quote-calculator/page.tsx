// 名称: 外贸报价利润计算器（紧凑单屏版）
// 描述: 左侧参数、右侧结果的一屏式布局
// 路径: ExportBox/app/tools/quote-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

'use client'

import { useMemo, useState } from 'react'
import { ToolShell } from '@/components/tools/tool-shell'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { calculateQuote, type QuoteInputs, type QuoteMode, type QuoteTerm } from '@/lib/tools/quote-calculator'
import { INITIAL_FORM, buildSummary, toNumber, type FormState, type NumericField, type QuoteCurrency } from './quote-page-data'
import { QuoteForm } from './quote-form'
import { QuoteResults } from './quote-results'

export default function QuoteCalculatorPage() {
  const [mode, setMode] = useState<QuoteMode>('target-margin')
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  const formatter = useMemo(
    () => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: form.currency, maximumFractionDigits: 2 }),
    [form.currency],
  )

  const inputs = useMemo<QuoteInputs>(() => ({
    quoteTerm: form.quoteTerm, unitCostCny: toNumber(form.unitCostCny), quantity: toNumber(form.quantity), domesticFeeCny: toNumber(form.domesticFeeCny), exportFeeCny: toNumber(form.exportFeeCny),
    internationalFreightCny: toNumber(form.internationalFreightCny), insuranceFeeCny: toNumber(form.insuranceFeeCny), destinationFeeCny: toNumber(form.destinationFeeCny), importDutyTaxCny: toNumber(form.importDutyTaxCny),
    exchangeRate: toNumber(form.exchangeRate), targetMarginPercent: toNumber(form.targetMarginPercent), sellingPriceForeign: toNumber(form.sellingPriceForeign), commissionPercent: toNumber(form.commissionPercent), paymentFeePercent: toNumber(form.paymentFeePercent), rebatePercent: toNumber(form.rebatePercent), vatPercent: toNumber(form.vatPercent),
  }), [form])

  const calculation = useMemo(() => {
    try {
      return { result: calculateQuote(inputs, mode), error: '' }
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : '报价参数无法计算，请检查输入' }
    }
  }, [inputs, mode])

  const formatForeign = (value: number) => formatter.format(value)
  const getSummaryText = () => (calculation.result ? buildSummary(calculation.result, form.currency, formatForeign) : '')
  const reset = () => {
    setMode('target-margin')
    setForm(INITIAL_FORM)
  }
  const updateField = (field: NumericField, value: string) => setForm((current) => ({ ...current, [field]: value }))

  return (
    <ToolShell
      title="外贸报价利润计算器"
      description="采购成本 + 运费 + 汇率 + 佣金 + 目标利润率，按 EXW / FOB / CIF / DDP 等条款测算报价"
      onReset={reset}
    >
      {calculation.error && (
        <EnhancedAlert
          type="error"
          title="计算错误"
          message={calculation.error}
          action={{ label: '重置', onClick: reset }}
          className="mb-3"
        />
      )}

      {/* 报价结果信息量最大（单价 + 四项指标 + 成本构成），右列给到 6 成宽度 */}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
        <QuoteForm
          form={form}
          mode={mode}
          missingCostLabels={calculation.result?.missingCostLabels ?? []}
          onFieldChange={updateField}
          onModeChange={setMode}
          onTermChange={(quoteTerm: QuoteTerm) => setForm((current) => ({ ...current, quoteTerm }))}
          onCurrencyChange={(currency: QuoteCurrency, exchangeRate: string) => setForm((current) => ({ ...current, currency, exchangeRate }))}
          onPreset={(values, nextMode) => {
            setMode(nextMode)
            setForm((current) => ({ ...current, ...values }))
          }}
        />
        <div className="xl:sticky xl:top-20">
          <QuoteResults
            result={calculation.result}
            mode={mode}
            currency={form.currency}
            summaryText={getSummaryText()}
            formatForeign={formatForeign}
          />
        </div>
      </div>
    </ToolShell>
  )
}
