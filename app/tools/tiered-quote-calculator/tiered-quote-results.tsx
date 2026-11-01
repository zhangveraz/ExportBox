// 名称: 外贸阶梯报价结果
// 描述: 展示最低单价、固定费摊薄和各数量档位利润明细（紧凑版）
// 路径: ExportBox/app/tools/tiered-quote-calculator/tiered-quote-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { BadgePercent, CircleDollarSign, Info, Layers3, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { TieredQuoteResult, TieredQuoteTierResult } from '@/lib/tools/tiered-quote-calculator'
import { formatCny, formatForeign, formatPercent } from './tiered-quote-page-data'

export function TieredQuoteStats({ result }: { result: TieredQuoteResult }) {
  const best = findTier(result, result.lowestUnitPriceTierId)
  const base = findTier(result, result.baseTierId)
  const largest = findTier(result, result.largestTierId)
  const stats = [
    { label: '最低建议单价', value: formatForeign(best.quotedUnitPriceForeign, result.currency), note: `${best.label} · ${best.quantity.toLocaleString('zh-CN')} 件`, icon: CircleDollarSign },
    { label: '最大单价降幅', value: formatPercent(result.maximumPriceReductionPercent), note: `相对 ${base.label}`, icon: TrendingDown },
    { label: '固定费单件摊薄', value: formatCny(result.fixedCostDilutionCnyPerUnit), note: `${base.quantity.toLocaleString('zh-CN')} → ${largest.quantity.toLocaleString('zh-CN')} 件`, icon: Layers3 },
    { label: '目标利润率', value: formatPercent(result.targetMarginPercent), note: `佣金及收款费 ${formatPercent(result.commissionPercent + result.paymentFeePercent)}`, icon: BadgePercent },
  ]
  return <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{stat.label}</p><p className="wrap-break-word text-[13px] leading-5 font-semibold">{stat.value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={stat.note}>{stat.note}</p></div></div> })}</div>
}

export function TieredQuoteResults({ result }: { result: TieredQuoteResult }) {
  return <div className="space-y-2"><div><h2 className="text-[13px] font-semibold">阶梯报价结果</h2><p className="text-[10px] text-muted-foreground">按订购数量从低到高排列，单价已应用向上取整步长。</p></div>{[...result.tiers].sort((a, b) => a.quantity - b.quantity).map((tier) => <TierResult key={tier.id} tier={tier} result={result} />)}<details className="rounded-lg border bg-muted/30 px-2.5 py-1.5"><summary className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground"><Info className="h-3.5 w-3.5" />计算口径与假设</summary><div className="mt-1 space-y-0.5 text-[10px] leading-4 text-muted-foreground"><p>建议价先覆盖采购成本与每单固定费用，再预留佣金、收款费和目标销售利润率。</p><p>报价按设定步长向上取整，因此实际利润率可能略高于目标值；设为 0 可保留未取整建议价。</p><p>阶梯降价来自固定费用摊薄与录入的采购成本变化，不代表供应商承诺或最终成交折扣。</p></div></details></div>
}

function TierResult({ tier, result }: { tier: TieredQuoteTierResult; result: TieredQuoteResult }) {
  const isBase = tier.id === result.baseTierId
  const isLowest = tier.id === result.lowestUnitPriceTierId
  return <div className="rounded-lg border bg-white px-2.5 py-2 dark:bg-slate-950/40">
    <div className="flex flex-wrap items-center justify-between gap-1.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <p className="wrap-break-word text-[13px] font-semibold">{tier.label}</p>
        {isBase && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">最小数量</Badge>}
        {isLowest && <Badge className="px-1.5 py-0 text-[10px]">单价最低</Badge>}
      </div>
      <p className="shrink-0 text-[10px] text-muted-foreground">{tier.quantity.toLocaleString('zh-CN')} 件 · 采购 {formatCny(tier.unitCostCny)}</p>
    </div>
    <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="text-lg leading-6 font-bold text-emerald-700 dark:text-cyan-200">{formatForeign(tier.quotedUnitPriceForeign, result.currency)}</span>
      <span className="text-[10px] text-muted-foreground">总额 {formatForeign(tier.totalQuoteForeign, result.currency)} · 较最小数量降价 {formatPercent(tier.priceReductionVsBasePercent)}</span>
    </div>
    <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 border-t pt-1.5 sm:grid-cols-3">
      <Metric label="盈亏平衡单价" value={formatForeign(tier.breakEvenUnitPriceForeign, result.currency)} />
      <Metric label="实际利润率" value={formatPercent(tier.marginPercent)} />
      <Metric label="单件成本含固定费" value={formatCny(tier.allocatedCostPerUnitCny)} />
      <Metric label="固定费摊销/件" value={formatCny(tier.fixedCostPerUnitCny)} />
      <Metric label="预估订单利润" value={formatCny(tier.profitCny)} />
      <Metric label="采购成本节省" value={formatCny(tier.purchaseSavingVsBaseCny)} />
    </div>
    <div className="mt-1 grid grid-cols-3 gap-x-3 border-t pt-1 text-[10px] text-muted-foreground">
      <CostRow label="产品采购" value={tier.productCostCny} />
      <CostRow label="固定费用" value={result.fixedOrderCostCny} />
      <CostRow label="佣金收款费" value={tier.variableFeeCny} />
    </div>
  </div>
}

function findTier(result: TieredQuoteResult, id: string) {
  return result.tiers.find((tier) => tier.id === id) ?? result.tiers[0]
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate text-[10px] text-muted-foreground">{label}</span><span className="shrink-0 text-[11px] font-medium tabular-nums">{value}</span></div>
}

function CostRow({ label, value }: { label: string; value: number }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate">{label}</span><span className="shrink-0 font-medium tabular-nums">{formatCny(value)}</span></div>
}
