// 名称: 货物保险费计算结果
// 描述: 展示 CIF 换算、投保金额、保费拆分与条款速查（紧凑版）
// 路径: ExportBox/app/tools/cargo-insurance-calculator/cargo-insurance-result.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { AlertTriangle, Info, Umbrella } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import type { CargoInsuranceResult } from '@/lib/tools/cargo-insurance-calculator'
import { ICC_CLAUSE_ROWS, INSURANCE_TIPS } from './cargo-insurance-data'

export interface CargoInsuranceResultProps {
  result: CargoInsuranceResult
  summaryText: string
}

export function CargoInsuranceResult({ result, summaryText }: CargoInsuranceResultProps) {
  const currency = result.currency
  const stats = [
    { label: '总保费', value: formatMoney(result.totalPremium, currency), note: `占 CIF ${result.effectivePremiumRateOnCif}%` },
    { label: '投保金额', value: formatMoney(result.insuredAmount, currency), note: `CIF 的 ${result.insuredPercentOfCif}%` },
    { label: '折算 CIF 价值', value: formatMoney(result.cifValue, currency), note: result.priceBasis === 'CIF' ? '直接以货值投保' : `由 ${result.priceBasis} 换算` },
    { label: '基础险保费', value: formatMoney(result.basePremium, currency), note: result.warRiskPremium > 0 ? `战争险另计 ${formatMoney(result.warRiskPremium, currency)}` : '未附加战争险' },
  ]

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-muted/30 px-2.5 py-1.5">
            <p className="truncate text-[10px] leading-3 text-muted-foreground">{stat.label}</p>
            <p className="wrap-break-word text-[13px] leading-5 font-semibold tabular-nums">{stat.value}</p>
            <p className="truncate text-[10px] leading-3 text-muted-foreground" title={stat.note}>{stat.note}</p>
          </div>
        ))}
      </div>

      <Card className="gap-0 py-0">
        <CardContent className="px-3 pt-2.5 pb-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold"><Umbrella className="h-4 w-4" />保费拆分</p>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground" title={result.basisNote}>{result.basisNote}</p>
            </div>
            <EnhancedCopyButton text={summaryText} variant="outline" size="sm" className="h-6 shrink-0 px-2 text-[11px]">复制</EnhancedCopyButton>
          </div>
          <div className="mt-1.5 divide-y divide-border/70">
            <Row label="投保金额" value={formatMoney(result.insuredAmount, currency)} />
            <Row label="基础险保费" value={formatMoney(result.basePremium, currency)} />
            <Row label="战争险附加保费" value={formatMoney(result.warRiskPremium, currency)} />
            <div className="flex items-center justify-between gap-3 pt-1.5 text-[12px] font-semibold">
              <span>合计保费</span>
              <span className="tabular-nums text-amber-700 dark:text-amber-300">{formatMoney(result.totalPremium, currency)}</span>
            </div>
          </div>
          {result.warnings.length > 0 && (
            <div className="mt-2 space-y-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] leading-4 dark:border-amber-300/20 dark:bg-amber-300/10">
              {result.warnings.map((warning) => (
                <p key={warning} className="flex items-start gap-1.5"><AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />{warning}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <details className="group rounded-lg border bg-muted/30 px-3 py-2">
        <summary className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-200">
          <Info className="h-3.5 w-3.5" />ICC 条款速查与投保提示
          <span className="ml-auto text-[11px] font-normal text-muted-foreground group-open:hidden">展开</span>
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-[11px]">
            <thead>
              <tr className="border-b text-left text-[10px] text-muted-foreground">
                <th className="py-1 pr-3 font-medium">条款</th>
                <th className="py-1 pr-3 font-medium">承保范围</th>
                <th className="py-1 font-medium">适用场景</th>
              </tr>
            </thead>
            <tbody>
              {ICC_CLAUSE_ROWS.map((row) => (
                <tr key={row.name} className="border-b last:border-0">
                  <td className="py-1 pr-3 font-medium">{row.name}</td>
                  <td className="py-1 pr-3 text-muted-foreground">{row.coverage}</td>
                  <td className="py-1 text-muted-foreground">{row.typicalUse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-1.5 space-y-0.5 text-[10px] leading-4 text-muted-foreground">
          {INSURANCE_TIPS.map((tip) => <li key={tip} className="flex items-start gap-1.5"><Info className="mt-0.5 h-3 w-3 shrink-0" />{tip}</li>)}
        </ul>
      </details>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 py-1"><span className="text-[11px] text-muted-foreground">{label}</span><span className="text-[12px] font-medium tabular-nums">{value}</span></div>
}

function formatMoney(value: number, currency: string): string {
  const formatted = value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${formatted} ${currency}`
}
