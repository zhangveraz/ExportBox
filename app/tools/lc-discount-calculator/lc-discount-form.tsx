// 名称: 信用证贴现表单
// 描述: 采集信用证面值、远期天数、贴现率与费用参数（单屏紧凑版）
// 路径: ExportBox/app/tools/lc-discount-calculator/lc-discount-form.tsx
// 作者: ExportBox
// 更新时间: 2026-11-01

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormattedInput } from '@/components/ui/formatted-input'
import { Label } from '@/components/ui/label'

export interface LcDiscountFormState {
  faceAmount: string
  currency: string
  tenorDays: string
  discountRatePercent: string
  acceptanceFeePercent: string
  cableFee: string
  sightFeePercent: string
}

export interface LcDiscountFormProps {
  form: LcDiscountFormState
  onChange: (patch: Partial<LcDiscountFormState>) => void
  onReset: () => void
}

export function LcDiscountForm({ form, onChange, onReset }: LcDiscountFormProps) {
  return (
    <Card className="self-start">
      <CardHeader className="flex flex-row items-start justify-between gap-2 px-3 pt-2.5 pb-1.5">
        <div className="min-w-0">
          <CardTitle className="text-sm font-semibold">贴现参数</CardTitle>
          <p className="mt-0.5 truncate text-[10px] leading-4 text-muted-foreground">按银行实际报价填写，利息按 360 天国际惯例计算</p>
        </div>
        <Button type="button" variant="outline" onClick={onReset} className="h-6 shrink-0 px-2 text-[11px]">
          <RefreshCw className="mr-1 h-3 w-3" />重置
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pt-0 pb-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="faceAmount" className="text-[11px] leading-4">信用证金额</Label>
            <div className="relative">
              <FormattedInput id="faceAmount" value={form.faceAmount} onChange={(value) => onChange({ faceAmount: value })} format="decimal" maxDecimals={2} autoFocusFirst className="h-8 pr-16 text-[12px] font-medium" />
              <input
                value={form.currency}
                onChange={(event) => onChange({ currency: event.target.value.toUpperCase() })}
                maxLength={6}
                aria-label="币种"
                className="absolute inset-y-1 right-1 w-14 rounded border border-slate-200 bg-slate-50 px-1 text-center text-[10px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              />
            </div>
          </div>
          <NumberField id="tenorDays" label="远期天数（承兑后 N 天）" suffix="天" value={form.tenorDays} onChange={(value) => onChange({ tenorDays: value })} integer />
          <NumberField id="discountRatePercent" label="贴现率（年化）" suffix="%" value={form.discountRatePercent} onChange={(value) => onChange({ discountRatePercent: value })} />
          <NumberField id="acceptanceFeePercent" label="承兑手续费" suffix="%" value={form.acceptanceFeePercent} onChange={(value) => onChange({ acceptanceFeePercent: value })} />
          <NumberField id="cableFee" label="邮电/单据处理费" suffix={form.currency || 'USD'} value={form.cableFee} onChange={(value) => onChange({ cableFee: value })} />
          <NumberField id="sightFeePercent" label="即期综合费率（0 不对比）" suffix="%" value={form.sightFeePercent} onChange={(value) => onChange({ sightFeePercent: value })} />
        </div>
        <details className="rounded-md bg-muted/40 px-2.5 py-1 text-[10px] leading-4 text-muted-foreground">
          <summary className="cursor-pointer list-none font-medium">常见口径参考</summary>
          <p className="mt-1">即期信用证综合费率约 0.5%–1%；远期贴现率随市场利率与承兑行资质浮动，以外资行或议付行实际报价为准。</p>
        </details>
      </CardContent>
    </Card>
  )
}

function NumberField({ id, label, suffix, value, onChange, integer = false }: { id: string; label: string; suffix: string; value: string; onChange: (value: string) => void; integer?: boolean }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[11px] leading-4">{label}</Label>
      <div className="relative">
        <FormattedInput id={id} value={value} onChange={onChange} format={integer ? 'number' : 'decimal'} maxDecimals={integer ? 0 : 3} className="h-8 pr-14 text-[12px] font-medium" />
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground">{suffix}</span>
      </div>
    </div>
  )
}
