// 名称: FOB/CIF 货代收费核对结果
// 描述: 展示账单合计、责任拆分、异常项目和复核操作（紧凑版）
// 路径: ExportBox/app/tools/freight-charge-audit/freight-audit-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import type { ComponentType } from 'react'
import { CheckCircle2, CircleDollarSign, FileWarning, Scale, ShieldAlert, WalletCards } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FREIGHT_AUDIT_PARTY_LABELS, type AuditedChargeLine, type ChargeAuditStatus, type FreightAuditResult } from '@/lib/tools/freight-charge-audit'
import { formatMoney } from './freight-audit-page-data'

const STATUS_STYLES: Record<ChargeAuditStatus, string> = {
  normal: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200',
  high: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200',
  'wrong-party': 'border-red-200 bg-red-50 text-red-700 dark:border-red-300/20 dark:bg-red-300/10 dark:text-red-200',
  review: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200',
  'missing-reference': 'border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200',
}

export function FreightAuditStats({ result }: { result: FreightAuditResult }) {
  const partyLabel = FREIGHT_AUDIT_PARTY_LABELS[result.auditParty]
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }> }> = [
    { label: '账单合计', value: formatMoney(result.actualTotal, result.currency), caption: `${result.lines.length} 项费用`, icon: WalletCards },
    { label: `${partyLabel}责任费用`, value: formatMoney(result.matchedResponsibilityTotal, result.currency), caption: `${result.term} 常规责任边界`, icon: Scale },
    { label: `非${partyLabel}责任费用`, value: formatMoney(result.otherPartyResponsibilityTotal, result.currency), caption: `${result.wrongPartyCount} 项责任不匹配`, icon: ShieldAlert },
    { label: '重点复核金额', value: formatMoney(result.reviewAmount, result.currency), caption: '错收费全额 + 超基准差额', icon: CircleDollarSign },
  ]

  return <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <div key={card.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5"><Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="truncate text-[10px] leading-3 text-muted-foreground">{card.label}</p><p className="wrap-break-word text-[13px] leading-5 font-semibold tabular-nums">{card.value}</p><p className="truncate text-[10px] leading-3 text-muted-foreground" title={card.caption}>{card.caption}</p></div></div> })}</div>
}

export function FreightAuditResults({ result, copyText }: { result: FreightAuditResult; copyText: string }) {
  const issues = result.lines.filter((line) => line.status !== 'normal')
  const partyLabel = FREIGHT_AUDIT_PARTY_LABELS[result.auditParty]
  const hasLines = result.lines.length > 0
  const hasDefiniteIssue = result.highCount + result.wrongPartyCount > 0
  const title = !hasLines ? '等待录入账单' : hasDefiniteIssue ? '这份账单建议复核' : issues.length > 0 ? '存在待确认项目' : '未发现明显异常'
  const description = !hasLines
    ? '添加货代收费项目和核价基准后生成诊断。'
    : hasDefiniteIssue
    ? `发现 ${result.highCount} 项高于基准、${result.wrongPartyCount} 项与${partyLabel}责任不匹配。`
    : issues.length > 0 ? '价格或责任依据还不完整，补齐后再确认。' : '已录入项目均符合当前责任边界与基准容差。'

  return (
    <div className="space-y-2.5">
      <Card className={cn('gap-0 py-0', hasDefiniteIssue && 'border-rose-200 dark:border-rose-300/20')}>
        <CardHeader className="gap-1 px-3 pt-2.5 pb-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold">{hasDefiniteIssue ? <FileWarning className="h-4 w-4 text-rose-600" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}{title}</p>
              <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground" title={description}>{description}</p>
            </div>
            <Badge variant="outline" className="shrink-0 px-1.5 py-0 text-[10px]">{result.term} · {partyLabel} · {result.tolerancePercent}%</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pt-0 pb-2.5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 rounded-md bg-muted/50 px-2.5 py-1.5">
            <Metric label="账单基准合计" value={formatMoney(result.benchmarkTotal, result.currency)} />
            <Metric label="需核对约定费用" value={formatMoney(result.agreementReviewTotal, result.currency)} />
            <Metric label="高于基准" value={`${result.highCount} 项`} />
            <Metric label="缺少基准" value={`${result.missingReferenceCount} 项`} />
          </div>
          <EnhancedCopyButton text={copyText} variant="outline" size="sm" className="h-7 px-2 text-[11px]" disabled={!hasLines}>复制给货代复核</EnhancedCopyButton>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="px-3 pt-2.5 pb-1">
          <p className="text-[12px] font-semibold">逐项诊断</p>
          <p className="text-[10px] text-muted-foreground">先看责任归属，再看实际收费是否超过核价基准</p>
        </CardHeader>
        <CardContent className="space-y-1.5 px-3 pt-0 pb-2.5">
          {issues.length === 0
            ? <div className="flex min-h-20 items-center justify-center rounded-md border border-dashed px-3 text-center text-[11px] text-muted-foreground">{hasLines ? '全部项目均在当前责任边界与基准容差内' : '录入费用后，这里会显示需要复核的项目'}</div>
            : issues.map((line) => <IssueRow key={line.id} line={line} currency={result.currency} />)}
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-2"><span className="truncate text-[10px] text-muted-foreground">{label}</span><span className="shrink-0 text-[11px] font-semibold tabular-nums">{value}</span></div>
}

function IssueRow({ line, currency }: { line: AuditedChargeLine; currency: FreightAuditResult['currency'] }) {
  return (
    <div className="rounded-md border px-2.5 py-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0"><p className="truncate text-[12px] font-semibold">{line.name}</p><p className="truncate text-[10px] text-muted-foreground">{line.responsibilityLabel}</p></div>
        <Badge variant="outline" className={cn('shrink-0 px-1.5 py-0 text-[10px]', STATUS_STYLES[line.status])}>{line.statusLabel}</Badge>
      </div>
      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-muted-foreground" title={line.reason}>{line.reason}</p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 border-t pt-1 text-[10px]"><span>实收 <strong className="tabular-nums">{formatMoney(line.actual, currency)}</strong></span><span>基准 <strong className="tabular-nums">{line.benchmark > 0 ? formatMoney(line.benchmark, currency) : '未填写'}</strong></span>{line.reviewAmount > 0 && <span className="text-rose-600">复核 <strong className="tabular-nums">{formatMoney(line.reviewAmount, currency)}</strong></span>}</div>
    </div>
  )
}
