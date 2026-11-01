// 名称: 外贸订单保本销量表单
// 描述: 编辑售价、成本、费率、计划销量和目标利润（紧凑版）
// 路径: ExportBox/app/tools/order-break-even-calculator/order-break-even-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { RefreshCw, Scale } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ScenarioPresets } from '@/components/tools/scenario-presets'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BREAK_EVEN_CURRENCY_OPTIONS, type BreakEvenCurrency } from '@/lib/tools/order-break-even-calculator'
import { ORDER_BREAK_EVEN_PRESETS, type BreakEvenNumericField, type OrderBreakEvenFormState } from './order-break-even-page-data'

interface OrderBreakEvenFormProps {
  form: OrderBreakEvenFormState
  summaryText: string
  onFieldChange: (field: BreakEvenNumericField, value: string) => void
  onCurrencyChange: (currency: BreakEvenCurrency) => void
  onPreset: (values: OrderBreakEvenFormState) => void
  onReset: () => void
}

export function OrderBreakEvenForm({ form, summaryText, onFieldChange, onCurrencyChange, onPreset, onReset }: OrderBreakEvenFormProps) {
  return <Card className="gap-0 py-0"><CardHeader className="px-3 pt-3 pb-1.5"><div className="flex items-center justify-between gap-2"><CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Scale className="h-4 w-4" />售价与成本参数</CardTitle><div className="flex gap-1.5"><EnhancedCopyButton text={summaryText} variant="outline" size="sm" className="h-7 px-2 text-[11px]" disabled={!summaryText}>复制摘要</EnhancedCopyButton><Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={onReset}><RefreshCw className="mr-1 h-3 w-3" />重置</Button></div></div></CardHeader><CardContent className="space-y-2.5 px-3 pt-0 pb-3">
    <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 sm:grid-cols-3"><div className="space-y-1"><Label htmlFor="break-even-currency" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">核算币种</Label><Select value={form.currency} onValueChange={(value) => onCurrencyChange(value as BreakEvenCurrency)}><SelectTrigger id="break-even-currency" className="h-8 text-[13px]"><SelectValue /></SelectTrigger><SelectContent>{BREAK_EVEN_CURRENCY_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div><NumberField id="break-even-plan-quantity" label="计划销量" suffix="件" value={form.plannedQuantity} integer onChange={(value) => onFieldChange('plannedQuantity', value)} /><NumberField id="break-even-selling-price" label="销售单价" suffix={`${form.currency}/件`} value={form.unitSellingPrice} onChange={(value) => onFieldChange('unitSellingPrice', value)} /><NumberField id="break-even-variable-cost" label="单件变动成本" suffix={`${form.currency}/件`} value={form.unitVariableCost} onChange={(value) => onFieldChange('unitVariableCost', value)} /><NumberField id="break-even-fixed-cost" label="订单固定成本" suffix={form.currency} value={form.fixedOrderCost} onChange={(value) => onFieldChange('fixedOrderCost', value)} /><NumberField id="break-even-target-profit" label="目标利润" suffix={form.currency} value={form.targetProfit} onChange={(value) => onFieldChange('targetProfit', value)} /><NumberField id="break-even-commission" label="佣金率" suffix="%" value={form.commissionPercent} onChange={(value) => onFieldChange('commissionPercent', value)} /><NumberField id="break-even-payment-fee" label="收款费率" suffix="%" value={form.paymentFeePercent} onChange={(value) => onFieldChange('paymentFeePercent', value)} /><NumberField id="break-even-loss" label="售后损耗预留" suffix="%" value={form.lossAllowancePercent} onChange={(value) => onFieldChange('lossAllowancePercent', value)} /></div>
    <ScenarioPresets presets={ORDER_BREAK_EVEN_PRESETS} onSelect={onPreset} />
    <p className="text-[10px] leading-4 text-muted-foreground">单件变动成本含随销量增加的采购、包装和单件物流成本；订单固定成本用于录入开模、认证、打样、制版或整票操作费。</p>
  </CardContent></Card>
}

function NumberField({ id, label, suffix, value, onChange, integer = false }: { id: string; label: string; suffix: string; value: string; onChange: (value: string) => void; integer?: boolean }) {
  return <div className="space-y-1"><Label htmlFor={id} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label><div className="relative"><FormattedInput id={id} value={value} onChange={onChange} format={integer ? 'number' : 'decimal'} maxDecimals={4} className="h-8 pr-16 text-[13px] font-medium" /><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span></div></div>
}
