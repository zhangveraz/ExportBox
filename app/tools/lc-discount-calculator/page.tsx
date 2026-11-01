// 名称: 信用证远期贴现计算器
// 描述: 测算远期信用证贴现到手净额与实际年化成本，对比即期收款
// 路径: ExportBox/app/tools/lc-discount-calculator/page.tsx
// 作者: ExportBox
// 更新时间: 2026-10-12

'use client'

import { useMemo, useState } from 'react'
import { ToolShell } from '@/components/tools/tool-shell'
import { EnhancedAlert } from '@/components/ui/enhanced-alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedCopyButton } from '@/components/tools/enhanced-copy-button'
import { Info, TrendingDown } from 'lucide-react'
import { DEFAULT_LC_DISCOUNT_INPUTS, buildLcDiscountSummary, calculateLcDiscount } from '@/lib/tools/lc-discount-calculator'
import { LcDiscountForm, type LcDiscountFormState } from './lc-discount-form'

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export default function LcDiscountCalculatorPage() {
  const [form, setForm] = useState<LcDiscountFormState>({
    faceAmount: String(DEFAULT_LC_DISCOUNT_INPUTS.faceAmount),
    currency: DEFAULT_LC_DISCOUNT_INPUTS.currency,
    tenorDays: String(DEFAULT_LC_DISCOUNT_INPUTS.tenorDays),
    discountRatePercent: String(DEFAULT_LC_DISCOUNT_INPUTS.discountRatePercent),
    acceptanceFeePercent: String(DEFAULT_LC_DISCOUNT_INPUTS.acceptanceFeePercent),
    cableFee: String(DEFAULT_LC_DISCOUNT_INPUTS.cableFee),
    sightFeePercent: String(DEFAULT_LC_DISCOUNT_INPUTS.sightFeePercent),
  })

  const calculation = useMemo(() => {
    try {
      return {
        result: calculateLcDiscount({
          faceAmount: toNumber(form.faceAmount),
          currency: form.currency,
          tenorDays: toNumber(form.tenorDays),
          discountRatePercent: toNumber(form.discountRatePercent),
          acceptanceFeePercent: toNumber(form.acceptanceFeePercent),
          cableFee: toNumber(form.cableFee),
          sightFeePercent: toNumber(form.sightFeePercent),
        }),
        error: '',
      }
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : '贴现测算无法计算，请检查输入' }
    }
  }, [form])

  const money = (value: number) => `${value.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${form.currency || 'USD'}`

  return (
    <ToolShell title="信用证远期贴现计算器" description="远期信用证承兑后想提前回款？输入贴现率与费用，测算到手净额与实际年化成本，并与即期收款对比再做决定。">
      

      {calculation.error && <EnhancedAlert type="error" title="计算错误" message={calculation.error} action={{ label: '重置', onClick: () => setForm({ ...form, faceAmount: '100000', tenorDays: '90', discountRatePercent: '4.5', acceptanceFeePercent: '0.125', cableFee: '100', sightFeePercent: '0.8' }) }} className="mb-2.5" />}

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <LcDiscountForm form={form} onChange={(patch) => setForm((current) => ({ ...current, ...patch }))} onReset={() => setForm({
          faceAmount: String(DEFAULT_LC_DISCOUNT_INPUTS.faceAmount),
          currency: DEFAULT_LC_DISCOUNT_INPUTS.currency,
          tenorDays: String(DEFAULT_LC_DISCOUNT_INPUTS.tenorDays),
          discountRatePercent: String(DEFAULT_LC_DISCOUNT_INPUTS.discountRatePercent),
          acceptanceFeePercent: String(DEFAULT_LC_DISCOUNT_INPUTS.acceptanceFeePercent),
          cableFee: String(DEFAULT_LC_DISCOUNT_INPUTS.cableFee),
          sightFeePercent: String(DEFAULT_LC_DISCOUNT_INPUTS.sightFeePercent),
        })} />

        {calculation.result ? (
          <div className="space-y-3">
            <Card className="self-start">
              <CardHeader className="flex flex-row items-start justify-between gap-2 px-3 pt-2.5 pb-1.5">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-1.5 text-sm font-semibold"><TrendingDown className="h-3.5 w-3.5" />贴现测算</CardTitle>
                  <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">面值 {money(calculation.result.faceAmount)} · 远期 {calculation.result.tenorDays} 天</p>
                </div>
                <EnhancedCopyButton text={buildLcDiscountSummary(calculation.result)} variant="outline" className="h-6 shrink-0 px-2 text-[11px]">复制</EnhancedCopyButton>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pt-0 pb-3">
                <div className="rounded-md border border-emerald-200 bg-emerald-50/70 px-2.5 py-2 dark:border-cyan-300/20 dark:bg-cyan-300/10">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] leading-4 text-muted-foreground">到手净额</p>
                      <p className="truncate text-base font-bold leading-6 tabular-nums text-emerald-700 dark:text-cyan-200">{money(calculation.result.netProceeds)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] leading-4 text-muted-foreground">实际年化成本</p>
                      <p className="text-[13px] font-semibold leading-5 tabular-nums">{calculation.result.effectiveAnnualRatePercent}%</p>
                    </div>
                  </div>
                  <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">成本占面值 {calculation.result.costToFacePercent}%</p>
                </div>
                <div className="divide-y">
                  <Row label="贴现利息" value={money(calculation.result.discountInterest)} />
                  <Row label="承兑手续费" value={money(calculation.result.acceptanceFee)} />
                  <Row label="邮电/单据处理费" value={money(calculation.result.cableFee)} />
                  <div className="flex items-center justify-between gap-2.5 pt-1.5 text-[11px] font-semibold">
                    <span>总成本</span>
                    <span className="tabular-nums text-amber-700 dark:text-amber-300">{money(calculation.result.totalCost)}</span>
                  </div>
                </div>
                {calculation.result.sightComparison.enabled && (
                  <div className="rounded-md border bg-muted/20 px-2.5 py-1.5 text-[10px] leading-4 text-muted-foreground">
                    <p className="font-medium text-foreground">与即期收款对比</p>
                    <p>即期净额 {money(calculation.result.sightComparison.sightNet)}</p>
                    <p>{calculation.result.sightComparison.note}</p>
                  </div>
                )}
                {calculation.result.warnings.length > 0 && (
                  <div className="space-y-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] leading-4 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
                    {calculation.result.warnings.map((warning) => (
                      <p key={warning} className="flex items-start gap-1.5"><Info className="mt-0.5 h-3 w-3 shrink-0" />{warning}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center text-[11px] text-muted-foreground">修正参数后查看贴现测算</div>
        )}
      </div>
    </ToolShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-2.5 py-1 text-[11px]"><span className="text-muted-foreground">{label}</span><span className="font-medium tabular-nums">{value}</span></div>
}
