// 名称: 外贸阶梯报价表单
// 描述: 编辑币种、费用、利润率和数量采购成本档位（紧凑版）
// 路径: ExportBox/app/tools/tiered-quote-calculator/tiered-quote-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { ListOrdered, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ScenarioPresets } from '@/components/tools/scenario-presets'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MAX_QUOTE_TIERS, MIN_QUOTE_TIERS, TIERED_QUOTE_CURRENCY_OPTIONS, type TieredQuoteCurrency } from '@/lib/tools/tiered-quote-calculator'
import { TIERED_QUOTE_PRESETS, type QuoteCommonField, type TieredQuoteFormState, type TierFormState, type TierNumericField } from './tiered-quote-page-data'

interface TieredQuoteFormProps {
  form: TieredQuoteFormState
  summaryText: string
  onCommonFieldChange: (field: QuoteCommonField, value: string) => void
  onCurrencyChange: (currency: TieredQuoteCurrency, rate: string) => void
  onTierLabelChange: (id: string, value: string) => void
  onTierFieldChange: (id: string, field: TierNumericField, value: string) => void
  onPreset: (values: Partial<TieredQuoteFormState>) => void
  onAddTier: () => void
  onRemoveTier: (id: string) => void
  onReset: () => void
}

export function TieredQuoteForm(props: TieredQuoteFormProps) {
  return <Card className="gap-0 py-0"><CardHeader className="px-3 pt-3 pb-1.5"><div className="flex items-center justify-between gap-2"><CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><ListOrdered className="h-4 w-4" />报价与成本参数</CardTitle><div className="flex gap-1.5"><EnhancedCopyButton text={props.summaryText} variant="outline" size="sm" className="h-7 px-2 text-[11px]" disabled={!props.summaryText}>复制摘要</EnhancedCopyButton><Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={props.onReset}><RefreshCw className="mr-1 h-3 w-3" />重置</Button></div></div></CardHeader><CardContent className="space-y-2.5 px-3 pt-0 pb-3">
    <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 sm:grid-cols-3">
      <div className="space-y-1"><Label htmlFor="tiered-currency" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">报价币种</Label><Select value={props.form.currency} onValueChange={(value) => { const option = TIERED_QUOTE_CURRENCY_OPTIONS.find((item) => item.value === value); props.onCurrencyChange(value as TieredQuoteCurrency, String(option?.rate ?? props.form.exchangeRate)) }}><SelectTrigger id="tiered-currency" className="h-8 text-[13px]"><SelectValue /></SelectTrigger><SelectContent>{TIERED_QUOTE_CURRENCY_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
      <NumberField id="tiered-rate" label="结算汇率" suffix={`CNY/${props.form.currency}`} value={props.form.exchangeRate} onChange={(value) => props.onCommonFieldChange('exchangeRate', value)} />
      <NumberField id="tiered-fixed-cost" label="每单固定费用" suffix="CNY" value={props.form.fixedOrderCostCny} onChange={(value) => props.onCommonFieldChange('fixedOrderCostCny', value)} />
      <NumberField id="tiered-margin" label="目标销售利润率" suffix="%" value={props.form.targetMarginPercent} onChange={(value) => props.onCommonFieldChange('targetMarginPercent', value)} />
      <NumberField id="tiered-commission" label="佣金率" suffix="%" value={props.form.commissionPercent} onChange={(value) => props.onCommonFieldChange('commissionPercent', value)} />
      <NumberField id="tiered-payment-fee" label="收款费率" suffix="%" value={props.form.paymentFeePercent} onChange={(value) => props.onCommonFieldChange('paymentFeePercent', value)} />
      <NumberField id="tiered-rounding" label="向上取整步长" suffix={props.form.currency} value={props.form.roundingIncrementForeign} onChange={(value) => props.onCommonFieldChange('roundingIncrementForeign', value)} />
    </div>
    <ScenarioPresets presets={TIERED_QUOTE_PRESETS} onSelect={props.onPreset} />
    <div className="space-y-2"><div className="flex items-center justify-between gap-2"><div className="flex items-baseline gap-1.5"><h2 className="text-[13px] font-semibold">数量档位</h2><p className="text-[10px] text-muted-foreground">同时比较 {MIN_QUOTE_TIERS}–{MAX_QUOTE_TIERS} 个档位</p></div><Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={props.onAddTier} disabled={props.form.tiers.length >= MAX_QUOTE_TIERS}><Plus className="mr-1 h-3 w-3" />添加档位</Button></div>{props.form.tiers.map((tier, index) => <TierEditor key={tier.id} tier={tier} index={index} removable={props.form.tiers.length > MIN_QUOTE_TIERS} onLabelChange={props.onTierLabelChange} onFieldChange={props.onTierFieldChange} onRemove={props.onRemoveTier} />)}</div>
    <p className="text-[10px] leading-4 text-muted-foreground">采购单价反映供应商数量折扣；每单固定费用按各档数量摊薄。运费、保险、税费和目的地费用应在确定档位后转到报价利润工具核算。</p>
  </CardContent></Card>
}

function TierEditor({ tier, index, removable, onLabelChange, onFieldChange, onRemove }: { tier: TierFormState; index: number; removable: boolean; onLabelChange: (id: string, value: string) => void; onFieldChange: (id: string, field: TierNumericField, value: string) => void; onRemove: (id: string) => void }) {
  return <div className="rounded-md border bg-muted/20 px-2 py-1.5"><div className="flex items-end gap-2"><div className="min-w-0 flex-[1.4] space-y-1"><Label htmlFor={`tiered-label-${tier.id}`} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">档位 {index + 1}</Label><Input id={`tiered-label-${tier.id}`} value={tier.label} maxLength={40} onChange={(event) => onLabelChange(tier.id, event.target.value)} className="h-8 text-[13px]" /></div><div className="min-w-0 flex-1"><NumberField id={`tiered-${tier.id}-quantity`} label="订购数量" suffix="件" value={tier.quantity} integer onChange={(value) => onFieldChange(tier.id, 'quantity', value)} /></div><div className="min-w-0 flex-1"><NumberField id={`tiered-${tier.id}-unit-cost`} label="采购单价" suffix="CNY/件" value={tier.unitCostCny} onChange={(value) => onFieldChange(tier.id, 'unitCostCny', value)} /></div><Button type="button" variant="ghost" size="icon" className="h-8 w-7 shrink-0" disabled={!removable} onClick={() => onRemove(tier.id)} title={removable ? `删除${tier.label}` : '至少保留两个档位'} aria-label={removable ? `删除${tier.label}` : '至少保留两个档位'}><Trash2 className="h-3.5 w-3.5" /></Button></div></div>
}

function NumberField({ id, label, suffix, value, onChange, integer = false }: { id: string; label: string; suffix: string; value: string; onChange: (value: string) => void; integer?: boolean }) {
  return <div className="space-y-1"><Label htmlFor={id} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label><div className="relative"><FormattedInput id={id} value={value} onChange={onChange} format={integer ? 'number' : 'decimal'} maxDecimals={4} className="h-8 pr-16 text-[13px] font-medium" /><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span></div></div>
}
