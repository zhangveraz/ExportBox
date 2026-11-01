// 名称: 快递专线比价结果（紧凑版）
// 描述: 重量口径速览、比价摘要与渠道明细卡片
// 路径: ExportBox/app/tools/express-channel-comparison/express-comparison-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import type { ComponentType } from 'react'
import { Box, CircleDollarSign, Info, Package, Plane, Scale, Timer, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { calculateAirFreight } from '@/lib/tools/air-freight-calculator'
import {
  EXPRESS_PRICING_MODE_LABELS,
  EXPRESS_SERVICE_LABELS,
  EXPRESS_TRADE_TERM_LABELS,
  type ExpressChannelResult,
} from '@/lib/tools/express-channel-comparison'
import { formatNumber, money, toNumber, type ShipmentForm } from './express-comparison-page-data'

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

/** 重量口径速览：2×2 小卡片，放在货物面板右侧 */
export function ExpressWeightSummary({ shipment }: { shipment: ShipmentForm }) {
  const weightRows = [
    { label: '商业快递 /5000', divisor: 5000, icon: Package },
    { label: '空运 /6000', divisor: 6000, icon: Plane },
    { label: '经济专线 /7000', divisor: 7000, icon: Box },
  ].map((item) => ({ ...item, result: calculateWeight(shipment, item.divisor) }))
  const actualWeight = weightRows[0].result.actualWeightKg

  const tiles = [
    { label: '总实重', value: `${formatNumber(actualWeight)} kg`, caption: '毛重 × 箱数', icon: Scale, tone: '' },
    ...weightRows.map((row) => ({
      label: row.label,
      value: `${formatNumber(row.result.volumetricWeightKg)} kg`,
      caption: row.result.billingBasis === 'volumetric' ? '体积重大于实重' : '体积重未超实重',
      icon: row.icon,
      tone: row.result.billingBasis === 'volumetric' ? 'text-amber-600 dark:text-amber-300' : '',
    })),
  ]

  return (
    <div className={panelClass}>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">泡重口径对比</h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {tiles.map((tile) => {
          const Icon = tile.icon
          return (
            <div key={tile.label} className="rounded-lg border border-slate-200 px-2.5 py-2 dark:border-white/10">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Icon className="h-3 w-3" />
                {tile.label}
              </div>
              <div className={cn('mt-0.5 truncate text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white', tile.tone)}>{tile.value}</div>
              <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{tile.caption}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** 比价摘要：三块并排 */
export function ExpressComparisonStats({ results }: { results: ExpressChannelResult[] }) {
  if (!results.length) return null
  const cheapest = results.find((row) => row.costRank === 1)
  const fastest = results.find((row) => row.speedRank === 1)
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }> }> = [
    { label: '最低成本', value: cheapest?.name ?? '-', caption: money.format(cheapest?.totalCostCny ?? 0), icon: Trophy },
    { label: '最快渠道', value: fastest?.name ?? '-', caption: `${fastest?.transitDaysMin ?? 0}-${fastest?.transitDaysMax ?? 0} 天`, icon: Timer },
    { label: '有效报价', value: `${results.length} 个`, caption: '仅统计已填价格的渠道', icon: CircleDollarSign },
  ]

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950/60">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">{card.value}</p>
              <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{card.caption}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** 渠道明细：按成本排名，一屏三列 */
export function ExpressComparisonResults({ results }: { results: ExpressChannelResult[] }) {
  if (!results.length) {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-500 dark:border-white/15">
        <Info className="h-4 w-4 shrink-0" />
        填写至少一个货代报价后显示计费口径和对比结果。
      </p>
    )
  }
  return (
    <div className="grid gap-2.5 lg:grid-cols-3">
      {[...results].sort((a, b) => a.costRank - b.costRank).map((row) => <ResultCard key={row.id} row={row} />)}
    </div>
  )
}

function ResultCard({ row }: { row: ExpressChannelResult }) {
  const volumetric = row.billingBasis === 'volumetric'
  const pricingDetail = row.pricingMode === 'per-kg'
    ? `${money.format(row.quoteAmountCny)}/kg × ${formatNumber(row.chargeableWeightKg)} kg`
    : row.pricingMode === 'all-in' ? '货代给出最终整票价格' : '整票基础价另加录入附加费'
  const ddpNote = row.tradeTerm === 'DDP'
    ? 'DDP 按包税到门理解，仍需确认偏远、查验、退件与超规格例外。'
    : `${EXPRESS_TRADE_TERM_LABELS[row.tradeTerm]}不含进口税费，请勿与 DDP 总价直接对比。`
  const isCheapest = row.costRank === 1

  return (
    <div className={cn(panelClass, isCheapest && 'border-emerald-300 dark:border-emerald-400/40')}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold text-slate-900 dark:text-white" title={row.name}>{row.name}</h3>
          <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
            {EXPRESS_SERVICE_LABELS[row.serviceType]} · {EXPRESS_TRADE_TERM_LABELS[row.tradeTerm]} · {row.transitDaysMin}-{row.transitDaysMax} 天
          </p>
        </div>
        <Badge variant={isCheapest ? 'default' : 'secondary'} className="shrink-0">成本第 {row.costRank}</Badge>
      </div>

      <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
        <p className="text-[11px] text-emerald-800 dark:text-cyan-100">费用合计</p>
        <p className="text-[22px] font-bold tabular-nums text-emerald-900 dark:text-white">{money.format(row.totalCostCny)}</p>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant={volumetric ? 'destructive' : 'secondary'} className="text-[10px]">{volumetric ? '按体积重计费' : '按实重计费'}</Badge>
        <Badge variant="outline" className="text-[10px]">{EXPRESS_PRICING_MODE_LABELS[row.pricingMode]}</Badge>
        <Badge variant="outline" className="text-[10px]">/{formatNumber(row.divisor, 0)}</Badge>
      </div>

      <div className="mt-2 space-y-1">
        <ResultRow label="总实重" value={`${formatNumber(row.actualWeightKg)} kg`} />
        <ResultRow label="总体积重" value={`${formatNumber(row.volumetricWeightKg)} kg`} />
        <ResultRow label="计费重量" value={`${formatNumber(row.chargeableWeightKg)} kg`} strong />
        <ResultRow label="折合单价" value={`${money.format(row.perKgCny)}/kg`} />
        <ResultRow label="每箱费用" value={money.format(row.perPackageCny)} />
      </div>

      <p className="mt-2 rounded-md bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600 dark:bg-white/5 dark:text-slate-300">
        报价口径：{pricingDetail}
      </p>
      <p className="mt-1.5 text-[11px] leading-4 text-slate-400 dark:text-slate-500">{ddpNote}</p>
    </div>
  )
}

function ResultRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-2 py-1 text-[11px] dark:bg-white/5">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={cn('tabular-nums text-slate-900 dark:text-white', strong ? 'font-semibold' : 'font-medium')}>{value}</span>
    </div>
  )
}

function calculateWeight(shipment: ShipmentForm, divisor: number) {
  return calculateAirFreight({
    lengthCm: toNumber(shipment.lengthCm), widthCm: toNumber(shipment.widthCm), heightCm: toNumber(shipment.heightCm),
    grossWeightKg: toNumber(shipment.grossWeightKg), netWeightKg: toNumber(shipment.netWeightKg), quantity: toNumber(shipment.packageCount),
    divisor, ratePerKg: 0, minCharge: 0, fuelSurchargePercent: 0, handlingFee: 0,
  })
}
