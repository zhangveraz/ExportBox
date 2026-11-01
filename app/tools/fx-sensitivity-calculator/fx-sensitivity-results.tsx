// 名称: 外贸汇率敏感性分析结果
// 描述: 展示盈亏平衡汇率、利润波动范围与三个汇率情景（紧凑版）
// 路径: ExportBox/app/tools/fx-sensitivity-calculator/fx-sensitivity-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { BadgeCheck, CircleDollarSign, Info, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { FxScenarioResult, FxSensitivityResult } from '@/lib/tools/fx-sensitivity-calculator'
import { formatMoney, formatPercent, formatRate, formatRateUnit } from './fx-sensitivity-page-data'

export function FxSensitivityStats({ result }: { result: FxSensitivityResult }) {
  const base = result.results.find((scenario) => scenario.id === 'base') ?? result.results[0]
  const best = result.results.find((scenario) => scenario.id === result.bestScenarioId) ?? result.results[0]
  const stats = [
    { label: '基准实际利润', value: formatMoney(base.profitCny), note: formatPercent(base.marginPercent), icon: CircleDollarSign, tone: base.profitCny >= 0 ? 'text-emerald-600' : 'text-red-600' },
    { label: '盈亏平衡汇率', value: formatRate(result.breakEvenRate), note: formatRateUnit(result.currency, result.rateUnit), icon: BadgeCheck, tone: 'text-sky-700' },
    { label: '最佳情景', value: best.label, note: `${formatMoney(best.profitCny)} 实际利润`, icon: TrendingUp, tone: 'text-emerald-600' },
    { label: '利润波动范围', value: formatMoney(result.profitRangeCny), note: '升值到贬值情景', icon: TrendingDown, tone: 'text-amber-600' },
  ]
  return <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{stat.label}</p><p className={cn('wrap-break-word text-[13px] leading-5 font-semibold', stat.tone)}>{stat.value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={stat.note}>{stat.note}</p></div></div> })}</div>
}

export function FxSensitivityResults({ result }: { result: FxSensitivityResult }) {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-[13px] font-semibold">汇率情景对比</h2>
        <p className="text-[10px] text-muted-foreground">每单位 {result.currency} 折算的 CNY 汇率变化，会直接影响人民币收入和订单利润。</p>
      </div>
      {result.results.map((scenario) => <ScenarioRow key={scenario.id} scenario={scenario} rateUnitLabel={formatRateUnit(result.currency, result.rateUnit)} best={scenario.id === result.bestScenarioId} worst={scenario.id === result.worstScenarioId} />)}
      <details className="rounded-lg border bg-muted/30 px-2.5 py-1.5">
        <summary className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground"><Info className="h-3.5 w-3.5" />计算口径</summary>
        <div className="mt-1 space-y-0.5 text-[10px] leading-4 text-muted-foreground">
          <p>收入按外币订单金额乘以情景汇率折算为 CNY，收款手续费按折算后的人民币收入计提。</p>
          <p>盈亏平衡汇率表示在当前成本和手续费率下，订单利润为零所需的最低汇率。</p>
          <p>情景汇率为预算假设，不代表银行实时牌价、远期结售汇报价或实际汇兑损益。</p>
        </div>
      </details>
    </div>
  )
}

function ScenarioRow({ scenario, rateUnitLabel, best, worst }: { scenario: FxScenarioResult; rateUnitLabel: string; best: boolean; worst: boolean }) {
  return <div className={cn('rounded-lg border px-2.5 py-2', best && 'border-emerald-300 bg-emerald-50/70 dark:border-cyan-300/30 dark:bg-cyan-300/10', worst && 'border-rose-300 bg-rose-50/40 dark:border-rose-300/30')}>
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-semibold">{scenario.label}</span>
          {best && <Badge className="px-1.5 py-0 text-[10px]">最佳</Badge>}
          {worst && <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">最差</Badge>}
        </div>
        <p className="text-[10px] text-muted-foreground">{formatRate(scenario.rate)} {rateUnitLabel} · 汇率变化 {scenario.rateChangePercent > 0 ? '+' : ''}{formatPercent(scenario.rateChangePercent)}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-muted-foreground">实际利润</p>
        <p className={cn('text-lg leading-6 font-bold tabular-nums', scenario.profitCny >= 0 ? 'text-emerald-700 dark:text-cyan-200' : 'text-red-600')}>{formatMoney(scenario.profitCny)}</p>
        <p className="text-[10px] text-muted-foreground">利润变化 {formatMoney(scenario.profitDeltaCny)}</p>
      </div>
    </div>
    <div className="mt-1.5 grid grid-cols-3 gap-x-3 border-t pt-1.5">
      <Value label="人民币收入" value={formatMoney(scenario.revenueCny)} />
      <Value label="收款手续费" value={formatMoney(scenario.settlementFeeCny)} />
      <Value label="成本合计" value={formatMoney(scenario.totalCostCny)} />
    </div>
  </div>
}

function Value({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate text-[10px] text-muted-foreground">{label}</span><span className="shrink-0 text-[11px] font-medium tabular-nums">{value}</span></div>
}
