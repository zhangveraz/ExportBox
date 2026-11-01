// 名称: 纸箱包装方案对比结果
// 描述: 展示成本、CBM、计费重排名和各方案明细（紧凑版）
// 路径: ExportBox/app/tools/packaging-plan-comparison/packaging-plan-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { BadgeCheck, Boxes, CircleDollarSign, Info, Scale } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PackagingComparisonResult, PackagingPlanResult } from '@/lib/tools/packaging-plan-comparison'
import { formatCbm, formatMoney, formatWeight } from './packaging-page-data'

export function PackagingPlanStats({ result }: { result: PackagingComparisonResult }) {
  const best = findPlan(result, result.bestCostPlanId)
  const lowestVolume = findPlan(result, result.lowestVolumePlanId)
  const lowestWeight = result.shippingMode === 'air' ? findPlan(result, result.lowestChargeableWeightPlanId) : [...result.plans].sort((a, b) => a.totalGrossWeightKg - b.totalGrossWeightKg)[0]
  const highestCost = Math.max(...result.plans.map((plan) => plan.totalLogisticsCostCny))
  const stats = [
    { label: '预计总成本最低', value: best.name, note: formatMoney(best.totalLogisticsCostCny), icon: BadgeCheck },
    { label: '总体积最低', value: lowestVolume.name, note: formatCbm(lowestVolume.totalCbm), icon: Boxes },
    { label: result.shippingMode === 'air' ? '计费重最低' : '总毛重最低', value: lowestWeight.name, note: formatWeight(result.shippingMode === 'air' ? lowestWeight.chargeableWeightKg : lowestWeight.totalGrossWeightKg), icon: Scale },
    { label: '最高可节省', value: formatMoney(highestCost - best.totalLogisticsCostCny), note: '相对当前最贵方案', icon: CircleDollarSign },
  ]
  return <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{stat.label}</p><p className="wrap-break-word text-[13px] leading-5 font-semibold">{stat.value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={stat.note}>{stat.note}</p></div></div> })}</div>
}

export function PackagingPlanResults({ result }: { result: PackagingComparisonResult }) {
  const lowestGrossPlanId = [...result.plans].sort((a, b) => a.totalGrossWeightKg - b.totalGrossWeightKg)[0].id
  return <div className="space-y-2">
    <div><h2 className="text-[13px] font-semibold">方案排名与明细</h2><p className="text-[10px] text-muted-foreground">{result.shippingMode === 'air' ? '空运按实重与体积重较大者计费' : '海运成本按总 CBM 估算'}</p></div>
    {[...result.plans].sort((a, b) => a.costRank - b.costRank).map((plan) => <PlanResult key={plan.id} plan={plan} mode={result.shippingMode} lowestGross={plan.id === lowestGrossPlanId} />)}
    <details className="rounded-lg border bg-muted/30 px-3 py-2">
      <summary className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-200"><Info className="h-3.5 w-3.5" />比较口径</summary>
      <div className="mt-1 space-y-0.5 text-[10px] leading-4 text-muted-foreground"><p>箱数按产品总件数除以每箱装量向上取整，尾箱未装满的件位显示为空余容量。</p><p>空运计费重取总毛重和总体积重的较大值；海运按总 CBM 乘以用户输入的每 CBM 单价。</p><p>预计总成本为运输成本与纸箱包装成本之和，不代表货代最终账单。</p></div>
    </details>
  </div>
}

function PlanResult({ plan, mode, lowestGross }: { plan: PackagingPlanResult; mode: PackagingComparisonResult['shippingMode']; lowestGross: boolean }) {
  return <div className="rounded-lg border bg-white px-2.5 py-2 dark:bg-slate-950/40">
    <div className="flex flex-wrap items-center justify-between gap-1.5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-semibold">{plan.name}</span>
          <Badge className="px-1.5 py-0 text-[10px]">成本第 {plan.costRank}</Badge>
          {plan.volumeRank === 1 && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">CBM 最低</Badge>}
          {mode === 'air' && plan.chargeableWeightRank === 1 && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">计费重最低</Badge>}
          {mode === 'ocean' && lowestGross && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">总毛重最低</Badge>}
        </div>
        <p className="text-[10px] text-muted-foreground">{plan.lengthCm} × {plan.widthCm} × {plan.heightCm} cm · 每箱 {plan.unitsPerCarton} 件</p>
      </div>
      <div className="text-right">
        <p className="text-[15px] leading-5 font-bold text-emerald-700 dark:text-cyan-200">{formatMoney(plan.totalLogisticsCostCny)}</p>
        <p className="text-[10px] text-muted-foreground">单件 {formatMoney(plan.costPerUnitCny)}</p>
      </div>
    </div>
    <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 border-t pt-1.5 sm:grid-cols-3">
      <Metric label="纸箱数量" value={`${plan.cartonCount} 箱`} />
      <Metric label="尾箱空余" value={`${plan.unusedCapacityUnits} 件位`} />
      <Metric label="总体积" value={formatCbm(plan.totalCbm)} />
      <Metric label="总毛重" value={formatWeight(plan.totalGrossWeightKg)} />
      {mode === 'air'
        ? <><Metric label="体积重" value={formatWeight(plan.totalVolumetricWeightKg)} /><Metric label="计费重" value={`${formatWeight(plan.chargeableWeightKg)}（${plan.billingBasis === 'actual' ? '实重' : '体积重'}）`} /></>
        : <><Metric label="单位体积装量" value={`${plan.unitsPerCbm.toLocaleString('zh-CN')} 件/CBM`} /><Metric label="装载密度" value={`${(plan.totalGrossWeightKg / plan.totalCbm).toLocaleString('zh-CN', { maximumFractionDigits: 2 })} kg/CBM`} /></>}
    </div>
    <div className="mt-1 grid grid-cols-2 gap-x-3 border-t pt-1 text-[10px] text-muted-foreground">
      <CostRow label="纸箱包装成本" value={plan.packagingCostCny} />
      <CostRow label="预估运输成本" value={plan.freightCostCny} />
    </div>
  </div>
}

function findPlan(result: PackagingComparisonResult, id: string) {
  return result.plans.find((plan) => plan.id === id) ?? result.plans[0]
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate text-[10px] text-muted-foreground">{label}</span><span className="shrink-0 text-[11px] font-medium tabular-nums">{value}</span></div>
}

function CostRow({ label, value }: { label: string; value: number }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate">{label}</span><span className="shrink-0 font-medium tabular-nums">{formatMoney(value)}</span></div>
}
