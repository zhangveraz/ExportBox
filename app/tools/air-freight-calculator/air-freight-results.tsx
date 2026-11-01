// 名称: 空运计费结果（紧凑版）
// 描述: 单屏布局下的结果区：计费重看板、重量对比与费用拆分
// 路径: ExportBox/app/tools/air-freight-calculator/air-freight-results.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import type { ComponentType } from 'react'
import { Box, Calculator, ChevronDown, CircleDollarSign, Fuel, Package, Plane, Scale } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { calculateAirFreight } from '@/lib/tools/air-freight-calculator'
import { formatMoney, formatNumber } from './air-freight-page-data'

type AirResult = ReturnType<typeof calculateAirFreight>

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

/** 顶部四个关键数字：两列小卡片，右栏宽度下不换行 */
export function AirFreightStats({ result }: { result: AirResult }) {
  const volumetric = result.billingBasis === 'volumetric'
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }> }> = [
    { label: '计费重量', value: `${formatNumber(result.chargeableWeightKg, 2)} kg`, caption: volumetric ? '按体积重计费' : '按毛重计费', icon: Scale },
    { label: '总体积重', value: `${formatNumber(result.volumetricWeightKg, 2)} kg`, caption: `单箱 ${formatNumber(result.volumetricWeightPerCartonKg, 2)} kg`, icon: Box },
    { label: '费用合计', value: formatMoney(result.totalCharge), caption: `基础运费 ${formatMoney(result.baseFreight)}`, icon: CircleDollarSign },
    { label: '单箱费用', value: formatMoney(result.unitCharge), caption: `${formatNumber(result.chargeableWeightPerCartonKg, 2)} kg/箱`, icon: Package },
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

/** 结果主体：计费重高亮 + 明细行 + 费用拆分 */
export function AirFreightResults({ result }: { result: AirResult }) {
  const volumetric = result.billingBasis === 'volumetric'

  return (
    <div className="space-y-3">
      <div className={panelClass}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">计费结果</h2>
          <Badge variant={volumetric ? 'destructive' : 'secondary'}>{volumetric ? '体积重计费' : '毛重计费'}</Badge>
        </div>

        <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] text-emerald-800 dark:text-cyan-100">计费重量</span>
            <span className="text-[22px] font-bold tabular-nums text-emerald-900 dark:text-white">
              {formatNumber(result.chargeableWeightKg, 2)}
              <span className="ml-1 text-xs font-medium">kg</span>
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-emerald-800/80 dark:text-cyan-100/70">
            抛重差 {formatNumber(result.weightDifferenceKg, 2)} kg · 总体积 {formatNumber(result.totalCbm, 3)} CBM
          </p>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <WeightCompareBar actualWeight={result.actualWeightKg} volumetricWeight={result.volumetricWeightKg} />
        </div>

        <div className="mt-2 grid gap-1.5">
          <InfoRow label="单箱体积" value={`${formatNumber(result.cartonCbm, 4)} CBM`} />
          <InfoRow label="总毛重" value={`${formatNumber(result.actualWeightKg, 2)} kg`} />
          <InfoRow label="总净重" value={`${formatNumber(result.netWeightKg, 2)} kg`} />
          <InfoRow label="单箱体积重" value={`${formatNumber(result.volumetricWeightPerCartonKg, 2)} kg`} />
          <InfoRow label="单箱计费重" value={`${formatNumber(result.chargeableWeightPerCartonKg, 2)} kg`} />
        </div>
      </div>

      <div className={panelClass}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">费用拆分</h2>
        <div className="mt-2 grid gap-1.5">
          <InfoRow label="基础运费" value={formatMoney(result.baseFreight)} icon={Calculator} />
          <InfoRow label="燃油附加" value={formatMoney(result.fuelSurcharge)} icon={Fuel} />
          <InfoRow label="操作/杂费" value={formatMoney(result.handlingFee)} icon={Package} />
        </div>
        <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <span className="text-xs font-medium text-emerald-800 dark:text-cyan-100">费用合计</span>
          <span className="text-[20px] font-bold tabular-nums text-emerald-900 dark:text-white">{formatMoney(result.totalCharge)}</span>
        </div>
      </div>

      <details className="group rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950/60">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
          计算口径提示
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          <li>体积重 = 单箱长 × 宽 × 高 ÷ 泡重系数，与毛重取大者作为计费重。</li>
          <li>基础运费 = 计费重 × 运价，并与最低收费取高。</li>
          <li>燃油附加按基础运费比例计收，操作费按票计收，实际以承运人账单为准。</li>
        </ul>
      </details>
    </div>
  )
}

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs dark:bg-white/5">
      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      <span className="text-right font-medium tabular-nums text-slate-900 dark:text-white">{value}</span>
    </div>
  )
}

function WeightCompareBar({ actualWeight, volumetricWeight }: { actualWeight: number; volumetricWeight: number }) {
  const maxWeight = Math.max(actualWeight, volumetricWeight, 1)
  return (
    <div className="col-span-2 space-y-2 rounded-lg border border-slate-200 px-2.5 py-2 dark:border-white/10">
      <CompareItem label="总毛重" value={`${formatNumber(actualWeight, 2)} kg`} width={Math.max(4, Math.min(100, (actualWeight / maxWeight) * 100))} className="bg-slate-400" />
      <CompareItem label="总体积重" value={`${formatNumber(volumetricWeight, 2)} kg`} width={Math.max(4, Math.min(100, (volumetricWeight / maxWeight) * 100))} className="bg-emerald-500" />
    </div>
  )
}

function CompareItem({ label, value, width, className }: { label: string; value: string; width: number; className: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium tabular-nums text-slate-900 dark:text-white">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div className={cn('h-full rounded-full', className)} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
