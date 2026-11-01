// 名称: 收款账期成本对比结果
// 描述: 展示推荐方案、利润排名与成本明细（紧凑版）
// 路径: ExportBox/app/tools/payment-terms-calculator/payment-terms-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { CalendarDays, CircleDollarSign, Info, TrendingUp, WalletCards, BadgeCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { cn } from '@/lib/utils'
import type { PaymentTermResult, PaymentTermsResult } from '@/lib/tools/payment-terms-calculator'
import { formatDays, formatMoney, formatPercent } from './payment-terms-page-data'

export function PaymentTermsStats({ result }: { result: PaymentTermsResult }) {
  const best = result.results.find((term) => term.id === result.bestTermId) ?? result.results[0]
  const stats = [
    { label: '首选方案', value: best.name, note: '按实际利润排序', icon: BadgeCheck },
    { label: '预计实际利润', value: formatMoney(best.effectiveProfit), note: formatPercent(best.effectiveMarginPercent), icon: TrendingUp },
    { label: '相对最高成本节省', value: formatMoney(result.costSavingAgainstWorst), note: '同一订单口径', icon: CircleDollarSign },
    { label: '资金缺口', value: formatMoney(best.fundingGap), note: `${formatDays(best.weightedCollectionDays)} 加权回款`, icon: WalletCards },
  ]
  return <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{stat.label}</p><p className="wrap-break-word text-[13px] leading-5 font-semibold">{stat.value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={stat.note}>{stat.note}</p></div></div> })}</div>
}

export function PaymentTermsResults({ result, summaryText }: { result: PaymentTermsResult; summaryText: string }) {
  const ranked = [...result.results].sort((a, b) => a.rank - b.rank)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold">方案对比</h2>
          <p className="text-[10px] text-muted-foreground">扣除资金、收款和风险成本后的实际表现</p>
        </div>
        <EnhancedCopyButton text={summaryText} variant="outline" size="sm" className="h-7 shrink-0 px-2 text-[11px]">复制</EnhancedCopyButton>
      </div>
      {ranked.map((term) => <TermResult key={term.id} term={term} best={term.id === result.bestTermId} />)}
      <details className="rounded-lg border bg-muted/30 px-2.5 py-1.5">
        <summary className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground"><Info className="h-3.5 w-3.5" />计算口径与假设</summary>
        <div className="mt-1 space-y-0.5 text-[10px] leading-4 text-muted-foreground">
          <p>资金成本按“订单总成本在订单确认日投入、尾款到账时释放”的保守口径估算。</p>
          <p>风险准备金仅对未预收的尾款计提，用于横向比较信用、拒付和汇率波动风险，不代表实际损失。</p>
          <p>L/C 银行费、平台费或中转行费率因机构而异，应以实际报价覆盖预设参数。</p>
        </div>
      </details>
    </div>
  )
}

function TermResult({ term, best }: { term: PaymentTermResult; best: boolean }) {
  const rows = [
    { label: '资金成本', value: term.fundingCost },
    { label: '收款手续费', value: term.collectionFee },
    { label: '风险准备金', value: term.riskReserve },
  ]
  return (
    <div className={cn('rounded-lg border px-2.5 py-2', best ? 'border-emerald-300 bg-emerald-50/70 dark:border-cyan-300/30 dark:bg-cyan-300/10' : 'bg-white dark:bg-slate-950/40')}>
      <div className="flex flex-wrap items-start justify-between gap-1.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[13px] font-semibold">{term.name}</span>
            <Badge variant={best ? 'default' : 'outline'} className="px-1.5 py-0 text-[10px]">{best ? '首选' : `第 ${term.rank} 名`}</Badge>
          </div>
          <p className="text-[10px] text-muted-foreground">预付 {formatPercent(term.advancePercent)} · 发货后 {term.daysAfterShipment} 天 · 加权回款 {formatDays(term.weightedCollectionDays)}</p>
        </div>
        <div className="text-right">
          <p className={cn('text-base leading-6 font-bold tabular-nums', term.effectiveProfit >= 0 ? 'text-emerald-700 dark:text-cyan-200' : 'text-red-600')}>{formatMoney(term.effectiveProfit)}</p>
          <p className="text-[10px] text-muted-foreground">实际利润率 {formatPercent(term.effectiveMarginPercent)}</p>
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-x-3 border-t pt-1.5 sm:grid-cols-4">
        <Value label="预收金额" value={formatMoney(term.advanceAmount)} />
        <Value label="资金缺口" value={formatMoney(term.fundingGap)} />
        {rows.map((row) => <Value key={row.label} label={row.label} value={formatMoney(row.value)} />)}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 border-t pt-1">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><CalendarDays className="h-3 w-3" />尾款预计订单后第 {term.collectionDay} 天到账</span>
        <span className="text-[11px] font-semibold tabular-nums text-amber-700 dark:text-amber-300">条款总成本 {formatMoney(term.totalTermCost)}</span>
      </div>
    </div>
  )
}

function Value({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-1"><span className="truncate text-[10px] text-muted-foreground">{label}</span><span className="shrink-0 text-[11px] font-medium tabular-nums">{value}</span></div>
}
