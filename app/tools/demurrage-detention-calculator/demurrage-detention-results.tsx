// 名称: 集装箱滞箱滞港费结果
// 描述: 展示免费期状态、阶梯费用拆分和业务口径（紧凑版）
// 路径: ExportBox/app/tools/demurrage-detention-calculator/demurrage-detention-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { AlertTriangle, CircleDollarSign, Clock, Container, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ChargeTypeResult, DemurrageDetentionResult } from '@/lib/tools/demurrage-detention-calculator'
import { formatMoney, formatRate } from './demurrage-detention-page-data'

export function DemurrageDetentionStats({ result }: { result: DemurrageDetentionResult }) {
  const highest = result.highestCostType === 'demurrage' ? result.demurrage : result.highestCostType === 'detention' ? result.detention : null
  const stats = [
    { label: '异常费用合计', value: formatMoney(result.totalFee, result.currency), note: `${result.containerCount} 柜`, icon: CircleDollarSign, tone: 'text-rose-700' },
    { label: '平均每柜', value: formatMoney(result.feePerContainer, result.currency), note: '滞港与滞箱合计', icon: Container, tone: 'text-sky-700' },
    { label: '总超期天数', value: `${result.totalChargeableDays} 天`, note: '两个计费环节合计', icon: Clock, tone: 'text-amber-700' },
    { label: '费用较高环节', value: highest ? highest.type === 'demurrage' ? '滞港费' : '滞箱费' : '暂无费用', note: highest ? formatMoney(highest.feeTotal, result.currency) : '均未超免费期', icon: AlertTriangle, tone: 'text-emerald-700' },
  ]
  return <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{stat.label}</p><p className={cn('wrap-break-word text-[13px] leading-5 font-semibold tabular-nums', stat.tone)}>{stat.value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={stat.note}>{stat.note}</p></div></div> })}</div>
}

export function DemurrageDetentionResults({ result }: { result: DemurrageDetentionResult }) {
  return <div className="space-y-2.5">
    <div className="space-y-2"><ChargeSection result={result.demurrage} currency={result.currency} /><ChargeSection result={result.detention} currency={result.currency} /></div>
    <details className="rounded-lg border bg-muted/30 px-3 py-2">
      <summary className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-200"><Info className="h-3.5 w-3.5" />计算口径</summary>
      <div className="mt-1 space-y-0.5 text-[10px] leading-4 text-muted-foreground"><p>滞港费按集装箱仍在码头或堆场内的占用天数估算；滞箱费按提柜后到还空柜前的占用天数估算。</p><p>本工具使用用户输入的日历天数，不自动判断周末、节假日、提柜日或还箱日是否计费。</p><p>船公司可能将免费期合并、按自然日或工作日计费，最终金额请以提单条款、设备交接单和正式账单为准。</p></div>
    </details>
  </div>
}

function ChargeSection({ result, currency }: { result: ChargeTypeResult; currency: DemurrageDetentionResult['currency'] }) {
  const maxTierFee = Math.max(...result.tiers.map((tier) => tier.feeTotal), 1)
  const hasOverage = result.chargeableDays > 0
  return <div className="rounded-lg border bg-white px-2.5 py-2 dark:bg-slate-950/40">
    <div className="flex items-start justify-between gap-2"><div className="min-w-0"><h2 className="flex items-center gap-1.5 text-[13px] font-semibold"><Clock className="h-3.5 w-3.5" />{result.label}</h2><p className="text-[10px] text-muted-foreground">占用 {result.totalDays} 天，免费 {result.freeDays} 天</p></div><Badge variant={hasOverage ? 'destructive' : 'secondary'} className="shrink-0 px-1.5 py-0 text-[10px]">{hasOverage ? `超期 ${result.overageDays} 天` : `剩余免费 ${result.freeDaysRemaining} 天`}</Badge></div>
    <div className="mt-1.5 grid grid-cols-3 gap-x-3 border-t pt-1.5"><Metric label="可计费天数" value={`${result.chargeableDays} 天`} /><Metric label="每柜费用" value={formatMoney(result.feePerContainer, currency)} /><Metric label="本批费用" value={formatMoney(result.feeTotal, currency)} /></div>
    <div className="mt-1.5 space-y-1 border-t pt-1.5">{result.tiers.map((tier) => <div key={tier.label}><div className="flex items-center justify-between gap-3 text-[11px]"><span className="truncate">{tier.label} · {tier.days} 天</span><span className="shrink-0 font-medium tabular-nums">{formatMoney(tier.feeTotal, currency)}</span></div><div className="mt-0.5 flex items-center gap-1.5"><div className="h-1 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-slate-500" style={{ width: `${tier.feeTotal ? Math.max(3, tier.feeTotal / maxTierFee * 100) : 0}%` }} /></div><span className="shrink-0 text-[9px] text-muted-foreground">{formatRate(tier.rate, currency)}</span></div></div>)}</div>
  </div>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate text-[10px] text-muted-foreground">{label}</span><span className="shrink-0 text-[11px] font-semibold tabular-nums">{value}</span></div>
}
