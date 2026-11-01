// 名称: 供应商报价对比表单
// 描述: 编辑计划数量、税价口径和各供应商采购参数（紧凑版）
// 路径: ExportBox/app/tools/supplier-quote-comparison/supplier-quote-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Factory, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ScenarioPresets } from '@/components/tools/scenario-presets'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MAX_SUPPLIER_QUOTES, MIN_SUPPLIER_QUOTES, SUPPLIER_QUOTE_CURRENCY_OPTIONS, type SupplierQuoteCurrency, type SupplierQuoteTaxMode } from '@/lib/tools/supplier-quote-comparison'
import { SUPPLIER_QUOTE_PRESETS, type SupplierCommonField, type SupplierComparisonFormState, type SupplierNumericField, type SupplierQuoteFormState } from './supplier-quote-page-data'

interface SupplierQuoteFormProps {
  form: SupplierComparisonFormState
  summaryText: string
  onCommonFieldChange: (field: SupplierCommonField, value: string) => void
  onCurrencyChange: (currency: SupplierQuoteCurrency) => void
  onSupplierNameChange: (id: string, value: string) => void
  onSupplierTaxModeChange: (id: string, value: SupplierQuoteTaxMode) => void
  onSupplierFieldChange: (id: string, field: SupplierNumericField, value: string) => void
  onPreset: (values: SupplierComparisonFormState) => void
  onAddSupplier: () => void
  onRemoveSupplier: (id: string) => void
  onReset: () => void
}

export function SupplierQuoteForm(props: SupplierQuoteFormProps) {
  return <Card className="gap-0 py-0"><CardHeader className="px-3 pt-3 pb-1.5"><div className="flex items-center justify-between gap-2"><CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Factory className="h-4 w-4" />采购需求与报价</CardTitle><div className="flex gap-1.5"><EnhancedCopyButton text={props.summaryText} variant="outline" size="sm" className="h-7 px-2 text-[11px]" disabled={!props.summaryText}>复制摘要</EnhancedCopyButton><Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={props.onReset}><RefreshCw className="mr-1 h-3 w-3" />重置</Button></div></div></CardHeader><CardContent className="space-y-2.5 px-3 pt-0 pb-3">
    <div className="grid grid-cols-2 gap-x-2.5 gap-y-2"><div className="space-y-1"><Label htmlFor="supplier-currency" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">核算币种</Label><Select value={props.form.currency} onValueChange={(value) => props.onCurrencyChange(value as SupplierQuoteCurrency)}><SelectTrigger id="supplier-currency" className="h-8 text-[13px]"><SelectValue /></SelectTrigger><SelectContent>{SUPPLIER_QUOTE_CURRENCY_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div><NumberField id="supplier-required-units" label="计划合格品数量" suffix="件" value={props.form.requiredGoodUnits} integer onChange={(value) => props.onCommonFieldChange('requiredGoodUnits', value)} /></div>
    <ScenarioPresets presets={SUPPLIER_QUOTE_PRESETS} onSelect={props.onPreset} />
    <div className="space-y-2"><div className="flex items-center justify-between gap-2"><div className="flex items-baseline gap-1.5"><h2 className="text-[13px] font-semibold">供应商报价</h2><p className="text-[10px] text-muted-foreground">同时比较 {MIN_SUPPLIER_QUOTES}–{MAX_SUPPLIER_QUOTES} 家</p></div><Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]" onClick={props.onAddSupplier} disabled={props.form.suppliers.length >= MAX_SUPPLIER_QUOTES}><Plus className="mr-1 h-3 w-3" />添加供应商</Button></div>{props.form.suppliers.map((supplier, index) => <SupplierEditor key={supplier.id} supplier={supplier} index={index} currency={props.form.currency} removable={props.form.suppliers.length > MIN_SUPPLIER_QUOTES} onNameChange={props.onSupplierNameChange} onTaxModeChange={props.onSupplierTaxModeChange} onFieldChange={props.onSupplierFieldChange} onRemove={props.onRemoveSupplier} />)}</div>
    <p className="text-[10px] leading-4 text-muted-foreground">固定费用可录入打样、开模、制版或认证费；国内运费按最终应付金额录入。首付仅按货款计算，不自动包含固定费用和运费。</p>
  </CardContent></Card>
}

function SupplierEditor({ supplier, index, currency, removable, onNameChange, onTaxModeChange, onFieldChange, onRemove }: { supplier: SupplierQuoteFormState; index: number; currency: SupplierQuoteCurrency; removable: boolean; onNameChange: (id: string, value: string) => void; onTaxModeChange: (id: string, value: SupplierQuoteTaxMode) => void; onFieldChange: (id: string, field: SupplierNumericField, value: string) => void; onRemove: (id: string) => void }) {
  const fields: Array<{ field: SupplierNumericField; label: string; suffix: string; integer?: boolean }> = [
    { field: 'quotedUnitPrice', label: '报价单价', suffix: `${currency}/件` }, { field: 'vatRatePercent', label: '增值税率', suffix: '%' }, { field: 'minimumOrderQuantity', label: '起订量 MOQ', suffix: '件', integer: true }, { field: 'defectAllowancePercent', label: '次品预留率', suffix: '%' }, { field: 'fixedFee', label: '固定费用', suffix: currency }, { field: 'domesticFreight', label: '国内运费', suffix: currency }, { field: 'leadTimeDays', label: '交期', suffix: '天', integer: true }, { field: 'depositPercent', label: '货款首付', suffix: '%' },
  ]
  return <div className="rounded-md border bg-muted/20 px-2 py-1.5">
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-[1.6] space-y-1"><Label htmlFor={`supplier-name-${supplier.id}`} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">供应商 {index + 1}</Label><Input id={`supplier-name-${supplier.id}`} value={supplier.name} maxLength={40} onChange={(event) => onNameChange(supplier.id, event.target.value)} className="h-8 text-[13px]" /></div>
      <div className="flex-1 space-y-1"><Label className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">报价口径</Label><Tabs value={supplier.taxMode} onValueChange={(value) => onTaxModeChange(supplier.id, value as SupplierQuoteTaxMode)}><TabsList className="h-8 p-0.5"><TabsTrigger value="tax-inclusive" className="h-7 px-2 text-[11px]">含税</TabsTrigger><TabsTrigger value="tax-exclusive" className="h-7 px-2 text-[11px]">未税</TabsTrigger></TabsList></Tabs></div>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-7 shrink-0" disabled={!removable} onClick={() => onRemove(supplier.id)} title={removable ? `删除${supplier.name}` : '至少保留两家供应商'} aria-label={removable ? `删除${supplier.name}` : '至少保留两家供应商'}><Trash2 className="h-3.5 w-3.5" /></Button>
    </div>
    <div className="mt-1.5 grid grid-cols-2 gap-x-2.5 gap-y-1.5 sm:grid-cols-4">{fields.map((field) => <NumberField key={field.field} id={`supplier-${supplier.id}-${field.field}`} label={field.label} suffix={field.suffix} value={supplier[field.field]} integer={field.integer} onChange={(value) => onFieldChange(supplier.id, field.field, value)} />)}</div>
  </div>
}

function NumberField({ id, label, suffix, value, onChange, integer = false }: { id: string; label: string; suffix: string; value: string; onChange: (value: string) => void; integer?: boolean }) {
  return <div className="space-y-1"><Label htmlFor={id} className="text-[10px] leading-3.5 text-slate-600 dark:text-slate-300">{label}</Label><div className="relative"><FormattedInput id={id} value={value} onChange={onChange} format={integer ? 'number' : 'decimal'} maxDecimals={4} className="h-7 pr-12 text-[12px] font-medium" /><span className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-[9px] text-muted-foreground">{suffix}</span></div></div>
}
