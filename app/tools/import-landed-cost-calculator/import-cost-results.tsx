// 名称: 进口成本结果（紧凑版）
// 描述: 单屏布局下的结果区：到岸成本看板、成本拆分与销售口径
// 路径: ExportBox/app/tools/import-landed-cost-calculator/import-cost-results.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import type { ComponentType } from 'react'
import { Calculator, ChevronDown, DollarSign, Package, Percent, ReceiptText, TrendingUp, Truck, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ImportCurrency, ImportLandedCostResult } from '@/lib/tools/import-landed-cost-calculator'
import { formatCny, formatNumber, formatPercent } from './import-cost-page-data'

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export function ImportCostStats({ result }: { result: ImportLandedCostResult }) {
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }>; tone?: string }> = [
    { label: '到岸总成本', value: formatCny(result.totalLandedCostCny), caption: 'CIF + 税费 + 本地费用', icon: Wallet },
    { label: '每件到岸成本', value: formatCny(result.unitLandedCostCny), caption: `${result.quantity} 件平均分摊`, icon: Package },
    { label: '税费合计', value: formatCny(result.totalTaxCny), caption: `关税 ${formatCny(result.dutyCny)} · 增值税 ${formatCny(result.vatCny)}`, icon: ReceiptText },
    { label: '销售毛利率', value: formatPercent(result.grossMarginPercent), caption: `预估毛利 ${formatCny(result.grossProfitCny)}`, icon: TrendingUp, tone: result.grossProfitCny >= 0 ? 'text-emerald-600' : 'text-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 dark:border-white/10 dark:bg-slate-950/60">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Icon className="h-3 w-3" />
              {card.label}
            </div>
            <div className={cn('mt-0.5 truncate text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white', card.tone)}>{card.value}</div>
            <p className="truncate text-[10px] text-slate-400 dark:text-slate-500" title={card.caption}>{card.caption}</p>
          </div>
        )
      })}
    </div>
  )
}

export function ImportCostResults({ result, currency }: { result: ImportLandedCostResult; currency: ImportCurrency }) {
  const maxCost = Math.max(...result.costBreakdown.map((row) => row.value), 1)

  return (
    <div className="space-y-3">
      <div className={panelClass}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">成本拆分</h2>
          <Badge variant="secondary">{currency}</Badge>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
          CIF {formatCny(result.cifCny)} · 本地费用 {formatCny(result.localCostCny)}
        </p>

        <div className="mt-2 space-y-1.5">
          {result.costBreakdown.map((row) => (
            <div key={row.key}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {row.label}
                  <span className="ml-1 text-[10px] text-slate-400">{formatPercent(row.sharePercent)}</span>
                </span>
                <span className="font-medium tabular-nums text-slate-900 dark:text-white">{formatCny(row.value)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div
                  className={cn('h-full rounded-full', row.key === 'goods' ? 'bg-emerald-500' : row.key === 'vat' ? 'bg-amber-500' : 'bg-slate-400')}
                  style={{ width: `${Math.max(3, Math.min(100, (row.value / maxCost) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <span className="text-xs font-medium text-emerald-800 dark:text-cyan-100">到岸总成本</span>
          <span className="text-[20px] font-bold tabular-nums text-emerald-900 dark:text-white">{formatCny(result.totalLandedCostCny)}</span>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          <ResultRow label="CIF 折算" value={formatCny(result.cifCny)} icon={DollarSign} />
          <ResultRow label="增值税计税基数" value={formatCny(result.vatBaseCny)} icon={ReceiptText} />
          <ResultRow label="清关本地费用" value={formatCny(result.localCostCny)} icon={Truck} />
          <ResultRow label="每件到岸成本" value={formatCny(result.unitLandedCostCny)} icon={Package} />
          <ResultRow label="销售加价率" value={formatPercent(result.markupPercent)} icon={Percent} />
          <ResultRow label="销售收入" value={formatCny(result.salesRevenueCny)} icon={Wallet} />
        </div>
      </div>

      <details className="group rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950/60">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
          到岸口径提示（进口数量 {formatNumber(result.quantity, 0)} 件）
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          <li>关税按 CIF 完税价格计征，增值税按「CIF + 关税 + 消费税」为基数。</li>
          <li>进口增值税通常可作为进项抵扣，测算时建议在现金流表单独列示。</li>
          <li>本地清关、港杂与国内运输按人民币录入，不含仓储和二次分拨费用。</li>
        </ul>
      </details>
    </div>
  )
}

function ResultRow({ label, value, icon: Icon }: { label: string; value: string; icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs dark:bg-white/5">
      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="text-right font-medium tabular-nums text-slate-900 dark:text-white">{value}</span>
    </div>
  )
}
