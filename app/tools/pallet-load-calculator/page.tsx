// 名称: 托盘装载计算器
// 描述: 按纸箱、托盘规格及高度载重限制，估算每层箱数、码放层数和所需托盘数量
// 路径: ExportBox/app/tools/pallet-load-calculator/page.tsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Boxes, Info, Layers3, RotateCcw, Weight } from 'lucide-react'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { ToolShell } from '@/components/tools/tool-shell'
import { calculatePalletLoad, DEFAULT_PALLET_LOAD_INPUTS, PALLET_SPECS, PalletLoadInputs, PalletType } from '@/lib/tools/pallet-load-calculator'
import { ScenarioPresets, type ScenarioPreset } from '@/components/tools/scenario-presets'

type NumericField = Exclude<keyof PalletLoadInputs, 'palletType'>
type FormState = Record<NumericField, string> & { palletType: PalletType }
const initialForm = Object.fromEntries(Object.entries(DEFAULT_PALLET_LOAD_INPUTS).map(([key, value]) => [key, String(value)])) as unknown as FormState
initialForm.palletType = DEFAULT_PALLET_LOAD_INPUTS.palletType
const number = (value: string) => Number.isFinite(Number.parseFloat(value)) ? Number.parseFloat(value) : 0
const fields: Array<{ field: NumericField; label: string; suffix: string }> = [
  { field: 'cartonLengthCm', label: '纸箱长', suffix: 'cm' }, { field: 'cartonWidthCm', label: '纸箱宽', suffix: 'cm' },
  { field: 'cartonHeightCm', label: '纸箱高', suffix: 'cm' }, { field: 'cartonWeightKg', label: '单箱毛重', suffix: 'kg' },
  { field: 'cartonQuantity', label: '货物总箱数', suffix: '箱' }, { field: 'maxLoadedHeightCm', label: '最大含托高度', suffix: 'cm' },
  { field: 'maxGrossWeightKg', label: '单托限重', suffix: 'kg' },
]
const PALLET_PRESETS: Array<ScenarioPreset<Partial<FormState>>> = [
  { label: '国内/海运托', description: '120×100 cm 中国标准托盘，常用含托高度和载重预算', values: { palletType: 'china', maxLoadedHeightCm: '180', maxGrossWeightKg: '1000' } },
  { label: '欧洲 EUR 托', description: '120×80 cm 欧标托盘，适合欧洲仓库和客户收货要求初算', values: { palletType: 'euro', maxLoadedHeightCm: '180', maxGrossWeightKg: '1000' } },
  { label: '北美 48×40', description: '北美常用 48×40 inch 托盘规格', values: { palletType: 'north-america', maxLoadedHeightCm: '180', maxGrossWeightKg: '1000' } },
  { label: '空运低托', description: '按较低含托高度和较轻载重预估，最终以航空公司或货代限制为准', values: { palletType: 'china', maxLoadedHeightCm: '160', maxGrossWeightKg: '700' } },
]

export default function PalletLoadCalculatorPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const inputs = useMemo(() => Object.fromEntries(Object.entries(form).map(([key, value]) => [key, key === 'palletType' ? value : number(value)])) as unknown as PalletLoadInputs, [form])
  const result = useMemo(() => calculatePalletLoad(inputs), [inputs])
  const noFit = result.cartonsPerPallet === 0
  const getSummaryText = () => ['托盘装载测算', `纸箱：${form.cartonLengthCm} × ${form.cartonWidthCm} × ${form.cartonHeightCm} cm，${form.cartonWeightKg} kg/箱`, `货物总数：${form.cartonQuantity} 箱`, `托盘：${result.pallet.name}`, `限制：含托高 ${form.maxLoadedHeightCm} cm，单托毛重 ${form.maxGrossWeightKg} kg`, `单层：${result.bestOrientation.cartonsPerLayer} 箱`, `层数：${result.maxLayers} 层`, `单托：${result.cartonsPerPallet} 箱`, `预计托盘数：${result.requiredPallets} 托（末托 ${result.lastPalletCartons} 箱）`, `单托毛重：${result.grossWeightKg} kg`, `含托高度：${result.loadedHeightCm} cm`, `限制因素：${result.limitingFactor === 'weight' ? '载重' : '尺寸/高度'}`].join('\n')
  const cards = [
    { label: '单层箱数', value: `${result.bestOrientation.cartonsPerLayer} 箱`, caption: `${result.bestOrientation.countLength} x ${result.bestOrientation.countWidth}`, icon: Boxes },
    { label: '单托箱数', value: `${result.cartonsPerPallet} 箱`, caption: `${result.maxLayers} 层`, icon: Layers3 },
    { label: '预计托盘数', value: `${result.requiredPallets} 托`, caption: `末托 ${result.lastPalletCartons} 箱`, icon: Boxes },
    { label: '单托毛重', value: `${result.grossWeightKg} kg`, caption: `含托盘自重 ${result.pallet.tareWeightKg} kg`, icon: Weight },
  ]
  return <ToolShell title="托盘装载计算器" description="按纸箱、托盘规格及高度载重限制，估算每层箱数、码放层数和所需托盘数量。">

    <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{cards.map(({ label, value, caption, icon: Icon }) => <div key={label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{label}</p><p className="wrap-break-word text-[13px] leading-5 font-semibold tabular-nums">{value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={caption}>{caption}</p></div></div>)}</div>

    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
      <Card className="gap-0 py-0">
        <CardHeader className="px-3 pt-3 pb-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">装载参数</CardTitle>
              <p className="text-[10px] text-muted-foreground">高度包含托盘本体，限重包含托盘自重</p>
            </div>
            <Button size="sm" variant="outline" className="h-7 shrink-0 px-2 text-[11px]" onClick={() => setForm(initialForm)}>
              <RotateCcw className="mr-1 h-3 w-3" />重置
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 px-3 pt-0 pb-3">
          <div className="space-y-1">
            <Label htmlFor="palletType" className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">托盘规格</Label>
            <Select value={form.palletType} onValueChange={(value) => setForm(current => ({ ...current, palletType: value as PalletType }))}>
              <SelectTrigger id="palletType" className="h-8 text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.values(PALLET_SPECS).map(pallet => <SelectItem key={pallet.type} value={pallet.type}>{pallet.name} · {pallet.lengthCm} x {pallet.widthCm} cm</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <ScenarioPresets presets={PALLET_PRESETS} onSelect={(values) => setForm((current) => ({ ...current, ...values }))} />
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 md:grid-cols-3">{fields.map(({ field, label, suffix }) => <div key={field} className="space-y-1"><Label htmlFor={field} className="text-[11px] leading-4 text-slate-600 dark:text-slate-300">{label}</Label><div className="relative"><Input id={field} type="text" inputMode="decimal" value={form[field]} onChange={event => setForm(current => ({ ...current, [field]: event.target.value }))} className="h-8 pr-12 text-[13px] tabular-nums" /><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span></div></div>)}</div>
          <Alert className="px-2.5 py-1.5"><Info className="h-3.5 w-3.5" /><AlertDescription className="text-[10px] leading-4">结果按同一朝向规则码放，未考虑交错码放、纸箱承压、托盘外沿、绑带和仓库安全间距。实际出货前请复核包装强度与承运方限制。</AlertDescription></Alert>
          <EnhancedCopyButton text={getSummaryText()} variant="outline" size="sm" className="h-7 px-2 text-[11px]">复制装载摘要</EnhancedCopyButton>
        </CardContent>
      </Card>
      <div className="space-y-2.5">
        <Card className="gap-0 py-0">
          <CardHeader className="px-3 pt-2.5 pb-1">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-[12px] font-semibold">装载结果</CardTitle>
              <Badge variant={noFit || result.limitingFactor === 'weight' ? 'destructive' : 'secondary'} className="px-1.5 py-0 text-[10px]">{noFit ? '无法装入' : result.limitingFactor === 'weight' ? '载重限制' : '尺寸/高度限制'}</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-3 pt-0 pb-2.5">
            {[
              ['最佳箱底朝向', `${result.bestOrientation.lengthCm} x ${result.bestOrientation.widthCm} cm`], ['按尺寸可装', `${result.maxByDimensions} 箱/托`], ['按载重可装', `${result.maxByWeight} 箱/托`], ['含托装载高度', `${result.loadedHeightCm} cm`], ['空间利用率', `${result.volumeUtilizationPercent}%`],
            ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3 border-b py-1 text-[11px] last:border-0"><span className="text-muted-foreground">{label}</span><span className="font-medium tabular-nums">{value}</span></div>)}
          </CardContent>
        </Card>
        <details className="rounded-lg border bg-muted/30 px-3 py-2">
          <summary className="cursor-pointer text-[12px] font-medium text-slate-700 dark:text-slate-200">托盘规格速查</summary>
          <div className="mt-1.5 space-y-1">{Object.values(PALLET_SPECS).map(pallet => <div key={pallet.type} className="flex items-baseline justify-between gap-2 text-[11px]"><span className="font-medium">{pallet.name}</span><span className="text-muted-foreground">{pallet.lengthCm} x {pallet.widthCm} x {pallet.baseHeightCm} cm · 自重 {pallet.tareWeightKg} kg</span></div>)}</div>
        </details>
      </div>
    </div>
  </ToolShell>
}
