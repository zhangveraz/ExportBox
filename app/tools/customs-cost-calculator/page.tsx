// 名称: 报关费用估算器
// 描述: 汇总报关、单证、代理、查验和本地操作费用，测算每票与每件成本
// 路径: ExportBox/app/tools/customs-cost-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calculator, FileCheck2, Info, Package, RotateCcw, ShieldCheck, Wallet } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ToolShell } from '@/components/tools/tool-shell'
import { cn } from '@/lib/utils'
import { calculateCustomsCost, CustomsCostInputs, CustomsDirection, DEFAULT_CUSTOMS_COST_INPUTS } from '@/lib/tools/customs-cost-calculator'
import { ScenarioPresets, type ScenarioPreset } from '@/components/tools/scenario-presets'

type NumericField = Exclude<keyof CustomsCostInputs, 'direction'>
type FormState = Record<NumericField, string> & { direction: CustomsDirection }

const initialForm = Object.fromEntries(
  Object.entries(DEFAULT_CUSTOMS_COST_INPUTS).map(([key, value]) => [key, String(value)])
) as unknown as FormState
initialForm.direction = DEFAULT_CUSTOMS_COST_INPUTS.direction

const fields: Array<{ field: NumericField; label: string; suffix: string; integer?: boolean }> = [
  { field: 'shipmentCount', label: '报关票数', suffix: '票', integer: true },
  { field: 'itemQuantity', label: '货物数量', suffix: '件', integer: true },
  { field: 'cargoValueCny', label: '申报货值', suffix: 'CNY' },
  { field: 'declarationFeeCny', label: '基础报关费/票', suffix: 'CNY' },
  { field: 'declarationItemCount', label: '申报品名数', suffix: '项', integer: true },
  { field: 'includedItemCount', label: '基础费含品名', suffix: '项', integer: true },
  { field: 'extraItemFeeCny', label: '超项费/品名', suffix: 'CNY' },
  { field: 'documentFeeCny', label: '单证费/票', suffix: 'CNY' },
  { field: 'agencyFeeCny', label: '代理服务费/票', suffix: 'CNY' },
  { field: 'inspectionProbabilityPercent', label: '预计查验概率', suffix: '%' },
  { field: 'inspectionFeeCny', label: '单次查验费用', suffix: 'CNY' },
  { field: 'portOperationFeeCny', label: '港区/场站操作费', suffix: 'CNY' },
  { field: 'storageFeeCny', label: '仓储费用', suffix: 'CNY' },
  { field: 'domesticTransportFeeCny', label: '国内运输费', suffix: 'CNY' },
  { field: 'otherFeeCny', label: '其他费用', suffix: 'CNY' },
]

const money = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 2 })
const number = (value: string) => Number.isFinite(Number.parseFloat(value)) ? Number.parseFloat(value) : 0
const CUSTOMS_PRESETS: Array<ScenarioPreset<Partial<FormState>>> = [
  { label: '出口普货单票', description: '常规出口报关，5 个以内申报品名，低查验预算', values: { direction: 'export', declarationItemCount: '5', includedItemCount: '5', inspectionProbabilityPercent: '5', portOperationFeeCny: '300', storageFeeCny: '0' } },
  { label: '出口多品名', description: '申报品名较多，预留超项费和一般查验预算', values: { direction: 'export', declarationItemCount: '15', includedItemCount: '5', inspectionProbabilityPercent: '10', portOperationFeeCny: '300', storageFeeCny: '0' } },
  { label: '进口清关', description: '进口代理、场站、仓储与国内派送预算', values: { direction: 'import', declarationFeeCny: '500', documentFeeCny: '250', agencyFeeCny: '500', inspectionProbabilityPercent: '15', inspectionFeeCny: '1500', portOperationFeeCny: '800', storageFeeCny: '300', domesticTransportFeeCny: '1000' } },
  { label: '高查验预算', description: '对品名、监管条件或资料不确定的货物提高查验与仓储预留', values: { inspectionProbabilityPercent: '50', inspectionFeeCny: '1800', storageFeeCny: '500', otherFeeCny: '300' } },
]

export default function CustomsCostCalculatorPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const inputs = useMemo(() => Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, key === 'direction' ? value : number(value)])
  ) as unknown as CustomsCostInputs, [form])
  const result = useMemo(() => calculateCustomsCost(inputs), [inputs])
  const maxCost = Math.max(...result.costBreakdown.map((row) => row.value), 1)

  const getSummaryText = () => [
      '报关费用估算', `业务方向：${result.directionLabel}`, `预计总费用：${money.format(result.totalExpectedCostCny)}`,
      `报关票数：${result.shipmentCount} 票`, `申报品名：${form.declarationItemCount} 项（基础含 ${form.includedItemCount} 项）`,
      `每票费用：${money.format(result.perShipmentCny)}`, `每件摊费：${money.format(result.perItemCny)}`,
      `货值占比：${result.cargoValueRatioPercent.toFixed(2)}%`, `查验概率：${form.inspectionProbabilityPercent}%`, `查验期望成本：${money.format(result.expectedInspectionCostCny)}`,
    ].join('\n')

  const cards = [
    { label: '预计费用合计', value: money.format(result.totalExpectedCostCny), caption: result.directionLabel, icon: Wallet },
    { label: '每票费用', value: money.format(result.perShipmentCny), caption: `${result.shipmentCount} 票平均`, icon: FileCheck2 },
    { label: '每件摊费', value: money.format(result.perItemCny), caption: `${result.itemQuantity} 件平均`, icon: Package },
    { label: '货值占比', value: `${result.cargoValueRatioPercent.toFixed(2)}%`, caption: '费用 / 申报货值', icon: Calculator },
  ]

  return <ToolShell title="报关费用估算器" description="汇总报关、单证、代理、查验和本地操作费用，快速测算每票与每件成本。">

    <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{cards.map(({ label, value, caption, icon: Icon }) => <div key={label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{label}</p><p className="wrap-break-word text-[13px] leading-5 font-semibold tabular-nums">{value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={caption}>{caption}</p></div></div>)}</div>

    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      <Card className="gap-0 py-0">
        <CardHeader className="px-3 pt-3 pb-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">费用参数</CardTitle>
              <p className="text-[10px] text-muted-foreground">按实际代理报价填写；查验费用按概率折算为预算期望值</p>
            </div>
            <Button variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]" onClick={() => setForm(initialForm)}>
              <RotateCcw className="mr-1 h-3 w-3" />重置
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
          <Tabs value={form.direction} onValueChange={(value) => setForm((current) => ({ ...current, direction: value as CustomsDirection }))}>
            <TabsList className="grid h-8 w-full grid-cols-2 p-0.5">
              <TabsTrigger value="export" className="h-7 text-[11px]">出口报关</TabsTrigger>
              <TabsTrigger value="import" className="h-7 text-[11px]">进口清关</TabsTrigger>
            </TabsList>
          </Tabs>
          <ScenarioPresets presets={CUSTOMS_PRESETS} onSelect={(values) => setForm((current) => ({ ...current, ...values }))} />
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 md:grid-cols-3">{fields.map(({ field, label, suffix, integer }) => <div key={field} className="space-y-1"><Label htmlFor={field} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label><div className="relative"><Input id={field} type="text" inputMode={integer ? 'numeric' : 'decimal'} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className="h-8 pr-14 text-[13px] tabular-nums" /><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span></div></div>)}</div>
          <Alert className="px-2.5 py-1.5"><Info className="h-3.5 w-3.5" /><AlertDescription className="text-[10px] leading-4">本工具不含关税、进口增值税和消费税。进口税费请使用“进口到岸成本计算器”，实际费用以报关行、港区和海关单据为准。</AlertDescription></Alert>
          <EnhancedCopyButton text={getSummaryText()} variant="outline" size="sm" className="h-7 px-2 text-[11px]">复制估算摘要</EnhancedCopyButton>
        </CardContent>
      </Card>
      <div className="space-y-2.5">
        <Card className="gap-0 py-0">
          <CardHeader className="px-3 pt-2.5 pb-1">
            <div className="flex items-center justify-between gap-2"><CardTitle className="text-[12px] font-semibold">费用拆分</CardTitle><Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{result.directionLabel}</Badge></div>
            <p className="text-[10px] text-muted-foreground">超出基础范围的申报品名 {result.extraItemCount} 项</p>
          </CardHeader>
          <CardContent className="space-y-1.5 px-3 pt-0 pb-2.5">{result.costBreakdown.map((row) => <div key={row.key} className="space-y-0.5"><div className="flex justify-between gap-3 text-[11px]"><span className="truncate text-muted-foreground">{row.label}</span><span className="shrink-0 font-medium tabular-nums">{money.format(row.value)}<span className="ml-1 text-[10px] text-muted-foreground">{row.sharePercent.toFixed(1)}%</span></span></div><div className="h-1 overflow-hidden rounded-full bg-muted"><div className={cn('h-full rounded-full', row.key === 'declaration' ? 'bg-emerald-500' : row.key === 'inspection' ? 'bg-amber-500' : 'bg-slate-500')} style={{ width: `${row.value ? Math.max(3, row.value / maxCost * 100) : 0}%` }} /></div></div>)}</CardContent>
        </Card>
        <Card className="gap-0 py-0">
          <CardHeader className="px-3 pt-2.5 pb-1"><CardTitle className="flex items-center gap-1.5 text-[12px] font-semibold"><ShieldCheck className="h-3.5 w-3.5" />预算提示</CardTitle></CardHeader>
          <CardContent className="space-y-0.5 px-3 pt-0 pb-2.5 text-[11px] text-muted-foreground">
            <div className="flex justify-between gap-3"><span>查验期望成本</span><span className="font-medium tabular-nums text-foreground/80">{money.format(result.expectedInspectionCostCny)}</span></div>
            <div className="flex justify-between gap-3"><span>报关与品名附加</span><span className="font-medium tabular-nums text-foreground/80">{money.format(result.declarationSubtotalCny)}</span></div>
            <div className="flex justify-between gap-3"><span>本地操作费用</span><span className="font-medium tabular-nums text-foreground/80">{money.format(result.localOperationCostCny)}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  </ToolShell>
}
