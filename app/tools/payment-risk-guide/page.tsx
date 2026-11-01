// 名称: 收款方式风险速查
// 描述: 按风险等级与业务场景筛选外贸收款方式，展示要点与防坑建议（单屏紧凑版）
// 路径: ExportBox/app/tools/payment-risk-guide/page.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

'use client'

import { useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { ToolShell } from '@/components/tools/tool-shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PAYMENT_METHODS,
  RISK_META,
  SCENARIO_META,
  getPaymentStats,
  recommendMethods,
  type PaymentRiskLevel,
  type PaymentScenario,
} from '@/lib/tools/payment-risk-guide'
import { cn } from '@/lib/utils'

const RISK_ORDER: PaymentRiskLevel[] = ['low', 'medium', 'high', 'very-high']

export default function PaymentRiskGuidePage() {
  const [riskFilter, setRiskFilter] = useState<PaymentRiskLevel | 'all'>('all')
  const [scenarioFilter, setScenarioFilter] = useState<PaymentScenario | 'all'>('all')
  const stats = getPaymentStats()

  const visibleMethods = useMemo(() => (
    PAYMENT_METHODS.filter((method) =>
      (riskFilter === 'all' || method.riskLevel === riskFilter) &&
      (scenarioFilter === 'all' || method.scenarios.includes(scenarioFilter))
    )
  ), [riskFilter, scenarioFilter])

  const recommended = scenarioFilter === 'all' ? [] : recommendMethods(scenarioFilter)
  const recommendedIds = new Set(recommended.map((method) => method.id))

  return (
    <ToolShell title="收款方式风险速查" description="T/T、L/C、D/P、D/A、O/A 一张表看懂风险等级、资金占用与防坑要点。先按场景筛，再看测算工具算具体成本。">
      <div className="grid grid-cols-3 gap-1.5">
        <Cell label="收录方式" value={String(stats.total)} note="主流收款工具" />
        <Cell label="低风险方式" value={String(stats.lowRisk)} note="银行信用或款到发货" />
        <Cell label="极高风险方式" value={String(stats.veryHighRisk)} note="纯赊销，需信保对冲" />
      </div>

      <div className="mt-2.5 space-y-1">
        <div className="flex flex-wrap items-center gap-1">
          <span className="w-14 shrink-0 text-[10px] font-semibold text-muted-foreground">风险等级</span>
          <FilterButton active={riskFilter === 'all'} onClick={() => setRiskFilter('all')}>全部</FilterButton>
          {RISK_ORDER.map((level) => (
            <FilterButton key={level} active={riskFilter === level} onClick={() => setRiskFilter(level)}>
              {RISK_META[level].label}
            </FilterButton>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span className="w-14 shrink-0 text-[10px] font-semibold text-muted-foreground">业务场景</span>
          <FilterButton active={scenarioFilter === 'all'} onClick={() => setScenarioFilter('all')}>全部</FilterButton>
          {(Object.keys(SCENARIO_META) as PaymentScenario[]).map((scenario) => (
            <FilterButton key={scenario} active={scenarioFilter === scenario} onClick={() => setScenarioFilter(scenario)}>
              {SCENARIO_META[scenario]}
            </FilterButton>
          ))}
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/60 px-2.5 py-1.5 text-[11px] leading-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-cyan-300" />
          <span className="shrink-0 font-semibold">{SCENARIO_META[scenarioFilter as PaymentScenario]}优先推荐</span>
          <span className="truncate text-muted-foreground">{recommended.map((method) => method.shortName).join(' → ')}</span>
        </div>
      )}

      <div className="mt-2.5 grid gap-2 md:grid-cols-2">
        {visibleMethods.map((method) => {
          const risk = RISK_META[method.riskLevel]
          return (
            <Card key={method.id} className={cn('gap-1 py-2', recommendedIds.has(method.id) && 'border-emerald-300 dark:border-cyan-300/40')}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 px-2.5 py-0">
                <div className="min-w-0">
                  <CardTitle className="truncate text-[13px] font-semibold">{method.name}</CardTitle>
                  <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground" title={method.summary}>{method.summary}</p>
                </div>
                <Badge variant="outline" className={cn('h-5 shrink-0 px-1.5 text-[10px] font-semibold', risk.className)}>{risk.label}</Badge>
              </CardHeader>
              <CardContent className="space-y-1 px-2.5 pt-1 pb-0">
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] leading-4 text-muted-foreground">
                  <span>到账 {method.speed}</span>
                  <span className="text-amber-500">{'★'.repeat(method.cashFlowScore)}{'☆'.repeat(5 - method.cashFlowScore)}</span>
                  <span>费用 {method.typicalCost}</span>
                </div>
                {method.scenarios.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {method.scenarios.map((scenario) => (
                      <span key={scenario} className="rounded border border-slate-200 bg-slate-50 px-1 py-0 text-[9px] font-medium leading-4 text-slate-600 dark:border-white/10 dark:bg-white/4 dark:text-slate-300">{SCENARIO_META[scenario]}</span>
                    ))}
                  </div>
                )}
                <ul className="space-y-0.5 border-t pt-1 text-[10px] leading-4 text-muted-foreground">
                  {method.tips.map((tip) => <li key={tip} className="flex items-start gap-1"><ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600 dark:text-cyan-300" />{tip}</li>)}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ToolShell>
  )
}

function Cell({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-2.5 py-1.5">
      <p className="truncate text-[10px] leading-4 text-muted-foreground">{label}</p>
      <p className="text-[13px] font-semibold leading-5 tabular-nums">{value}</p>
      {note && <p className="truncate text-[10px] leading-4 text-muted-foreground">{note}</p>}
    </div>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded border px-1.5 py-0.5 text-[10px] font-medium leading-4 transition-colors',
        active ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-cyan-300/50 dark:bg-cyan-300/10 dark:text-cyan-200' : 'border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-200 dark:border-white/10 dark:bg-white/4 dark:text-slate-300'
      )}
    >
      {children}
    </button>
  )
}
