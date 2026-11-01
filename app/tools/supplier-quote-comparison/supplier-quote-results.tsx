// 名称: 供应商报价对比结果
// 描述: 展示现金成本、交期、首付排名与标准化采购明细（紧凑版）
// 路径: ExportBox/app/tools/supplier-quote-comparison/supplier-quote-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { BadgeCheck, Clock3, Info, TrendingDown, WalletCards } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { SupplierQuoteComparisonResult, SupplierQuoteResult } from '@/lib/tools/supplier-quote-comparison'
import { formatMoney, formatPercent, formatQuantity } from './supplier-quote-page-data'

export function SupplierQuoteStats({ result }: { result: SupplierQuoteComparisonResult }) {
  const best = findSupplier(result, result.bestCostSupplierId)
  const fastest = findSupplier(result, result.fastestSupplierId)
  const lowestDeposit = findSupplier(result, result.lowestDepositSupplierId)
  const stats = [
    { label: '现金总成本最低', value: best.name, note: formatMoney(best.totalAcquisitionCost, result.currency), icon: BadgeCheck },
    { label: '交期最快', value: fastest.name, note: `${fastest.leadTimeDays} 天`, icon: Clock3 },
    { label: '首付占用最低', value: lowestDeposit.name, note: formatMoney(lowestDeposit.depositAmount, result.currency), icon: WalletCards },
    { label: '最高可节省', value: formatMoney(result.costSpread, result.currency), note: `最低成本的 ${formatPercent(result.costSpreadPercent)}`, icon: TrendingDown },
  ]
  return <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{stat.label}</p><p className="wrap-break-word text-[13px] leading-5 font-semibold">{stat.value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={stat.note}>{stat.note}</p></div></div> })}</div>
}

export function SupplierQuoteResults({ result }: { result: SupplierQuoteComparisonResult }) {
  return <div className="space-y-2">
    <div><h2 className="text-[13px] font-semibold">供应商排名与明细</h2><p className="text-[10px] text-muted-foreground">按满足 {formatQuantity(result.requiredGoodUnits)} 计划合格品后的现金采购成本排序。</p></div>
    {[...result.suppliers].sort((a, b) => a.costRank - b.costRank).map((supplier) => <SupplierResult key={supplier.id} supplier={supplier} result={result} />)}
    <details className="rounded-lg border bg-muted/30 px-2.5 py-1.5"><summary className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground"><Info className="h-3.5 w-3.5" />比较口径与假设</summary><div className="mt-1 space-y-0.5 text-[10px] leading-4 text-muted-foreground"><p>采购数量先按次品预留率反推，再与 MOQ 取较大值；合格品和剩余数量均为期望值，不是质量承诺。</p><p>含税报价拆出 VAT，未税报价加计 VAT，排名按含税货款、固定费用和国内运费的现金合计计算。</p><p>VAT 不自动抵扣或计入出口退税。成本排名也不代表质量、履约能力和供应风险的综合排名。</p></div></details>
  </div>
}

function SupplierResult({ supplier, result }: { supplier: SupplierQuoteResult; result: SupplierQuoteComparisonResult }) {
  const isFastest = supplier.id === result.fastestSupplierId
  const isLowestDeposit = supplier.id === result.lowestDepositSupplierId
  return <div className="rounded-lg border bg-white px-2.5 py-2 dark:bg-slate-950/40">
    <div className="flex flex-wrap items-center justify-between gap-1.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <p className="wrap-break-word text-[13px] font-semibold">{supplier.name}</p>
        <Badge className="px-1.5 py-0 text-[10px]">成本第 {supplier.costRank}</Badge>
        {isFastest && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">交期最快</Badge>}
        {isLowestDeposit && <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">首付最低</Badge>}
        {supplier.moqConstrained && <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">MOQ 抬量</Badge>}
      </div>
      <p className="shrink-0 text-[10px] text-muted-foreground">{supplier.taxMode === 'tax-inclusive' ? '含税' : '未税'} {formatMoney(supplier.quotedUnitPrice, result.currency)}/件 · VAT {formatPercent(supplier.vatRatePercent)}</p>
    </div>
    <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="text-lg leading-6 font-bold text-emerald-700 dark:text-cyan-200">{formatMoney(supplier.totalAcquisitionCost, result.currency)}</span>
      <span className="text-[10px] text-muted-foreground">摊销 {formatMoney(supplier.costPerRequiredUnit, result.currency)}/件{supplier.costDifferenceFromBest > 0 ? ` · 比最低方案高 ${formatMoney(supplier.costDifferenceFromBest, result.currency)}` : ' · 当前最低成本'}</span>
    </div>
    <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 border-t pt-1.5 sm:grid-cols-4">
      <Metric label="实际采购数量" value={formatQuantity(supplier.purchaseQuantity)} />
      <Metric label="预期合格品" value={formatQuantity(supplier.expectedGoodUnits)} />
      <Metric label="剩余合格品" value={formatQuantity(supplier.surplusGoodUnits)} />
      <Metric label="含税现金单价" value={formatMoney(supplier.cashUnitPrice, result.currency)} />
      <Metric label="货款首付" value={formatMoney(supplier.depositAmount, result.currency)} />
      <Metric label="剩余货款" value={formatMoney(supplier.goodsBalanceAmount, result.currency)} />
      <Metric label="交期" value={`${supplier.leadTimeDays} 天`} />
      <Metric label="合格品成本/件" value={formatMoney(supplier.costPerExpectedGoodUnit, result.currency)} />
    </div>
    <div className="mt-1 grid grid-cols-2 gap-x-3 border-t pt-1 text-[10px] text-muted-foreground sm:grid-cols-4">
      <CostRow label="未税货款" value={supplier.preTaxGoodsAmount} currency={result.currency} />
      <CostRow label="VAT 税额" value={supplier.vatAmount} currency={result.currency} />
      <CostRow label="固定费用" value={supplier.fixedFee} currency={result.currency} />
      <CostRow label="国内运费" value={supplier.domesticFreight} currency={result.currency} />
    </div>
  </div>
}

function findSupplier(result: SupplierQuoteComparisonResult, id: string) {
  return result.suppliers.find((supplier) => supplier.id === id) ?? result.suppliers[0]
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate text-[10px] text-muted-foreground">{label}</span><span className="shrink-0 text-[11px] font-medium tabular-nums">{value}</span></div>
}

function CostRow({ label, value, currency }: { label: string; value: number; currency: SupplierQuoteComparisonResult['currency'] }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate">{label}</span><span className="shrink-0 font-medium tabular-nums">{formatMoney(value, currency)}</span></div>
}
