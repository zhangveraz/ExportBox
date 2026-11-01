// 名称: 外贸订单保本销量结果
// 描述: 展示保本销量、目标销量、计划利润与单件贡献明细（紧凑版）
// 路径: ExportBox/app/tools/order-break-even-calculator/order-break-even-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { CircleDollarSign, Gauge, Info, ShieldCheck, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { OrderBreakEvenResult } from '@/lib/tools/order-break-even-calculator'
import { formatMoney, formatPercent, formatQuantity } from './order-break-even-page-data'

export function OrderBreakEvenStats({ result }: { result: OrderBreakEvenResult }) {
  const stats = [
    { label: '保本销量', value: formatQuantity(result.breakEvenQuantity), note: `销售额 ${formatMoney(result.breakEvenSalesAmount, result.currency)}`, icon: ShieldCheck },
    { label: '目标利润销量', value: formatQuantity(result.targetProfitQuantity), note: `目标 ${formatMoney(result.targetProfit, result.currency)}`, icon: Target },
    { label: '计划订单利润', value: formatMoney(result.plannedProfit, result.currency), note: `利润率 ${formatPercent(result.plannedMarginPercent)}`, icon: CircleDollarSign },
    { label: '销量安全余量', value: formatQuantity(result.marginOfSafetyUnits), note: `相对计划销量 ${formatPercent(result.marginOfSafetyPercent)}`, icon: Gauge },
  ]
  return <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{stat.label}</p><p className="wrap-break-word text-[13px] leading-5 font-semibold">{stat.value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={stat.note}>{stat.note}</p></div></div> })}</div>
}

export function OrderBreakEvenResults({ result }: { result: OrderBreakEvenResult }) {
  const status = getStatus(result)
  const targetProgress = Math.min(100, result.targetProfitQuantity === 0 ? 100 : result.plannedQuantity / result.targetProfitQuantity * 100)
  return <div className="space-y-2">
    <div className="rounded-lg border bg-white px-2.5 py-2 dark:bg-slate-950/40">
      <div className="flex items-center justify-between gap-2"><div className="flex min-w-0 items-baseline gap-1.5"><h2 className="text-[13px] font-semibold">计划订单判断</h2><span className="truncate text-[10px] text-muted-foreground">{formatQuantity(result.plannedQuantity)} 件</span></div><Badge variant={status.variant} className="px-1.5 py-0 text-[10px]">{status.label}</Badge></div>
      <div className="mt-1.5"><div className="flex items-center justify-between gap-3 text-[11px]"><span className="text-muted-foreground">目标销量进度</span><span className="font-semibold tabular-nums">{formatPercent(targetProgress)}</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/8"><div className="h-full rounded-full bg-emerald-600 transition-[width] dark:bg-cyan-400" style={{ width: `${targetProgress}%` }} /></div><p className="mt-1 text-[10px] text-muted-foreground">{result.quantityGapToTarget > 0 ? `距离目标利润还需 ${formatQuantity(result.quantityGapToTarget)}` : '当前计划销量已覆盖目标利润'}</p></div>
    </div>

    <div className="rounded-lg border bg-white px-2.5 py-2 dark:bg-slate-950/40">
      <h2 className="text-[12px] font-semibold">单件贡献</h2>
      <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 sm:grid-cols-3">
        <Metric label="销售单价" value={formatMoney(result.unitSellingPrice, result.currency)} />
        <Metric label="佣金、收款与损耗" value={formatMoney(result.variableFeePerUnit, result.currency)} />
        <Metric label="扣费后净收入" value={formatMoney(result.netRevenuePerUnit, result.currency)} />
        <Metric label="单件变动成本" value={formatMoney(result.unitVariableCost, result.currency)} />
        <Metric label="单件贡献毛利" value={formatMoney(result.contributionPerUnit, result.currency)} />
        <Metric label="贡献毛利率" value={formatPercent(result.contributionMarginPercent)} />
      </div>
    </div>

    <div className="grid gap-2 sm:grid-cols-2">
      <div className="rounded-lg border bg-white px-2.5 py-2 dark:bg-slate-950/40">
        <h2 className="text-[12px] font-semibold">销量与单价阈值</h2>
        <div className="mt-1 divide-y divide-border/60">
          <ResultRow label="保本销量" value={formatQuantity(result.breakEvenQuantity)} />
          <ResultRow label="目标利润销量" value={formatQuantity(result.targetProfitQuantity)} />
          <ResultRow label="计划销量下保本单价" value={formatMoney(result.breakEvenUnitPriceAtPlan, result.currency)} />
          <ResultRow label="计划销量下目标利润单价" value={formatMoney(result.targetUnitPriceAtPlan, result.currency)} />
        </div>
      </div>
      <div className="rounded-lg border bg-white px-2.5 py-2 dark:bg-slate-950/40">
        <h2 className="text-[12px] font-semibold">计划订单汇总</h2>
        <div className="mt-1 divide-y divide-border/60">
          <ResultRow label="销售收入" value={formatMoney(result.plannedRevenue, result.currency)} />
          <ResultRow label="按销售额计提费用" value={formatMoney(result.plannedVariableFees, result.currency)} />
          <ResultRow label="变动成本" value={formatMoney(result.plannedVariableCost, result.currency)} />
          <ResultRow label="固定成本" value={formatMoney(result.fixedOrderCost, result.currency)} />
          <ResultRow label="计划利润" value={formatMoney(result.plannedProfit, result.currency)} strong />
        </div>
      </div>
    </div>

    <details className="rounded-lg border bg-muted/30 px-2.5 py-1.5"><summary className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground"><Info className="h-3.5 w-3.5" />计算边界与假设</summary><div className="mt-1 space-y-0.5 text-[10px] leading-4 text-muted-foreground"><p>保本和目标销量均按完整件数向上取整，实际订单利润按输入的计划销量计算。</p><p>售后损耗预留按销售额计提，用于粗略覆盖折让、索赔或退款；确定订单后应以合同和历史数据复核。</p><p>结果不含未录入的税费、汇率波动与资金占用成本，也不替代正式财务预算。</p></div></details>
  </div>
}

function getStatus(result: OrderBreakEvenResult): { label: string; variant: 'default' | 'secondary' | 'destructive' } {
  if (result.status === 'target-achieved') return { label: '目标利润已覆盖', variant: 'default' }
  if (result.status === 'profitable') return { label: '已保本，未达目标', variant: 'secondary' }
  return { label: '尚未保本', variant: 'destructive' }
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate text-[10px] text-muted-foreground">{label}</span><span className="shrink-0 text-[11px] font-medium tabular-nums">{value}</span></div>
}

function ResultRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex items-center justify-between gap-2 py-0.5"><span className="truncate text-[11px] text-muted-foreground">{label}</span><span className={`${strong ? 'font-bold text-foreground' : 'font-medium'} shrink-0 text-[12px] tabular-nums`}>{value}</span></div>
}
