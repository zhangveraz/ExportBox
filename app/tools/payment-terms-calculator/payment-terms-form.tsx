// 名称: 收款账期成本对比表单
// 描述: 展示订单参数、方案预设与可编辑成本字段（紧凑版）
// 路径: ExportBox/app/tools/payment-terms-calculator/payment-terms-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Landmark, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PAYMENT_TERM_PRESETS, type PaymentTermPresetId } from '@/lib/tools/payment-terms-calculator'
import type { GlobalNumericField, PaymentTermsFormState, TermNumericField } from './payment-terms-page-data'

interface PaymentTermsFormProps {
  form: PaymentTermsFormState
  onGlobalChange: (field: GlobalNumericField, value: string) => void
  onTermChange: (termId: string, field: TermNumericField, value: string) => void
  onPresetChange: (termId: string, presetId: PaymentTermPresetId) => void
  onAddTerm: () => void
  onRemoveTerm: (termId: string) => void
  onReset: () => void
}

export function PaymentTermsForm({ form, onGlobalChange, onTermChange, onPresetChange, onAddTerm, onRemoveTerm, onReset }: PaymentTermsFormProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-3 pt-3 pb-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Landmark className="h-4 w-4" />订单与收款方案</CardTitle>
            <p className="text-[10px] text-muted-foreground">统一订单口径后，比较 2 至 3 种付款条件</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={onReset}>
            <RefreshCw className="mr-1 h-3 w-3" />重置
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
          <NumberField id="orderAmount" label="订单金额" suffix="CNY" value={form.orderAmount} onChange={(value) => onGlobalChange('orderAmount', value)} />
          <NumberField id="orderCost" label="订单总成本" suffix="CNY" value={form.orderCost} onChange={(value) => onGlobalChange('orderCost', value)} />
          <NumberField id="productionDays" label="生产周期" suffix="天" value={form.productionDays} onChange={(value) => onGlobalChange('productionDays', value)} integer />
          <NumberField id="annualFundingRatePercent" label="资金年化成本" suffix="%" value={form.annualFundingRatePercent} onChange={(value) => onGlobalChange('annualFundingRatePercent', value)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <h2 className="text-[13px] font-semibold">对比方案</h2>
              <p className="text-[10px] text-muted-foreground">预设参数可继续修改</p>
            </div>
            <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={onAddTerm} disabled={form.terms.length >= 3}>
              <Plus className="mr-1 h-3 w-3" />添加方案
            </Button>
          </div>
          {form.terms.map((term, index) => (
            <div key={term.id} className="rounded-md border bg-muted/20 px-2 py-1.5">
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <Label htmlFor={`${term.id}-preset`} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">方案 {index + 1}</Label>
                  <Select value={term.presetId} onValueChange={(value) => onPresetChange(term.id, value as PaymentTermPresetId)}>
                    <SelectTrigger id={`${term.id}-preset`} className="h-8 text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>{PAYMENT_TERM_PRESETS.map((preset) => <SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-7 shrink-0" title="移除方案" aria-label={`移除方案 ${index + 1}`} disabled={form.terms.length <= 2} onClick={() => onRemoveTerm(term.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-x-2.5 gap-y-1.5 sm:grid-cols-3">
                <NumberField id={`${term.id}-advancePercent`} label="预付款" suffix="%" value={term.advancePercent} onChange={(value) => onTermChange(term.id, 'advancePercent', value)} />
                <NumberField id={`${term.id}-daysAfterShipment`} label="发货后账期" suffix="天" value={term.daysAfterShipment} onChange={(value) => onTermChange(term.id, 'daysAfterShipment', value)} integer />
                <NumberField id={`${term.id}-feePercent`} label="收款费率" suffix="%" value={term.feePercent} onChange={(value) => onTermChange(term.id, 'feePercent', value)} />
                <NumberField id={`${term.id}-fixedFee`} label="固定费用" suffix="CNY" value={term.fixedFee} onChange={(value) => onTermChange(term.id, 'fixedFee', value)} />
                <NumberField id={`${term.id}-riskReservePercent`} label="风险准备金" suffix="%" value={term.riskReservePercent} onChange={(value) => onTermChange(term.id, 'riskReservePercent', value)} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface NumberFieldProps {
  id: string
  label: string
  value: string
  suffix: string
  onChange: (value: string) => void
  integer?: boolean
}

function NumberField({ id, label, value, suffix, onChange, integer = false }: NumberFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label>
      <div className="relative">
        <FormattedInput id={id} value={value} onChange={onChange} format={integer ? 'number' : 'decimal'} maxDecimals={integer ? 0 : 2} className="h-8 pr-14 text-[13px] font-medium" />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span>
      </div>
    </div>
  )
}
