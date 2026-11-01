// 名称: 装柜计算结果（紧凑版）
// 描述: 单屏布局下的结果区：柜数看板、装载明细与利用率条
// 路径: ExportBox/app/tools/container-load-calculator/container-load-results.tsx
// 作者: ExportBox
// 更新时间: 2026-10-30

import type { ComponentType } from 'react'
import { ChevronDown, Container, Layers, Package, Ruler, Weight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ContainerType, LoadingResult } from '@/lib/tools/container-load-calculator'
import { formatNumber, formatPercent } from './container-load-page-data'

const panelClass =
  'rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-slate-950/60'

const LIMIT_LABEL: Record<LoadingResult['limitingFactor'], string> = {
  volume: '受体积限制',
  weight: '受重量限制',
  dimensions: '尺寸受限',
}

/** 顶部四个关键数字 */
export function ContainerLoadStats({ result }: { result: LoadingResult | null }) {
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }> }> = [
    { label: '单柜可装', value: result ? `${formatNumber(result.maxCartonsPerContainer)} 箱` : '—', caption: result ? result.container.name : '柜型未定', icon: Package },
    { label: '需要柜数', value: result ? `${result.requiredContainers} 柜` : '—', caption: result ? `末柜 ${formatNumber(result.lastContainerCartons)} 箱` : '—', icon: Container },
    { label: '体积利用率', value: result ? formatPercent(result.volumeUtilizationPercent) : '—', caption: result ? `总货量 ${formatNumber(result.totalCbm, 2)} CBM` : '—', icon: Layers },
    { label: '重量利用率', value: result ? formatPercent(result.weightUtilizationPercent) : '—', caption: result ? `总毛重 ${formatNumber(result.totalWeightKg)} kg` : '—', icon: Weight },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 2xl:grid-cols-4">
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

/** 结果主体：柜数高亮 + 装载能力 + 利用率 */
export function ContainerLoadResults({ result, containerType }: { result: LoadingResult | null; containerType: ContainerType }) {
  if (!result) {
    return <div className={panelClass}>请填写有效的纸箱尺寸与数量。</div>
  }

  const orientation = result.bestOrientation

  return (
    <div className="space-y-3">
      <div className={panelClass}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">装柜结果</h2>
          <Badge variant={result.limitingFactor === 'weight' ? 'destructive' : 'secondary'}>{LIMIT_LABEL[result.limitingFactor]}</Badge>
        </div>

        <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] text-emerald-800 dark:text-cyan-100">需要柜数（{result.container.name}）</span>
            <span className="text-[22px] font-bold tabular-nums text-emerald-900 dark:text-white">
              {result.requiredContainers}
              <span className="ml-1 text-xs font-medium">柜</span>
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-emerald-800/80 dark:text-cyan-100/70">
            满柜 {formatNumber(result.maxCartonsPerContainer)} 箱 · 末柜 {formatNumber(result.lastContainerCartons)} 箱
          </p>
        </div>

        <div className="mt-2 space-y-2 rounded-lg border border-slate-200 px-2.5 py-2 dark:border-white/10">
          <UtilBar label="体积利用率" value={result.volumeUtilizationPercent} detail={`${formatNumber(result.totalCbm, 2)} / ${formatNumber(result.container.volumeCbm, 1)} CBM`} className="bg-emerald-500" />
          <UtilBar label="重量利用率" value={result.weightUtilizationPercent} detail={`${formatNumber(result.totalWeightKg)} / ${formatNumber(result.container.maxPayloadKg)} kg`} className="bg-blue-500" />
        </div>

        <div className="mt-2 grid gap-1.5">
          <InfoRow label="单箱体积" value={`${formatNumber(result.cartonCbm, 4)} CBM`} icon={Ruler} />
          <InfoRow label="重量上限可装" value={`${formatNumber(result.maxByWeight)} 箱`} icon={Weight} />
          <InfoRow label="最佳摆放方向" value={`${orientation.lengthCm}×${orientation.widthCm}×${orientation.heightCm} cm`} icon={Layers} />
          <InfoRow label="每层排布" value={`长 ${orientation.countLength} × 宽 ${orientation.countWidth} × 高 ${orientation.countHeight} 箱`} icon={Package} />
        </div>
      </div>

      <details className="group rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950/60">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
          估算口径提示（当前柜型 {containerType}）
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          <li>按纸箱六种摆放方向逐一试算，取单柜可装箱数最多的方向。</li>
          <li>柜内尺寸取行业常见值，未扣除门框、加固件和装卸间隙。</li>
          <li>实际柜况、限重法规与托盘使用会降低可装箱数，建议留 5%~10% 余量。</li>
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

function UtilBar({ label, value, detail, className }: { label: string; value: number; detail: string; className: string }) {
  const width = Math.max(3, Math.min(100, Number.isFinite(value) ? value : 0))
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium tabular-nums text-slate-900 dark:text-white">
          {formatPercent(value)}
          <span className="ml-1.5 font-normal text-slate-400">{detail}</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div className={cn('h-full rounded-full', className)} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
