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
  'rounded-xl border border-slate-200 bg-card p-2.5 shadow-xs dark:border-white/10'

/** 重量口径速览：一行四格，放在货物面板右侧 */
export function ExpressWeightSummary({ shipment }: { shipment: ShipmentForm }) {
  const weightRows = [
    { label: '快递 /5000', divisor: 5000, icon: Package },
    { label: '空运 /6000', divisor: 6000, icon: Plane },
    { label: '专线 /7000', divisor: 7000, icon: Box },
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
      <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon
          return (
            <div key={tile.label} className="min-w-0 rounded-lg border border-slate-200 px-1.5 py-1 dark:border-white/10">
              <div className="flex items-center gap-1 text-[10px] leading-3 text-slate-500 dark:text-slate-400">
                <Icon className="h-3 w-3 shrink-0" />
                <span className="truncate" title={tile.label}>{tile.label}</span>
              </div>
              <div className={cn('mt-0.5 truncate text-[13px] leading-4 font-semibold tabular-nums text-slate-900 dark:text-white', tile.tone)} title={tile.value}>{tile.value}</div>
              <p className="truncate text-[10px] leading-3 text-slate-400 dark:text-slate-500" title={tile.caption}>{tile.caption}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** 比价摘要：顶部四格概览条，与其余工具保持同一视觉节奏 */
export function ExpressComparisonStats({ results }: { results: ExpressChannelResult[] }) {
  if (!results.length) return null
  const cheapest = results.find((row) => row.costRank === 1)
  const fastest = results.find((row) => row.speedRank === 1)
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }> }> = [
    { label: '最低成本', value: cheapest?.name ?? '-', caption: cheapest ? money.format(cheapest.totalCostCny) : '—', icon: Trophy },
    { label: '最低单价', value: cheapest ? `${money.format(cheapest.perKgCny)}/kg` : '-', caption: cheapest ? `计费重 ${formatNumber(cheapest.chargeableWeightKg)} kg` : '—', icon: CircleDollarSign },
    { label: '最快渠道', value: fastest?.name ?? '-', caption: `${fastest?.transitDaysMin ?? 0}-${fastest?.transitDaysMax ?? 0} 天`, icon: Timer },
    { label: '有效报价', value: `${results.length} 个`, caption: '仅统计已填价格的渠道', icon: Plane },
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

/** 渠道对比：改用紧凑对比表，窄栏也能一眼比完三个渠道 */
export function ExpressComparisonResults({ results }: { results: ExpressChannelResult[] }) {
  if (!results.length) {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-4 text-[11px] text-slate-500 dark:border-white/15">
        <Info className="h-3.5 w-3.5 shrink-0" />
        填写至少一个货代报价后显示计费口径和对比结果。
      </p>
    )
  }

  const sorted = [...results].sort((a, b) => a.costRank - b.costRank)

  return (
    <div className={panelClass}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[13px] font-semibold text-slate-900 dark:text-white">渠道对比</h2>
        <span className="text-[10px] text-muted-foreground">按费用从低到高</span>
      </div>
      <div className="mt-1.5 overflow-x-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="text-[10px] text-muted-foreground">
              <th className="py-0.5 pr-1 text-left font-medium">渠道</th>
              <th className="px-1 py-0.5 text-right font-medium">计费重</th>
              <th className="px-1 py-0.5 text-right font-medium">费用</th>
              <th className="px-1 py-0.5 text-right font-medium">单价</th>
              <th className="py-0.5 pl-1 text-right font-medium">时效</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isCheapest = row.costRank === 1
              return (
                <tr key={row.id} className={cn('border-t border-slate-100 dark:border-white/10', isCheapest && 'bg-emerald-50/60 dark:bg-emerald-400/5')}>
                  <td className="max-w-[96px] py-1 pr-1">
                    <span className="flex items-center gap-1">
                      <span className="truncate font-medium text-slate-900 dark:text-white" title={row.name}>{row.name}</span>
                      {isCheapest && <Badge variant="default" className="shrink-0 px-1 py-0 text-[9px]">低</Badge>}
                    </span>
                    <span className="block truncate text-[10px] text-muted-foreground">{EXPRESS_SERVICE_LABELS[row.serviceType]} · {EXPRESS_TRADE_TERM_LABELS[row.tradeTerm]}</span>
                  </td>
                  <td className="px-1 py-1 text-right tabular-nums">
                    {formatNumber(row.chargeableWeightKg)}
                    <span className={cn('block text-[9px]', row.billingBasis === 'volumetric' ? 'text-amber-600 dark:text-amber-300' : 'text-muted-foreground')}>
                      {row.billingBasis === 'volumetric' ? '体积重' : '实重'}
                    </span>
                  </td>
                  <td className={cn('px-1 py-1 text-right font-semibold tabular-nums', isCheapest ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white')}>{money.format(row.totalCostCny)}</td>
                  <td className="px-1 py-1 text-right tabular-nums text-slate-700 dark:text-slate-200">{money.format(row.perKgCny)}</td>
                  <td className="py-1 pl-1 text-right tabular-nums text-slate-700 dark:text-slate-200">
                    {row.transitDaysMin}-{row.transitDaysMax}
                    <span className="block text-[9px] text-muted-foreground">天</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-1 border-t pt-1 text-[10px] leading-3.5 text-muted-foreground">
        单价 = 费用 ÷ 计费重。DDP 为包税到门口径，非 DDP 不含进口税费，两者不宜只比总价。
      </p>
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
