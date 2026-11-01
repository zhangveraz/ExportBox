// 名称: 外贸报价结果（紧凑版）
// 描述: 单屏布局下的结果区：核心单价、四项指标、成本结构与折叠说明
// 路径: ExportBox/app/tools/quote-calculator/quote-results.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import { ChevronDown, DollarSign, Info, Percent, ReceiptText, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { cn } from '@/lib/utils'
import type { QuoteMode, QuoteResult } from '@/lib/tools/quote-calculator'
import { formatCny, formatPercent, type QuoteCurrency } from './quote-page-data'

interface QuoteResultsProps {
  result: QuoteResult | null
  mode: QuoteMode
  currency: QuoteCurrency
  summaryText: string
  formatForeign: (value: number) => string
}

export function QuoteResults(props: QuoteResultsProps) {
  const result = props.result
  const rows = result?.costRows ?? []
  const included = rows.filter((row) => row.included && row.value > 0)
  const excluded = rows.filter((row) => !row.included && row.value > 0)
  const maxCost = Math.max(...rows.map((row) => Math.abs(row.value)), 1)

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3.5 py-2.5 dark:border-white/10">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
          <ReceiptText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          报价结果
        </h2>
        {result && (
          <EnhancedCopyButton text={props.summaryText} variant="outline" size="sm">
            复制
          </EnhancedCopyButton>
        )}
      </div>

      {result ? (
        <div className="px-3.5 py-3">
          {/* 核心单价 */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2.5 dark:border-emerald-400/20 dark:bg-emerald-400/10">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-200">
                {props.mode === 'target-margin' ? '建议报价单价' : '当前报价单价'}
              </span>
              <Badge variant="outline" className="border-0 bg-white text-[10px] text-emerald-700 shadow-xs dark:bg-white/10 dark:text-emerald-200">
                {props.currency}
              </Badge>
            </div>
            <div className="mt-0.5 text-[27px] leading-tight font-bold text-emerald-700 tabular-nums dark:text-emerald-300">
              {props.formatForeign(result.quotedUnitPriceForeign)}
            </div>
            <p className="mt-0.5 text-[11px] text-emerald-800/75 dark:text-emerald-200/70">
              盈亏平衡单价 {props.formatForeign(result.breakevenUnitPriceForeign)}
            </p>
          </div>

          {/* 四项指标 */}
          <div className="mt-2.5 grid grid-cols-2 gap-2 2xl:grid-cols-4">
            <MiniStat label="销售利润率" value={formatPercent(result.marginPercent)} icon={Percent} tone={result.marginPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} />
            <MiniStat label="预估利润" value={formatCny(result.profitCny)} icon={TrendingUp} tone={result.profitCny >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} />
            <MiniStat label="订单总额" value={props.formatForeign(result.totalQuoteForeign)} icon={DollarSign} />
            <MiniStat label="加价率" value={formatPercent(result.markupPercent)} icon={Percent} />
          </div>

          {/* 成本结构 */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                卖方计入成本
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{result.quoteTerm} 口径</span>
            </div>
            <div className="mt-1.5 space-y-1.5">
              {included.map((row) => (
                <CostBar key={row.key} label={row.label} value={row.value} maxCost={maxCost} />
              ))}
              {result.rebateAmountCny > 0 && (
                <CostBar label="退税抵扣" value={result.rebateAmountCny} maxCost={maxCost} rebate />
              )}
            </div>
          </div>

          {/* 折叠区：默认收起，需要时再展开 */}
          <details className="group mt-3 rounded-lg border border-dashed border-slate-200 px-2.5 py-1.5 dark:border-white/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <span>未计入报价的后续费用</span>
              <span className="flex items-center gap-1.5">
                <span className="font-semibold tabular-nums">{formatCny(result.excludedCostCny)}</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </span>
            </summary>
            <div className="mt-1.5 space-y-1 border-t border-slate-100 pt-1.5 dark:border-white/10">
              {excluded.length ? (
                excluded.map((row) => (
                  <div key={row.key} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                    <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">{formatCny(row.value)}</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">当前输入中没有由买方承担的费用。</p>
              )}
            </div>
          </details>

          <details className="group mt-1.5 rounded-lg border border-dashed border-slate-200 px-2.5 py-1.5 dark:border-white/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                报价口径提示
              </span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="mt-1.5 space-y-1 border-t border-slate-100 pt-1.5 text-[11px] leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
              <li>• 销售利润率 = 利润 ÷ 销售额，用来控制毛利底线。</li>
              <li>• 退税按含税采购价、增值税率与退税率估算，实际以财务口径为准。</li>
              <li>• CFR/CIF/DDP 等含运输或到门条款，需先确认货代、保险与税费报价。</li>
            </ul>
          </details>
        </div>
      ) : (
        <div className="px-3.5 py-10 text-center text-xs text-slate-400 dark:text-slate-500">
          调整左侧参数后即可查看报价测算结果
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Percent; tone?: string }) {
  return (
    <div className="rounded-md border border-slate-200 px-2 py-1.5 dark:border-white/10">
      <p className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className={cn('mt-0.5 truncate text-[13px] font-semibold tabular-nums text-slate-900 dark:text-white', tone)}>{value}</p>
    </div>
  )
}

function CostBar({ label, value, maxCost, rebate = false }: { label: string; value: number; maxCost: number; rebate?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="truncate text-slate-500 dark:text-slate-400">{label}</span>
        <span className={cn('shrink-0 font-medium tabular-nums text-slate-700 dark:text-slate-200', rebate && 'text-emerald-600 dark:text-emerald-400')}>
          {rebate && '-'}
          {formatCny(value)}
        </span>
      </div>
      <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div
          className={cn('h-full rounded-full', rebate ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-500')}
          style={{ width: `${Math.max(3, Math.min(100, (Math.abs(value) / maxCost) * 100))}%` }}
        />
      </div>
    </div>
  )
}
