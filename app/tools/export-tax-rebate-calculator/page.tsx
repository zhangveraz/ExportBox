// 名称: 出口退税计算器
// 描述: 按采购发票、增值税率、退税率和 FOB 收入估算退税额与退税后利润
// 路径: ExportBox/app/tools/export-tax-rebate-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01
'use client'

import { useMemo, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calculator, Info, Percent, ReceiptText, RotateCcw, TrendingUp, Wallet } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ToolShell } from '@/components/tools/tool-shell'
import { calculateExportTaxRebate, DEFAULT_EXPORT_TAX_REBATE_INPUTS, ExportTaxRebateInputs, PurchaseTaxMode } from '@/lib/tools/export-tax-rebate-calculator'
import { cn } from '@/lib/utils'
import { ScenarioPresets, type ScenarioPreset } from '@/components/tools/scenario-presets'

type NumericField = Exclude<keyof ExportTaxRebateInputs, 'purchaseTaxMode'>
type FormState = Record<NumericField, string> & { purchaseTaxMode: PurchaseTaxMode }
const defaults = DEFAULT_EXPORT_TAX_REBATE_INPUTS
const initialForm: FormState = {
  purchaseTaxMode: defaults.purchaseTaxMode, purchaseAmountCny: String(defaults.purchaseAmountCny), vatRatePercent: String(defaults.vatRatePercent),
  rebateRatePercent: String(defaults.rebateRatePercent), fobAmountForeign: String(defaults.fobAmountForeign), exchangeRate: String(defaults.exchangeRate),
  domesticFreightCny: String(defaults.domesticFreightCny), customsAndPortFeeCny: String(defaults.customsAndPortFeeCny), agencyFeeCny: String(defaults.agencyFeeCny), otherCostCny: String(defaults.otherCostCny),
}
const fields: Array<{ field: NumericField; label: string; suffix: string; group: 'trade' | 'expense' }> = [
  { field: 'purchaseAmountCny', label: '采购金额', suffix: 'CNY', group: 'trade' }, { field: 'vatRatePercent', label: '增值税率', suffix: '%', group: 'trade' },
  { field: 'rebateRatePercent', label: '出口退税率', suffix: '%', group: 'trade' }, { field: 'fobAmountForeign', label: 'FOB 出口金额', suffix: '外币', group: 'trade' },
  { field: 'exchangeRate', label: '折算汇率', suffix: 'CNY', group: 'trade' }, { field: 'domesticFreightCny', label: '国内运输费', suffix: 'CNY', group: 'expense' },
  { field: 'customsAndPortFeeCny', label: '报关与港杂费', suffix: 'CNY', group: 'expense' }, { field: 'agencyFeeCny', label: '代理服务费', suffix: 'CNY', group: 'expense' },
  { field: 'otherCostCny', label: '其他出口费用', suffix: 'CNY', group: 'expense' },
]
const money = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 2 })
const num = (value: string) => Number.isFinite(Number(value)) ? Number(value) : 0
const TAX_RATE_PRESETS: Array<ScenarioPreset<Partial<FormState>>> = [
  { label: '13% 退 13%', description: '常见增值税率 13%、出口退税率 13% 的足额退税口径', values: { vatRatePercent: '13', rebateRatePercent: '13' } },
  { label: '13% 退 9%', description: '增值税率 13%、退税率 9%，存在 4% 征退税差', values: { vatRatePercent: '13', rebateRatePercent: '9' } },
  { label: '13% 退 6%', description: '增值税率 13%、退税率 6%，需重点关注征退税差成本', values: { vatRatePercent: '13', rebateRatePercent: '6' } },
  { label: '9% 退 9%', description: '适用于增值税率和退税率均为 9% 的商品口径', values: { vatRatePercent: '9', rebateRatePercent: '9' } },
]

export default function ExportTaxRebateCalculatorPage() {
  const [form, setForm] = useState(initialForm)
  const result = useMemo(() => calculateExportTaxRebate({ purchaseTaxMode: form.purchaseTaxMode, purchaseAmountCny: num(form.purchaseAmountCny), vatRatePercent: num(form.vatRatePercent), rebateRatePercent: num(form.rebateRatePercent), fobAmountForeign: num(form.fobAmountForeign), exchangeRate: num(form.exchangeRate), domesticFreightCny: num(form.domesticFreightCny), customsAndPortFeeCny: num(form.customsAndPortFeeCny), agencyFeeCny: num(form.agencyFeeCny), otherCostCny: num(form.otherCostCny) }), [form])
  const update = (field: NumericField, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const getSummaryText = () => [`出口退税测算`, `采购口径：${form.purchaseTaxMode === 'tax-inclusive' ? '含税采购' : '未税采购'}`, `增值税率/退税率：${form.vatRatePercent}% / ${form.rebateRatePercent}%`, `FOB 收入：${money.format(result.fobRevenueCny)}`, `预计退税：${money.format(result.estimatedRebateCny)}`, `征退税差成本：${money.format(result.nonRefundableTaxCostCny)}`, `采购现金支出：${money.format(result.purchaseCashOutflowCny)}`, `出口费用：${money.format(result.exportExpenseCny)}`, `退税后利润：${money.format(result.profitBeforeTaxCny)}`, `利润率：${result.profitMarginPercent.toFixed(2)}%`].join('\n')
  const cards = [
    { label: '预计退税额', value: money.format(result.estimatedRebateCny), caption: `收入占比 ${result.rebateSharePercent.toFixed(1)}%`, icon: ReceiptText },
    { label: 'FOB 折算收入', value: money.format(result.fobRevenueCny), caption: `汇率 ${form.exchangeRate}`, icon: Wallet },
    { label: '退税后利润', value: money.format(result.profitBeforeTaxCny), caption: `利润率 ${result.profitMarginPercent.toFixed(1)}%`, icon: TrendingUp },
    { label: '征退税差成本', value: money.format(result.nonRefundableTaxCostCny), caption: `税率差 ${Math.max(0, num(form.vatRatePercent) - num(form.rebateRatePercent))}%`, icon: Percent },
  ]
  const renderField = ({ field, label, suffix }: typeof fields[number]) => <div key={field} className="space-y-1"><Label htmlFor={field} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label><div className="relative"><Input id={field} type="text" inputMode="decimal" value={form[field]} onChange={(e) => update(field, e.target.value)} className="h-8 pr-16 text-[13px] tabular-nums" /><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span></div></div>

  return <ToolShell title="出口退税计算器" description="按采购发票、增值税率、退税率和 FOB 收入，估算退税额与退税后利润。">
    <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{cards.map(({ label, value, caption, icon: Icon }) => <div key={label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{label}</p><p className={cn('wrap-break-word text-[13px] leading-5 font-semibold', label === '退税后利润' && result.profitBeforeTaxCny < 0 && 'text-red-600')}>{value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={caption}>{caption}</p></div></div>)}</div>

    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
      <Card className="gap-0 py-0"><CardHeader className="px-3 pt-3 pb-1.5"><div className="flex items-center justify-between gap-2"><div className="min-w-0"><CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><Calculator className="h-4 w-4" />测算参数</CardTitle><p className="text-[10px] text-muted-foreground">采购金额口径会影响不含税成本与进项税拆分</p></div><Button variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={() => setForm(initialForm)}><RotateCcw className="mr-1 h-3 w-3" />重置</Button></div></CardHeader><CardContent className="space-y-2.5 px-3 pt-0 pb-3">
        <Tabs value={form.purchaseTaxMode} onValueChange={(value) => setForm((current) => ({ ...current, purchaseTaxMode: value as PurchaseTaxMode }))}><TabsList className="grid h-8 w-full grid-cols-2 p-0.5"><TabsTrigger value="tax-inclusive" className="h-7 text-[11px]">采购金额含税</TabsTrigger><TabsTrigger value="tax-exclusive" className="h-7 text-[11px]">采购金额未税</TabsTrigger></TabsList></Tabs>
        <ScenarioPresets presets={TAX_RATE_PRESETS} onSelect={(values) => setForm((current) => ({ ...current, ...values }))} />
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 md:grid-cols-3">{fields.filter((field) => field.group === 'trade').map(renderField)}</div>
        <div><h3 className="mb-1.5 text-[12px] font-semibold">出口费用</h3><div className="grid grid-cols-2 gap-x-2.5 gap-y-2 md:grid-cols-4">{fields.filter((field) => field.group === 'expense').map(renderField)}</div></div>
        {num(form.rebateRatePercent) > num(form.vatRatePercent) && <Alert variant="destructive" className="px-2.5 py-1.5"><Info className="h-3.5 w-3.5" /><AlertDescription className="text-[11px] leading-4">退税率不能高于增值税率，当前测算已按增值税率封顶。</AlertDescription></Alert>}
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="max-w-[62%] text-[10px] leading-4 text-muted-foreground">结果仅用于业务预算。实际退税以商品 HS 编码、有效增值税发票、申报口径、收汇及主管税务机关审核为准。</p><EnhancedCopyButton text={getSummaryText()} variant="outline" size="sm" className="h-7 px-2 text-[11px]">复制摘要</EnhancedCopyButton></div>
      </CardContent></Card>

      <div className="space-y-2">
        <Card className="gap-0 py-0"><CardHeader className="flex items-center justify-between px-3 pt-2.5 pb-1"><CardTitle className="text-[12px] font-semibold">采购与税额拆分</CardTitle><Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{form.purchaseTaxMode === 'tax-inclusive' ? '含税采购' : '未税采购'}</Badge></CardHeader><CardContent className="px-3 pt-0 pb-2"><Row label="不含税采购额" value={result.purchaseExclusiveCny} /><Row label="进项增值税" value={result.inputVatCny} /><Row label="采购现金支出" value={result.purchaseCashOutflowCny} /><Row label="出口费用" value={result.exportExpenseCny} /></CardContent></Card>
        <Card className="gap-0 py-0"><CardHeader className="px-3 pt-2.5 pb-1"><CardTitle className="text-[12px] font-semibold">利润桥</CardTitle></CardHeader><CardContent className="px-3 pt-0 pb-2"><Row label="FOB 折算收入" value={result.fobRevenueCny} /><Row label="预计退税收入" value={result.estimatedRebateCny} /><Row label="收入合计" value={result.totalIncomeCny} /><Row label="成本合计" value={result.totalCostCny} /><div className="mt-1 flex items-center justify-between border-t pt-1.5 text-[12px] font-semibold"><span>退税后利润</span><span className="tabular-nums">{money.format(result.profitBeforeTaxCny)}</span></div></CardContent></Card>
      </div>
    </div>
  </ToolShell>
}
function Row({ label, value }: { label: string; value: number }) { return <div className="flex items-baseline justify-between gap-2 py-0.5"><span className="truncate text-[11px] text-muted-foreground">{label}</span><span className="shrink-0 text-[12px] font-medium tabular-nums">{money.format(value)}</span></div> }
