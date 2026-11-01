// 名称: 进口成本结果卡（对齐出口退税布局）
// 描述: 顶部四格概览条 + 右侧成本构成与关键指标卡，横向占满、纵向留白紧凑
// 路径: ExportBox/app/tools/import-landed-cost-calculator/import-cost-results.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { Calculator, Coins, Layers, Percent, Receipt, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ImportLandedCostResult } from '@/lib/tools/import-landed-cost-calculator'
import { formatCny, formatNumber, formatPercent } from './import-cost-page-data'

interface ImportCostViewProps {
  result: ImportLandedCostResult
}

export function ImportCostStats({ result }: ImportCostViewProps) {
  return (
    <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">
      <StatCell icon={<Layers className="h-3.5 w-3.5" />} label="到岸总成本" value={formatCny(result.totalLandedCostCny)} caption={`含税 ${formatCny(result.totalTaxCny)}`} />
      <StatCell icon={<Calculator className="h-3.5 w-3.5" />} label="单件到岸成本" value={formatCny(result.unitLandedCostCny)} caption={`${formatNumber(result.quantity)} 件`} />
      <StatCell icon={<Receipt className="h-3.5 w-3.5" />} label="进口税费合计" value={formatCny(result.totalTaxCny)} caption={`关税 ${formatCny(result.dutyCny)}`} />
      <StatCell icon={<Percent className="h-3.5 w-3.5" />} label="毛利率" value={formatPercent(result.grossMarginPercent)} caption={`毛利 ${formatCny(result.grossProfitCny)}`} />
    </div>
  )
}

export function ImportCostResults({ result }: ImportCostViewProps) {
  return (
    <div className="space-y-2">
      <Card className="gap-0 py-0">
        <CardHeader className="px-2.5 pt-2 pb-0.5">
          <CardTitle className="flex items-center gap-1.5 text-[12px] font-semibold">
            <Coins className="h-3.5 w-3.5" />
            成本构成
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2.5 pt-0 pb-2">
          <ul className="space-y-0.5">
            {result.costBreakdown.map((row) => (
              <li key={row.key} className="flex items-center gap-1.5 py-[2px]" title={`${row.label} ${formatCny(row.value)} · ${formatPercent(row.sharePercent)}`}>
                <span className="w-[74px] shrink-0 truncate text-[11px] leading-4 text-slate-600 dark:text-slate-300">{row.label}</span>
                <div className="h-1.5 min-w-6 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${Math.min(100, Math.max(0, row.sharePercent))}%` }} />
                </div>
                <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">{formatPercent(row.sharePercent)}</span>
                <span className="w-[76px] shrink-0 text-right text-[12px] font-medium tabular-nums text-slate-900 dark:text-white">{formatCny(row.value)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-baseline justify-between gap-2 border-t pt-1">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">到岸总成本</span>
            <span className="text-[13px] font-semibold tabular-nums text-primary">{formatCny(result.totalLandedCostCny)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="px-2.5 pt-2 pb-0.5">
          <CardTitle className="flex items-center gap-1.5 text-[12px] font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            关键指标
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2.5 pt-0 pb-1.5">
          <Row label="CIF 到岸价" value={formatCny(result.cifCny)} />
          <Row label="增值税计税基数" value={formatCny(result.vatBaseCny)} />
          <Row label="清关与本地费用" value={formatCny(result.localCostCny)} />
          <Row label="目标销售收入" value={formatCny(result.salesRevenueCny)} />
          <Row label="毛利" value={formatCny(result.grossProfitCny)} strong />
          <Row label="加价率（相对到岸成本）" value={formatPercent(result.markupPercent)} />
        </CardContent>
      </Card>

      <details className="rounded-lg border bg-card px-3 py-2">
        <summary className="cursor-pointer text-[11px] font-medium text-slate-600 dark:text-slate-300">口径说明</summary>
        <ul className="mt-1.5 space-y-1 text-[10px] leading-4 text-muted-foreground">
          <li>到岸成本 = 采购货值 + 国际运费 + 保险费 + 其他外币费用（均折算人民币） + 关税 + 进口增值税 + 清关与本地费用。</li>
          <li>进口增值税计税基数按 CIF 加关税计算，仅作成本测算，进项是否可抵扣以企业资质为准。</li>
        </ul>
      </details>
    </div>
  )
}

interface StatCellProps {
  icon: React.ReactNode
  label: string
  value: string
  caption: string
}

function StatCell({ icon, label, value, caption }: StatCellProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-1.5">
      <span className="shrink-0 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[10px] leading-3 text-muted-foreground">{label}</p>
        <p className="truncate text-[13px] leading-4 font-semibold tabular-nums" title={value}>{value}</p>
        <p className="truncate text-[10px] leading-3 text-muted-foreground" title={caption}>{caption}</p>
      </div>
    </div>
  )
}

interface RowProps {
  label: string
  value: string
  strong?: boolean
}

function Row({ label, value, strong = false }: RowProps) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0">
      <span className="truncate text-[11px] leading-4 text-slate-600 dark:text-slate-300" title={label}>{label}</span>
      <span className={'shrink-0 text-[12px] tabular-nums ' + (strong ? 'font-semibold text-primary' : 'font-medium text-slate-900 dark:text-white')}>{value}</span>
    </div>
  )
}
