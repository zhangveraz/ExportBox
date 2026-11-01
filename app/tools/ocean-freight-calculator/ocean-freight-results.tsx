// 名称: 海运费用结果（对齐出口退税布局）
// 描述: 顶部四格概览 + 费用拆分卡 + 摊销口径卡，行高与字号按 1080p 收紧
// 路径: ExportBox/app/tools/ocean-freight-calculator/ocean-freight-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import type { ComponentType } from 'react'
import { Boxes, Calculator, ChevronDown, Container, Package, Truck, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { calculateOceanFreight } from '@/lib/tools/ocean-freight-calculator'
import { formatCny, formatNumber, type FormState } from './ocean-freight-page-data'

type OceanResult = ReturnType<typeof calculateOceanFreight>

/** 顶部四个关键数字（横向概览条） */
export function OceanFreightStats({ result, form }: { result: OceanResult; form: FormState }) {
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }> }> = [
    { label: '费用合计', value: formatCny(result.totalCostCny), caption: `${result.modeLabel} 全链路估算`, icon: Wallet },
    { label: '每 CBM 成本', value: formatCny(result.perCbmCny), caption: `计费 ${formatNumber(result.chargeableCbm, 3)} CBM`, icon: Boxes },
    { label: '每件摊费', value: formatCny(result.perCartonCny), caption: `${result.quantity} 件平均分摊`, icon: Package },
    { label: form.mode === 'fcl' ? '每柜费用' : '每公斤费用', value: form.mode === 'fcl' ? formatCny(result.perContainerCny) : formatCny(result.perKgCny), caption: form.mode === 'fcl' ? `${form.containerCount || '1'} 柜分摊` : `${formatNumber(result.weightTon, 3)} 吨毛重`, icon: form.mode === 'fcl' ? Container : Truck },
  ]

  return (
    <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5">
            <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-[10px] leading-3 text-muted-foreground">{card.label}</p>
              <p className="truncate text-[13px] leading-4 font-semibold tabular-nums" title={card.value}>{card.value}</p>
              <p className="truncate text-[10px] leading-3 text-muted-foreground" title={card.caption}>{card.caption}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function OceanFreightResults({ result, form }: { result: OceanResult; form: FormState }) {
  const maxCost = Math.max(...result.costBreakdown.map((row) => row.value), 1)

  return (
    <div className="space-y-2">
      <Card className="gap-0 py-0">
        <CardHeader className="px-2.5 pt-2 pb-0.5">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-1.5 text-[12px] font-semibold">
              <Wallet className="h-3.5 w-3.5" />
              费用拆分
            </CardTitle>
            <Badge variant="secondary" className="text-[10px]">{result.modeLabel}</Badge>
          </div>
          <p className="text-[10px] leading-3 text-muted-foreground">起运端 {formatCny(result.originSubtotalCny)} · 目的港 {formatCny(result.destinationChargeCny)}</p>
        </CardHeader>
        <CardContent className="px-2.5 pt-1 pb-2">
          <ul className="space-y-1">
            {result.costBreakdown.map((row) => (
              <li key={row.key}>
                <div className="flex items-baseline justify-between gap-2 text-[11px] leading-3">
                  <span className="truncate text-slate-600 dark:text-slate-300" title={row.label}>{row.label}</span>
                  <span className="shrink-0 font-medium tabular-nums text-slate-900 dark:text-white">{formatCny(row.value)}</span>
                </div>
                <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted">
                  <div className={cn('h-full rounded-full', row.key === 'freight' ? 'bg-cyan-500' : 'bg-slate-400')} style={{ width: `${Math.max(3, Math.min(100, (row.value / maxCost) * 100))}%` }} />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-1.5 flex items-baseline justify-between gap-2 rounded-md bg-primary/5 px-2 py-1">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">总费用</span>
            <span className="text-[15px] leading-5 font-bold tabular-nums text-primary">{formatCny(result.totalCostCny)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="px-2.5 pt-2 pb-0.5">
          <CardTitle className="flex items-center gap-1.5 text-[12px] font-semibold">
            <Calculator className="h-3.5 w-3.5" />
            摊销口径
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2.5 pt-0 pb-1.5">
          <ResultRow label="计费体积" value={`${formatNumber(result.chargeableCbm, 3)} CBM`} icon={Boxes} />
          <ResultRow label="毛重吨位" value={`${formatNumber(result.weightTon, 3)} 吨`} icon={Truck} />
          <ResultRow label="每公斤费用" value={formatCny(result.perKgCny)} icon={Package} />
          <ResultRow label="每件摊费" value={formatCny(result.perCartonCny)} icon={Calculator} />
        </CardContent>
      </Card>

      <details className="group rounded-lg border bg-card px-3 py-2">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
          口径说明
          <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-1.5 space-y-1 text-[10px] leading-4 text-muted-foreground">
          <li>散货按计费体积（CBM 与最低计费体积取大）计费，整柜按柜数摊销。</li>
          <li>目的港费用为到付口径估算，实际以船公司、货代报价与账单为准。</li>
        </ul>
      </details>
    </div>
  )
}

function ResultRow({ label, value, icon: Icon }: { label: string; value: string; icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="flex min-w-0 items-center gap-1.5 truncate text-[11px] leading-4 text-slate-600 dark:text-slate-300">
        <Icon className="h-3 w-3 shrink-0" />
        {label}
      </span>
      <span className="shrink-0 text-[12px] font-medium tabular-nums text-slate-900 dark:text-white">{value}</span>
    </div>
  )
}
