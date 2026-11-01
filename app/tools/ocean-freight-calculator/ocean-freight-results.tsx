// 名称: 海运费用结果
// 描述: 展示概览、费用拆分和摊销口径
// 路径: ExportBox/app/tools/ocean-freight-calculator/ocean-freight-results.tsx
// 作者: ExportBox
// 更新时间: 2026-07-15

import type { ComponentType } from 'react'
import { Boxes, Calculator, Container, FileText, Package, ShieldCheck, Truck, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { calculateOceanFreight } from '@/lib/tools/ocean-freight-calculator'
import { formatCny, formatNumber, toNumber, type FormState } from './ocean-freight-page-data'

type OceanResult = ReturnType<typeof calculateOceanFreight>

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

export function OceanFreightStats({ result, form }: { result: OceanResult; form: FormState }) {
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }> }> = [
    { label: '费用合计', value: formatCny(result.totalCostCny), caption: `${result.modeLabel} 全链路估算`, icon: Wallet },
    { label: '每 CBM 成本', value: formatCny(result.perCbmCny), caption: `计费 ${formatNumber(result.chargeableCbm, 3)} CBM`, icon: Boxes },
    { label: '每件摊费', value: formatCny(result.perCartonCny), caption: `${result.quantity} 件平均分摊`, icon: Package },
    { label: form.mode === 'fcl' ? '每柜费用' : '每公斤费用', value: form.mode === 'fcl' ? formatCny(result.perContainerCny) : formatCny(result.perKgCny), caption: form.mode === 'fcl' ? `${form.containerCount || '1'} 柜分摊` : `${formatNumber(result.weightTon, 3)} 吨毛重`, icon: form.mode === 'fcl' ? Container : Truck },
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
            <div className="mt-0.5 truncate text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">{card.value}</div>
            <p className="truncate text-[10px] text-slate-400 dark:text-slate-500" title={card.caption}>{card.caption}</p>
          </div>
        )
      })}
    </div>
  )
}

export function OceanFreightResults({ result, form }: { result: OceanResult; form: FormState }) {
  const maxCost = Math.max(...result.costBreakdown.map((row) => row.value), 1)
  return (
    <div className={panelClass}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">费用拆分</h2>
        <Badge variant="secondary">{result.modeLabel}</Badge>
      </div>
      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
        起运端 {formatCny(result.originSubtotalCny)} · 目的港 {formatCny(result.destinationChargeCny)}
      </p>

      <div className="mt-2 space-y-1.5">
        {result.costBreakdown.map((row) => (
          <div key={row.key}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-white">{formatCny(row.value)}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div className={cn('h-full rounded-full', row.key === 'freight' ? 'bg-cyan-500' : 'bg-slate-400')} style={{ width: `${Math.max(3, Math.min(100, (row.value / maxCost) * 100))}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
        <span className="text-xs font-medium text-emerald-800 dark:text-cyan-100">总费用</span>
        <span className="text-[20px] font-bold tabular-nums text-emerald-900 dark:text-white">{formatCny(result.totalCostCny)}</span>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        <ResultRow label="计费体积" value={`${formatNumber(result.chargeableCbm, 3)} CBM`} icon={Boxes} />
        <ResultRow label="毛重吨位" value={`${formatNumber(result.weightTon, 3)} 吨`} icon={Truck} />
        <ResultRow label="每公斤费用" value={formatCny(result.perKgCny)} icon={Package} />
        <ResultRow label="每件摊费" value={formatCny(result.perCartonCny)} icon={Calculator} />
        <ResultRow label="保险费用" value={formatCny(result.insuranceFeeCny)} icon={ShieldCheck} />
        <ResultRow label="文件与操作" value={formatCny(toNumber(form.documentFeeCny))} icon={FileText} />
      </div>
    </div>
  )
}

function ResultRow({ label, value, icon: Icon }: { label: string; value: string; icon: ComponentType<{ className?: string }> }) {
  return <div className="flex items-center justify-between gap-4 rounded-md bg-muted/50 px-3 py-2 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</span><span className="text-right font-medium">{value}</span></div>
}
