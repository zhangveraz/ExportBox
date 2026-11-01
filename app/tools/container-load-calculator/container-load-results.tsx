// 名称: 装柜计算结果（对齐出口退税布局）
// 描述: 顶部四格概览 + 右侧柜数高亮与利用率、装载明细卡
// 路径: ExportBox/app/tools/container-load-calculator/container-load-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import type { ComponentType } from 'react'
import { ChevronDown, Container, Layers, Package, Ruler, Weight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ContainerType, LoadingResult } from '@/lib/tools/container-load-calculator'
import { formatNumber, formatPercent } from './container-load-page-data'

const LIMIT_LABEL: Record<LoadingResult['limitingFactor'], string> = {
  volume: '受体积限制',
  weight: '受重量限制',
  dimensions: '尺寸受限',
}

/** 顶部四个关键数字（横向概览条） */
export function ContainerLoadStats({ result }: { result: LoadingResult | null }) {
  const cards: Array<{ label: string; value: string; caption: string; icon: ComponentType<{ className?: string }> }> = [
    { label: '单柜可装', value: result ? `${formatNumber(result.maxCartonsPerContainer)} 箱` : '—', caption: result ? result.container.name : '柜型未定', icon: Package },
    { label: '需要柜数', value: result ? `${result.requiredContainers} 柜` : '—', caption: result ? `末柜 ${formatNumber(result.lastContainerCartons)} 箱` : '—', icon: Container },
    { label: '体积利用率', value: result ? formatPercent(result.volumeUtilizationPercent) : '—', caption: result ? `总货量 ${formatNumber(result.totalCbm, 2)} CBM` : '—', icon: Layers },
    { label: '重量利用率', value: result ? formatPercent(result.weightUtilizationPercent) : '—', caption: result ? `总毛重 ${formatNumber(result.totalWeightKg)} kg` : '—', icon: Weight },
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

/** 结果主体：柜数高亮 + 利用率 + 装载明细 */
export function ContainerLoadResults({ result, containerType }: { result: LoadingResult | null; containerType: ContainerType }) {
  if (!result) {
    return <Card className="px-3 py-2 text-[12px] text-muted-foreground">请填写有效的纸箱尺寸与数量。</Card>
  }

  const orientation = result.bestOrientation

  return (
    <div className="space-y-2">
      <Card className="gap-0 py-0">
        <CardHeader className="px-2.5 pt-2 pb-0.5">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-1.5 text-[12px] font-semibold">
              <Container className="h-3.5 w-3.5" />
              装柜结果
            </CardTitle>
            <Badge variant={result.limitingFactor === 'weight' ? 'destructive' : 'secondary'} className="text-[10px]">{LIMIT_LABEL[result.limitingFactor]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2.5 pt-0 pb-2">
          <div className="flex items-baseline justify-between gap-2 rounded-md bg-primary/5 px-2 py-1">
            <span className="truncate text-[11px] text-slate-600 dark:text-slate-300">需要柜数（{result.container.name}）</span>
            <span className="shrink-0 text-[18px] leading-6 font-bold tabular-nums text-primary">
              {result.requiredContainers}
              <span className="ml-0.5 text-[10px] font-medium">柜</span>
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            满柜 {formatNumber(result.maxCartonsPerContainer)} 箱 · 末柜 {formatNumber(result.lastContainerCartons)} 箱
          </p>

          <div className="mt-1.5 space-y-1">
            <UtilBar label="体积利用率" value={result.volumeUtilizationPercent} detail={`${formatNumber(result.totalCbm, 2)} / ${formatNumber(result.container.volumeCbm, 1)} CBM`} className="bg-primary" />
            <UtilBar label="重量利用率" value={result.weightUtilizationPercent} detail={`${formatNumber(result.totalWeightKg)} / ${formatNumber(result.container.maxPayloadKg)} kg`} className="bg-sky-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="px-2.5 pt-2 pb-0.5">
          <CardTitle className="flex items-center gap-1.5 text-[12px] font-semibold">
            <Ruler className="h-3.5 w-3.5" />
            装载明细
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2.5 pt-0 pb-1.5">
          <InfoRow label="单箱体积" value={`${formatNumber(result.cartonCbm, 4)} CBM`} icon={Ruler} />
          <InfoRow label="重量上限可装" value={`${formatNumber(result.maxByWeight)} 箱`} icon={Weight} />
          <InfoRow label="最佳摆放方向" value={`${orientation.lengthCm}×${orientation.widthCm}×${orientation.heightCm} cm`} icon={Layers} />
          <InfoRow label="每层排布" value={`长 ${orientation.countLength} × 宽 ${orientation.countWidth} × 高 ${orientation.countHeight} 箱`} icon={Package} />
        </CardContent>
      </Card>

      <details className="group rounded-lg border bg-card px-3 py-2">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
          估算口径提示（当前柜型 {containerType}）
          <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
        </summary>
        <ul className="mt-1.5 space-y-1 text-[10px] leading-4 text-muted-foreground">
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
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="flex min-w-0 items-center gap-1.5 truncate text-[11px] leading-4 text-slate-600 dark:text-slate-300">
        {Icon && <Icon className="h-3 w-3 shrink-0" />}
        {label}
      </span>
      <span className="shrink-0 text-[12px] font-medium tabular-nums text-slate-900 dark:text-white">{value}</span>
    </div>
  )
}

function UtilBar({ label, value, detail, className }: { label: string; value: number; detail: string; className: string }) {
  const width = Math.max(3, Math.min(100, Number.isFinite(value) ? value : 0))
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-[10px] leading-3">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-medium tabular-nums text-slate-900 dark:text-white">
          {formatPercent(value)}
          <span className="ml-1 font-normal text-muted-foreground">{detail}</span>
        </span>
      </div>
      <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', className)} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
